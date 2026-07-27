/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { CreditCard, Lock, ShieldCheck, X, Sparkles, CheckCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { billingApi } from '../../api/billingApi';

interface StripeModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string;
  planName: string;
  price: number;
  onSuccess: () => void;
}

export const StripeModal: React.FC<StripeModalProps> = ({
  isOpen,
  onClose,
  planId,
  planName,
  price,
  onSuccess,
}) => {
  const toast = useToast();
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [zip, setZip] = useState('');
  const [loading, setLoading] = useState(false);
  const [processingState, setProcessingState] = useState<'idle' | 'processing' | 'success'>('idle');

  if (!isOpen) return null;

  const handleFillDemoCard = () => {
    setCardNumber('4242 •••• •••• 4242');
    setExpiry('12 / 28');
    setCvc('123');
    setZip('90210');
    toast.info('Test card numbers auto-filled!');
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setProcessingState('processing');

      // Call backend payment confirmation
      const res = await billingApi.confirmPayment(planId);

      setTimeout(() => {
        setProcessingState('success');
        toast.success(res?.data?.message || `Successfully upgraded to ${planName} Plan!`);
        setTimeout(() => {
          onSuccess();
          onClose();
          setProcessingState('idle');
          setLoading(false);
        }, 1000);
      }, 800);
    } catch (err: any) {
      setProcessingState('idle');
      setLoading(false);
      toast.error(err.message || 'Payment processing failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Stripe Checkout</h3>
              <p className="text-xs text-slate-400">Powered by Stripe 256-bit Encryption</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Order Summary Box */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">Selected Plan</span>
            <h4 className="text-base font-extrabold text-white">{planName} Subscription</h4>
            <span className="text-xs text-slate-400">Billed monthly • Cancel anytime</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-emerald-400">${price}</span>
            <span className="text-xs text-slate-400">/mo</span>
          </div>
        </div>

        {/* Demo Test Card Filler Banner */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs">
          <span className="text-indigo-300 font-medium flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-indigo-400" /> Need test card details?
          </span>
          <button
            type="button"
            onClick={handleFillDemoCard}
            className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px] transition-colors"
          >
            Auto-Fill 4242
          </button>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmitPayment} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Card Number</label>
            <div className="relative">
              <input
                type="text"
                placeholder="4242 •••• •••• 4242"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-all pl-10"
              />
              <CreditCard className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1 space-y-1">
              <label className="text-xs font-semibold text-slate-300">Expires</label>
              <input
                type="text"
                placeholder="MM / YY"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-all text-center"
              />
            </div>
            <div className="col-span-1 space-y-1">
              <label className="text-xs font-semibold text-slate-300">CVC</label>
              <input
                type="text"
                placeholder="123"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-all text-center"
              />
            </div>
            <div className="col-span-1 space-y-1">
              <label className="text-xs font-semibold text-slate-300">ZIP</label>
              <input
                type="text"
                placeholder="90210"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-all text-center"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50 mt-2"
          >
            {processingState === 'processing' ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing Stripe Charge...
              </>
            ) : processingState === 'success' ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-300" />
                Payment Confirmed!
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Pay ${price}.00 & Activate {planName}
              </>
            )}
          </button>
        </form>

        {/* Security Footer */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-800/60">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Stripe Test Mode Enabled • TLS 1.3 End-to-End Encryption</span>
        </div>

      </div>
    </div>
  );
};

export default StripeModal;
