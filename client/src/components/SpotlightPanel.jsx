import { useEffect, useRef, useState } from 'react';

import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';
import { classNames } from '../utils/helpers';

export default function SpotlightPanel({
  as: Component = 'div',
  children,
  className = '',
  intensity = 'medium',
  disabled = false,
  ...props
}) {
  const ref = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [canAnimate, setCanAnimate] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 768px)');
    const updateValue = (event) => setCanAnimate(event.matches);

    updateValue(mediaQuery);
    mediaQuery.addEventListener('change', updateValue);

    return () => {
      mediaQuery.removeEventListener('change', updateValue);
    };
  }, []);

  const isInteractive = canAnimate && !prefersReducedMotion && !disabled;

  const handleMove = (event) => {
    if (!isInteractive || !ref.current) {
      return;
    }

    const bounds = ref.current.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;

    ref.current.style.setProperty('--spotlight-x', `${x}%`);
    ref.current.style.setProperty('--spotlight-y', `${y}%`);
    ref.current.style.setProperty('--spotlight-opacity', '1');
  };

  const handleLeave = () => {
    if (!ref.current) {
      return;
    }

    ref.current.style.setProperty('--spotlight-opacity', '0');
    ref.current.style.setProperty('--spotlight-x', '50%');
    ref.current.style.setProperty('--spotlight-y', '50%');
  };

  return (
    <Component
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={classNames(
        'spotlight-panel',
        intensity === 'high' && 'spotlight-panel-strong',
        !isInteractive && 'spotlight-panel-static',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
