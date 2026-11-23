import React from 'react';
import { Sparkles, Play, ClipboardList, BookOpen, Trophy, HelpCircle, Star, Award, Beaker } from 'lucide-react';
import { MamaMascot } from './MamaMascot';
import { LevelOrder } from '../types/game';
import { gameStateManager } from '../services/gameState';
import { soundEngine } from '../services/soundEngine';

interface MainMenuProps {
  onStartGame: (order?: LevelOrder) => void;
  onOpenOrderSelect: () => void;
  onOpenKnowledgeBook: () => void;
  onOpenAchievements: () => void;
  onOpenHowToPlay: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onOpenOrderSelect,
  onOpenKnowledgeBook,
  onOpenAchievements,
  onOpenHowToPlay,
}) => {
  const stats = gameStateManager.getPlayerStats();
  const totalStars = Object.values(stats.starsEarned).reduce((a, b) => a + b, 0);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background cute lab decor */}
      <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-pink-100/50 -z-10 blur-xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-teal-100/50 -z-10 blur-2xl pointer-events-none" />
      <div className="absolute top-1/3 right-16 w-24 h-24 rounded-full bg-yellow-100/50 -z-10 blur-lg pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-3xl flex flex-col items-center text-center">
        {/* Title Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 border-2 border-pink-300 text-pink-700 text-xs sm:text-sm font-bold shadow-sm mb-3 animate-bounce-gentle">
          <Sparkles className="w-4 h-4 text-pink-500 animate-spin-slow" />
          <span>Interactive Compounding & Excipient Science</span>
        </div>

        {/* Big Game Title in Cooking Mama Style */}
        <div className="relative mb-4">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bubble font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 drop-shadow-sm">
            Pharma Mama
          </h1>
          <div className="text-base sm:text-xl font-bubble font-bold text-slate-700 -mt-1 sm:-mt-2 tracking-wide flex items-center justify-center gap-2">
            <span className="w-8 h-1 bg-pink-300 rounded-full inline-block" />
            <span className="text-emerald-600">The Formulation Lab</span>
            <span className="w-8 h-1 bg-pink-300 rounded-full inline-block" />
          </div>
        </div>

        {/* Mama Mascot with Greeting */}
        <div className="my-2 sm:my-4">
          <MamaMascot
            mood="happy"
            size="lg"
            speech="Hi there, future pharmacist! Ready to weigh powders, test chemical compatibilities, and press perfect tablets?"
          />
        </div>

        {/* Player Stats Ribbon */}
        <div className="flex flex-wrap items-center justify-center gap-3 my-4">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white border-2 border-pink-200 shadow-mama-sm text-xs font-bold text-slate-700">
            <Beaker className="w-4 h-4 text-pink-500" />
            <span>Batches: <span className="text-pink-600 font-extrabold">{stats.batchesCompleted}</span></span>
          </div>

          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white border-2 border-amber-200 shadow-mama-sm text-xs font-bold text-slate-700">
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>Stars: <span className="text-amber-600 font-extrabold">{totalStars}</span> / 12</span>
          </div>

          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white border-2 border-teal-200 shadow-mama-sm text-xs font-bold text-slate-700">
            <Award className="w-4 h-4 text-teal-600" />
            <span>Levels Unlocked: <span className="text-teal-700 font-extrabold">{stats.unlockedLevelIds.length}</span> / 4</span>
          </div>
        </div>

        {/* Menu Buttons Group */}
        <div className="w-full max-w-md space-y-3 mt-2">
          {/* Main Play Button */}
          <button
            onClick={() => {
              soundEngine.playSuccess();
              onStartGame();
            }}
            className="w-full py-4 px-6 btn-mama btn-mama-pink text-white font-bubble text-xl sm:text-2xl flex items-center justify-center gap-3 shadow-mama-pink"
          >
            <Play className="w-7 h-7 fill-white" />
            <span>Let's Formulate!</span>
          </button>

          {/* Secondary Buttons Grid */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                soundEngine.playPop();
                onOpenOrderSelect();
              }}
              className="py-3 px-3 btn-mama btn-mama-yellow font-bubble text-sm sm:text-base flex items-center justify-center gap-2"
            >
              <ClipboardList className="w-4 h-4" />
              <span>Choose Order</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playPop();
                onOpenHowToPlay();
              }}
              className="py-3 px-3 btn-mama btn-mama-blue font-bubble text-sm sm:text-base flex items-center justify-center gap-2"
            >
              <HelpCircle className="w-4 h-4" />
              <span>How to Play</span>
            </button>
          </div>

          {/* Tertiary Row */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                soundEngine.playPop();
                onOpenKnowledgeBook();
              }}
              className="py-2.5 px-3 btn-mama btn-mama-mint font-bubble text-xs sm:text-sm flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Knowledge Book</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playPop();
                onOpenAchievements();
              }}
              className="py-2.5 px-3 btn-mama btn-mama-purple font-bubble text-xs sm:text-sm flex items-center justify-center gap-2"
            >
              <Trophy className="w-4 h-4" />
              <span>Achievements</span>
            </button>
          </div>
        </div>

        {/* Scientific Subtitle Footer */}
        <div className="mt-8 text-xs text-slate-500 font-medium">
          Based on the <span className="font-bold text-slate-700">Handbook of Pharmaceutical Excipients (HOPE)</span> &amp; USP standards.
        </div>
      </div>
    </div>
  );
};
