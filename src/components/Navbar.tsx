import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowUpRight } from "lucide-react";

interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

const navLinks: NavLink[] = [
  { label: "Start Here", href: "/start-here" },
  { label: "ADAPT", href: "/adapt" },
  { label: "Speaking", href: "/speaking" },
  { label: "Resources", href: "/resources" },
  { label: "Blog", href: "/blog" },
  { label: "Work With Me", href: "/work-with-me" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => { setOpen(false); }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) =>
    location.pathname === href || location.pathname.startsWith(href + "/");

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          scrolled || open
            ? "bg-background/95 backdrop-blur border-b border-border"
            : "bg-background/80 backdrop-blur border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 lg:px-14 h-16 md:h-[72px]">
          <Link to="/" className="font-serif text-base md:text-lg font-bold tracking-tight text-foreground hover:text-accent-deep transition-colors">
            Rovonn <span className="italic text-accent-deep">Russell</span>
          </Link>

          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  {link.label}
                  <ArrowUpRight size={11} className="text-accent-deep opacity-60" />
                </a>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive(link.href) ? "text-accent-deep" : "text-foreground/80 hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
            <Link
              to="/the-edge"
              className="ml-2 bg-foreground text-background px-5 py-2.5 text-xs font-semibold tracking-[0.18em] uppercase hover:bg-accent-deep transition-colors rounded-sm"
            >
              Get Your Edge
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-foreground p-1"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="fixed top-16 left-0 right-0 z-40 lg:hidden bg-background border-t border-border px-6 py-6 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="space-y-1">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between py-3 border-b border-border/50 text-base font-medium text-foreground"
                >
                  {link.label}
                  <ArrowUpRight size={14} className="text-accent-deep" />
                </a>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setOpen(false)}
                  className={`block py-3 border-b border-border/50 text-base font-medium ${
                    isActive(link.href) ? "text-accent-deep" : "text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>
          <Link
            to="/the-edge"
            onClick={() => setOpen(false)}
            className="block bg-foreground text-background px-5 py-3.5 mt-6 text-xs font-semibold tracking-[0.18em] uppercase text-center rounded-sm"
          >
            Get Your Edge
          </Link>
        </div>
      )}
    </>
  );
};

export default Navbar;
