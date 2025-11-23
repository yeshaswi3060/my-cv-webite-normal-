// script.js

document.addEventListener('DOMContentLoaded', () => {

  // 1. Preloader
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('fade-out');
      }, 1000); // Wait 1s then fade out
    });
  }

  // 2. Mobile Menu
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');

      // Animate bars
      const bars = hamburger.querySelectorAll('.bar');
      if (hamburger.classList.contains('active')) {
        bars[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
        bars[1].style.opacity = '0';
        // Note: The third bar was removed in HTML, but if we add it back or use pseudo-elements:
        // For 2 bars design:
        bars[1].style.transform = 'rotate(-45deg) translate(5px, -6px)';
        // Wait, my CSS for hamburger uses flex gap. Let's adjust JS to match a simple class toggle 
        // and let CSS handle the animation if possible. 
        // Actually, I'll just toggle the class and let CSS do the heavy lifting.
      } else {
        bars.forEach(bar => bar.style.transform = 'none');
        bars.forEach(bar => bar.style.opacity = '1');
      }
    });

    // Close menu when link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        // Reset bars
        const bars = hamburger.querySelectorAll('.bar');
        bars.forEach(bar => bar.style.transform = 'none');
        bars.forEach(bar => bar.style.opacity = '1');
      });
    });
  }

  // 3. Scroll Animations (Reveal on Scroll)
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  // Elements to animate
  const animatedElements = document.querySelectorAll('.section-title, .about-content, .skill-category, .timeline-item, .project-card, .contact-wrapper');

  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Add class for the CSS transition to take effect
  // We need to inject a style rule or handle it via class
  // Let's add a global style for .active state on these elements
  const style = document.createElement('style');
  style.innerHTML = `
    .section-title.active, 
    .about-content.active, 
    .skill-category.active, 
    .timeline-item.active, 
    .project-card.active, 
    .contact-wrapper.active {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);


  // 4. Active Link Highlighting
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('active');
      }
    });
  });

});
