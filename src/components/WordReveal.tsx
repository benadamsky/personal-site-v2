'use client';

import { CSSProperties, useEffect, useRef, useState } from 'react';

interface WordRevealProps {
  children: string;
}

const WordReveal = ({ children }: WordRevealProps) => {
  const rootRef = useRef<HTMLParagraphElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.32 }
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <p ref={rootRef} className={`word-reveal ${visible ? 'is-visible' : ''}`}>
      {children.split(' ').map((word, index) => (
        <span
          key={`${word}-${index}`}
          style={{ '--word-index': index } as CSSProperties}
        >
          {word}{' '}
        </span>
      ))}
    </p>
  );
};

export default WordReveal;
