import React from 'react';
import { BookOpen, Trophy, Volume2, VolumeX, Sparkles, Home, ClipboardList } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

interface NavbarProps {
  onOpenKnowledgeBook: () => void;
  onOpenAchievements: () => void;
  onOpenOrderSelect: () => void;
  onGoHome: () => void;
  currentLevelTitle?: string;
  totalScore?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenKnowledgeBook,
  onOpenAchievements,
  onOpenOrderSelect,
  onGoHome,
  currentLevelTitle,
  totalScore = 0,
}) => {
  const [isMuted, setIsMuted] = React.useState(soundEngine.getIsMuted());

  const handleToggleSound = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundEngine.playPop();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-4 border-pink-200 px-4 py-2.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Logo and Home Button */}
        <button
          onClick={() => {
            soundEngine.playPop();
            onGoHome();
          }}
          className="flex items-center gap-2 group text-left cursor-pointer transition-transform active:scale-95"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-mama-pink to-rose-400 flex items-center justify-center text-white shadow-mama-sm border-2 border-white">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-xl font-bubble font-bold text-slate-800 tracking-wide">
                Pharma Mama
              </span>
              <span className="hidden sm:inline-block text-[11px] font-bold bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full border border-pink-300">
                The Formulation Lab
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Pharmaceutical Compounding Simulation</p>
          </div>
        </button>

        {/* Current Order Badge (if inside a level) */}
        {currentLevelTitle && (
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border-2 border-amber-300 text-amber-900 text-xs font-bold shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            <span className="truncate max-w-[200px] lg:max-w-xs">{currentLevelTitle}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Order Selection */}
          <button
            onClick={() => {
              soundEngine.playPop();
              onOpenOrderSelect();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs sm:text-sm border-2 border-purple-200 transition-all active:scale-95 cursor-pointer shadow-sm"
            title="Choose Formulation Order"
          >
            <ClipboardList className="w-4 h-4 text-purple-600" />
            <span className="hidden sm:inline">Orders</span>
          </button>

          {/* Knowledge Book Button */}
          <button
            onClick={() => {
              soundEngine.playPop();
              onOpenKnowledgeBook();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs sm:text-sm border-2 border-teal-200 transition-all active:scale-95 cursor-pointer shadow-sm"
            title="Open Handbook of Pharmaceutical Excipients (HOPE)"
          >
            <BookOpen className="w-4 h-4 text-teal-600" />
            <span className="hidden sm:inline">Knowledge Book</span>
          </button>

          {/* Achievements Button */}
          <button
            onClick={() => {
              soundEngine.playPop();
              onOpenAchievements();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs sm:text-sm border-2 border-amber-200 transition-all active:scale-95 cursor-pointer shadow-sm"
            title="View Achievements"
          >
            <Trophy className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">Awards</span>
          </button>

          {/* Audio Mute/Unmute */}
          <button
            onClick={handleToggleSound}
            className={`p-2 rounded-xl border-2 transition-all active:scale-95 cursor-pointer shadow-sm ${
              isMuted
                ? 'bg-slate-100 text-slate-400 border-slate-300'
                : 'bg-pink-50 text-pink-600 border-pink-200 hover:bg-pink-100'
            }`}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
