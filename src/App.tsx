import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { MainMenu } from './components/MainMenu';
import { HowToPlayModal } from './components/HowToPlayModal';
import { OrderSelectModal } from './components/OrderSelectModal';
import { AchievementsModal } from './components/AchievementsModal';
import { KnowledgeBookModal } from './components/KnowledgeBookModal';
import { Stage1Weighing } from './components/stages/Stage1Weighing';
import { Stage2Compatibility } from './components/stages/Stage2Compatibility';
import { Stage3Blending } from './components/stages/Stage3Blending';
import { Stage4Production } from './components/stages/Stage4Production';
import { Stage5QualityControl } from './components/stages/Stage5QualityControl';
import { Stage6ReportCard } from './components/stages/Stage6ReportCard';

import {
  LevelOrder,
  WeighedIngredient,
  TestedPair,
  ProductionExecution,
  QCResults,
  FormulationBatch,
} from './types/game';
import { LEVEL_ORDERS } from './data/levels';
import { gameStateManager } from './services/gameState';
import { soundEngine } from './services/soundEngine';

type AppView =
  | 'main-menu'
  | 'stage-1-weighing'
  | 'stage-2-compatibility'
  | 'stage-3-blending'
  | 'stage-4-production'
  | 'stage-5-qc'
  | 'stage-6-report';

export function App() {
  const [currentView, setCurrentView] = useState<AppView>('main-menu');
  const [currentOrder, setCurrentOrder] = useState<LevelOrder>(LEVEL_ORDERS[0]);

  // Modal visibility states
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState<boolean>(false);
  const [isOrderSelectOpen, setIsOrderSelectOpen] = useState<boolean>(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState<boolean>(false);
  const [isKnowledgeBookOpen, setIsKnowledgeBookOpen] = useState<boolean>(false);
  const [knowledgeInitialExcipientId, setKnowledgeInitialExcipientId] = useState<string | undefined>(undefined);

  // Formulation session state
  const [selectedExcipientIds, setSelectedExcipientIds] = useState<string[]>([]);
  const [weighedIngredients, setWeighedIngredients] = useState<WeighedIngredient[]>([]);
  const [testedPairs, setTestedPairs] = useState<TestedPair[]>([]);
  const [blendingSequence, setBlendingSequence] = useState<string[]>([]);
  const [lubricationDurationSeconds, setLubricationDurationSeconds] = useState<number>(120);
  const [productionExecution, setProductionExecution] = useState<ProductionExecution>({});
  const [qcResults, setQcResults] = useState<QCResults | null>(null);
  const [evaluatedBatch, setEvaluatedBatch] = useState<FormulationBatch | null>(null);

  // Open monograph in Knowledge Book from any stage
  const handleOpenKnowledgeMonograph = (excipientId: string) => {
    setKnowledgeInitialExcipientId(excipientId);
    setIsKnowledgeBookOpen(true);
  };

  // Start formulation with selected or default order
  const handleStartGame = (order?: LevelOrder) => {
    const targetOrder = order || currentOrder;
    setCurrentOrder(targetOrder);
    setSelectedExcipientIds([]);
    setWeighedIngredients([]);
    setTestedPairs([]);
    setBlendingSequence([]);
    setLubricationDurationSeconds(120);
    setProductionExecution({});
    setQcResults(null);
    setEvaluatedBatch(null);
    setCurrentView('stage-1-weighing');
  };

  // Stage 1 -> Stage 2
  const handleCompleteStage1 = (selectedIds: string[], weighed: WeighedIngredient[]) => {
    setSelectedExcipientIds(selectedIds);
    setWeighedIngredients(weighed);
    setCurrentView('stage-2-compatibility');
  };

  // Stage 2 -> Stage 3
  const handleCompleteStage2 = (tested: TestedPair[]) => {
    setTestedPairs(tested);
    setCurrentView('stage-3-blending');
  };

  // Stage 3 -> Stage 4
  const handleCompleteStage3 = (sequence: string[], durationSeconds: number) => {
    setBlendingSequence(sequence);
    setLubricationDurationSeconds(durationSeconds);
    setCurrentView('stage-4-production');
  };

  // Stage 4 -> Stage 5
  const handleCompleteStage4 = (production: ProductionExecution) => {
    setProductionExecution(production);
    setCurrentView('stage-5-qc');
  };

  // Stage 5 -> Stage 6 (Evaluate!)
  const handleCompleteStage5 = (qc: QCResults) => {
    setQcResults(qc);
    const batch = gameStateManager.evaluateBatch(
      currentOrder,
      selectedExcipientIds,
      weighedIngredients,
      testedPairs,
      blendingSequence,
      lubricationDurationSeconds,
      productionExecution,
      qc
    );
    setEvaluatedBatch(batch);
    setCurrentView('stage-6-report');
  };

  const getStageNumber = (): number => {
    switch (currentView) {
      case 'stage-1-weighing':
        return 1;
      case 'stage-2-compatibility':
        return 2;
      case 'stage-3-blending':
        return 3;
      case 'stage-4-production':
        return 4;
      case 'stage-5-qc':
        return 5;
      default:
        return 0;
    }
  };

  const stageNumber = getStageNumber();

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf8f4]">
      {/* Top Navbar */}
      <Navbar
        onGoHome={() => setCurrentView('main-menu')}
        onOpenKnowledgeBook={() => {
          setKnowledgeInitialExcipientId(undefined);
          setIsKnowledgeBookOpen(true);
        }}
        onOpenAchievements={() => setIsAchievementsOpen(true)}
        onOpenOrderSelect={() => setIsOrderSelectOpen(true)}
        currentLevelTitle={currentView !== 'main-menu' ? currentOrder.medicineName : undefined}
      />

      {/* Progress Stepper Bar (if inside formulation stages 1-5) */}
      {stageNumber > 0 && (
        <div className="bg-pink-50/70 border-b border-pink-200 px-4 py-2">
          <div className="max-w-4xl mx-auto flex items-center justify-between text-xs font-bubble font-bold text-slate-600">
            <span className={stageNumber === 1 ? 'text-pink-600 font-extrabold' : ''}>
              1. Weighing
            </span>
            <span>&rarr;</span>
            <span className={stageNumber === 2 ? 'text-pink-600 font-extrabold' : ''}>
              2. Compatibility Lab
            </span>
            <span>&rarr;</span>
            <span className={stageNumber === 3 ? 'text-pink-600 font-extrabold' : ''}>
              3. Mixing
            </span>
            <span>&rarr;</span>
            <span className={stageNumber === 4 ? 'text-pink-600 font-extrabold' : ''}>
              4. Production
            </span>
            <span>&rarr;</span>
            <span className={stageNumber === 5 ? 'text-pink-600 font-extrabold' : ''}>
              5. Quality Control
            </span>
          </div>
        </div>
      )}

      {/* Main View Router */}
      <main className="flex-1 flex flex-col justify-center">
        {currentView === 'main-menu' && (
          <MainMenu
            onStartGame={handleStartGame}
            onOpenOrderSelect={() => setIsOrderSelectOpen(true)}
            onOpenKnowledgeBook={() => {
              setKnowledgeInitialExcipientId(undefined);
              setIsKnowledgeBookOpen(true);
            }}
            onOpenAchievements={() => setIsAchievementsOpen(true)}
            onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
          />
        )}

        {currentView === 'stage-1-weighing' && (
          <Stage1Weighing
            order={currentOrder}
            onComplete={handleCompleteStage1}
            onOpenKnowledgeMonograph={handleOpenKnowledgeMonograph}
          />
        )}

        {currentView === 'stage-2-compatibility' && (
          <Stage2Compatibility
            order={currentOrder}
            selectedExcipientIds={selectedExcipientIds}
            onComplete={handleCompleteStage2}
            onOpenKnowledgeMonograph={handleOpenKnowledgeMonograph}
          />
        )}

        {currentView === 'stage-3-blending' && (
          <Stage3Blending
            order={currentOrder}
            selectedExcipientIds={selectedExcipientIds}
            onComplete={handleCompleteStage3}
          />
        )}

        {currentView === 'stage-4-production' && (
          <Stage4Production order={currentOrder} onComplete={handleCompleteStage4} />
        )}

        {currentView === 'stage-5-qc' && (
          <Stage5QualityControl
            order={currentOrder}
            selectedExcipientIds={selectedExcipientIds}
            lubricationDurationSeconds={lubricationDurationSeconds}
            production={productionExecution}
            onComplete={handleCompleteStage5}
          />
        )}

        {currentView === 'stage-6-report' && evaluatedBatch && (
          <Stage6ReportCard
            order={currentOrder}
            batch={evaluatedBatch}
            onRestartOrder={() => handleStartGame(currentOrder)}
            onOpenOrderSelect={() => setIsOrderSelectOpen(true)}
            onOpenKnowledgeBook={() => {
              setKnowledgeInitialExcipientId(undefined);
              setIsKnowledgeBookOpen(true);
            }}
          />
        )}
      </main>

      {/* Global Modals */}
      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
        onOpenKnowledgeBook={() => {
          setIsHowToPlayOpen(false);
          setIsKnowledgeBookOpen(true);
        }}
      />

      <OrderSelectModal
        isOpen={isOrderSelectOpen}
        onClose={() => setIsOrderSelectOpen(false)}
        onSelectLevel={(order) => {
          handleStartGame(order);
        }}
        currentLevelId={currentOrder.id}
      />

      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
      />

      <KnowledgeBookModal
        isOpen={isKnowledgeBookOpen}
        onClose={() => setIsKnowledgeBookOpen(false)}
        initialExcipientId={knowledgeInitialExcipientId}
      />
    </div>
  );
}

export default App;
