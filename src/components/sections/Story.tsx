import { Section } from '../layout/Section';
import './Story.css';

/**
 * The narrative section.
 */
export function Story() {
  return (
    <Section
      id="story"
      eyebrow="01 — The Story"
      title="Every life has a story. His is worth telling."
      tone="default"
    >
      <div className="story__body">
        <p className="story__lead">
          Forty years is more than a number. It is a collection of moments,
          lessons, relationships, unexpected turns and memories that become part
          of who we are.
        </p>

        <p>
          Behind the name{' '}
          <span className="story__name">Olakunle Ikotun</span> is a man whose
          story extends far beyond the photographs, the milestones and the
          years. A story shaped by experiences, defined by the people along the
          way, and still unfolding.
        </p>

        <p>
          Today, we pause to celebrate not just the years behind him, but the
          person he has become and the many chapters still waiting to be
          written.
        </p>

        <p className="story__closing">
          This is his story. And at forty, there is still so much more to come.
        </p>
      </div>
    </Section>
  );
}
