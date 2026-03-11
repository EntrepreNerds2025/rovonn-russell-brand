import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Compass, BookOpen, Film, Mic, Users, ChevronRight } from "lucide-react";

const serviceCategories = [
  {
    key: "strategy",
    title: "Impact Story Architecture",
    icon: Compass,
    description:
      "Your organization's story shouldn't be left to chance. We design narrative systems that bring clarity to your mission, align your messaging, and position your work for maximum impact.",
    learnMore: "/services",
    focusAreas: [
      { title: "Narrative Design", desc: "Craft the core story structure that connects your mission to your audience with clarity and emotional resonance." },
      { title: "Messaging Clarity", desc: "Eliminate confusion and align every touchpoint around a consistent, compelling message." },
      { title: "Story Frameworks", desc: "Build repeatable storytelling systems that scale across campaigns, teams, and platforms." },
      { title: "Impact Story Diagnostic", desc: "AI-powered assessment that reveals gaps in your storytelling and provides actionable recommendations." },
    ],
  },
  {
    key: "content",
    title: "Authority Content",
    icon: BookOpen,
    description:
      "Position your leaders as trusted voices in your space. We build content systems that establish authority, drive thought leadership, and attract the right opportunities.",
    learnMore: "/services",
    focusAreas: [
      { title: "Thought Leadership Systems", desc: "Develop a structured approach to publishing insights that build credibility and influence." },
      { title: "Story-Driven Content", desc: "Create content rooted in real stories and outcomes rather than generic marketing copy." },
      { title: "Authority Positioning", desc: "Strategic positioning that places your organization as the go-to voice in your category." },
    ],
  },
  {
    key: "media",
    title: "Impact Media",
    icon: Film,
    description:
      "Bring your impact to life through cinematic storytelling. From documentaries to campaign films, we produce media that moves people to action.",
    learnMore: "/services",
    focusAreas: [
      { title: "Documentary Storytelling", desc: "Long-form visual narratives that capture the depth and nuance of your organization's work." },
      { title: "Initiative Storytelling", desc: "Focused stories that spotlight specific programs, partnerships, and community impact." },
      { title: "Campaign Storytelling", desc: "Strategic video content designed to drive awareness, engagement, and support." },
    ],
  },
  {
    key: "speaking",
    title: "Workshops & Speaking",
    icon: Mic,
    description:
      "Equip your team with storytelling skills or bring Rovonn to your stage. Interactive workshops and keynotes that transform how organizations communicate.",
    learnMore: "/speaking",
    focusAreas: [
      { title: "Impact Storytelling Workshops", desc: "Hands-on sessions that teach teams to identify, craft, and deliver compelling impact stories." },
      { title: "Trust-Building Communication", desc: "Training on transparent communication that builds stakeholder confidence and loyalty." },
      { title: "Conference Keynotes", desc: "Inspiring talks on storytelling, trust, and the future of impact communication." },
    ],
  },
  {
    key: "advisory",
    title: "Advisory",
    icon: Users,
    description:
      "Ongoing strategic guidance for organizations ready to elevate their storytelling. Rovonn serves as your dedicated storytelling advisor and communications strategist.",
    learnMore: "/services",
    focusAreas: [
      { title: "Strategic Storytelling Advisor", desc: "Embedded advisory support to guide narrative decisions across your organization." },
      { title: "Communications Advisor", desc: "High-level counsel on messaging, positioning, and stakeholder communication strategy." },
      { title: "Narrative Consulting", desc: "Project-based consulting to solve specific storytelling challenges and opportunities." },
    ],
  },
];

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services", hasDropdown: true },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Speaking", href: "/speaking" },
  { label: "Insights", href: "/insights" },
  { label: "AI Tools", href: "/ai-tools" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(serviceCategories[0].key);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const location = useLocation();
  const navRef = useRef<HTMLDivElement>(null);
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
    timeoutRef.current = setTimeout(() => setServicesOpen(false), 250);
  };

  const activeCat = serviceCategories.find((c) => c.key === activeCategory)!;

  return (
    <div ref={navRef} onMouseLeave={handleMouseLeave}>
      {/* Main nav bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 h-16 md:h-[72px]">
          <Link to="/" className="font-serif text-lg md:text-xl font-bold tracking-tight text-foreground">
            ROVONN <span className="text-accent">RUSSELL</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) =>
              link.hasDropdown ? (
                <button
                  key={link.href}
                  onMouseEnter={handleMouseEnter}
                  onClick={() => setServicesOpen(!servicesOpen)}
                  className={`text-sm font-medium tracking-wide transition-colors hover:text-accent inline-flex items-center gap-1 ${
                    location.pathname === link.href || servicesOpen
                      ? "text-accent"
                      : "text-foreground"
                  }`}
                >
                  {link.label}
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
                  />
                </button>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-medium tracking-wide transition-colors hover:text-accent ${
                    location.pathname === link.href ? "text-accent" : "text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
            <Link
              to="/contact"
              className="ml-3 bg-accent text-accent-foreground px-5 py-2 text-xs font-semibold tracking-widest uppercase hover:bg-accent/90 transition-colors rounded-sm"
            >
              Let's Talk
            </Link>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} className="lg:hidden text-foreground">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Services mega menu — full width below nav */}
        {servicesOpen && (
          <div
            className="hidden lg:block border-t border-border bg-background"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Category tabs row */}
            <div className="border-b border-border">
              <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center gap-0">
                <span className="text-xs font-semibold text-muted-foreground tracking-wide uppercase mr-6 py-4 shrink-0">
                  Services:
                </span>
                {serviceCategories.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = activeCategory === cat.key;
                  return (
                    <button
                      key={cat.key}
                      onMouseEnter={() => setActiveCategory(cat.key)}
                      onClick={() => setActiveCategory(cat.key)}
                      className={`flex items-center gap-2 px-5 py-4 text-sm font-medium transition-colors border-b-2 -mb-[1px] ${
                        isActive
                          ? "border-accent text-accent"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon size={18} strokeWidth={1.5} />
                      {cat.title}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active category content */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
              <div className="grid grid-cols-12 gap-10">
                {/* Left description */}
                <div className="col-span-4">
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {activeCat.description}
                  </p>
                  <Link
                    to={activeCat.learnMore}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:text-accent/80 transition-colors"
                  >
                    <ChevronRight size={14} />
                    Learn more
                  </Link>
                </div>

                {/* Right focus areas grid */}
                <div className="col-span-8">
                  <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted-foreground mb-4">
                    Focus Areas
                  </p>
                  <div className="grid grid-cols-3 gap-x-6 gap-y-6">
                    {activeCat.focusAreas.map((area) => (
                      <div key={area.title}>
                        <Link
                          to="/services"
                          className="inline-flex items-center gap-1 text-sm font-semibold text-foreground hover:text-accent transition-colors mb-1"
                        >
                          <ChevronRight size={12} className="text-accent" />
                          {area.title}
                        </Link>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {area.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="fixed top-16 left-0 right-0 z-40 lg:hidden bg-background border-t border-border px-6 py-6 space-y-1 max-h-[80vh] overflow-y-auto">
          {navLinks.map((link) =>
            link.hasDropdown ? (
              <div key={link.href}>
                <button
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  className={`flex items-center justify-between w-full text-sm font-medium tracking-wide py-2 ${
                    location.pathname === link.href ? "text-accent" : "text-foreground"
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
                    {serviceCategories.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <div key={cat.key}>
                          <p className="text-xs font-semibold text-foreground mb-1 flex items-center gap-2">
                            <Icon size={14} className="text-accent" />
                            {cat.title}
                          </p>
                          <div className="space-y-1 pl-6">
                            {cat.focusAreas.map((area) => (
                              <Link
                                key={area.title}
                                to="/services"
                                onClick={() => setOpen(false)}
                                className="block text-xs text-muted-foreground py-0.5"
                              >
                                {area.title}
                              </Link>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setOpen(false)}
                className={`block text-sm font-medium tracking-wide py-2 ${
                  location.pathname === link.href ? "text-accent" : "text-foreground"
                }`}
              >
                {link.label}
              </Link>
            )
          )}
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="block bg-accent text-accent-foreground px-5 py-2.5 text-xs font-semibold tracking-widest uppercase text-center mt-4 rounded-sm"
          >
            Let's Talk
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
