import { useEffect, useRef, useState } from 'react';
import { Container } from '../layout/Container';
import { navLinks } from '../../constants/sections';
import './Navigation.css';

const DESKTOP_QUERY = '(min-width: 60rem)';

/**
 * Site navigation.
 * - Fixed header that gains a solid backdrop once the page is scrolled.
 * - Inline links on desktop, full-screen menu on smaller screens.
 */
export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  /* Track scroll position for the header backdrop. */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close on Escape and lock page scroll while the menu is open. */
  useEffect(() => {
    if (!isMenuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        toggleRef.current?.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isMenuOpen]);

  /* Close the menu when the viewport grows to the desktop breakpoint. */
  useEffect(() => {
    if (!isMenuOpen) return;

    const query = window.matchMedia(DESKTOP_QUERY);
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setIsMenuOpen(false);
    };

    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);
  const headerClasses = [
    'site-header',
    isScrolled ? 'is-scrolled' : '',
    isMenuOpen ? 'is-open' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <header className={headerClasses}>
      <Container className="site-header__inner">
        <a className="site-header__brand" href="#home" onClick={closeMenu}>
          <span className="site-header__brand-name">Olamoses</span>
          <span className="site-header__brand-mark" aria-hidden="true">
            40
          </span>
          <span className="visually-hidden">— back to top</span>
        </a>

        <nav className="site-header__nav" aria-label="Primary">
          <ul className="site-nav">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a className="site-nav__link" href={`#${link.id}`}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="site-header__toggle"
          aria-expanded={isMenuOpen}
          aria-controls="site-menu"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span className="site-header__toggle-label">
            {isMenuOpen ? 'Close' : 'Menu'}
          </span>
          <span className="site-header__toggle-bars" aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </Container>

      {isMenuOpen && (
        <div id="site-menu" className="site-menu">
          <Container className="site-menu__inner">
            <ul className="site-menu__list">
              {navLinks.map((link, index) => (
                <li key={link.id} className="site-menu__item">
                  <a
                    className="site-menu__link"
                    href={`#${link.id}`}
                    onClick={closeMenu}
                  >
                    <span className="site-menu__index" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="site-menu__label">{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </Container>
        </div>
      )}
    </header>
  );
}
