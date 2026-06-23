import React from 'react';
import { CreditCard, CheckCircle, CheckCircle2 } from 'lucide-react';

export default function FraudPanel({ currentAction, isFinished, handleNextStep, actionIndex, totalSteps }) {
  return (
    <section className={`${isFinished ? 'bg-emerald-50 border-emerald-500' : 'bg-purple-50/70 border-purple-600'} border-l-4 p-4 rounded-r-2xl shadow-sm transition-all duration-300`}>
      <div className="flex items-start gap-2.5">
        {isFinished ? <CheckCircle2 className="text-emerald-600 w-5 h-5 mt-0.5 shrink-0" /> : <CreditCard className="text-purple-600 w-5 h-5 mt-0.5 shrink-0" />}
        <div>
          <h4 className={`font-bold text-sm ${isFinished ? 'text-emerald-900' : 'text-[#001C40]'}`}>
            {isFinished ? "Account Secured." : `Step ${actionIndex + 1} of ${totalSteps}`}
          </h4>
          <p className="text-xs text-gray-700 mt-1.5 font-medium leading-relaxed">
            {isFinished 
              ? "Your digital wallet is locked and fraud investigators have been notified. No further action needed." 
              : currentAction}
          </p>
        </div>
      </div>
      {!isFinished && (
        <button onClick={handleNextStep} className="mt-4 w-full bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold py-2.5 rounded-lg transition-all shadow-sm flex items-center justify-center gap-2">
          <CheckCircle className="w-4 h-4" /> Done, what's next?
        </button>
      )}
    </section>
  );
}