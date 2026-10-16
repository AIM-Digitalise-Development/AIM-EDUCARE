import { useCallback } from 'react';
import { api } from '@/api/client';
import { toast } from 'sonner';

const SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

function loadScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement('script');
    s.src = SCRIPT_URL;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export function useRazorpay() {
  const pay = useCallback(async ({ planId, examId, onSuccess }) => {
    const ok = await loadScript();
    if (!ok) return toast.error('Could not load Razorpay. Check your connection.');

    const { data } = await api.post('/api/orders', { plan_id: planId, exam_id: examId });
    const order = data.data;

    const rzp = new window.Razorpay({
      key: order.razorpay_key,
      amount: order.amount,
      currency: order.currency || 'INR',
      name: 'AimEducare',
      description: order.plan_name || 'Mock Test Plan',
      order_id: order.gateway_order_id,
      prefill: { name: order.user_name, email: order.user_email, contact: order.user_phone },
      theme: { color: '#4f46e5' },
      handler: function () {
        toast.success('Payment received. Verifying...');
        onSuccess?.(order.id);
      },
      modal: { ondismiss: () => toast.info('Payment cancelled.') },
    });
    rzp.open();
  }, []);

  return { pay };
}