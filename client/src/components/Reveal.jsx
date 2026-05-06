import { useEffect, useRef, useState } from 'react';

import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';
import { classNames } from '../utils/helpers';

export default function Reveal({
  as: Component = 'div',
  children,
  className = '',
  delay = 0,
  threshold = 0.18,
  once = true,
  ...props
}) {
  const ref = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isVisible, setIsVisible] = useState(prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true);
      return undefined;
    }

    const element = ref.current;

    if (!element) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);

          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -8% 0px',
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [once, prefersReducedMotion, threshold]);

  return (
    <Component
      ref={ref}
      className={classNames('reveal', isVisible && 'reveal-visible', className)}
      style={{ '--reveal-delay': `${delay}ms` }}
      {...props}
    >
      {children}
    </Component>
  );
}
