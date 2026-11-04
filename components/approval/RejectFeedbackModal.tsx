'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { MessageSquare, Send, X } from 'lucide-react';

interface RejectFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: string) => void;
  isLoading?: boolean;
}

export function RejectFeedbackModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: RejectFeedbackModalProps) {
  const [feedback, setFeedback] = React.useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(feedback);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Instruções de Ajuste (Luca & Nando)</h3>
              <p className="text-[11px] text-slate-400">Envie observações para reescrita da pauta</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              O que deve ser reformulado?
            </label>
            <textarea
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Ex: O gancho inicial está longo. Crie uma introdução de 10 segundos com dados mais chocantes..."
              className="w-full rounded-lg border border-slate-800 bg-slate-900 p-3 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="danger"
              size="sm"
              isLoading={isLoading}
              className="text-xs gap-1.5"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Devolver com Feedback</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
