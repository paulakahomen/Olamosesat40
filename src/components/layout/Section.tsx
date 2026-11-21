import { useId, type ReactNode } from 'react';
import { Container } from './Container';
import './Section.css';

type SectionTone = 'default' | 'raised' | 'flush';
type SectionWidth = 'default' | 'wide' | 'narrow';

type SectionProps = {
  /** Anchor id — must match the id used in `constants/sections.ts`. */
  id: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  children?: ReactNode;
  /** Background treatment. Defaults to `default` (page black). */
  tone?: SectionTone;
  /** Content max-width. Defaults to `default`. */
  width?: SectionWidth;
  className?: string;
};

/**
 * Reusable section shell: handles vertical rhythm, the eyebrow/heading/lede
 * header block, and the content container.
 */
export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  tone = 'default',
  width = 'default',
  className,
}: SectionProps) {
  const titleId = useId();
  const hasHeader = Boolean(eyebrow || title || description);

  const classes = ['section', `section--${tone}`];
  if (className) classes.push(className);

  return (
    <section
      id={id}
      className={classes.join(' ')}
      aria-labelledby={title ? titleId : undefined}
    >
      <Container width={width}>
        {hasHeader && (
          <header className="section__header">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && (
              <h2 id={titleId} className="section__title section-title">
                {title}
              </h2>
            )}
            {description && <p className="section__lede lede">{description}</p>}
          </header>
        )}
        {children && <div className="section__body">{children}</div>}
      </Container>
    </section>
  );
}
