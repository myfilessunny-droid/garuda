import React, { useState, useEffect } from 'react';
import { Menu, X, Heart } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Vision', href: '#vision' },
    { label: 'Activities', href: '#work' },
    { label: 'Stories', href: '#stories' },
    { label: 'Contact', href: '#contact' }
  ];

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const footer = document.querySelector('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavClick = (e: React.MouseEvent, href: string, label: string) => {
    e.preventDefault();
    
    // If we're not on the homepage, navigate to homepage first
    if (location.pathname !== '/') {
      navigate(`/${href}`);
    } else {
      // If we're on homepage, scroll to the section
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    
    // Close mobile menu if open
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-lg shadow-lg h-16 md:h-18' 
          : 'bg-white/70 backdrop-blur-lg shadow-sm h-18 md:h-20'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-full">
        {/* Logo */}
        <div className="flex items-center">
          <div 
            className="w-36 md:w-48 cursor-pointer" 
            aria-label="Home Logo"
            onClick={handleLogoClick}
          >
            <h1 className="text-xl md:text-2xl font-semibold">
              <span className="text-primary font-sans">Garuda</span>{' '}
              <span className="text-accent font-serif">Dhhruvam</span>
            </h1>
            <p className="text-xs text-muted-foreground -mt-1">Foundation</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => {
                if (item.label === 'Contact') {
                  handleContactClick(e);
                } else {
                  handleNavClick(e, item.href, item.label);
                }
              }}
              className="text-sm md:text-base font-light tracking-wide text-foreground hover:text-accent px-3 py-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
            >
              {item.label}
            </a>
          ))}
          {/* Admin Login link for desktop */}
          <a
            href="/admin/login"
            className="text-xs md:text-sm font-light text-muted-foreground hover:text-primary px-2 py-1 border border-transparent hover:border-primary rounded transition-colors duration-200 ml-2"
            style={{ textDecoration: 'underline', opacity: 0.7 }}
          >
            Admin Login
          </a>
        </nav>

        {/* CTA & Mobile Menu */}
        <div className="flex items-center gap-4">
          <a href="/donate" className="btn-turmeric hidden sm:inline-flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Donate
          </a>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-foreground hover:bg-accent/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-ivory border-t border-border shadow-lg">
          <nav className="px-6 py-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  if (item.label === 'Contact') {
                    e.preventDefault();
                    handleContactClick(e);
                  } else {
                    handleNavClick(e, item.href, item.label);
                  }
                }}
                className="block py-3 text-lg font-medium text-foreground hover:text-accent border-b border-border/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
              >
                {item.label}
              </a>
            ))}
            {/* Admin Login link for mobile */}
            <a
              href="/admin/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-3 text-base font-light text-muted-foreground hover:text-primary border-b border-border/50 transition-colors rounded-md mt-2"
              style={{ textDecoration: 'underline', opacity: 0.7 }}
            >
              Admin Login
            </a>
            <a href="/donate" className="btn-turmeric w-full mt-4 flex items-center justify-center gap-2">
              <Heart className="w-4 h-4" />
              Donate
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;