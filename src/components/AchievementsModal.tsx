import React from 'react';
import { X, Trophy, Sparkles, CheckCircle2, Lock, ShieldCheck, Microscope, Scale, Award, Search, Cpu, BookOpen } from 'lucide-react';
import { gameStateManager } from '../services/gameState';
import { soundEngine } from '../services/soundEngine';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const achievements = gameStateManager.getAchievements();
  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;
  const progressPercent = Math.round((unlockedCount / achievements.length) * 100);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      case 'Microscope':
        return <Microscope className="w-5 h-5 text-indigo-600" />;
      case 'Scale':
        return <Scale className="w-5 h-5 text-amber-600" />;
      case 'Award':
        return <Award className="w-5 h-5 text-yellow-500" />;
      case 'Search':
        return <Search className="w-5 h-5 text-sky-600" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-purple-600" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-teal-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-pink-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-pop-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl border-4 border-amber-300 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 p-4 text-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-slate-900" />
            <h2 className="text-xl sm:text-2xl font-bubble font-bold tracking-wide">
              Pharmacist Honors & Awards
            </h2>
          </div>
          <button
            onClick={() => {
              soundEngine.playPop();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-black/10 transition-all text-slate-900 cursor-pointer active:scale-90"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="bg-amber-50 px-6 py-3 border-b border-amber-200 flex items-center justify-between gap-4">
          <div className="text-xs sm:text-sm font-bold text-amber-900">
            Progress: <span className="text-amber-700">{unlockedCount}</span> of {achievements.length} Badges Unlocked
          </div>
          <div className="flex-1 max-w-xs h-3 bg-amber-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-xs font-bold text-amber-800">{progressPercent}%</div>
        </div>

        {/* Scrollable Badges List */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-3 custom-scrollbar">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-3.5 rounded-2xl border-2 flex items-center gap-3.5 transition-all ${
                ach.isUnlocked
                  ? 'bg-amber-50/60 border-amber-200 shadow-sm'
                  : 'bg-slate-50 border-slate-200 opacity-60'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border-2 ${
                  ach.isUnlocked
                    ? 'bg-white border-amber-300 shadow-mama-sm'
                    : 'bg-slate-200 border-slate-300'
                }`}
              >
                {ach.isUnlocked ? getIcon(ach.icon) : <Lock className="w-5 h-5 text-slate-400" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bubble font-bold text-sm text-slate-800 truncate">
                    {ach.title}
                  </h4>
                  {ach.isUnlocked && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                      <CheckCircle2 className="w-3 h-3" /> Unlocked
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                  {ach.description}
                </p>
                {ach.unlockedAt && (
                  <span className="text-[10px] text-slate-400 block mt-1 font-medium">
                    Awarded on {ach.unlockedAt}
                  </span>
                )}
              </div>
            </div>
          ))}
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
