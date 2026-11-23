import React from 'react';
import { X, Star, Lock, Sparkles, CheckCircle, ArrowRight, Pill, Droplet, RefreshCw } from 'lucide-react';
import { LevelOrder } from '../types/game';
import { LEVEL_ORDERS } from '../data/levels';
import { gameStateManager } from '../services/gameState';
import { soundEngine } from '../services/soundEngine';

interface OrderSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLevel: (level: LevelOrder) => void;
  currentLevelId?: string;
}

export const OrderSelectModal: React.FC<OrderSelectModalProps> = ({
  isOpen,
  onClose,
  onSelectLevel,
  currentLevelId,
}) => {
  if (!isOpen) return null;

  const playerStats = gameStateManager.getPlayerStats();

  const getDosageFormIcon = (form: string) => {
    switch (form) {
      case 'suspension':
        return <Droplet className="w-5 h-5 text-sky-600" />;
      case 'tablet-effervescent':
        return <RefreshCw className="w-5 h-5 text-amber-600" />;
      default:
        return <Pill className="w-5 h-5 text-pink-600" />;
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Intermediate':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Advanced':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-pop-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl border-4 border-purple-300 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-yellow-200 animate-spin-slow" />
            <h2 className="text-xl sm:text-2xl font-bubble font-bold tracking-wide">
              Prescription Order Board
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

        {/* Level List */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 custom-scrollbar">
          <p className="text-sm text-slate-600 font-medium">
            Select a formulation order to begin compounding. Each clinical order presents unique compatibility considerations and dosage form manufacturing challenges.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LEVEL_ORDERS.map((order) => {
              const isUnlocked = playerStats.unlockedLevelIds.includes(order.id) || order.levelNumber === 1;
              const stars = playerStats.starsEarned[order.id] || 0;
              const bestScore = playerStats.bestScores[order.id];
              const isCurrent = currentLevelId === order.id;

              return (
                <div
                  key={order.id}
                  className={`relative rounded-3xl p-5 border-3 transition-all flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-pink-50/70 border-pink-400 shadow-mama-pink ring-2 ring-pink-300'
                      : isUnlocked
                      ? 'bg-white hover:bg-slate-50 border-slate-200 shadow-mama'
                      : 'bg-slate-100 border-slate-200 opacity-75'
                  }`}
                >
                  <div>
                    {/* Top Row: Level & Stars */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-slate-800 text-white font-bubble text-xs flex items-center justify-center font-bold">
                          {order.levelNumber}
                        </span>
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getDifficultyBadge(
                            order.difficulty
                          )}`}
                        >
                          {order.difficulty}
                        </span>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-1">
                        {[1, 2, 3].map((starIdx) => (
                          <Star
                            key={starIdx}
                            className={`w-4 h-4 ${
                              starIdx <= stars
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-200 fill-slate-100'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Title & Medicine */}
                    <div className="flex items-start gap-3 mt-1">
                      <div className="w-10 h-10 rounded-2xl bg-pink-100 border border-pink-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                        {getDosageFormIcon(order.dosageForm)}
                      </div>
                      <div>
                        <h3 className="font-bubble text-base sm:text-lg font-bold text-slate-800 leading-tight">
                          {order.medicineName}
                        </h3>
                        <span className="text-xs font-semibold text-pink-600 block mt-0.5">
                          {order.dosageFormDisplayName}
                        </span>
                      </div>
                    </div>

                    {/* Clinical Scenario */}
                    <p className="text-xs text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
                      {order.clinicalScenario}
                    </p>

                    {/* Quick Specs */}
                    <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-400 block font-medium">Strength:</span>
                        <span className="font-bold text-slate-700">{order.targetSpecifications.dosageStrength}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-medium">Available Excipients:</span>
                        <span className="font-bold text-slate-700">{order.availableExcipientIds.length} candidate excipients</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action */}
                  <div className="mt-4 pt-3 flex items-center justify-between">
                    <div>
                      {bestScore !== undefined && (
                        <div className="text-[11px] font-semibold text-slate-500">
                          Best Score: <span className="text-pink-600 font-bold">{bestScore}/100</span>
                        </div>
                      )}
                    </div>

                    {isUnlocked ? (
                      <button
                        onClick={() => {
                          soundEngine.playSuccess();
                          onSelectLevel(order);
                          onClose();
                        }}
                        className={`px-4 py-2 font-bubble text-xs sm:text-sm btn-mama flex items-center gap-1.5 ${
                          isCurrent ? 'btn-mama-mint' : 'btn-mama-pink'
                        }`}
                      >
                        {isCurrent ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            <span>Currently Active</span>
                          </>
                        ) : (
                          <>
                            <span>Select Order</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-200/70 px-3 py-1.5 rounded-xl">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Pass Previous Order to Unlock</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t-2 border-slate-200 flex justify-end">
          <button
            onClick={() => {
              soundEngine.playPop();
              onClose();
            }}
            className="px-5 py-2 font-bubble text-sm btn-mama btn-mama-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
