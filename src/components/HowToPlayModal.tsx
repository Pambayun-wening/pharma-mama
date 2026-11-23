import React from 'react';
import { X, Sparkles, Scale, Microscope, RefreshCw, Cpu, CheckCircle2, BookOpen } from 'lucide-react';
import { MamaMascot } from './MamaMascot';
import { soundEngine } from '../services/soundEngine';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenKnowledgeBook: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({
  isOpen,
  onClose,
  onOpenKnowledgeBook,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-pop-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl border-4 border-pink-300 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-yellow-200 animate-spin-slow" />
            <h2 className="text-xl sm:text-2xl font-bubble font-bold tracking-wide">
              How to Play Pharma Mama!
            </h2>
          </div>
          <button
            onClick={() => {
              soundEngine.playPop();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-white/20 transition-all text-white cursor-pointer active:scale-90"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 custom-scrollbar text-slate-700">
          {/* Mama Intro */}
          <div className="bg-pink-50 rounded-2xl p-4 border-2 border-pink-200 flex flex-col sm:flex-row items-center gap-4">
            <MamaMascot mood="happy" size="sm" showSpeechBubble={false} />
            <div>
              <h3 className="font-bubble font-bold text-lg text-pink-700 mb-1">
                Welcome to my Pharmaceutical Formulation Lab!
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Here, you'll step into the shoes of a compounding pharmacist. Unlike ordinary cooking games, our recipes are life-saving medications! Your mission is to pick the right ingredients, check chemical & physical compatibilities, and manufacture perfect batches that pass pharmacopoeial inspection!
              </p>
            </div>
          </div>

          {/* 5 Gameplay Stages Breakdown */}
          <div className="space-y-3.5">
            <h4 className="font-bubble text-base text-slate-800 font-bold uppercase tracking-wider text-pink-600 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
              The 5 Compounding Stages:
            </h4>

            {/* Stage 1 */}
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 flex-shrink-0 font-bold">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-800 text-sm">Stage 1: Formulation & Precision Weighing</div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Review the order requirements (e.g. Diluent, Binder, Superdisintegrant, Lubricant). Select suitable excipients and dispense them onto the analytical balance inside the tolerance zone!
                </p>
              </div>
            </div>

            {/* Stage 2 */}
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-200">
              <div className="w-10 h-10 rounded-xl bg-amber-200 border border-amber-400 flex items-center justify-center text-amber-800 flex-shrink-0 font-bold">
                <Microscope className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <span>Stage 2: Compatibility Lab</span>
                  <span className="text-[10px] bg-pink-600 text-white font-bold px-2 py-0.5 rounded-full">35% of Score!</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Combine the drug with excipients in the reaction chamber. Discover whether pairs are generally compatible, have condition-dependent risks (like the Maillard reaction with lactose or hydrophobic over-coating), or cause severe degradation!
                </p>
              </div>
            </div>

            {/* Stage 3 */}
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-blue-50 border-2 border-blue-200">
              <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-700 flex-shrink-0 font-bold">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-800 text-sm">Stage 3: Mixing & Blending Order</div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Sequence matters! Blend the active and binders first. <strong>Warning:</strong> Never over-blend lubricants like magnesium stearate — excessive mixing coats particles in water-repellent wax, preventing disintegration!
                </p>
              </div>
            </div>

            {/* Stage 4 */}
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-purple-50 border-2 border-purple-200">
              <div className="w-10 h-10 rounded-xl bg-purple-100 border border-purple-300 flex items-center justify-center text-purple-700 flex-shrink-0 font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-800 text-sm">Stage 4: Dosage Form Manufacturing</div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Operate real lab equipment! Use the rotary punch press to compact tablets at the optimal 12–15 kN force to avoid capping or crumbling. For suspensions, wet and homogenize!
                </p>
              </div>
            </div>

            {/* Stage 5 */}
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-200">
              <div className="w-10 h-10 rounded-xl bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-700 flex-shrink-0 font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-800 text-sm">Stage 5: Quality Control (QC) Testing</div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Perform real pharmacopoeial checks: Appearance, Disintegration bath (37°C water), Tablet Hardness tester, and Dissolution release profile!
                </p>
              </div>
            </div>
          </div>

          {/* Scoring Table */}
          <div className="p-4 rounded-2xl bg-pink-100/60 border border-pink-200">
            <h4 className="font-bubble text-sm font-bold text-pink-900 mb-2">Grading System (Mama's Report Card)</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-pink-200">
                <div className="font-extrabold text-pink-600 text-base">25%</div>
                <div className="text-slate-600 font-medium">Excipient Selection</div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-pink-300 ring-2 ring-pink-400">
                <div className="font-extrabold text-rose-600 text-base">35%</div>
                <div className="text-slate-700 font-bold">Compatibility Lab</div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-pink-200">
                <div className="font-extrabold text-pink-600 text-base">20%</div>
                <div className="text-slate-600 font-medium">Manufacturing</div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-pink-200">
                <div className="font-extrabold text-pink-600 text-base">20%</div>
                <div className="text-slate-600 font-medium">Quality Control</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              soundEngine.playPop();
              onClose();
              onOpenKnowledgeBook();
            }}
            className="flex items-center gap-2 text-teal-700 font-bold text-xs sm:text-sm hover:underline cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-teal-600" />
            Open HOPE Knowledge Book anytime
          </button>
          <button
            onClick={() => {
              soundEngine.playSuccess();
              onClose();
            }}
            className="w-full sm:w-auto px-6 py-2.5 btn-mama btn-mama-pink text-white font-bubble text-base"
          >
            Let's Formulate!
          </button>
        </div>
      </div>
    </div>
  );
};
