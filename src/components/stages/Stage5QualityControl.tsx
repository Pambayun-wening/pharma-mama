import React, { useState } from 'react';
import {
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Eye,
  Scale,
  Timer,
  Activity,
  Play,
  RotateCcw,
  TrendingUp,
} from 'lucide-react';
import { LevelOrder, QCResults, MamaMood, ProductionExecution } from '../../types/game';
import { EXCIPIENTS_DATABASE } from '../../data/excipients';
import { MamaMascot } from '../MamaMascot';
import { soundEngine } from '../../services/soundEngine';

interface Stage5QualityControlProps {
  order: LevelOrder;
  selectedExcipientIds: string[];
  lubricationDurationSeconds: number;
  production: ProductionExecution;
  onComplete: (qcResults: QCResults) => void;
}

export const Stage5QualityControl: React.FC<Stage5QualityControlProps> = ({
  order,
  selectedExcipientIds,
  lubricationDurationSeconds,
  production,
  onComplete,
}) => {
  // Active test tab: 'appearance' | 'disintegration' | 'hardness' | 'dissolution'
  const [activeTest, setActiveTest] = useState<'appearance' | 'disintegration' | 'hardness' | 'dissolution'>('appearance');

  // Completed tests tracking
  const [completedTests, setCompletedTests] = useState<string[]>([]);

  // Disintegration mini-game simulation
  const [disintegrationProgress, setDisintegrationProgress] = useState<number>(0);
  const [isDisintegrating, setIsDisintegrating] = useState<boolean>(false);
  const [disintegrationTimerSeconds, setDisintegrationTimerSeconds] = useState<number>(0);

  // Hardness mini-game simulation
  const [hardnessMeasured, setHardnessMeasured] = useState<number | null>(null);
  const [isMeasuringHardness, setIsMeasuringHardness] = useState<boolean>(false);

  // Dissolution mini-game simulation
  const [dissolutionProgress, setDissolutionProgress] = useState<number>(0);
  const [isDissolving, setIsDissolving] = useState<boolean>(false);

  // Mama reaction state
  const [mamaMood, setMamaMood] = useState<MamaMood>('thinking');
  const [mamaSpeech, setMamaSpeech] = useState<string>(
    'Time for Quality Control! Pharmacopoeial tests ensure our batch meets patient safety and efficacy standards.'
  );

  // Scientific impact evaluations based on player formulation choices:
  const hasDisintegrant = selectedExcipientIds.some((id) => {
    const exc = EXCIPIENTS_DATABASE[id];
    return exc && exc.categories.includes('Disintegrant');
  });

  const hasIncompatible = selectedExcipientIds.some((id) =>
    order.incompatibleExcipientIds.includes(id)
  );

  const isOverLubricated = lubricationDurationSeconds > 180;
  const punchStatus = production.punchStatus || 'perfect';

  // 1. Appearance Evaluation
  const appearanceStatus: 'pass' | 'warning' | 'fail' =
    punchStatus === 'capping' || hasIncompatible
      ? 'fail'
      : punchStatus === 'soft'
      ? 'warning'
      : 'pass';

  const appearanceDetails =
    appearanceStatus === 'pass'
      ? 'Clean, uniform tablets with smooth glossy surfaces, distinct embossing, and no capping or discoloration.'
      : punchStatus === 'capping'
      ? 'Severe capping and lamination observed! Tablet crowns sheared off due to excessive radial compaction stresses.'
      : hasIncompatible
      ? 'Surface discoloration and mottled spotting observed due to incompatible chemical interaction!'
      : 'Mild powder chipping and edge friability detected.';

  // 2. Disintegration Calculation
  // Normal IR tablet with croscarmellose disintegrates in 90-180s. Without disintegrant or over-lubricated: > 900s (fails USP <701> 15 min limit!)
  const actualDisintegrationTime = !hasDisintegrant
    ? 980 // Fails!
    : isOverLubricated
    ? 720 // Borderline / slow
    : order.dosageForm === 'tablet-effervescent'
    ? 110 // Effervescent is fast
    : 145; // 2.4 minutes (Pass!)

  // 3. Hardness Calculation
  const actualHardness =
    order.dosageForm === 'tablet-chewable'
      ? 55 // 55 N (chewable sweet spot)
      : punchStatus === 'soft'
      ? 35 // soft
      : punchStatus === 'capping'
      ? 125 // too hard
      : 75; // 75 N (optimal 60-90 N)

  // 4. Dissolution % at 30 min Calculation
  // USP IR spec: > 80% at 30 min
  const actualDissolutionRelease =
    !hasDisintegrant || isOverLubricated
      ? isOverLubricated && !hasDisintegrant
        ? 42
        : 68
      : 94; // 94% release (Pass!)

  // DISINTEGRATION SIMULATION
  const handleStartDisintegration = () => {
    setIsDisintegrating(true);
    soundEngine.playSplash();
    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      setDisintegrationProgress(current);
      setDisintegrationTimerSeconds(Math.round((current / 100) * actualDisintegrationTime));

      if (current >= 100) {
        clearInterval(interval);
        setIsDisintegrating(false);
        setCompletedTests((prev) => Array.from(new Set([...prev, 'disintegration'])));

        if (actualDisintegrationTime <= (order.targetSpecifications.disintegrationTimeLimit || 900)) {
          soundEngine.playSuccess();
          setMamaMood('starry');
          setMamaSpeech(`Disintegration PASSED in ${actualDisintegrationTime}s! Superdisintegrant wicked water rapidly!`);
        } else {
          soundEngine.playError();
          setMamaMood('shocked');
          setMamaSpeech(`Disintegration FAILED (${actualDisintegrationTime}s > 900s)! Missing disintegrant or over-lubrication!`);
        }
      }
    }, 150);
  };

  // HARDNESS SIMULATION
  const handleStartHardness = () => {
    setIsMeasuringHardness(true);
    soundEngine.playPop();
    setTimeout(() => {
      setIsMeasuringHardness(false);
      setHardnessMeasured(actualHardness);
      soundEngine.playPunchPress();
      setCompletedTests((prev) => Array.from(new Set([...prev, 'hardness'])));

      if (actualHardness >= 50 && actualHardness <= 95) {
        soundEngine.playSuccess();
        setMamaMood('starry');
        setMamaSpeech(`Hardness PASSED at ${actualHardness} N! Perfect resistance to crushing.`);
      } else {
        soundEngine.playError();
        setMamaMood('worried');
        setMamaSpeech(`Hardness (${actualHardness} N) outside optimal pharmacopoeial specification.`);
      }
    }, 1000);
  };

  // DISSOLUTION SIMULATION
  const handleStartDissolution = () => {
    setIsDissolving(true);
    soundEngine.playBubble();
    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      setDissolutionProgress(current);

      if (current >= 100) {
        clearInterval(interval);
        setIsDissolving(false);
        setCompletedTests((prev) => Array.from(new Set([...prev, 'dissolution'])));

        if (actualDissolutionRelease >= 80) {
          soundEngine.playSuccess();
          setMamaMood('starry');
          setMamaSpeech(`Dissolution PASSED! ${actualDissolutionRelease}% released at 30 min (>80% Q threshold).`);
        } else {
          soundEngine.playError();
          setMamaMood('worried');
          setMamaSpeech(`Dissolution SUBOPTIMAL (${actualDissolutionRelease}%). Hydrophobic lubricant barrier slowed release.`);
        }
      }
    }, 150);
  };

  // Compile final QC results
  const handleFinishQC = () => {
    soundEngine.playSuccess();
    const results: QCResults = {
      appearance: {
        status: appearanceStatus,
        details: appearanceDetails,
        score: appearanceStatus === 'pass' ? 4 : appearanceStatus === 'warning' ? 2 : 0,
      },
      weightVariation: {
        status: 'pass',
        averageWeightMg: order.targetSpecifications.targetWeight,
        rsdPercent: 1.4,
        score: 4,
      },
      disintegration: {
        status: actualDisintegrationTime <= (order.targetSpecifications.disintegrationTimeLimit || 900) ? 'pass' : 'fail',
        timeSeconds: actualDisintegrationTime,
        limitSeconds: order.targetSpecifications.disintegrationTimeLimit || 900,
        score: actualDisintegrationTime <= (order.targetSpecifications.disintegrationTimeLimit || 900) ? 4 : 0,
      },
      hardnessOrViscosity: {
        status: actualHardness >= 50 && actualHardness <= 100 ? 'pass' : 'warning',
        measuredValue: `${actualHardness} N`,
        targetRange: order.targetSpecifications.targetHardness || '60 – 90 N',
        score: actualHardness >= 50 && actualHardness <= 100 ? 4 : 2,
      },
      dissolution: {
        status: actualDissolutionRelease >= 80 ? 'pass' : 'fail',
        percentReleasedAt30Min: actualDissolutionRelease,
        score: actualDissolutionRelease >= 80 ? 4 : 1,
      },
    };

    onComplete(results);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-2 sm:p-4 animate-pop-in">
      {/* Mama Guidance Ribbon */}
      <div className="bg-white rounded-3xl p-4 border-3 border-rose-200 shadow-mama flex flex-col sm:flex-row items-center gap-4">
        <MamaMascot mood={mamaMood} size="sm" showSpeechBubble={false} />
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
              Stage 5 of 5
            </span>
            <span className="text-xs font-bubble font-bold text-slate-500">
              Pharmacopoeial Quality Control (QC) Testing (20% Weight)
            </span>
          </div>
          <p className="text-sm sm:text-base font-bold text-slate-800 leading-snug">
            {mamaSpeech}
          </p>
        </div>

        <button
          onClick={handleFinishQC}
          className="px-5 py-3 btn-mama btn-mama-mint font-bubble text-sm sm:text-base flex items-center gap-2 flex-shrink-0 cursor-pointer shadow-mama-mint animate-bounce-gentle"
        >
          <span>View Mama's Report Card</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* QC Test Navigation Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => {
            soundEngine.playPop();
            setActiveTest('appearance');
          }}
          className={`px-4 py-2 rounded-2xl font-bubble text-xs sm:text-sm font-bold border-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTest === 'appearance'
              ? 'bg-rose-500 text-white border-rose-600 shadow-mama-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Visual &amp; Appearance</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playPop();
            setActiveTest('disintegration');
          }}
          className={`px-4 py-2 rounded-2xl font-bubble text-xs sm:text-sm font-bold border-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTest === 'disintegration'
              ? 'bg-rose-500 text-white border-rose-600 shadow-mama-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Timer className="w-4 h-4" />
          <span>Disintegration (USP &lt;701&gt;)</span>
          {completedTests.includes('disintegration') && '✓'}
        </button>

        <button
          onClick={() => {
            soundEngine.playPop();
            setActiveTest('hardness');
          }}
          className={`px-4 py-2 rounded-2xl font-bubble text-xs sm:text-sm font-bold border-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTest === 'hardness'
              ? 'bg-rose-500 text-white border-rose-600 shadow-mama-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Breaking Force / Hardness</span>
          {completedTests.includes('hardness') && '✓'}
        </button>

        <button
          onClick={() => {
            soundEngine.playPop();
            setActiveTest('dissolution');
          }}
          className={`px-4 py-2 rounded-2xl font-bubble text-xs sm:text-sm font-bold border-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTest === 'dissolution'
              ? 'bg-rose-500 text-white border-rose-600 shadow-mama-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Dissolution Profile (USP &lt;711&gt;)</span>
          {completedTests.includes('dissolution') && '✓'}
        </button>
      </div>

      {/* Active Test Station View */}
      <div className="bg-white rounded-3xl p-6 border-3 border-slate-200 shadow-mama">
        {/* TEST 1: APPEARANCE */}
        {activeTest === 'appearance' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="bg-slate-900 rounded-3xl p-8 text-center text-white border-4 border-slate-700 flex flex-col items-center justify-center min-h-[220px]">
              {/* Magnified Tablet Visual */}
              <div className="relative w-28 h-28 rounded-full bg-slate-800 border-4 border-pink-400 flex items-center justify-center shadow-lg">
                <div
                  className={`w-20 h-20 rounded-full border-2 flex items-center justify-center font-bubble font-bold text-xs ${
                    appearanceStatus === 'pass'
                      ? 'bg-white text-slate-800 border-slate-300 shadow-inner'
                      : appearanceStatus === 'warning'
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-rose-200 text-rose-900 border-rose-400'
                  }`}
                >
                  {order.api.name.split(' ')[0]}
                </div>
              </div>
              <span className="text-xs font-mono text-slate-400 mt-3">20x OPTICAL MAGNIFICATION</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    appearanceStatus === 'pass'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : appearanceStatus === 'warning'
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-rose-100 text-rose-800 border-rose-300'
                  }`}
                >
                  {appearanceStatus === 'pass' ? '✓ PASS: Ph. Eur. 2.9.1' : appearanceStatus === 'warning' ? '⚠️ DEFECT WARNING' : '❌ OUT OF SPEC'}
                </span>
              </div>

              <h4 className="font-bubble text-lg font-bold text-slate-800">Visual Quality Inspection</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{appearanceDetails}</p>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
                <strong>Pharmacopoeial Reference:</strong> Ph. Eur. Uniformity of mass and appearance inspection. No chipped edges, capping, or blotches allowed.
              </div>
            </div>
          </div>
        )}

        {/* TEST 2: DISINTEGRATION */}
        {activeTest === 'disintegration' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="bg-slate-900 rounded-3xl p-6 text-center text-white border-4 border-slate-700 flex flex-col items-center justify-center min-h-[220px]">
              {/* Basket-rack in 37°C bath */}
              <div className="relative w-32 h-36 bg-blue-950/60 rounded-2xl border-2 border-blue-400 flex flex-col justify-end p-2 overflow-hidden">
                <div
                  className="bg-blue-400/40 rounded-xl transition-all duration-300 flex items-center justify-center"
                  style={{ height: `${Math.max(20, 100 - disintegrationProgress * 0.8)}%` }}
                >
                  <span className="text-[10px] font-mono text-blue-200">
                    {disintegrationProgress >= 100 ? 'DISINTEGRATED' : 'TABLET CORE'}
                  </span>
                </div>
              </div>
              <div className="mt-2 text-xs font-mono text-emerald-400">WATER BATH TEMP: 37.0°C ± 0.5°C</div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bubble text-lg font-bold text-slate-800">USP &lt;701&gt; Disintegration Bath</h4>
                <div className="text-xs font-mono font-bold text-slate-700">
                  Timer: {disintegrationTimerSeconds}s / {order.targetSpecifications.disintegrationTimeLimit || 900}s
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Tablets are immersed in 37°C water with oscillating basket agitation. Croscarmellose wicks water rapidly, exploding the tablet matrix in under 15 minutes.
              </p>

              {/* Progress bar */}
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 transition-all duration-200"
                  style={{ width: `${disintegrationProgress}%` }}
                />
              </div>

              <button
                onClick={handleStartDisintegration}
                disabled={isDisintegrating || disintegrationProgress >= 100}
                className="w-full py-3 btn-mama btn-mama-pink font-bubble text-sm flex items-center justify-center gap-2 cursor-pointer shadow-mama-pink"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>
                  {disintegrationProgress >= 100
                    ? `Test Complete (${actualDisintegrationTime}s)`
                    : isDisintegrating
                    ? 'Oscillating Basket...'
                    : 'Start Disintegration Test'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* TEST 3: HARDNESS */}
        {activeTest === 'hardness' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="bg-slate-900 rounded-3xl p-6 text-center text-white border-4 border-slate-700 flex flex-col items-center justify-center min-h-[220px]">
              <div className="text-4xl sm:text-5xl font-mono font-bold text-amber-400 tracking-tight my-2">
                {hardnessMeasured !== null ? `${hardnessMeasured} N` : '--- N'}
              </div>
              <span className="text-xs font-mono text-slate-400">DIGITAL JAW COMPRESSOR</span>
            </div>

            <div className="space-y-4">
              <h4 className="font-bubble text-lg font-bold text-slate-800">
                USP &lt;1217&gt; Tablet Breaking Force
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Motorized jaws compress the tablet diametrically until it fractures. Target specification for immediate-release tablets is {order.targetSpecifications.targetHardness || '60 – 90 N'}.
              </p>

              <button
                onClick={handleStartHardness}
                disabled={isMeasuringHardness || hardnessMeasured !== null}
                className="w-full py-3 btn-mama btn-mama-yellow font-bubble text-sm flex items-center justify-center gap-2 cursor-pointer shadow-mama-yellow"
              >
                <Activity className="w-4 h-4" />
                <span>
                  {hardnessMeasured !== null
                    ? `Fracture Force: ${hardnessMeasured} N`
                    : isMeasuringHardness
                    ? 'Applying Breaking Force...'
                    : 'Actuate Hardness Tester'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* TEST 4: DISSOLUTION */}
        {activeTest === 'dissolution' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="bg-slate-900 rounded-3xl p-6 text-center text-white border-4 border-slate-700 flex flex-col items-center justify-center min-h-[220px]">
              {/* Dissolution Curve Plot */}
              <div className="w-full h-32 flex items-end gap-2 px-4 border-b border-l border-slate-600">
                <div
                  className="w-1/4 bg-blue-500 rounded-t transition-all duration-300"
                  style={{ height: `${dissolutionProgress * 0.25}%` }}
                />
                <div
                  className="w-1/4 bg-blue-400 rounded-t transition-all duration-300"
                  style={{ height: `${dissolutionProgress * 0.55}%` }}
                />
                <div
                  className="w-1/4 bg-blue-300 rounded-t transition-all duration-300"
                  style={{ height: `${dissolutionProgress * 0.78}%` }}
                />
                <div
                  className="w-1/4 bg-emerald-400 rounded-t transition-all duration-300"
                  style={{ height: `${(dissolutionProgress / 100) * actualDissolutionRelease}%` }}
                />
              </div>
              <div className="flex justify-between w-full text-[10px] font-mono text-slate-400 mt-1 px-4">
                <span>0 min</span>
                <span>10 min</span>
                <span>20 min</span>
                <span>30 min (Q)</span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bubble text-lg font-bold text-slate-800">
                USP &lt;711&gt; Paddle Dissolution Apparatus
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Apparatus 2 at 50 RPM in 900 mL buffer at 37°C. Specification: Q &gt; 80% dissolved in 30 minutes.
              </p>

              <button
                onClick={handleStartDissolution}
                disabled={isDissolving || dissolutionProgress >= 100}
                className="w-full py-3 btn-mama btn-mama-mint font-bubble text-sm flex items-center justify-center gap-2 cursor-pointer shadow-mama-mint"
              >
                <TrendingUp className="w-4 h-4" />
                <span>
                  {dissolutionProgress >= 100
                    ? `Dissolution Profile: ${actualDissolutionRelease}% at 30 min`
                    : isDissolving
                    ? 'Sampling Spectrophotometer...'
                    : 'Run Dissolution Test'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
