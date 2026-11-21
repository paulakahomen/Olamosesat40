/**
 * Single source of truth for the site's sections.
 * `id` values are used as anchor targets and as the section element ids.
 */
export type SectionLink = {
  id: string;
  label: string;
};

export const sections: SectionLink[] = [
  { id: 'story', label: 'The Story' },
  { id: 'frames', label: 'The Frames' },
  { id: 'wishes', label: 'Wishes' },
];

/** Links shown in the primary navigation (excludes the hero/home section). */
export const navLinks = sections;
