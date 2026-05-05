import { Link } from "react-router-dom";
import { Linkedin, Instagram, Mail, ArrowUpRight } from "lucide-react";

const IMPACT_LOOP_URL = import.meta.env.VITE_IMPACT_LOOP_URL || "https://impactloop.ca";
const LINKEDIN_URL = import.meta.env.VITE_LINKEDIN_URL || "https://www.linkedin.com/in/rovonnrussell";
const INSTAGRAM_URL = import.meta.env.VITE_INSTAGRAM_URL || "https://instagram.com";

const Footer = () => (
  <footer className="bg-foreground text-background px-6 md:px-12 lg:px-20 py-16 md:py-20">
    <div className="max-w-7xl mx-auto">
      <div className="grid md:grid-cols-12 gap-10 md:gap-14 mb-14">
        {/* Brand */}
        <div className="md:col-span-5">
          <Link to="/" className="font-serif text-2xl font-bold tracking-tight inline-block mb-4">
            Rovonn <span className="italic text-accent">Russell</span>
          </Link>
          <p className="text-base opacity-70 leading-relaxed font-serif italic max-w-md mb-6">
            Storytelling, systems, and AI for people building something that matters.
          </p>
          <a
            href={IMPACT_LOOP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold tracking-[0.18em] uppercase text-accent hover:text-background transition-colors"
          >
            For Organizations: Impact Loop <ArrowUpRight size={14} />
          </a>
        </div>

        {/* Navigate */}
        <div className="md:col-span-3">
          <h4 className="text-xs font-semibold tracking-[0.22em] uppercase mb-5 opacity-60">Navigate</h4>
          <div className="space-y-2.5">
            <Link to="/start-here" className="block text-sm opacity-75 hover:opacity-100 transition-opacity">Start Here</Link>
            <Link to="/blog" className="block text-sm opacity-75 hover:opacity-100 transition-opacity">Blog</Link>
            <Link to="/resources" className="block text-sm opacity-75 hover:opacity-100 transition-opacity">Resources</Link>
            <Link to="/speaking" className="block text-sm opacity-75 hover:opacity-100 transition-opacity">Speaking</Link>
            <Link to="/work-with-me" className="block text-sm opacity-75 hover:opacity-100 transition-opacity">Work With Me</Link>
          </div>
        </div>

        {/* Frameworks + Resources */}
        <div className="md:col-span-2">
          <h4 className="text-xs font-semibold tracking-[0.22em] uppercase mb-5 opacity-60">Featured</h4>
          <div className="space-y-2.5">
            <Link to="/resources/visibility-starter-kit" className="block text-sm opacity-75 hover:opacity-100 transition-opacity">Visibility Starter Kit</Link>
            <Link to="/frameworks/adapt" className="block text-sm opacity-75 hover:opacity-100 transition-opacity">ADAPT Framework</Link>
            <Link to="/contact" className="block text-sm opacity-75 hover:opacity-100 transition-opacity">Contact</Link>
          </div>
        </div>

        {/* Connect / Socials */}
        <div className="md:col-span-2">
          <h4 className="text-xs font-semibold tracking-[0.22em] uppercase mb-5 opacity-60">Connect</h4>
          <div className="flex gap-3 mb-5">
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
               className="w-10 h-10 rounded-md border border-background/20 flex items-center justify-center hover:border-accent hover:text-accent transition-colors">
              <Linkedin size={16} />
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
               className="w-10 h-10 rounded-md border border-background/20 flex items-center justify-center hover:border-accent hover:text-accent transition-colors">
              <Instagram size={16} />
            </a>
          </div>
          <a
            href="mailto:hello@rovonnrussell.com"
            className="inline-flex items-center gap-2 text-sm opacity-75 hover:opacity-100 transition-opacity"
          >
            <Mail size={14} /> hello@rovonnrussell.com
          </a>
        </div>
      </div>

      <div className="border-t border-background/15 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs opacity-50">
        <p>© {new Date().getFullYear()} Rovonn Russell.</p>
        <div className="flex gap-5">
          <Link to="/contact" className="hover:opacity-100">Privacy</Link>
          <Link to="/contact" className="hover:opacity-100">Terms</Link>
          <span className="font-serif italic">Storytelling + Systems</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
