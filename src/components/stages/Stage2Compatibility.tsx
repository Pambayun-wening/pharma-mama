import React, { useState } from 'react';
import {
  Microscope,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  HelpCircle,
  ArrowRight,
  BookOpen,
  FlaskConical,
  Beaker,
  History,
  ShieldCheck,
} from 'lucide-react';
import { LevelOrder, TestedPair, CompatibilityRecord, MamaMood } from '../../types/game';
import { EXCIPIENTS_DATABASE } from '../../data/excipients';
import { COMPATIBILITY_DATABASE } from '../../data/compatibility';
import { MamaMascot } from '../MamaMascot';
import { soundEngine } from '../../services/soundEngine';

interface Stage2CompatibilityProps {
  order: LevelOrder;
  selectedExcipientIds: string[];
  onComplete: (testedPairs: TestedPair[]) => void;
  onOpenKnowledgeMonograph: (excipientId: string) => void;
}

export const Stage2Compatibility: React.FC<Stage2CompatibilityProps> = ({
  order,
  selectedExcipientIds,
  onComplete,
  onOpenKnowledgeMonograph,
}) => {
  // Candidate items available for pairing
  const candidateItems = [
    { id: order.api.id, name: order.api.name.split(' ')[0], isApi: true },
    ...selectedExcipientIds.map((id) => ({
      id,
      name: EXCIPIENTS_DATABASE[id]?.name || id,
      isApi: false,
    })),
  ];

  // Selected item A and item B for testing
  const [slotAId, setSlotAId] = useState<string>(order.api.id);
  const [slotBId, setSlotBId] = useState<string>(selectedExcipientIds[0] || 'mcc');

  // Animation state for reaction chamber
  const [isReacting, setIsReacting] = useState<boolean>(false);
  // Last evaluated result
  const [currentResult, setCurrentResult] = useState<CompatibilityRecord | null>(null);
  // Logbook of all tested pairs
  const [testedPairs, setTestedPairs] = useState<TestedPair[]>([]);

  // Mama reaction state
  const [mamaMood, setMamaMood] = useState<MamaMood>('thinking');
  const [mamaSpeech, setMamaSpeech] = useState<string>(
    `This is our Compatibility Lab! Test ${order.api.name.split(' ')[0]} with each excipient to evaluate solid-state interactions.`
  );

  // Find compatibility record
  const findRecord = (idA: string, idB: string): CompatibilityRecord => {
    const match = COMPATIBILITY_DATABASE.find(
      (c) =>
        (c.itemAId === idA && c.itemBId === idB) ||
        (c.itemAId === idB && c.itemBId === idA)
    );

    if (match) return match;

    // Default fallback if not directly recorded
    const excA = EXCIPIENTS_DATABASE[idA];
    const excB = EXCIPIENTS_DATABASE[idB];
    const nameA = excA ? excA.name : order.api.name;
    const nameB = excB ? excB.name : order.api.name;

    return {
      id: `compat_${idA}_${idB}`,
      itemAId: idA,
      itemAName: nameA,
      itemBId: idB,
      itemBName: nameB,
      interactionType: 'Physical incompatibility',
      status: 'Generally compatible',
      scientificExplanation: `${nameA} and ${nameB} show no documented deleterious chemical or physical incompatibility under standard pharmaceutical formulation conditions.`,
      formulationConditions: 'Process under standard room temperature (20–25°C) and controlled humidity (<60% RH).',
      practicalRecommendation: 'Routine formulation protocols apply.',
      supportingReference: {
        refId: 'hope6',
        edition: '6th Edition',
        sourceTitle: 'Handbook of Pharmaceutical Excipients - General Compatibility Guidelines',
      },
    };
  };

  // Run the assay!
  const handleRunAssay = () => {
    if (slotAId === slotBId) {
      soundEngine.playError();
      setMamaMood('worried');
      setMamaSpeech('Select two different ingredients to test their compatibility!');
      return;
    }

    setIsReacting(true);
    soundEngine.playBubble();

    setTimeout(() => {
      setIsReacting(false);
      const record = findRecord(slotAId, slotBId);
      setCurrentResult(record);

      // Record into logbook if not already present
      const alreadyTested = testedPairs.some(
        (p) =>
          (p.itemAId === slotAId && p.itemBId === slotBId) ||
          (p.itemAId === slotBId && p.itemBId === slotAId)
      );

      if (!alreadyTested) {
        setTestedPairs((prev) => [
          ...prev,
          { itemAId: slotAId, itemBId: slotBId, testedAt: Date.now(), record },
        ]);
      }

      // Update Mama speech & mood based on scientific outcome
      if (record.status === 'Generally compatible') {
        soundEngine.playSuccess();
        setMamaMood('starry');
        setMamaSpeech(`Great news! ${record.itemAName} and ${record.itemBName} are generally compatible.`);
      } else if (record.status === 'Condition-dependent compatibility') {
        soundEngine.playPop();
        setMamaMood('thinking');
        setMamaSpeech(`Notice: ${record.itemAName} and ${record.itemBName} have condition-dependent compatibility! Check moisture & mixing times.`);
      } else if (record.status === 'Known incompatibility' || record.status === 'Potential incompatibility') {
        soundEngine.playError();
        setMamaMood('shocked');
        setMamaSpeech(`Caution! ${record.itemAName} and ${record.itemBName} show ${record.status}! Review the HOPE monograph.`);
      } else {
        soundEngine.playPop();
        setMamaMood('thinking');
        setMamaSpeech(`Assay complete for ${record.itemAName} and ${record.itemBName}.`);
      }
    }, 800);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Generally compatible':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
        };
      case 'Condition-dependent compatibility':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
        };
      case 'Known incompatibility':
        return {
          bg: 'bg-rose-100 text-rose-800 border-rose-300',
          icon: <AlertOctagon className="w-4 h-4 text-rose-600" />,
        };
      case 'Potential incompatibility':
        return {
          bg: 'bg-orange-100 text-orange-800 border-orange-300',
          icon: <AlertTriangle className="w-4 h-4 text-orange-600" />,
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-800 border-slate-300',
          icon: <HelpCircle className="w-4 h-4 text-slate-600" />,
        };
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-2 sm:p-4 animate-pop-in">
      {/* Mama Guidance Ribbon */}
      <div className="bg-white rounded-3xl p-4 border-3 border-amber-200 shadow-mama flex flex-col sm:flex-row items-center gap-4">
        <MamaMascot mood={mamaMood} size="sm" showSpeechBubble={false} />
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
              Stage 2 of 5
            </span>
            <span className="text-xs font-bubble font-bold text-slate-500">
              Pharmaceutical Compatibility &amp; Stability Testing Lab (35% Weight)
            </span>
          </div>
          <p className="text-sm sm:text-base font-bold text-slate-800 leading-snug">
            {mamaSpeech}
          </p>
        </div>

        <button
          onClick={() => {
            soundEngine.playSuccess();
            onComplete(testedPairs);
          }}
          className="px-5 py-3 btn-mama btn-mama-mint font-bubble text-sm sm:text-base flex items-center gap-2 flex-shrink-0 cursor-pointer shadow-mama-mint"
        >
          <span>Continue to Mixing &amp; Blending</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Main Testing Laboratory Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Assay Chamber (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-5 border-3 border-indigo-200 shadow-mama">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <Microscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bubble text-base sm:text-lg font-bold text-slate-800">
                    Solid-State Reaction Chamber
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pair ingredients to test chemical stability, degradation pathways &amp; physics
                  </p>
                </div>
              </div>

              <div className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-200 flex items-center gap-1">
                <History className="w-3.5 h-3.5" />
                <span>{testedPairs.length} Tested</span>
              </div>
            </div>

            {/* Two Reagent Slots */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
              {/* Slot A */}
              <div className="bg-slate-50 rounded-2xl p-4 border-2 border-slate-200">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Ingredient A (Drug or Excipient):
                </label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar">
                  {candidateItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        soundEngine.playPop();
                        setSlotAId(item.id);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-between ${
                        slotAId === item.id
                          ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <span className="truncate">{item.name}</span>
                      {item.isApi && (
                        <span className="text-[10px] bg-pink-500 text-white px-1.5 py-0.2 rounded font-bold">
                          API
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slot B */}
              <div className="bg-slate-50 rounded-2xl p-4 border-2 border-slate-200">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Ingredient B (Excipient):
                </label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar">
                  {candidateItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        soundEngine.playPop();
                        setSlotBId(item.id);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-between ${
                        slotBId === item.id
                          ? 'bg-purple-600 text-white border-purple-700 shadow-sm'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <span className="truncate">{item.name}</span>
                      {item.isApi && (
                        <span className="text-[10px] bg-pink-500 text-white px-1.5 py-0.2 rounded font-bold">
                          API
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Reaction Chamber Animation Flask */}
            <div className="relative bg-gradient-to-b from-slate-900 to-indigo-950 rounded-2xl p-6 text-center text-white my-4 overflow-hidden border-3 border-indigo-300">
              {/* Animated Beaker Graphic */}
              <div className="relative mx-auto w-24 h-28 flex items-center justify-center">
                <FlaskConical
                  className={`w-20 h-20 transition-all ${
                    isReacting
                      ? 'text-yellow-300 animate-wiggle scale-110'
                      : currentResult?.status === 'Generally compatible'
                      ? 'text-emerald-400'
                      : currentResult?.status === 'Condition-dependent compatibility'
                      ? 'text-amber-400'
                      : currentResult?.status === 'Known incompatibility'
                      ? 'text-rose-400'
                      : 'text-indigo-300'
                  }`}
                />
                {isReacting && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="w-3 h-3 rounded-full bg-yellow-300 animate-ping" />
                  </div>
                )}
              </div>

              {/* Selected Ingredients Display */}
              <div className="mt-3 flex items-center justify-center gap-2 text-sm font-bubble">
                <span className="px-3 py-1 bg-white/20 rounded-xl font-bold">
                  {candidateItems.find((c) => c.id === slotAId)?.name}
                </span>
                <span className="text-yellow-300 text-lg font-bold">+</span>
                <span className="px-3 py-1 bg-white/20 rounded-xl font-bold">
                  {candidateItems.find((c) => c.id === slotBId)?.name}
                </span>
              </div>

              {/* Run Assay Button */}
              <div className="mt-4">
                <button
                  onClick={handleRunAssay}
                  disabled={isReacting}
                  className="px-6 py-3 btn-mama btn-mama-yellow font-bubble text-base flex items-center gap-2 mx-auto active:scale-95 cursor-pointer shadow-mama-yellow"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>{isReacting ? 'Assaying Reactions...' : 'Run Compatibility Assay'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Scientific Analysis Report Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-5 border-3 border-pink-200 shadow-mama flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between border-b pb-3 mb-3">
                <h3 className="font-bubble text-base font-bold text-slate-800 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-pink-600" />
                  Assay Scientific Report
                </h3>
                {currentResult && (
                  <button
                    onClick={() => {
                      soundEngine.playPop();
                      onOpenKnowledgeMonograph(currentResult.itemBId);
                    }}
                    className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1"
                  >
                    <BookOpen className="w-3.5 h-3.5" /> Monograph
                  </button>
                )}
              </div>

              {currentResult ? (
                <div className="space-y-3.5 text-xs">
                  {/* Status & Interaction Type */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-bold">Classification:</span>
                      <span
                        className={`font-bold px-2.5 py-0.5 rounded-full border text-xs flex items-center gap-1 ${
                          getStatusBadge(currentResult.status).bg
                        }`}
                      >
                        {getStatusBadge(currentResult.status).icon}
                        {currentResult.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-bold">Interaction Type:</span>
                      <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                        {currentResult.interactionType}
                      </span>
                    </div>
                  </div>

                  {/* Scientific Mechanism */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    <span className="font-bubble font-bold text-slate-800 text-xs block mb-1">
                      Scientific Explanation (HOPE):
                    </span>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      {currentResult.scientificExplanation}
                    </p>
                  </div>

                  {/* Formulation Conditions */}
                  <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200">
                    <span className="font-bubble font-bold text-amber-900 text-xs block mb-1">
                      Critical Formulation Conditions:
                    </span>
                    <p className="text-amber-800 leading-relaxed text-[11px]">
                      {currentResult.formulationConditions}
                    </p>
                  </div>

                  {/* Formulator Recommendation */}
                  <div className="bg-teal-50/70 p-3 rounded-2xl border border-teal-200">
                    <span className="font-bubble font-bold text-teal-900 text-xs block mb-1">
                      Practical Recommendation:
                    </span>
                    <p className="text-teal-800 leading-relaxed text-[11px]">
                      {currentResult.practicalRecommendation}
                    </p>
                  </div>

                  {/* Verified Reference */}
                  <div className="text-[10px] text-slate-400 pt-2 border-t">
                    <span className="font-bold text-slate-500">Supporting Reference: </span>
                    {currentResult.supportingReference.sourceTitle} (Edition: {currentResult.supportingReference.edition || '6th'}, Page: {currentResult.supportingReference.page || 'Refer to HOPE Monograph'}).
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <Beaker className="w-12 h-12 mx-auto text-slate-300 mb-2 animate-bounce-gentle" />
                  <p className="text-xs font-medium">
                    Select two ingredients and press <strong>Run Compatibility Assay</strong> to inspect their solid-state interaction data!
                  </p>
                </div>
              )}
            </div>

            {/* Tested Pairs Mini Badges */}
            <div className="mt-4 pt-3 border-t">
              <span className="text-[11px] font-bold text-slate-500 block mb-2">
                Lab Notebook Tested Pairs ({testedPairs.length}):
              </span>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto custom-scrollbar">
                {testedPairs.map((p, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300 px-2 py-0.5 rounded-lg"
                  >
                    {p.record?.itemAName.split(' ')[0]} + {p.record?.itemBName.split(' ')[0]}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
