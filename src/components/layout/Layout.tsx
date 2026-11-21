import type { ReactNode } from 'react';
import { Navigation } from '../navigation/Navigation';
import { Footer } from './Footer';
import './Layout.css';

type LayoutProps = {
  children: ReactNode;
};

/**
 * Page shell: skip link, fixed navigation, main content region and footer.
 * Section components are passed in as children of `main`.
 */
export function Layout({ children }: LayoutProps) {
  return (
    <div className="site">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Navigation />

      <main id="main" className="site__main" tabIndex={-1}>
        {children}
      </main>

      <Footer />
    </div>
  );
}
