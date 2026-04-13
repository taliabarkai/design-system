import React from 'react';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

interface HeadingProps {
  level: HeadingLevel;
  children: React.ReactNode;
  className?: string;
}

export const Heading: React.FC<HeadingProps> = ({
  level,
  children,
  className = '',
}) => {
  const typographyClass = `typography-headline${level}`;
  const cls = `${typographyClass} ${className}`.trim();

  if (level <= 6) {
    const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    return <Tag className={cls}>{children}</Tag>;
  }

  return (
    <div className={cls} role="heading" aria-level={level}>
      {children}
    </div>
  );
};

Heading.displayName = 'Heading';
