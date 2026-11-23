import {
  Achievement,
  FormulationBatch,
  LevelOrder,
  QCResults,
  WeighedIngredient,
  TestedPair,
  ProductionExecution,
} from '../types/game';
import { LEVEL_ORDERS } from '../data/levels';
import { EXCIPIENTS_DATABASE } from '../data/excipients';
import { COMPATIBILITY_DATABASE } from '../data/compatibility';
import { INITIAL_ACHIEVEMENTS } from '../data/achievements';

const STORAGE_KEY_PLAYER = 'pharma_mama_player_stats';
const STORAGE_KEY_ACHIEVEMENTS = 'pharma_mama_achievements';

export interface PlayerStats {
  batchesCompleted: number;
  totalScoreSum: number;
  starsEarned: Record<string, number>; // levelId -> stars
  bestScores: Record<string, number>; // levelId -> score
  unlockedLevelIds: string[];
}

export class GameStateManager {
  private playerStats: PlayerStats;
  private achievements: Achievement[];

  constructor() {
    this.playerStats = this.loadPlayerStats();
    this.achievements = this.loadAchievements();
  }

  private loadPlayerStats(): PlayerStats {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PLAYER);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // Fallback
    }
    return {
      batchesCompleted: 0,
      totalScoreSum: 0,
      starsEarned: {},
      bestScores: {},
      unlockedLevelIds: [LEVEL_ORDERS[0].id],
    };
  }

  private savePlayerStats() {
    try {
      localStorage.setItem(STORAGE_KEY_PLAYER, JSON.stringify(this.playerStats));
    } catch {
      // Fallback
    }
  }

  private loadAchievements(): Achievement[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_ACHIEVEMENTS);
      if (data) {
        const saved: Achievement[] = JSON.parse(data);
        // Merge with initial in case new achievements were added
        return INITIAL_ACHIEVEMENTS.map((init) => {
          const match = saved.find((s) => s.id === init.id);
          return match || init;
        });
      }
    } catch {
      // Fallback
    }
    return [...INITIAL_ACHIEVEMENTS];
  }

  private saveAchievements() {
    try {
      localStorage.setItem(STORAGE_KEY_ACHIEVEMENTS, JSON.stringify(this.achievements));
    } catch {
      // Fallback
    }
  }

  public getPlayerStats(): PlayerStats {
    return { ...this.playerStats };
  }

  public getAchievements(): Achievement[] {
    return [...this.achievements];
  }

  public unlockAchievement(achievementId: string): Achievement | null {
    const ach = this.achievements.find((a) => a.id === achievementId);
    if (ach && !ach.isUnlocked) {
      ach.isUnlocked = true;
      ach.unlockedAt = new Date().toLocaleDateString();
      this.saveAchievements();
      return ach;
    }
    return null;
  }

  // Calculate scores and scientific evaluation
  public evaluateBatch(
    order: LevelOrder,
    selectedExcipientIds: string[],
    weighedIngredients: WeighedIngredient[],
    testedPairs: TestedPair[],
    blendingSequence: string[],
    lubricationDurationSeconds: number,
    production: ProductionExecution,
    qc: QCResults
  ): FormulationBatch {
    // 1. Excipient Selection Score (25% Weight)
    let excipientScore = 0;
    const mistakes: string[] = [];
    const highlights: string[] = [];
    const educationalFeedback: string[] = [];

    // Check required functional coverage
    const coveredFunctions = new Set<string>();
    selectedExcipientIds.forEach((id) => {
      const exc = EXCIPIENTS_DATABASE[id];
      if (exc) {
        exc.categories.forEach((cat) => coveredFunctions.add(cat));
      }
    });

    const missingFunctions = order.requiredFunctions.filter((fn) => !coveredFunctions.has(fn));
    if (missingFunctions.length === 0) {
      excipientScore += 12;
      highlights.push(`All vital pharmaceutical functions covered (${order.requiredFunctions.join(', ')}).`);
    } else {
      const penalty = Math.max(0, 12 - missingFunctions.length * 4);
      excipientScore += penalty;
      mistakes.push(`Missing critical excipient functions: ${missingFunctions.join(', ')}.`);
      educationalFeedback.push(
        `A dosage form must satisfy essential physical functions. For example, omitting a disintegrant prevents the tablet from breaking down in gastric fluid.`
      );
    }

    // Check incompatible ingredients
    let hasIncompatible = false;
    selectedExcipientIds.forEach((id) => {
      if (order.incompatibleExcipientIds.includes(id)) {
        hasIncompatible = true;
        const exc = EXCIPIENTS_DATABASE[id];
        mistakes.push(`Selected incompatible excipient: ${exc?.name || id}.`);
        educationalFeedback.push(
          `${exc?.name} is incompatible in this formulation! ${exc?.knownIncompatibilities[0] || 'Chemical or physical interference observed.'}`
        );
      }
    });

    if (!hasIncompatible) {
      excipientScore += 8;
      highlights.push('Zero known incompatible excipients selected.');
    }

    // Check recommended choices
    const recommendedCount = selectedExcipientIds.filter((id) => order.recommendedExcipientIds.includes(id)).length;
    const recommendedRatio = recommendedCount / Math.max(1, order.recommendedExcipientIds.length);
    excipientScore += Math.round(recommendedRatio * 5);
    excipientScore = Math.min(25, Math.max(0, excipientScore));

    // 2. Compatibility Understanding Score (35% Weight - HIGHEST WEIGHT!)
    let compatibilityScore = 0;
    // Reward for active testing in the compatibility lab
    const testedCount = testedPairs.length;
    if (testedCount >= 4) {
      compatibilityScore += 15;
      highlights.push(`Thorough compatibility screening performed (${testedCount} pairs analyzed).`);
    } else if (testedCount >= 2) {
      compatibilityScore += 10;
      highlights.push(`Investigated ${testedCount} key API-excipient pairs.`);
    } else {
      compatibilityScore += 4;
      mistakes.push('Insufficient compatibility tests conducted before blending.');
      educationalFeedback.push(
        'Testing compatibility early prevents costly batch failures and explains degradation pathways like Maillard browning or hydrolytic esterification.'
      );
    }

    // Check condition-dependent awareness
    if (order.dosageForm === 'tablet-ir') {
      const testedLactose = testedPairs.some(
        (p) => (p.itemAId === 'paracetamol' && p.itemBId === 'lactose_mono') || (p.itemAId === 'lactose_mono' && p.itemBId === 'paracetamol')
      );
      if (testedLactose) {
        compatibilityScore += 10;
        highlights.push('Mastered Paracetamol–Lactose condition-dependent interaction (Maillard risk via 4-aminophenol hydrolysis).');
      } else {
        compatibilityScore += 4;
        educationalFeedback.push(
          'Scientific Insight (HOPE p.364): Paracetamol has a secondary amide, so it does not directly form Maillard products with lactose monohydrate at room temperature, but hydrolytic impurity 4-aminophenol contains a primary amine that causes brown discoloration in accelerated stability!'
        );
      }

      const testedMgSt = testedPairs.some(
        (p) => (p.itemAId === 'paracetamol' && p.itemBId === 'magnesium_stearate') || (p.itemAId === 'magnesium_stearate' && p.itemBId === 'paracetamol')
      );
      if (testedMgSt) {
        compatibilityScore += 10;
      } else {
        compatibilityScore += 5;
      }
    } else if (order.dosageForm === 'tablet-effervescent') {
      const testedEffCouple = testedPairs.some(
        (p) => (p.itemAId === 'citric_acid' && p.itemBId === 'sodium_bicarbonate') || (p.itemAId === 'sodium_bicarbonate' && p.itemBId === 'citric_acid')
      );
      if (testedEffCouple) {
        compatibilityScore += 20;
        highlights.push('Recognized the moisture-dependent reaction dynamics of the citric acid / sodium bicarbonate effervescent couple.');
      } else {
        compatibilityScore += 8;
      }
    } else {
      compatibilityScore += 15;
    }
    compatibilityScore = Math.min(35, Math.max(0, compatibilityScore));

    // 3. Manufacturing Process Score (20% Weight)
    let manufacturingScore = 0;

    // Weighing precision
    const accurateWeights = weighedIngredients.filter((w) => w.isAccurate).length;
    const totalWeighed = Math.max(1, weighedIngredients.length);
    const weighingFraction = accurateWeights / totalWeighed;
    manufacturingScore += Math.round(weighingFraction * 8);
    if (weighingFraction >= 0.9) {
      highlights.push('Precision dispensing: All ingredients weighed within strict pharmacopoeial tolerance.');
    } else {
      mistakes.push('Some ingredients were dispensed outside acceptable weight tolerances.');
    }

    // Lubrication blending time check (crucial formulation principle!)
    if (lubricationDurationSeconds <= 180 && lubricationDurationSeconds >= 60) {
      manufacturingScore += 6;
      highlights.push(`Optimal lubricant blending time (${lubricationDurationSeconds}s): Prevented hydrophobic particle coating.`);
    } else if (lubricationDurationSeconds > 180) {
      manufacturingScore += 1;
      mistakes.push(`Lubricant over-blended (${lubricationDurationSeconds}s). Prolonged mixing creates an impermeable hydrophobic stearate shell!`);
      educationalFeedback.push(
        'Formulation Principle (HOPE p.404): Magnesium stearate forms lamellar shear layers. Excessive blending coats disintegrants and active particles with hydrophobic film, retarding wetting and prolonging disintegration.'
      );
    } else {
      manufacturingScore += 4;
    }

    // Compression / Production execution
    if (order.dosageForm === 'tablet-ir' || order.dosageForm === 'tablet-chewable') {
      const force = production.compressionForceKn || 0;
      if (force >= 11 && force <= 16) {
        manufacturingScore += 6;
        highlights.push(`Ideal tablet compaction force (${force.toFixed(1)} kN): Excellent tensile strength without capping.`);
      } else if (force < 10) {
        manufacturingScore += 2;
        mistakes.push(`Under-compressed (${force.toFixed(1)} kN): Risk of high friability and crumbling.`);
      } else {
        manufacturingScore += 2;
        mistakes.push(`Over-compressed (${force.toFixed(1)} kN): High internal stresses cause capping/lamination upon ejection.`);
      }
    } else {
      manufacturingScore += 6;
    }
    manufacturingScore = Math.min(20, Math.max(0, manufacturingScore));

    // 4. Quality Control Score (20% Weight)
    let qcScore = 0;
    if (qc.appearance.status === 'pass') qcScore += 4;
    else if (qc.appearance.status === 'warning') qcScore += 2;

    if (qc.weightVariation.status === 'pass') qcScore += 4;
    else if (qc.weightVariation.status === 'warning') qcScore += 2;

    if (qc.disintegration.status === 'pass') {
      qcScore += 4;
      highlights.push(`Disintegration passed (${qc.disintegration.timeSeconds}s < ${qc.disintegration.limitSeconds}s limit).`);
    } else {
      mistakes.push(`Disintegration failed (${qc.disintegration.timeSeconds}s).`);
    }

    if (qc.hardnessOrViscosity.status === 'pass') qcScore += 4;
    else if (qc.hardnessOrViscosity.status === 'warning') qcScore += 2;

    if (qc.dissolution.status === 'pass') {
      qcScore += 4;
      highlights.push(`Dissolution test passed (${qc.dissolution.percentReleasedAt30Min}% release at 30 min).`);
    } else {
      mistakes.push(`Dissolution release rate suboptimal (${qc.dissolution.percentReleasedAt30Min}% released at 30 min).`);
    }
    qcScore = Math.min(20, Math.max(0, qcScore));

    // Total Score (0 - 100)
    const totalScore = Math.min(100, Math.max(0, excipientScore + compatibilityScore + manufacturingScore + qcScore));

    // Star rating
    let starRating: 1 | 2 | 3 = 1;
    if (totalScore >= 85) starRating = 3;
    else if (totalScore >= 65) starRating = 2;

    // Formulation Quality Rating
    let formulationQualityRating: FormulationBatch['formulationQualityRating'] = 'Subpotent / Rejected Batch';
    if (totalScore >= 90) {
      formulationQualityRating = 'Pharmacopoeial Masterpiece';
    } else if (totalScore >= 75) {
      formulationQualityRating = 'Commercial Batch Approved';
    } else if (totalScore >= 60) {
      formulationQualityRating = 'Marginal Pass';
    }

    // Save player stats
    this.playerStats.batchesCompleted += 1;
    this.playerStats.totalScoreSum += totalScore;
    const currentBest = this.playerStats.bestScores[order.id] || 0;
    if (totalScore > currentBest) {
      this.playerStats.bestScores[order.id] = totalScore;
    }
    const currentStars = this.playerStats.starsEarned[order.id] || 0;
    if (starRating > currentStars) {
      this.playerStats.starsEarned[order.id] = starRating;
    }

    // Unlock next level if passed
    if (totalScore >= 60) {
      const currentIndex = LEVEL_ORDERS.findIndex((l) => l.id === order.id);
      if (currentIndex >= 0 && currentIndex < LEVEL_ORDERS.length - 1) {
        const nextLevelId = LEVEL_ORDERS[currentIndex + 1].id;
        if (!this.playerStats.unlockedLevelIds.includes(nextLevelId)) {
          this.playerStats.unlockedLevelIds.push(nextLevelId);
        }
      }
    }

    this.savePlayerStats();

    // Trigger achievements
    this.unlockAchievement('ach-first-batch');
    if (!hasIncompatible) {
      this.unlockAchievement('ach-zero-incompat');
    }
    if (testedCount >= 6) {
      this.unlockAchievement('ach-compat-master');
    }
    if (weighingFraction >= 0.99) {
      this.unlockAchievement('ach-precision-weighing');
    }
    if (totalScore >= 90) {
      this.unlockAchievement('ach-formulation-expert');
    }
    if (order.dosageForm === 'tablet-ir' && production.compressionForceKn && production.compressionForceKn >= 12 && production.compressionForceKn <= 15) {
      this.unlockAchievement('ach-punch-perfect');
    }

    return {
      orderId: order.id,
      selectedExcipientIds,
      weighedIngredients,
      testedPairs,
      blendingSequence,
      lubricationBlendingDuration: lubricationDurationSeconds,
      production,
      qc,
      scores: {
        excipientSelection: excipientScore,
        compatibilityUnderstanding: compatibilityScore,
        manufacturingProcess: manufacturingScore,
        qualityControl: qcScore,
        totalScore,
      },
      starRating,
      formulationQualityRating,
      mistakeSummary: mistakes,
      positiveHighlights: highlights,
      educationalFeedback,
    };
  }

  // Lookup compatibility for any two items
  public lookupCompatibility(itemAId: string, itemBId: string) {
    return COMPATIBILITY_DATABASE.find(
      (c) =>
        (c.itemAId === itemAId && c.itemBId === itemBId) ||
        (c.itemAId === itemBId && c.itemBId === itemAId)
    );
  }
}

export const gameStateManager = new GameStateManager();
