import { useState, useEffect, useRef, useCallback } from 'react';

export function useTimer({ duration, onExpire, active }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const intervalRef = useRef(null);

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    clear();
    setTimeLeft(duration);
  }, [clear, duration]);

  const start = useCallback(() => {
    clear();
    setTimeLeft(duration);
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          onExpire();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [clear, duration, onExpire]);

  useEffect(() => {
    return () => clear();
  }, [clear]);

  const timerClass =
    timeLeft <= 5 ? 'danger' : timeLeft <= 9 ? 'warning' : '';

  return { timeLeft, timerClass, start, reset, clear };
}
