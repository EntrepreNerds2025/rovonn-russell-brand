import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";

const serviceCategories = [
  {
    title: "Impact Story Architecture Strategy",
    items: ["Narrative Design", "Messaging Clarity", "Story Frameworks", "Impact Story Diagnostic"],
  },
  {
    title: "Authority Content Strategy",
    items: ["Thought Leadership Systems", "Story-Driven Content", "Authority Positioning"],
  },
  {
    title: "Impact Media Production",
    items: ["Documentary Storytelling", "Initiative Storytelling", "Campaign Storytelling"],
  },
  {
    title: "Workshops & Speaking",
    items: ["Impact Storytelling Workshops", "Trust-Building Communication Training", "Conference Keynotes"],
  },
  {
    title: "Advisory",
    items: ["Strategic Storytelling Advisor", "Communications Advisor", "Narrative Consulting"],
  },
];

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services", hasDropdown: true },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Speaking", href: "/speaking" },
  { label: "Insights", href: "/insights" },
  { label: "AI Tools", href: "/ai-tools" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setOpen(false);
    setServicesOpen(false);
    setMobileServicesOpen(false);
  }, [location.pathname]);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setServicesOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setServicesOpen(false), 200);
  };

  const isHome = location.pathname === "/";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all ${
        isHome
          ? "bg-background/80 backdrop-blur-md"
          : "bg-background border-b border-border shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 h-16 md:h-20">
        <Link to="/" className="font-serif text-lg md:text-xl font-bold tracking-tight text-foreground">
          ROVONN <span className="text-accent-highlight">RUSSELL</span>
        </Link>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) =>
            link.hasDropdown ? (
              <div
                key={link.href}
                className="relative"
                ref={dropdownRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  to={link.href}
                  className={`text-sm font-medium tracking-wide transition-colors hover:text-accent inline-flex items-center gap-1 ${
                    location.pathname === link.href ? "text-accent-highlight" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
                  />
                </Link>

                {/* Mega dropdown */}
                {servicesOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[700px]">
                    <div className="bg-card border border-border shadow-xl rounded-sm overflow-hidden">
                      {/* Category tabs */}
                      <div className="border-b border-border px-6 pt-5 pb-4">
                        <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-accent-highlight mb-4">
                          Services
                        </p>
                        <div className="grid grid-cols-3 gap-x-8 gap-y-5">
                          {serviceCategories.map((cat, i) => (
                            <div key={cat.title}>
                              <div className="flex items-start gap-2 mb-2">
                                <span className="text-[10px] tracking-widest text-accent-highlight font-semibold mt-0.5">
                                  0{i + 1}
                                </span>
                                <h3 className="text-xs font-semibold text-foreground leading-tight">
                                  {cat.title}
                                </h3>
                              </div>
                              <ul className="space-y-1 ml-5">
                                {cat.items.map((item) => (
                                  <li key={item}>
                                    <Link
                                      to="/services"
                                      className="text-xs text-muted-foreground hover:text-accent transition-colors block py-0.5"
                                    >
                                      {item}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Footer CTA */}
                      <div className="px-6 py-3 bg-secondary/50 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Not sure where to start?
                        </span>
                        <Link
                          to="/contact"
                          className="text-xs font-semibold text-accent hover:text-accent/80 transition-colors"
                        >
                          Book a Strategy Conversation →
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium tracking-wide transition-colors hover:text-accent ${
                  location.pathname === link.href ? "text-accent-highlight" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            )
          )}
          <Link
            to="/contact"
            className="ml-4 bg-accent text-accent-foreground px-5 py-2.5 text-xs font-semibold tracking-widest uppercase hover:bg-accent/90 transition-colors"
          >
            Let's Talk
          </Link>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="lg:hidden text-foreground">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-background border-t border-border px-6 py-6 space-y-1 max-h-[80vh] overflow-y-auto">
          {navLinks.map((link) =>
            link.hasDropdown ? (
              <div key={link.href}>
                <button
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  className={`flex items-center justify-between w-full text-sm font-medium tracking-wide py-2 ${
                    location.pathname === link.href ? "text-accent-highlight" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${mobileServicesOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {mobileServicesOpen && (
                  <div className="pl-4 pb-3 space-y-4">
                    {serviceCategories.map((cat, i) => (
                      <div key={cat.title}>
                        <p className="text-xs font-semibold text-foreground mb-1 flex items-center gap-2">
                          <span className="text-[10px] text-accent-highlight">0{i + 1}</span>
                          {cat.title}
                        </p>
                        <div className="space-y-1 pl-5">
                          {cat.items.map((item) => (
                            <Link
                              key={item}
                              to="/services"
                              onClick={() => setOpen(false)}
                              className="block text-xs text-muted-foreground py-0.5"
                            >
                              {item}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                    <Link
                      to="/services"
                      onClick={() => setOpen(false)}
                      className="block text-xs font-semibold text-accent mt-2"
                    >
                      View All Services →
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setOpen(false)}
                className={`block text-sm font-medium tracking-wide py-2 ${
                  location.pathname === link.href ? "text-accent-highlight" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            )
          )}
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="block bg-accent text-accent-foreground px-5 py-2.5 text-xs font-semibold tracking-widest uppercase text-center mt-4"
          >
            Let's Talk
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
