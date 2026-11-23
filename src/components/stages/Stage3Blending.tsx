import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  Sparkles,
  AlertTriangle,
  Play,
  Pause,
  ArrowRight,
  CheckCircle2,
  Clock,
  Gauge,
  Sliders,
} from 'lucide-react';
import { LevelOrder, MamaMood } from '../../types/game';
import { EXCIPIENTS_DATABASE } from '../../data/excipients';
import { MamaMascot } from '../MamaMascot';
import { soundEngine } from '../../services/soundEngine';

interface Stage3BlendingProps {
  order: LevelOrder;
  selectedExcipientIds: string[];
  onComplete: (sequence: string[], durationSeconds: number) => void;
}

export const Stage3Blending: React.FC<Stage3BlendingProps> = ({
  order,
  selectedExcipientIds,
  onComplete,
}) => {
  // All ingredients in the batch to be blended
  const allIngredients = [
    { id: 'api', name: `${order.api.name.split(' ')[0]} (API)`, isLubricant: false },
    ...selectedExcipientIds.map((id) => {
      const exc = EXCIPIENTS_DATABASE[id];
      return {
        id,
        name: exc ? exc.name : id,
        isLubricant: exc ? exc.categories.includes('Lubricant') : false,
      };
    }),
  ];

  // Blending order sequence arranged by player
  const [sequence, setSequence] = useState<string[]>([]);
  // Current remaining pool of unadded ingredients
  const unaddedIngredients = allIngredients.filter((ing) => !sequence.includes(ing.id));

  // Blending timer and state
  const [isBlending, setIsBlending] = useState<boolean>(false);
  const [mixingSeconds, setMixingSeconds] = useState<number>(0);
  const [blenderRpm, setBlenderRpm] = useState<number>(25);

  // Content uniformity calculated
  const [uniformityRsd, setUniformityRsd] = useState<number>(14.5); // Starts poorly mixed
  const [hasOverLubricated, setHasOverLubricated] = useState<boolean>(false);

  // Mama mood
  const [mamaMood, setMamaMood] = useState<MamaMood>('thinking');
  const [mamaSpeech, setMamaSpeech] = useState<string>(
    'Arrange the order of addition into the V-Blender. Remember: Add boundary lubricants LAST!'
  );

  // Animation angle for blender drum
  const [rotationAngle, setRotationAngle] = useState<number>(0);

  // Timer effect when blending is active
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isBlending) {
      interval = setInterval(() => {
        setMixingSeconds((prev) => prev + 1);
        setRotationAngle((prev) => (prev + blenderRpm * 0.4) % 360);

        // Gradually improve uniformity as mixing progresses
        setUniformityRsd((prev) => Math.max(1.2, +(prev * 0.96).toFixed(2)));
      }, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBlending, blenderRpm]);

  // Check if lubricant is added and if over-mixing has occurred
  useEffect(() => {
    const hasLubricantInSequence = sequence.some((id) => {
      const exc = EXCIPIENTS_DATABASE[id];
      return exc && exc.categories.includes('Lubricant');
    });

    if (hasLubricantInSequence && mixingSeconds > 180 && !hasOverLubricated) {
      setHasOverLubricated(true);
      soundEngine.playError();
      setMamaMood('worried');
      setMamaSpeech(
        'Warning! Lubricant has been mixed for over 3 minutes! Hydrophobic stearate coating may delay dissolution!'
      );
    }
  }, [mixingSeconds, sequence, hasOverLubricated]);

  // Add ingredient to sequence
  const handleAddToSequence = (id: string) => {
    soundEngine.playPop();
    const ing = allIngredients.find((i) => i.id === id);
    if (!ing) return;

    // Check if adding lubricant too early
    if (ing.isLubricant && unaddedIngredients.length > 1) {
      soundEngine.playError();
      setMamaMood('worried');
      setMamaSpeech(
        'Hold on! Adding lubricant at the beginning coats unmixed drug particles and impairs tablet binding!'
      );
    } else if (ing.id === 'api') {
      soundEngine.playSuccess();
      setMamaMood('happy');
      setMamaSpeech('API added to the drum! Good practice to pre-blend with diluent.');
    } else {
      setMamaMood('happy');
      setMamaSpeech(`Added ${ing.name} to blending order.`);
    }

    setSequence((prev) => [...prev, id]);
  };

  // Reset sequence
  const handleResetSequence = () => {
    soundEngine.playPop();
    setSequence([]);
    setIsBlending(false);
    setMixingSeconds(0);
    setUniformityRsd(14.5);
    setHasOverLubricated(false);
    setMamaMood('thinking');
    setMamaSpeech('Sequence reset. Add active ingredient and diluent first, lubricant last.');
  };

  // Toggle blending process
  const handleToggleBlend = () => {
    if (sequence.length < allIngredients.length) {
      soundEngine.playError();
      setMamaMood('worried');
      setMamaSpeech('Add all ingredients to the blending drum before starting the motor!');
      return;
    }

    const nextState = !isBlending;
    setIsBlending(nextState);

    if (nextState) {
      soundEngine.playScoop();
      setMamaMood('happy');
      setMamaSpeech('V-Blender rotating! Monitor content uniformity RSD% on the display.');
    } else {
      soundEngine.playPop();
      if (uniformityRsd <= 2.0) {
        soundEngine.playSuccess();
        setMamaMood('starry');
        setMamaSpeech(`Homogeneous blend achieved! RSD is ${uniformityRsd}%, meeting pharmacopoeial standards!`);
      }
    }
  };

  const isFullyAdded = sequence.length === allIngredients.length;
  const isUniform = uniformityRsd <= 5.0 && mixingSeconds >= 10;

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-2 sm:p-4 animate-pop-in">
      {/* Mama Guidance Ribbon */}
      <div className="bg-white rounded-3xl p-4 border-3 border-blue-200 shadow-mama flex flex-col sm:flex-row items-center gap-4">
        <MamaMascot mood={mamaMood} size="sm" showSpeechBubble={false} />
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
              Stage 3 of 5
            </span>
            <span className="text-xs font-bubble font-bold text-slate-500">
              Powder Mixing &amp; Addition Sequence (20% Weight)
            </span>
          </div>
          <p className="text-sm sm:text-base font-bold text-slate-800 leading-snug">
            {mamaSpeech}
          </p>
        </div>

        {isUniform && (
          <button
            onClick={() => {
              soundEngine.playSuccess();
              onComplete(sequence, mixingSeconds);
            }}
            className="px-5 py-3 btn-mama btn-mama-mint font-bubble text-sm sm:text-base flex items-center gap-2 flex-shrink-0 cursor-pointer shadow-mama-mint animate-bounce-gentle"
          >
            <span>Proceed to Production Stage</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Mixing & Blending Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Addition Sequence Manager (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-3xl p-5 border-3 border-blue-200 shadow-mama">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bubble text-base sm:text-lg font-bold text-slate-800">
                  Order of Addition into Blender
                </h3>
                <p className="text-xs text-slate-500">
                  Click ingredients in the exact sequence you want to load them into the mixing vessel.
                </p>
              </div>

              {sequence.length > 0 && (
                <button
                  onClick={handleResetSequence}
                  className="text-xs font-bold text-rose-600 hover:underline"
                >
                  Reset Sequence
                </button>
              )}
            </div>

            {/* Unadded Ingredients Pool */}
            <div className="mb-4">
              <span className="text-xs font-bold text-slate-600 block mb-2">
                Available to Add ({unaddedIngredients.length}):
              </span>
              <div className="flex flex-wrap gap-2">
                {unaddedIngredients.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleAddToSequence(item.id)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-300 shadow-sm active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{item.name}</span>
                    {item.isLubricant && (
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-1 rounded font-bold">
                        Lubricant
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Loaded Sequence in Blender */}
            <div className="border-t pt-3">
              <span className="text-xs font-bold text-slate-600 block mb-2">
                Sequence Loaded in Vessel ({sequence.length} / {allIngredients.length}):
              </span>

              {sequence.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300 text-center text-xs text-slate-400">
                  No ingredients added yet. Click items above to load.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {sequence.map((id, idx) => {
                    const ing = allIngredients.find((i) => i.id === id);
                    return (
                      <div
                        key={id}
                        className="px-3 py-2 rounded-xl bg-blue-50/70 border border-blue-200 text-xs font-bold text-blue-900 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-[11px] flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          <span>{ing?.name}</span>
                        </div>
                        {ing?.isLubricant && (
                          <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold">
                            Lubricant (Step {idx + 1})
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive V-Blender Drum Simulation (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-3xl p-5 border-3 border-slate-200 shadow-mama flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bubble text-base font-bold text-slate-800">
                      Rotary V-Blender Equipment
                    </h3>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Diffusion / Tumble Powder Mixer
                    </span>
                  </div>
                </div>

                {/* Mixing Timer */}
                <div className="flex items-center gap-1.5 bg-slate-900 text-white font-mono px-3 py-1.5 rounded-xl text-xs font-bold">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  <span>{mixingSeconds}s</span>
                </div>
              </div>

              {/* Animated Rotating V-Blender Graphic */}
              <div className="relative bg-slate-900 rounded-3xl p-6 text-center text-white my-3 overflow-hidden border-4 border-slate-700 shadow-inner flex flex-col items-center justify-center min-h-[180px]">
                {/* V-blender graphic */}
                <div
                  className="transition-transform duration-300"
                  style={{ transform: `rotate(${rotationAngle}deg)` }}
                >
                  <svg width="120" height="120" viewBox="0 0 100 100">
                    {/* V-Shape Blender Body */}
                    <path
                      d="M 20 20 L 50 80 L 80 20 L 65 20 L 50 60 L 35 20 Z"
                      fill="#94a3b8"
                      stroke="#cbd5e1"
                      strokeWidth="3"
                    />
                    {/* Central Axle */}
                    <circle cx="50" cy="50" r="6" fill="#38bdf8" />
                    {/* Powder tumbling dots */}
                    {isBlending && (
                      <>
                        <circle cx="48" cy="65" r="3" fill="#fde047" className="animate-ping" />
                        <circle cx="53" cy="68" r="2.5" fill="#f472b6" />
                        <circle cx="45" cy="58" r="2" fill="#ffffff" />
                      </>
                    )}
                  </svg>
                </div>

                <div className="mt-3 text-xs font-mono text-slate-400">
                  Status: {isBlending ? <span className="text-emerald-400 font-bold animate-pulse">MIXING IN PROGRESS ({blenderRpm} RPM)</span> : <span>STANDBY</span>}
                </div>
              </div>

              {/* Gauges & Controls */}
              <div className="space-y-3">
                {/* Content Uniformity RSD Meter */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-slate-600 flex items-center gap-1">
                      <Gauge className="w-3.5 h-3.5 text-blue-600" /> Content Uniformity RSD:
                    </span>
                    <span
                      className={`font-mono font-bold ${
                        uniformityRsd <= 2.0
                          ? 'text-emerald-600'
                          : uniformityRsd <= 5.0
                          ? 'text-amber-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {uniformityRsd.toFixed(2)}% (Target: &lt; 2.0%)
                    </span>
                  </div>

                  <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        uniformityRsd <= 2.0
                          ? 'bg-emerald-500'
                          : uniformityRsd <= 5.0
                          ? 'bg-amber-400'
                          : 'bg-rose-400'
                      }`}
                      style={{ width: `${Math.max(10, 100 - uniformityRsd * 5)}%` }}
                    />
                  </div>
                </div>

                {/* Blender RPM Slider */}
                <div className="flex items-center justify-between text-xs font-bold gap-3 px-1">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5" /> Blender Speed:
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="10"
                      max="40"
                      value={blenderRpm}
                      onChange={(e) => setBlenderRpm(Number(e.target.value))}
                      className="w-28 sm:w-36 accent-blue-600 cursor-pointer"
                    />
                    <span className="font-mono text-slate-700 w-12 text-right">{blenderRpm} RPM</span>
                  </div>
                </div>

                {/* Over-lubrication warning banner if triggered */}
                {hasOverLubricated && (
                  <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Hydrophobic Film Warning (HOPE p.404):</strong> Magnesium stearate has been mixed past 3 minutes. Lubricant crystals delaminate and coat disintegrant pores!
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Start / Stop Mixing Button */}
            <div className="mt-5 pt-3 border-t">
              <button
                onClick={handleToggleBlend}
                disabled={!isFullyAdded}
                className={`w-full py-3.5 btn-mama font-bubble text-base flex items-center justify-center gap-2 ${
                  !isFullyAdded
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : isBlending
                    ? 'btn-mama-yellow'
                    : 'btn-mama-blue'
                }`}
              >
                {isBlending ? (
                  <>
                    <Pause className="w-5 h-5" />
                    <span>Pause Blender</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    <span>{mixingSeconds > 0 ? 'Resume Blending' : 'Start Blender Motor'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
