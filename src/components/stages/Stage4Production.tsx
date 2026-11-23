import React, { useState } from 'react';
import {
  Cpu,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Droplets,
  Wind,
  Flame,
  Gauge,
  Activity,
} from 'lucide-react';
import { LevelOrder, ProductionExecution, MamaMood } from '../../types/game';
import { MamaMascot } from '../MamaMascot';
import { soundEngine } from '../../services/soundEngine';

interface Stage4ProductionProps {
  order: LevelOrder;
  onComplete: (production: ProductionExecution) => void;
}

export const Stage4Production: React.FC<Stage4ProductionProps> = ({
  order,
  onComplete,
}) => {
  // Compression force state (for tablets)
  const [compressionForceKn, setCompressionForceKn] = useState<number>(0);
  const [isPressing, setIsPressing] = useState<boolean>(false);
  const [tabletCompressed, setTabletCompressed] = useState<boolean>(false);
  const [punchStatus, setPunchStatus] = useState<'perfect' | 'capping' | 'sticking' | 'soft' | null>(null);

  // Effervescent airlock state
  const [airlockHumidity, setAirlockHumidity] = useState<number>(45); // starts at 45% ambient
  const [dehumidifierActive, setDehumidifierActive] = useState<boolean>(false);

  // Suspension wetting & homogenization state
  const [wettingProgress, setWettingProgress] = useState<number>(0);
  const [homogenizerRpm, setHomogenizerRpm] = useState<number>(0);
  const [isHomogenizing, setIsHomogenizing] = useState<boolean>(false);

  // Mama mood
  const [mamaMood, setMamaMood] = useState<MamaMood>('thinking');
  const [mamaSpeech, setMamaSpeech] = useState<string>(
    order.dosageForm === 'suspension'
      ? 'Wetting step first! Lower the contact angle of hydrophobic ibuprofen before homogenizing.'
      : order.dosageForm === 'tablet-effervescent'
      ? 'Activate the HVAC dehumidifier! Relative humidity must be below 25% RH before compression.'
      : 'Calibrate the rotary press! Apply 12–15 kN compaction force to form a robust tablet.'
  );

  // TABLET PRESS HANDLERS
  const handleTabletCompress = (force: number) => {
    soundEngine.playPunchPress();
    setCompressionForceKn(force);
    setTabletCompressed(true);

    if (order.dosageForm === 'tablet-chewable') {
      if (force >= 6 && force <= 9) {
        soundEngine.playSuccess();
        setPunchStatus('perfect');
        setMamaMood('starry');
        setMamaSpeech('Perfect chewable compaction! Soft enough for teeth, yet robust against friability!');
      } else if (force < 6) {
        setPunchStatus('soft');
        setMamaMood('worried');
        setMamaSpeech('Under-compressed! The tablet will crumble upon packaging.');
      } else {
        setPunchStatus('capping');
        setMamaMood('shocked');
        setMamaSpeech('Over-compressed! The tablet will be hard as a rock and hurt the patient’s teeth.');
      }
    } else {
      // Immediate-Release Tablet (Paracetamol)
      if (force >= 12 && force <= 16) {
        soundEngine.playSuccess();
        setPunchStatus('perfect');
        setMamaMood('starry');
        setMamaSpeech('Flawless punch stroke! Tablet has high tensile strength with zero capping or lamination!');
      } else if (force < 10) {
        soundEngine.playError();
        setPunchStatus('soft');
        setMamaMood('worried');
        setMamaSpeech('Compaction force too low (<10 kN)! Tablet friability exceeds the 1.0% pharmacopoeial limit.');
      } else {
        soundEngine.playError();
        setPunchStatus('capping');
        setMamaMood('shocked');
        setMamaSpeech('Over-compression (>18 kN)! High elastic recovery causes tablet capping upon ejection from the die!');
      }
    }
  };

  // EFFERVESCENT DEHUMIDIFIER HANDLER
  const handleToggleDehumidifier = () => {
    soundEngine.playPop();
    setDehumidifierActive(true);
    let current = 45;
    const interval = setInterval(() => {
      current -= 5;
      if (current <= 18) {
        clearInterval(interval);
        setAirlockHumidity(18);
        soundEngine.playSuccess();
        setMamaMood('starry');
        setMamaSpeech('Cleanroom humidity dropped to 18% RH! Safe to compress effervescent tablets.');
      } else {
        setAirlockHumidity(current);
      }
    }, 200);
  };

  // SUSPENSION WETTING HANDLER
  const handleWettingStep = () => {
    soundEngine.playSplash();
    setWettingProgress(100);
    setMamaMood('happy');
    setMamaSpeech('Polysorbate 80 has adsorbed onto ibuprofen surfaces! Contact angle reduced.');
  };

  const handleHomogenize = () => {
    soundEngine.playBubble();
    setIsHomogenizing(true);
    setHomogenizerRpm(4500);
    setTimeout(() => {
      setIsHomogenizing(false);
      soundEngine.playSuccess();
      setMamaMood('starry');
      setMamaSpeech('High-shear dispersion complete! Drug particles are uniformly suspended in the xanthan matrix.');
    }, 1500);
  };

  const canProceed =
    order.dosageForm === 'suspension'
      ? wettingProgress >= 100 && homogenizerRpm > 0
      : order.dosageForm === 'tablet-effervescent'
      ? airlockHumidity <= 25 && tabletCompressed
      : tabletCompressed;

  const handleFinish = () => {
    soundEngine.playSuccess();
    onComplete({
      compressionForceKn,
      punchStatus: punchStatus || 'perfect',
      airlockHumidityPercent: airlockHumidity,
      homogenizationRpm: homogenizerRpm,
      wettingComplete: wettingProgress >= 100,
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-2 sm:p-4 animate-pop-in">
      {/* Mama Guidance Ribbon */}
      <div className="bg-white rounded-3xl p-4 border-3 border-purple-200 shadow-mama flex flex-col sm:flex-row items-center gap-4">
        <MamaMascot mood={mamaMood} size="sm" showSpeechBubble={false} />
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-300">
              Stage 4 of 5
            </span>
            <span className="text-xs font-bubble font-bold text-slate-500">
              Dosage Form Production: {order.productionStageTitle} (20% Weight)
            </span>
          </div>
          <p className="text-sm sm:text-base font-bold text-slate-800 leading-snug">
            {mamaSpeech}
          </p>
        </div>

        {canProceed && (
          <button
            onClick={handleFinish}
            className="px-5 py-3 btn-mama btn-mama-mint font-bubble text-sm sm:text-base flex items-center gap-2 flex-shrink-0 cursor-pointer shadow-mama-mint animate-bounce-gentle"
          >
            <span>Proceed to Quality Control</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Production Mini-Game Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Machinery Controls & Status (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-5 border-3 border-purple-200 shadow-mama">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bubble text-base sm:text-lg font-bold text-slate-800">
                    {order.productionStageTitle}
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    GMP Pilot Plant Manufacturing Equipment
                  </span>
                </div>
              </div>
            </div>

            {/* IF TABLETS (IR or Chewable): Rotary Punch Press */}
            {(order.dosageForm === 'tablet-ir' || order.dosageForm === 'tablet-chewable') && (
              <div className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Operate the rotary tablet press punch stroke. Tap a target compaction force or test the sweet spot (Target:{' '}
                  {order.dosageForm === 'tablet-chewable' ? '7–8 kN' : '13–15 kN'}).
                </p>

                {/* Machine Visualization Canvas */}
                <div className="bg-slate-900 rounded-3xl p-6 text-center text-white border-4 border-slate-700 shadow-inner flex flex-col items-center justify-center min-h-[220px]">
                  {/* Punch Tooling SVG */}
                  <svg width="140" height="140" viewBox="0 0 100 100">
                    {/* Upper Punch */}
                    <rect
                      x="40"
                      y={tabletCompressed ? '25' : '10'}
                      width="20"
                      height="25"
                      rx="3"
                      fill="#94a3b8"
                      stroke="#cbd5e1"
                      strokeWidth="2"
                      className="transition-all duration-300"
                    />
                    {/* Die Cavity */}
                    <rect x="25" y="45" width="50" height="20" rx="2" fill="#334155" stroke="#64748b" strokeWidth="2" />
                    {/* Compacted Tablet */}
                    {tabletCompressed && (
                      <ellipse
                        cx="50"
                        cy="55"
                        rx="16"
                        ry="6"
                        fill={
                          punchStatus === 'perfect'
                            ? '#ffffff'
                            : punchStatus === 'soft'
                            ? '#fef08a'
                            : '#f87171'
                        }
                        stroke="#e2e8f0"
                        strokeWidth="1.5"
                      />
                    )}
                    {/* Lower Punch */}
                    <rect x="40" y="60" width="20" height="25" rx="3" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="2" />
                  </svg>

                  <div className="mt-3 font-mono text-xs">
                    {tabletCompressed ? (
                      <span className="text-emerald-400 font-bold">
                        COMPACTION FORCE: {compressionForceKn} kN (Status: {punchStatus?.toUpperCase()})
                      </span>
                    ) : (
                      <span className="text-slate-400">READY FOR DIE COMPACTION</span>
                    )}
                  </div>
                </div>

                {/* Force Selector Buttons */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">
                    Select Punch Compaction Force:
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      onClick={() => handleTabletCompress(6)}
                      className="py-3 px-1 rounded-2xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 font-bold text-xs text-slate-800 transition-all cursor-pointer active:scale-95"
                    >
                      6 kN <span className="block text-[10px] text-slate-500 font-normal">Gentle</span>
                    </button>
                    <button
                      onClick={() => handleTabletCompress(10)}
                      className="py-3 px-1 rounded-2xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 font-bold text-xs text-slate-800 transition-all cursor-pointer active:scale-95"
                    >
                      10 kN <span className="block text-[10px] text-slate-500 font-normal">Moderate</span>
                    </button>
                    <button
                      onClick={() => handleTabletCompress(14)}
                      className="py-3 px-1 rounded-2xl bg-pink-100 hover:bg-pink-200 border-2 border-pink-400 font-bold text-xs text-pink-900 transition-all cursor-pointer active:scale-95 shadow-sm"
                    >
                      14 kN <span className="block text-[10px] text-pink-700 font-bold">Optimal Target</span>
                    </button>
                    <button
                      onClick={() => handleTabletCompress(24)}
                      className="py-3 px-1 rounded-2xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 font-bold text-xs text-slate-800 transition-all cursor-pointer active:scale-95"
                    >
                      24 kN <span className="block text-[10px] text-rose-500 font-normal">Heavy (Risk)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* IF EFFERVESCENT: Humidity Control & Compression */}
            {order.dosageForm === 'tablet-effervescent' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-amber-900 flex items-center gap-1.5">
                      <Wind className="w-4 h-4 text-amber-600" />
                      Cleanroom Relative Humidity (RH):
                    </span>
                    <span className="font-mono font-bold text-sm text-amber-900">{airlockHumidity}% RH</span>
                  </div>
                  <div className="w-full h-3 bg-amber-200 rounded-full overflow-hidden mb-3">
                    <div
                      className={`h-full transition-all duration-300 ${
                        airlockHumidity <= 25 ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${(airlockHumidity / 50) * 100}%` }}
                    />
                  </div>

                  <button
                    onClick={handleToggleDehumidifier}
                    disabled={airlockHumidity <= 25}
                    className="w-full py-2.5 btn-mama btn-mama-yellow font-bubble text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Wind className="w-4 h-4" />
                    <span>
                      {airlockHumidity <= 25 ? '✓ Cleanroom Dehumidified (<20% RH)' : 'Activate HVAC Dehumidifier'}
                    </span>
                  </button>
                </div>

                {airlockHumidity <= 25 && (
                  <button
                    onClick={() => handleTabletCompress(14)}
                    className="w-full py-3.5 btn-mama btn-mama-pink font-bubble text-base flex items-center justify-center gap-2 cursor-pointer shadow-mama-pink"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Dry-Room Effervescent Punch Compression</span>
                  </button>
                )}
              </div>
            )}

            {/* IF SUSPENSION: Wetting & Homogenization */}
            {order.dosageForm === 'suspension' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-sky-50 border-2 border-sky-200">
                  <h4 className="font-bubble font-bold text-sm text-sky-900 mb-1">
                    Step 1: Wetting Hydrophobic Drug Core
                  </h4>
                  <p className="text-xs text-sky-700 mb-3">
                    Ibuprofen particles float on water due to a high contact angle. Apply Polysorbate 80 to reduce surface tension.
                  </p>
                  <button
                    onClick={handleWettingStep}
                    disabled={wettingProgress >= 100}
                    className="w-full py-2.5 btn-mama btn-mama-blue font-bubble text-xs sm:text-sm flex items-center justify-center gap-2"
                  >
                    <Droplets className="w-4 h-4" />
                    <span>{wettingProgress >= 100 ? '✓ Complete Wetting Achieved' : 'Apply Wetting Agent (Tween 80)'}</span>
                  </button>
                </div>

                {wettingProgress >= 100 && (
                  <div className="p-4 rounded-2xl bg-indigo-50 border-2 border-indigo-200">
                    <h4 className="font-bubble font-bold text-sm text-indigo-900 mb-1">
                      Step 2: High-Shear Rotor-Stator Homogenization
                    </h4>
                    <p className="text-xs text-indigo-700 mb-3">
                      Hydrate Xanthan gum and homogenize at 4,500 RPM to create a uniform, non-caking suspension.
                    </p>
                    <button
                      onClick={handleHomogenize}
                      disabled={isHomogenizing}
                      className="w-full py-3 btn-mama btn-mama-purple font-bubble text-sm flex items-center justify-center gap-2"
                    >
                      <Activity className="w-4 h-4" />
                      <span>{isHomogenizing ? 'Homogenizing...' : 'Start Rotor-Stator (4,500 RPM)'}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Physical Formulation Inspection (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-5 border-3 border-pink-200 shadow-mama flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between border-b pb-3 mb-3">
                <h3 className="font-bubble text-base font-bold text-slate-800 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-pink-600" />
                  Pilot Batch Verification
                </h3>
              </div>

              {tabletCompressed || (order.dosageForm === 'suspension' && homogenizerRpm > 0) ? (
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900">
                    <strong className="block mb-1 font-bubble text-sm">Batch Status: Formed!</strong>
                    <span>
                      {punchStatus === 'perfect'
                        ? 'Tablet core compacted with smooth glossy surface and crisp bevelled edges.'
                        : punchStatus === 'soft'
                        ? 'Low compression force resulted in excessive friability. Tablet may break during packaging.'
                        : punchStatus === 'capping'
                        ? 'High compression pressure caused air entrapment and capping upon ejection from the die.'
                        : 'Homogeneous suspension created.'}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-600 block">Manufacturing Parameters:</span>
                    <div className="flex justify-between text-slate-500">
                      <span>Compression Force:</span>
                      <span className="font-mono font-bold text-slate-800">{compressionForceKn || 14} kN</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Tooling Type:</span>
                      <span className="font-mono font-bold text-slate-800">B-Tooling Flat-Faced Bevel</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Pilot Batch Size:</span>
                      <span className="font-mono font-bold text-slate-800">1,000 units</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <Cpu className="w-12 h-12 mx-auto text-slate-300 mb-2 animate-bounce-gentle" />
                  <p className="text-xs">
                    Operate the production equipment on the left to form your batch!
                  </p>
                </div>
              )}
            </div>

            {/* Special Production Tips */}
            <div className="mt-4 pt-3 border-t">
              <span className="text-[11px] font-bold text-pink-700 block mb-1">
                Pharma Mama's Formulation Tips:
              </span>
              <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
                {order.specialProductionTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
