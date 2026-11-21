import { Container } from '../layout/Container';
import './Frames.css';

type Frame = {
  src: string;
  alt: string;
};

/**
 * Photographic gallery — the six supplied frames, laid out as a three-column,
 * two-row grid beneath the section header.
 */
const frames: Frame[] = [
  {
    src: '/40th-images/1.jpg',
    alt: 'Olamoses in a green agb and patterned cap, one hand raised to his cap, holding a staff',
  },
  {
    src: '/40th-images/2.jpg',
    alt: 'Olamoses standing beside an ornate chair in a green agbada, holding a walking cane',
  },
  {
    src: '/40th-images/3.jpg',
    alt: 'Portrait of Olamoses in a blue shirt and glasses, hand resting at his chin',
  },
  {
    src: '/40th-images/4.jpg',
    alt: 'Portrait of Olamoses in a white polo shirt, arms folded, wearing a watch',
  },
  {
    src: '/40th-images/5.jpg',
    alt: 'Olamoses in a white textured kaftan and gold chain, hands in his pockets',
  },
  {
    src: '/40th-images/6.jpg',
    alt: 'Olakunle Ikotun in a navy suit and patterned red tie, hands clasped on a table',
  },
];

export function Frames() {
  return (
    <section
      id="frames"
      className="section section--raised frames"
      aria-labelledby="frames-title"
    >
      <Container>
        <header className="frames__header">
          <p className="eyebrow">02 — The Frames</p>
          <h2 id="frames-title" className="frames__title section-title">
            Photographs, in sequence.
          </h2>
          <p className="frames__lede lede">
            A photographic study of the celebration, in six frames.
          </p>
        </header>

        <ul className="frames__grid">
          {frames.map((frame) => (
            <li key={frame.src} className="frames__item">
              <img
                className="frames__image"
                src={frame.src}
                alt={frame.alt}
                width={1179}
                height={1802}
                loading="lazy"
                decoding="async"
              />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
