import { useCallback, useEffect, useRef, useState } from 'react';

import { useIsomorphicLayoutEffect } from './use-isomorphic-layout-effect';
import { useToggle } from './use-toggle';

export const useInterval = (callback: () => void, delay: number) => {
  const savedCallback = useRef(callback);
  const timer = useRef(null);
  const [canActive, toggleCanActive] = useToggle(false);

  useIsomorphicLayoutEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!canActive) return;

    clearInterval(timer.current);
    timer.current = setInterval(() => savedCallback.current(), delay);

    return () => clearInterval(timer.current);
  }, [canActive, delay]);

  const start = useCallback(() => {
    toggleCanActive(true);
  }, [toggleCanActive]);

  const stop = useCallback(() => {
    clearInterval(timer.current);
    toggleCanActive(false);
  }, [toggleCanActive]);

  return { start, stop };
};
