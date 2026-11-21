import type { ReactNode } from 'react';
import './Container.css';

type ContainerWidth = 'default' | 'wide' | 'narrow' | 'full';

type ContainerProps = {
  children: ReactNode;
  /** Constrains the content width. Defaults to `default`. */
  width?: ContainerWidth;
  className?: string;
};

/**
 * Horizontal layout wrapper: applies the content max-width and page gutters.
 */
export function Container({
  children,
  width = 'default',
  className,
}: ContainerProps) {
  const classes = ['container'];

  if (width !== 'default') classes.push(`container--${width}`);
  if (className) classes.push(className);

  return <div className={classes.join(' ')}>{children}</div>;
}
