export default function SectionHeading({ number, label, children, description, aside }) {
  return <div className="section-heading reveal">
    <div><p className="section-kicker"><span>{number}</span> {label}</p><h2>{children}</h2>{description && <p className="heading-description">{description}</p>}</div>
    {aside && <div className="heading-aside">{aside}</div>}
  </div>;
}

