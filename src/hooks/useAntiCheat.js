import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export function useAntiCheat(attemptId, { enabled = true, onViolation } = {}) {
  const violations = useRef([]);
  const storageKey = `aimeducare-attempt-${attemptId}-violations`;

  const log = (type, meta = {}) => {
    const v = { type, at: new Date().toISOString(), ...meta };
    violations.current.push(v);
    try {
      const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
      localStorage.setItem(storageKey, JSON.stringify([...existing, v]));
    } catch {}
    onViolation?.(v);
  };

  useEffect(() => {
    if (!enabled) return;

    const enterFs = async () => {
      try {
        if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      } catch {}
    };
    enterFs();

    const onFsChange = () => {
      if (!document.fullscreenElement) {
        log('fullscreen_exit');
        toast.warning('You left fullscreen. Please return to continue.');
      }
    };
    document.addEventListener('fullscreenchange', onFsChange);

    const onVis = () => {
      if (document.hidden) {
        log('tab_switch');
        toast.warning('Tab switch detected. This is being recorded.');
      }
    };
    document.addEventListener('visibilitychange', onVis);

    const block = (e) => { e.preventDefault(); log('blocked_' + e.type); };
    ['copy','cut','paste','contextmenu'].forEach((ev) =>
      document.addEventListener(ev, block)
    );

    const onKey = (e) => {
      if (
        (e.ctrlKey && ['c','v','u','s','p'].includes(e.key.toLowerCase())) ||
        e.key === 'F12'
      ) {
        e.preventDefault();
        log('blocked_shortcut', { key: e.key });
      }
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      document.removeEventListener('visibilitychange', onVis);
      ['copy','cut','paste','contextmenu'].forEach((ev) =>
        document.removeEventListener(ev, block)
      );
      document.removeEventListener('keydown', onKey);
    };
  }, [enabled, attemptId]);

  return { getViolations: () => violations.current };
}