import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="section-dark px-6 md:px-12 lg:px-20 py-16">
    <div className="max-w-7xl mx-auto">
      <div className="grid md:grid-cols-4 gap-10 mb-12">
        <div>
          <h3 className="font-serif text-xl font-bold mb-4">
            ROVONN <span className="text-accent-highlight">RUSSELL</span>
          </h3>
          <p className="text-sm opacity-70 leading-relaxed">
            Impact Story Architect. Designing storytelling systems that help organizations communicate their impact clearly.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-semibold tracking-widest uppercase mb-4 opacity-60">Navigate</h4>
          <div className="space-y-2">
            {["About", "Services", "Case Studies", "Speaking", "Insights"].map((l) => (
              <Link key={l} to={`/${l.toLowerCase().replace(" ", "-")}`} className="block text-sm opacity-70 hover:opacity-100 transition-opacity">
                {l}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-xs font-semibold tracking-widest uppercase mb-4 opacity-60">Tools</h4>
          <div className="space-y-2">
            <Link to="/ai-tools" className="block text-sm opacity-70 hover:opacity-100 transition-opacity">Impact Story Diagnostic</Link>
            <Link to="/ai-tools" className="block text-sm opacity-70 hover:opacity-100 transition-opacity">Authority Content Planner</Link>
            <Link to="/ai-tools" className="block text-sm opacity-70 hover:opacity-100 transition-opacity">Story Clarity Analyzer</Link>
          </div>
        </div>
        <div>
          <h4 className="text-xs font-semibold tracking-widest uppercase mb-4 opacity-60">Connect</h4>
          <div className="space-y-2 text-sm opacity-70">
            <p>hello@rovonnrussell.com</p>
            <Link to="/contact" className="block hover:opacity-100 transition-opacity">Book a Strategy Call</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-border/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-50">
        <p>© {new Date().getFullYear()} Rovonn Russell. All rights reserved.</p>
        <p>Impact Story Architecture™</p>
      </div>
    </div>
  </footer>
);

export default Footer;
