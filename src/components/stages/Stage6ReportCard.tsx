import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Star,
  Award,
  Sparkles,
  RotateCcw,
  ClipboardList,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import { FormulationBatch, LevelOrder, MamaMood } from '../../types/game';
import { MamaMascot } from '../MamaMascot';
import { soundEngine } from '../../services/soundEngine';

interface Stage6ReportCardProps {
  order: LevelOrder;
  batch: FormulationBatch;
  onRestartOrder: () => void;
  onOpenOrderSelect: () => void;
  onOpenKnowledgeBook: () => void;
}

export const Stage6ReportCard: React.FC<Stage6ReportCardProps> = ({
  order,
  batch,
  onRestartOrder,
  onOpenOrderSelect,
  onOpenKnowledgeBook,
}) => {
  const { scores, starRating, formulationQualityRating, mistakeSummary, positiveHighlights, educationalFeedback } =
    batch;

  useEffect(() => {
    if (starRating >= 2) {
      soundEngine.playFanfare();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else {
      soundEngine.playSuccess();
    }
  }, [starRating]);

  // Determine Mama's reaction
  const mamaMood: MamaMood = starRating === 3 ? 'cheering' : starRating === 2 ? 'starry' : 'thinking';
  const mamaSpeech =
    starRating === 3
      ? 'Even better than Mama! You created a true Pharmacopoeial Masterpiece with zero incompatibility errors!'
      : starRating === 2
      ? 'Great compounding work! Your formulation meets commercial release standards with just minor refinements needed.'
      : 'Good effort! Review the HOPE compendium on compatibility and lubricant mixing times to master this formulation.';

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-2 sm:p-4 animate-pop-in">
      {/* Top Mama Hero Celebration Banner */}
      <div className="bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 rounded-3xl p-6 text-white shadow-mama-pink flex flex-col sm:flex-row items-center gap-6">
        <MamaMascot mood={mamaMood} size="md" showSpeechBubble={false} />
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-1 mb-2">
            {[1, 2, 3].map((starIdx) => (
              <Star
                key={starIdx}
                className={`w-7 h-7 sm:w-8 sm:h-8 transition-transform ${
                  starIdx <= starRating
                    ? 'text-yellow-300 fill-yellow-300 animate-bounce-gentle'
                    : 'text-white/30 fill-white/10'
                }`}
              />
            ))}
          </div>

          <span className="text-xs font-bold tracking-wider uppercase bg-white/20 px-3 py-1 rounded-full inline-block mb-1">
            Batch Evaluation Certificate
          </span>

          <h2 className="text-2xl sm:text-3xl font-bubble font-black tracking-wide">
            {formulationQualityRating}
          </h2>

          <p className="text-sm sm:text-base font-medium text-pink-50 mt-1 leading-snug">
            {mamaSpeech}
          </p>
        </div>

        {/* Big Circular Total Score Badge */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white text-slate-800 shadow-xl flex flex-col items-center justify-center border-4 border-yellow-300 flex-shrink-0 animate-pop-in">
          <span className="text-xs font-bubble font-bold text-slate-500 uppercase">Total Score</span>
          <span className="text-3xl sm:text-4xl font-bubble font-black text-pink-600 leading-none">
            {scores.totalScore}
          </span>
          <span className="text-[10px] font-mono text-slate-400">OUT OF 100</span>
        </div>
      </div>

      {/* 4 Weighted Categories Breakdown */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-3 border-pink-100 shadow-mama space-y-4">
        <h3 className="font-bubble text-lg font-bold text-slate-800 flex items-center gap-2">
          <Award className="w-5 h-5 text-pink-600" />
          Weighted Grading Breakdown
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Category 1: Selection (25%) */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200">
            <div className="flex items-center justify-between text-slate-500 font-bold mb-1">
              <span>Excipient Selection</span>
              <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded">25% Max</span>
            </div>
            <div className="text-2xl font-bubble font-bold text-pink-600 my-1">
              {scores.excipientSelection} <span className="text-xs text-slate-400">/ 25</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-pink-500 rounded-full"
                style={{ width: `${(scores.excipientSelection / 25) * 100}%` }}
              />
            </div>
          </div>

          {/* Category 2: Compatibility (35% - HIGHEST WEIGHT!) */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 ring-2 ring-amber-400/50">
            <div className="flex items-center justify-between text-amber-900 font-bold mb-1">
              <span>Compatibility Lab</span>
              <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-extrabold">
                35% Max
              </span>
            </div>
            <div className="text-2xl font-bubble font-bold text-amber-600 my-1">
              {scores.compatibilityUnderstanding} <span className="text-xs text-slate-400">/ 35</span>
            </div>
            <div className="w-full h-2 bg-amber-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${(scores.compatibilityUnderstanding / 35) * 100}%` }}
              />
            </div>
          </div>

          {/* Category 3: Manufacturing (20%) */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200">
            <div className="flex items-center justify-between text-slate-500 font-bold mb-1">
              <span>Manufacturing Process</span>
              <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded">20% Max</span>
            </div>
            <div className="text-2xl font-bubble font-bold text-pink-600 my-1">
              {scores.manufacturingProcess} <span className="text-xs text-slate-400">/ 20</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-pink-500 rounded-full"
                style={{ width: `${(scores.manufacturingProcess / 20) * 100}%` }}
              />
            </div>
          </div>

          {/* Category 4: Quality Control (20%) */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200">
            <div className="flex items-center justify-between text-slate-500 font-bold mb-1">
              <span>Quality Control (QC)</span>
              <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded">20% Max</span>
            </div>
            <div className="text-2xl font-bubble font-bold text-pink-600 my-1">
              {scores.qualityControl} <span className="text-xs text-slate-400">/ 20</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-pink-500 rounded-full"
                style={{ width: `${(scores.qualityControl / 20) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Highlights & Feedback Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Positive Highlights */}
        <div className="bg-white rounded-3xl p-5 border-3 border-emerald-100 shadow-mama">
          <h4 className="font-bubble text-base font-bold text-emerald-900 flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Formulation Achievements
          </h4>
          <ul className="space-y-2 text-xs text-slate-700">
            {positiveHighlights.map((hl, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <span>{hl}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Mistakes & Learning Opportunities */}
        <div className="bg-white rounded-3xl p-5 border-3 border-amber-100 shadow-mama">
          <h4 className="font-bubble text-base font-bold text-amber-900 flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            Mistake Analysis &amp; Cautions
          </h4>
          {mistakeSummary.length === 0 ? (
            <p className="text-xs text-emerald-700 font-medium">
              Zero errors detected! You executed this formulation batch with flawless compounding precision!
            </p>
          ) : (
            <ul className="space-y-2 text-xs text-slate-700">
              {mistakeSummary.map((err, idx) => (
                <li key={idx} className="flex items-start gap-2 text-amber-900">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                  <span>{err}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* In-depth Scientific Educational Rationale */}
      {educationalFeedback.length > 0 && (
        <div className="bg-white rounded-3xl p-5 border-3 border-blue-100 shadow-mama space-y-2">
          <h4 className="font-bubble text-base font-bold text-blue-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            Evidence-Based Learning Feedback (HOPE Monograph Science)
          </h4>
          <div className="space-y-2 text-xs text-slate-700">
            {educationalFeedback.map((fb, idx) => (
              <p key={idx} className="bg-blue-50/60 p-3 rounded-2xl border border-blue-200 leading-relaxed">
                {fb}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          onClick={() => {
            soundEngine.playPop();
            onRestartOrder();
          }}
          className="px-5 py-3 btn-mama btn-mama-yellow font-bubble text-sm sm:text-base flex items-center gap-2 cursor-pointer shadow-mama-yellow"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Formulate Again</span>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              soundEngine.playPop();
              onOpenKnowledgeBook();
            }}
            className="px-4 py-3 btn-mama btn-mama-mint font-bubble text-sm flex items-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Consult HOPE Book</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playSuccess();
              onOpenOrderSelect();
            }}
            className="px-6 py-3 btn-mama btn-mama-pink font-bubble text-sm sm:text-base flex items-center gap-2 cursor-pointer shadow-mama-pink"
          >
            <ClipboardList className="w-5 h-5" />
            <span>Next Prescription Order</span>
          </button>
        </div>
      </div>
    </div>
  );
};
