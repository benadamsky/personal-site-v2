'use client';
import { ReactNode, useEffect } from 'react';

interface PanelProps {
  onClose: () => void;
  children: ReactNode;
}

const Panel = ({ onClose, children }: PanelProps) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <>
      <div className="panel-backdrop" onClick={onClose} />
      <aside className="panel" role="dialog" aria-modal="true">
        <button className="panel__close" onClick={onClose}>
          close
        </button>
        {children}
      </aside>
    </>
  );
};

export default Panel;
