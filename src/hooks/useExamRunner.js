import { useEffect, useRef, useState, useCallback } from 'react';
import { api } from '@/api/client';

export function useExamRunner(attemptId, attemptPayload) {
  const storageKey = `aimeducare-attempt-${attemptId}`;
  const [answers, setAnswers] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw).answers || {} : {};
    } catch { return {}; }
  });
  const [markedForReview, setMarked] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw).marked || [] : [];
    } catch { return []; }
  });
  const [remainingSec, setRemainingSec] = useState(() => {
    if (!attemptPayload?.expires_at) return 0;
    return Math.max(0, Math.floor((new Date(attemptPayload.expires_at) - Date.now()) / 1000));
  });
  const [submitting, setSubmitting] = useState(false);
  const submittedRef = useRef(false);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({ answers, marked: markedForReview }));
  }, [answers, markedForReview, storageKey]);

  useEffect(() => {
    const t = setInterval(() => {
      setRemainingSec((s) => {
        if (s <= 1) { clearInterval(t); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const submit = useCallback(async (reason = 'manual') => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);
    try {
      const res = await api.post(`/api/attempts/${attemptId}/submit`, {
        answers,
        violations: JSON.parse(localStorage.getItem(`${storageKey}-violations`) || '[]'),
        submit_reason: reason,
      });
      localStorage.removeItem(storageKey);
      localStorage.removeItem(`${storageKey}-violations`);
      return res.data;
    } finally {
      setSubmitting(false);
    }
  }, [attemptId, answers, storageKey]);

  useEffect(() => {
    if (remainingSec === 0 && !submittedRef.current) {
      submit('timeout');
    }
  }, [remainingSec, submit]);

  const lastSaved = useRef('');
  useEffect(() => {
    const t = setInterval(async () => {
      const snap = JSON.stringify(answers);
      if (snap === lastSaved.current) return;
      try {
        await api.post(`/api/attempts/${attemptId}/save`, { answers });
        lastSaved.current = snap;
      } catch { /* silent */ }
    }, 20000);
    return () => clearInterval(t);
  }, [attemptId, answers]);

  const setAnswer = (qid, value) =>
    setAnswers((prev) => ({ ...prev, [qid]: value }));

  const clearAnswer = (qid) =>
    setAnswers((prev) => { const c = { ...prev }; delete c[qid]; return c; });

  const toggleMark = (qid) =>
    setMarked((prev) => prev.includes(qid) ? prev.filter((x) => x !== qid) : [...prev, qid]);

  return {
    answers, setAnswer, clearAnswer,
    markedForReview, toggleMark,
    remainingSec, submitting, submit,
  };
}