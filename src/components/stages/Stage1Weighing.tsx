import React, { useState } from 'react';
import {
  Scale,
  Sparkles,
  Check,
  Plus,
  RotateCcw,
  BookOpen,
  ArrowRight,
  AlertTriangle,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { LevelOrder, WeighedIngredient, MamaMood } from '../../types/game';
import { EXCIPIENTS_DATABASE } from '../../data/excipients';
import { MamaMascot } from '../MamaMascot';
import { soundEngine } from '../../services/soundEngine';

interface Stage1WeighingProps {
  order: LevelOrder;
  onComplete: (selectedIds: string[], weighed: WeighedIngredient[]) => void;
  onOpenKnowledgeMonograph: (excipientId: string) => void;
}

export const Stage1Weighing: React.FC<Stage1WeighingProps> = ({
  order,
  onComplete,
  onOpenKnowledgeMonograph,
}) => {
  // Excipients selected by player
  const [selectedExcipientIds, setSelectedExcipientIds] = useState<string[]>([
    order.recommendedExcipientIds[0] || 'mcc',
  ]);

  // Which ingredient is currently placed on the balance
  const [currentWeighingId, setCurrentWeighingId] = useState<string>('api');
  // Current scale reading in mg
  const [currentScaleMg, setCurrentScaleMg] = useState<number>(0);
  // Weighed ingredients map
  const [weighedMap, setWeighedMap] = useState<Record<string, WeighedIngredient>>({});

  // Mama reaction state
  const [mamaMood, setMamaMood] = useState<MamaMood>('happy');
  const [mamaSpeech, setMamaSpeech] = useState<string>(
    `Select the excipients we need for ${order.medicineName}, then dispense them on the analytical balance!`
  );

  // Available excipients for this level
  const availableExcipients = order.availableExcipientIds.map((id) => EXCIPIENTS_DATABASE[id]).filter(Boolean);

  // Target weight calculation for current active item
  const getTargetWeightMg = (id: string): number => {
    if (id === 'api') {
      return order.dosageForm === 'tablet-ir' ? 500 : order.dosageForm === 'tablet-effervescent' ? 1000 : 200;
    }
    const exc = EXCIPIENTS_DATABASE[id];
    if (!exc) return 50;
    if (exc.categories.includes('Diluent')) return 100;
    if (exc.categories.includes('Acidifying Agent')) return 800;
    if (exc.categories.includes('Alkalizing Agent')) return 900;
    if (exc.categories.includes('Binder')) return 30;
    if (exc.categories.includes('Disintegrant')) return 20;
    if (exc.categories.includes('Lubricant')) return 5;
    if (exc.categories.includes('Glidant')) return 3;
    if (exc.categories.includes('Wetting Agent')) return 10;
    if (exc.categories.includes('Suspending Agent')) return 15;
    return 25;
  };

  const currentTargetMg = getTargetWeightMg(currentWeighingId);
  const toleranceMg = Math.max(0.5, currentTargetMg * 0.05); // 5% pharmacopoeial tolerance

  // Calculate percentage of target on scale
  const isWithinTolerance = Math.abs(currentScaleMg - currentTargetMg) <= toleranceMg;
  const isOverweight = currentScaleMg > currentTargetMg + toleranceMg;

  // Toggle selection of an excipient
  const handleToggleExcipient = (id: string) => {
    soundEngine.playPop();
    const exc = EXCIPIENTS_DATABASE[id];
    if (selectedExcipientIds.includes(id)) {
      setSelectedExcipientIds((prev) => prev.filter((item) => item !== id));
      // Remove from weighed if unselected
      setWeighedMap((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      if (currentWeighingId === id) {
        setCurrentWeighingId('api');
        setCurrentScaleMg(0);
      }
      setMamaMood('thinking');
      setMamaSpeech(`Removed ${exc?.name}. Make sure we still satisfy all required functions!`);
    } else {
      setSelectedExcipientIds((prev) => [...prev, id]);
      // Give scientific feedback
      if (order.incompatibleExcipientIds.includes(id)) {
        setMamaMood('worried');
        setMamaSpeech(`Warning! ${exc?.name} has known incompatibilities in this dosage form!`);
      } else if (order.conditionDependentExcipientIds.includes(id)) {
        setMamaMood('thinking');
        setMamaSpeech(`${exc?.name} requires special formulation conditions. Let's test it in Stage 2!`);
      } else {
        setMamaMood('happy');
        setMamaSpeech(`Good choice! ${exc?.name} acts as a ${exc?.categories.join(' & ')}.`);
      }
    }
  };

  // Dispense powder onto the scale
  const handleAddWeight = (delta: number) => {
    soundEngine.playScoop();
    const nextVal = Math.round((currentScaleMg + delta) * 10) / 10;
    setCurrentScaleMg(nextVal);

    if (Math.abs(nextVal - currentTargetMg) <= toleranceMg) {
      soundEngine.playSuccess();
      setMamaMood('starry');
      setMamaSpeech(`Spot on! ${nextVal} mg is right in the pharmacopoeial acceptance zone!`);
    } else if (nextVal > currentTargetMg + toleranceMg) {
      soundEngine.playError();
      setMamaMood('worried');
      setMamaSpeech(`A bit too much powder! Press Tare/Reset to dispense again.`);
    }
  };

  // Tare / Reset the scale
  const handleTare = () => {
    soundEngine.playPop();
    setCurrentScaleMg(0);
    setMamaMood('happy');
    setMamaSpeech('Scale tared to 0.0 mg. Scoop the powder carefully!');
  };

  // Confirm weighing of current item
  const handleConfirmWeighing = () => {
    soundEngine.playSuccess();
    const isAccurate = Math.abs(currentScaleMg - currentTargetMg) <= toleranceMg;
    const isAppropriate =
      currentWeighingId === 'api' || !order.incompatibleExcipientIds.includes(currentWeighingId);

    const exc = EXCIPIENTS_DATABASE[currentWeighingId];
    const newRecord: WeighedIngredient = {
      excipientId: currentWeighingId,
      targetWeightMg: currentTargetMg,
      actualWeightMg: currentScaleMg,
      isAccurate,
      isAppropriate,
      functionAssigned: exc ? exc.categories[0] : 'Diluent',
    };

    setWeighedMap((prev) => ({ ...prev, [currentWeighingId]: newRecord }));

    // Auto-advance to next unweighed item
    const queue = ['api', ...selectedExcipientIds];
    const nextUnweighed = queue.find((id) => id !== currentWeighingId && !weighedMap[id]);
    if (nextUnweighed) {
      setCurrentWeighingId(nextUnweighed);
      setCurrentScaleMg(0);
      const nextExc = EXCIPIENTS_DATABASE[nextUnweighed];
      setMamaMood('happy');
      setMamaSpeech(`Next, dispense ${nextExc?.name || 'Active Ingredient'} (Target: ${getTargetWeightMg(nextUnweighed)} mg)!`);
    } else {
      setMamaMood('starry');
      setMamaSpeech('All formulation ingredients are dispensed! Ready to test their compatibility?');
    }
  };

  // Check if we can proceed to Stage 2
  const queue = ['api', ...selectedExcipientIds];
  const allWeighed = queue.every((id) => Boolean(weighedMap[id]));
  const canProceed = selectedExcipientIds.length >= 3 && allWeighed;

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-2 sm:p-4 animate-pop-in">
      {/* Mama Guidance Ribbon */}
      <div className="bg-white rounded-3xl p-4 border-3 border-pink-200 shadow-mama flex flex-col sm:flex-row items-center gap-4">
        <MamaMascot mood={mamaMood} size="sm" showSpeechBubble={false} />
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 border border-pink-300">
              Stage 1 of 5
            </span>
            <span className="text-xs font-bubble font-bold text-slate-500">
              Ingredient Preparation &amp; Precision Weighing
            </span>
          </div>
          <p className="text-sm sm:text-base font-bold text-slate-800 leading-snug">
            {mamaSpeech}
          </p>
        </div>

        {canProceed && (
          <button
            onClick={() => {
              soundEngine.playSuccess();
              onComplete(selectedExcipientIds, Object.values(weighedMap));
            }}
            className="px-5 py-3 btn-mama btn-mama-mint font-bubble text-sm sm:text-base flex items-center gap-2 flex-shrink-0 animate-bounce-gentle"
          >
            <span>Proceed to Compatibility Lab</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Excipient Selection Deck (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-5 border-3 border-slate-200 shadow-mama">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="font-bubble text-lg font-bold text-slate-800">
                  Candidate Formulation Excipients
                </h3>
                <p className="text-xs text-slate-500">
                  Select excipients to fulfill required functions: {order.requiredFunctions.join(', ')}
                </p>
              </div>
              <span className="text-xs font-bold bg-pink-100 text-pink-700 px-3 py-1 rounded-full border border-pink-300">
                {selectedExcipientIds.length} Selected
              </span>
            </div>

            {/* Excipient Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto custom-scrollbar p-1">
              {availableExcipients.map((exc) => {
                const isSelected = selectedExcipientIds.includes(exc.id);
                const isWeighed = Boolean(weighedMap[exc.id]);
                const isCurrent = currentWeighingId === exc.id;

                return (
                  <div
                    key={exc.id}
                    onClick={() => handleToggleExcipient(exc.id)}
                    className={`relative p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between select-none ${
                      isSelected
                        ? 'bg-pink-50/80 border-pink-400 shadow-mama-sm'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${exc.colorTag}`}
                        >
                          {exc.categories[0]}
                        </span>
                        <div className="flex items-center gap-1">
                          {isWeighed && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                              <Check className="w-2.5 h-2.5" /> Weighed
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              soundEngine.playPop();
                              onOpenKnowledgeMonograph(exc.id);
                            }}
                            className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
                            title="View HOPE Monograph"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Excipient Name */}
                      <h4 className="font-bubble text-sm font-bold text-slate-800 leading-snug">
                        {exc.name}
                      </h4>

                      {/* Function & Short description */}
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {exc.primaryFunction}
                      </p>
                    </div>

                    {/* Footer selection status */}
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-medium">
                        HOPE {exc.hopeReference.edition}
                      </span>
                      <span
                        className={`font-bold flex items-center gap-1 ${
                          isSelected ? 'text-pink-600' : 'text-slate-400'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3 h-3 stroke-[3]" /> Added to Formula
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3" /> Select
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Analytical Weighing Station (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-5 border-3 border-emerald-200 shadow-mama flex flex-col justify-between h-full">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bubble text-base font-bold text-slate-800">
                      Analytical Balance Station
                    </h3>
                    <span className="text-[11px] text-slate-500 font-medium">
                      USP &lt;41&gt; Precision Balances
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleTare}
                  className="px-2.5 py-1 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center gap-1 border border-slate-300 active:scale-95 cursor-pointer"
                  title="Tare scale to 0.0 mg"
                >
                  <RotateCcw className="w-3 h-3" /> Tare
                </button>
              </div>

              {/* Ingredient Tabs to Select Active Weighing Item */}
              <div className="mb-4">
                <span className="text-xs font-bold text-slate-600 block mb-1.5">
                  Weighing Queue (Click to switch):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {/* API */}
                  <button
                    onClick={() => {
                      soundEngine.playPop();
                      setCurrentWeighingId('api');
                      setCurrentScaleMg(weighedMap['api']?.actualWeightMg || 0);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      currentWeighingId === 'api'
                        ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                        : weighedMap['api']
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    API: {order.api.name.split(' ')[0]} {weighedMap['api'] ? '✓' : ''}
                  </button>

                  {/* Selected Excipients */}
                  {selectedExcipientIds.map((id) => {
                    const exc = EXCIPIENTS_DATABASE[id];
                    const isWeighed = Boolean(weighedMap[id]);
                    const isActive = currentWeighingId === id;

                    return (
                      <button
                        key={id}
                        onClick={() => {
                          soundEngine.playPop();
                          setCurrentWeighingId(id);
                          setCurrentScaleMg(weighedMap[id]?.actualWeightMg || 0);
                        }}
                        className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          isActive
                            ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                            : isWeighed
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-slate-100 text-slate-700 border-slate-300'
                        }`}
                      >
                        {exc?.name.split(' ')[0]} {isWeighed ? '✓' : ''}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Digital Scale Display Unit */}
              <div className="bg-slate-900 rounded-2xl p-4 text-center border-4 border-slate-700 shadow-inner my-4">
                <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest flex items-center justify-between mb-1">
                  <span>METTLER TOLEDO PRECISION</span>
                  <span>[CALIBRATED]</span>
                </div>
                {/* Large Green LED Display */}
                <div className="text-4xl sm:text-5xl font-mono font-bold text-emerald-400 tracking-tight my-2">
                  {currentScaleMg.toFixed(1)} <span className="text-xl text-emerald-500">mg</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-slate-800">
                  <span>Target: {currentTargetMg} mg</span>
                  <span>Tolerance: ±{toleranceMg.toFixed(1)} mg</span>
                </div>
              </div>

              {/* Tolerance Visual Gauge */}
              <div className="space-y-1 mb-5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-500">Tolerance Zone Meter:</span>
                  <span
                    className={`font-bubble ${
                      isWithinTolerance
                        ? 'text-emerald-600 font-extrabold'
                        : isOverweight
                        ? 'text-rose-600'
                        : 'text-amber-600'
                    }`}
                  >
                    {isWithinTolerance
                      ? '✓ In Acceptance Zone'
                      : isOverweight
                      ? '⚠️ Over Target'
                      : 'Under Target'}
                  </span>
                </div>

                <div className="relative w-full h-4 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                  {/* Green Target Zone in Middle */}
                  <div
                    className="absolute top-0 bottom-0 bg-emerald-300 border-x-2 border-emerald-600 z-10 opacity-70"
                    style={{ left: '45%', width: '10%' }}
                  />
                  {/* Current Fill Level */}
                  <div
                    className={`h-full transition-all duration-150 ${
                      isWithinTolerance
                        ? 'bg-emerald-500'
                        : isOverweight
                        ? 'bg-rose-500'
                        : 'bg-amber-400'
                    }`}
                    style={{
                      width: `${Math.min(100, (currentScaleMg / (currentTargetMg * 1.5)) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Interactive Scoop Dispense Buttons */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-600 block">
                  Interactive Powder Dispenser:
                </span>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => handleAddWeight(0.5)}
                    className="py-2.5 px-1 bg-white hover:bg-slate-50 border-2 border-slate-300 rounded-xl font-bold text-xs text-slate-700 shadow-sm active:scale-95 transition-all cursor-pointer"
                  >
                    +0.5 mg
                  </button>
                  <button
                    onClick={() => handleAddWeight(5)}
                    className="py-2.5 px-1 bg-white hover:bg-slate-50 border-2 border-slate-300 rounded-xl font-bold text-xs text-slate-700 shadow-sm active:scale-95 transition-all cursor-pointer"
                  >
                    +5 mg
                  </button>
                  <button
                    onClick={() => handleAddWeight(25)}
                    className="py-2.5 px-1 bg-white hover:bg-slate-50 border-2 border-slate-300 rounded-xl font-bold text-xs text-slate-700 shadow-sm active:scale-95 transition-all cursor-pointer"
                  >
                    +25 mg
                  </button>
                  <button
                    onClick={() => handleAddWeight(100)}
                    className="py-2.5 px-1 bg-white hover:bg-slate-50 border-2 border-slate-300 rounded-xl font-bold text-xs text-slate-700 shadow-sm active:scale-95 transition-all cursor-pointer"
                  >
                    +100 mg
                  </button>
                </div>
              </div>
            </div>

            {/* Confirm Weighing Button */}
            <div className="mt-5 pt-3 border-t">
              <button
                onClick={handleConfirmWeighing}
                disabled={currentScaleMg === 0}
                className={`w-full py-3.5 btn-mama font-bubble text-sm sm:text-base flex items-center justify-center gap-2 ${
                  isWithinTolerance
                    ? 'btn-mama-mint'
                    : currentScaleMg === 0
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'btn-mama-yellow'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>
                  {weighedMap[currentWeighingId]
                    ? 'Update Dispensed Weight'
                    : 'Confirm Dispensed Weight'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
