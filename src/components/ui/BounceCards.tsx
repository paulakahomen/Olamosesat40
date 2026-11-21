import type { CSSProperties } from 'react';
import './BounceCards.css';

export type BounceCardImage = string | { src: string; alt?: string };

type BounceCardsProps = {
  images?: BounceCardImage[];
  className?: string;
  style?: CSSProperties;
  containerWidth?: number;
  containerHeight?: number;
  cardSize?: number;
  spread?: number;
  rotation?: number;
  arc?: number;
  animationDelay?: number;
  animationStagger?: number;
  bounciness?: number;
  enableHover?: boolean;
  pushDistance?: number;
  hoverScale?: number;
  borderWidth?: number;
  borderColor?: string;
  radius?: number;
  shadow?: boolean;
  transformStyles?: string[];
  stackOrder?: 'forward' | 'reverse' | 'center';
  onCardClick?: (index: number) => void;
};

type Card = { src: string; alt: string };
type Slot = { x: number; y: number; rotate: number };

const PATTERN = [1, 0.5, -0.3, -1, 0.2, 0.75, -0.6, 0.35, -0.85, 0.1];

const parseTransform = (value?: string): Slot | null => {
  if (typeof value !== 'string') return null;
  const rotate = value.match(/rotate\(\s*(-?[\d.]+)deg\s*\)/);
  const translate = value.match(
    /translate\(\s*(-?[\d.]+)px(?:\s*,\s*(-?[\d.]+)px)?\s*\)/,
  );
  return {
    x: translate ? Number(translate[1]) : 0,
    y: translate && translate[2] ? Number(translate[2]) : 0,
    rotate: rotate ? Number(rotate[1]) : 0,
  };
};

const toCard = (item: BounceCardImage): Card =>
  typeof item === 'string'
    ? { src: item, alt: '' }
    : { src: item?.src ?? '', alt: item?.alt ?? '' };

/**
 * Static card fan. Cards are laid out in a loose pile using the supplied
 * spread / rotation / arc values — no animation, no hover physics.
 */
export default function BounceCards({
  images = [],
  className = '',
  style,
  containerWidth = 400,
  containerHeight = 400,
  cardSize = 200,
  spread = 85,
  rotation = 10,
  arc = 0,
  borderWidth = 5,
  borderColor = '#ffffff',
  radius = 25,
  shadow = true,
  transformStyles,
  stackOrder = 'forward',
}: BounceCardsProps) {
  const cards = images.map(toCard);
  const count = cards.length;
  const middle = (count - 1) / 2;
  const reach = Math.max(1, middle);

  const slots: Slot[] = cards.map((_, i) => {
    const custom = transformStyles ? parseTransform(transformStyles[i]) : null;
    if (custom) return custom;
    const offset = i - middle;
    return {
      x: offset * spread,
      y: arc * (offset / reach) ** 2,
      rotate: rotation * PATTERN[i % PATTERN.length],
    };
  });

  const baseZ = cards.map((_, i) => {
    if (stackOrder === 'reverse') return count - i;
    if (stackOrder === 'center') return count - Math.round(Math.abs(i - middle) * 2);
    return i + 1;
  });

  const containerStyle = {
    width: containerWidth,
    height: containerHeight,
    '--bounce-cards-size': `${Math.max(10, cardSize)}px`,
    '--bounce-cards-border': `${Math.max(0, borderWidth)}px`,
    '--bounce-cards-border-color': borderColor,
    '--bounce-cards-radius': `${Math.max(0, radius)}px`,
    '--bounce-cards-shadow': shadow
      ? '0 1px 2px rgba(0, 0, 0, 0.12), 0 10px 28px -6px rgba(0, 0, 0, 0.32)'
      : 'none',
    '--bounce-cards-shadow-active': shadow
      ? '0 2px 4px rgba(0, 0, 0, 0.14), 0 22px 44px -10px rgba(0, 0, 0, 0.42)'
      : 'none',
    ...style,
  } as CSSProperties;

  return (
    <div
      className={`bounce-cards${className ? ` ${className}` : ''}`}
      style={containerStyle}
    >
      {cards.map((card, i) => {
        const slot = slots[i];
        return (
          <div
            key={i}
            className="bounce-cards__card"
            style={{
              zIndex: baseZ[i] ?? i + 1,
              transform: `translate(-50%, -50%) translate3d(${slot.x}px, ${slot.y}px, 0) rotate(${slot.rotate}deg)`,
            }}
          >
            {card.src && <img src={card.src} alt={card.alt} draggable={false} />}
          </div>
        );
      })}
    </div>
  );
}
