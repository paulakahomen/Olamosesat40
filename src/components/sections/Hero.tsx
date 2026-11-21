import { Container } from '../layout/Container';
import './Hero.css';

/**
 * Opening frame of the site: editorial split between display typography
 * and the portrait, closed by a quiet scroll cue.
 */
export function Hero() {
  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <Container width="wide" className="hero__inner">
        <div className="hero__content">
          <p className="hero__eyebrow eyebrow">
            <span className="hero__eyebrow-rule" aria-hidden="true" />
            A Life. A Legacy. Four Decades.
          </p>

          <h1 id="hero-title" className="hero__title">
            <span className="hero__title-name">Olamoses</span>
          </h1>

          <p className="hero__headline">Forty Years. Countless Stories.</p>

          <p className="hero__celebrant">
            Celebrating Olakunle Ikotun at 40
          </p>

          <p className="hero__statement">
            The man behind the moments deserves a moment of his own.
          </p>

          <p className="hero__intro">
            Four decades of life, memories, friendships, lessons and a legacy
            still being written. Today, we turn the lens towards the man who has
            spent so much time capturing everyone else&rsquo;s stories.
          </p>
        </div>

        <figure className="hero__portrait">
          <span className="hero__portrait-accent" aria-hidden="true" />
          <span
            className="hero__portrait-accent hero__portrait-accent--end"
            aria-hidden="true"
          />
          <div className="hero__portrait-frame">
            <img
              className="hero__portrait-image"
              src="/40th-images/main.jpg"
              alt="Portrait of Olakunle Ikotun"
              width={1031}
              height={1406}
              fetchPriority="high"
            />
            <span className="hero__portrait-index" aria-hidden="true">
              01
            </span>
          </div>
        </figure>
      </Container>

      <a className="hero__scroll" href="#story">
        <span className="hero__scroll-label">Scroll to discover his story</span>
        <span className="hero__scroll-track" aria-hidden="true">
          <span className="hero__scroll-line" />
        </span>
      </a>
    </section>
  );
}
