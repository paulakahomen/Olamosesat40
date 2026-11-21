import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import './HorizontalGallery.css';

export type GalleryItem = {
  src: string;
  alt: string;
  /** Optional natural aspect ratio, e.g. "2 / 3". Defaults to "2 / 3". */
  ratio?: string;
};

type HorizontalGalleryProps = {
  items: GalleryItem[];
  /** Optional header rendered above the strip. */
  children?: ReactNode;
  className?: string;
};

/**
 * Full-bleed horizontal photography gallery.
 *
 * The strip scrolls itself natively on every device: swipe on touch, drag with
 * the mouse, horizontal trackpad gestures, or focus it and use the arrow keys.
 * Page scroll is never hijacked.
 */
export function HorizontalGallery({
  items,
  children,
  className = '',
}: HorizontalGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return undefined;

    let pointerId: number | null = null;
    let startX = 0;
    let startLeft = 0;
    let dragged = false;

    const onPointerDown = (event: PointerEvent) => {
      /* Mouse only — touch already scrolls natively. */
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      pointerId = event.pointerId;
      startX = event.clientX;
      startLeft = scroller.scrollLeft;
      dragged = false;
      scroller.classList.add('is-dragging');
    };

    const onPointerMove = (event: PointerEvent) => {
      if (pointerId === null || event.pointerId !== pointerId) return;
      const delta = event.clientX - startX;
      if (Math.abs(delta) > 4) dragged = true;
      if (dragged) scroller.scrollLeft = startLeft - delta;
    };

    const endDrag = (event: PointerEvent) => {
      if (pointerId === null || event.pointerId !== pointerId) return;
      pointerId = null;
      scroller.classList.remove('is-dragging');
    };

    /* Swallow the click that follows a drag so it isn't read as a tap. */
    const onClickCapture = (event: MouseEvent) => {
      if (!dragged) return;
      dragged = false;
      event.preventDefault();
      event.stopPropagation();
    };

    /* Horizontal trackpad gestures drive the strip, not the page. */
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      scroller.scrollLeft += event.deltaX;
    };

    scroller.addEventListener('pointerdown', onPointerDown);
    scroller.addEventListener('pointermove', onPointerMove);
    scroller.addEventListener('pointerup', endDrag);
    scroller.addEventListener('pointercancel', endDrag);
    scroller.addEventListener('pointerleave', endDrag);
    scroller.addEventListener('click', onClickCapture, true);
    scroller.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      scroller.removeEventListener('pointerdown', onPointerDown);
      scroller.removeEventListener('pointermove', onPointerMove);
      scroller.removeEventListener('pointerup', endDrag);
      scroller.removeEventListener('pointercancel', endDrag);
      scroller.removeEventListener('pointerleave', endDrag);
      scroller.removeEventListener('click', onClickCapture, true);
      scroller.removeEventListener('wheel', onWheel);
    };
  }, []);

  return (
    <div className={`h-gallery${className ? ` ${className}` : ''}`}>
      {children && <div className="h-gallery__top">{children}</div>}

      <div
        ref={scrollRef}
        className="h-gallery__scroll"
        role="region"
        aria-label="Photographs, scroll horizontally"
        tabIndex={0}
      >
        <ul className="h-gallery__track">
          {items.map((item) => (
            <li key={item.src} className="h-gallery__item">
              <img
                className="h-gallery__image"
                src={item.src}
                alt={item.alt}
                width={1179}
                height={1802}
                loading="lazy"
                decoding="async"
                draggable={false}
                style={{ '--ratio': item.ratio ?? '2 / 3' } as CSSProperties}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
