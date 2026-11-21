import { Container } from './Container';
import { navLinks } from '../../constants/sections';
import './Footer.css';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <Container>
        <div className="site-footer__top">
          <p className="site-footer__wordmark">Olamoses</p>
          <nav className="site-footer__nav" aria-label="Footer">
            <ul className="site-footer__list">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a className="site-footer__link" href={`#${link.id}`}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <hr className="rule" />

        <div className="site-footer__bottom">
          <p className="site-footer__meta">The 40th Frame</p>
          <p className="site-footer__meta">© {year} — All rights reserved</p>
        </div>
      </Container>
    </footer>
  );
}
