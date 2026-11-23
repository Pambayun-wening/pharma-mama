export type DosageForm = 'tablet-ir' | 'tablet-effervescent' | 'suspension' | 'tablet-chewable';

export type ExcipientCategory =
  | 'Diluent'
  | 'Binder'
  | 'Disintegrant'
  | 'Lubricant'
  | 'Glidant'
  | 'Acidifying Agent'
  | 'Alkalizing Agent'
  | 'Suspending Agent'
  | 'Wetting Agent'
  | 'Sweetener / Flavor'
  | 'Buffering Agent';

export type CompatibilityStatus =
  | 'Generally compatible'
  | 'Potential incompatibility'
  | 'Known incompatibility'
  | 'Condition-dependent compatibility'
  | 'Insufficient evidence';

export type InteractionType =
  | 'Maillard reaction'
  | 'Acid-base reactions'
  | 'Oxidation and reduction'
  | 'Hydrolysis'
  | 'Complexation'
  | 'Adsorption'
  | 'Physical incompatibility'
  | 'Moisture-related instability'
  | 'Hydrophobic film formation'
  | 'Eutectic mixture formation';

export interface ScientificReference {
  id: string;
  title: string;
  authors: string;
  edition?: string;
  publisher: string;
  year: number;
  isbn?: string;
  doi?: string;
  notes: string;
}

export interface ExcipientMonograph {
  id: string;
  name: string;
  synonyms: string[];
  categories: ExcipientCategory[];
  primaryFunction: string;
  description: string;
  physicalProperties: {
    appearance: string;
    solubility: string;
    flowability: string;
    hygroscopicity: string;
    meltingPoint?: string;
    bulkDensity?: string;
  };
  typicalConcentrations: {
    use: string;
    range: string;
  }[];
  stability: string;
  storageConditions: string;
  knownIncompatibilities: string[];
  formulationConsiderations: string;
  hopeReference: {
    edition: string;
    page: string;
    refId: string;
  };
  iconName: string;
  colorTag: string;
}

export interface APIMonograph {
  id: string;
  name: string;
  chemicalName: string;
  therapeuticClass: string;
  dosageForms: DosageForm[];
  structureDescription: string;
  pKa?: number;
  solubility: string;
  bcsClass: string;
  stabilityConcerns: string[];
  criticalFunctionalGroups: string[];
  formulationChallenges: string;
  pharmacopoeialStandards: string;
  hopeReference?: {
    edition: string;
    refId: string;
  };
}

export interface CompatibilityRecord {
  id: string;
  itemAId: string; // API id or excipient id
  itemAName: string;
  itemBId: string; // Excipient id
  itemBName: string;
  interactionType: InteractionType;
  status: CompatibilityStatus;
  scientificExplanation: string;
  formulationConditions: string;
  practicalRecommendation: string;
  supportingReference: {
    refId: string;
    edition?: string;
    page?: string;
    sourceTitle: string;
  };
}

export interface LevelOrder {
  id: string;
  levelNumber: number;
  title: string;
  medicineName: string;
  api: APIMonograph;
  dosageForm: DosageForm;
  dosageFormDisplayName: string;
  clinicalScenario: string;
  targetSpecifications: {
    dosageStrength: string;
    targetWeight: number; // in mg or mL
    toleranceWeight: number; // ± mg or mL
    disintegrationTimeLimit?: number; // seconds
    targetHardness?: string; // e.g. "50 - 80 N"
    targetDissolution?: string; // e.g. "> 80% at 30 min"
    targetViscosity?: string; // for suspensions
    targetPH?: string;
  };
  availableExcipientIds: string[];
  requiredFunctions: ExcipientCategory[];
  recommendedExcipientIds: string[];
  incompatibleExcipientIds: string[];
  conditionDependentExcipientIds: string[];
  productionStageTitle: string;
  specialProductionTips: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface WeighedIngredient {
  excipientId: string;
  targetWeightMg: number;
  actualWeightMg: number;
  isAccurate: boolean;
  isAppropriate: boolean;
  functionAssigned: ExcipientCategory;
}

export interface TestedPair {
  itemAId: string;
  itemBId: string;
  testedAt: number;
  record?: CompatibilityRecord;
}

export interface BlendingStep {
  ingredientId: string;
  order: number;
  mixingTimeSeconds: number;
  rpm: number;
}

export interface ProductionExecution {
  compressionForceKn?: number; // For tablets
  punchStatus?: 'perfect' | 'capping' | 'sticking' | 'soft';
  airlockHumidityPercent?: number; // For effervescent
  homogenizationRpm?: number; // For suspension
  wettingComplete?: boolean;
}

export interface QCResults {
  appearance: {
    status: 'pass' | 'warning' | 'fail';
    details: string;
    score: number;
  };
  weightVariation: {
    status: 'pass' | 'warning' | 'fail';
    averageWeightMg: number;
    rsdPercent: number;
    score: number;
  };
  disintegration: {
    status: 'pass' | 'warning' | 'fail';
    timeSeconds: number;
    limitSeconds: number;
    score: number;
  };
  hardnessOrViscosity: {
    status: 'pass' | 'warning' | 'fail';
    measuredValue: string;
    targetRange: string;
    score: number;
  };
  dissolution: {
    status: 'pass' | 'warning' | 'fail';
    percentReleasedAt30Min: number;
    score: number;
  };
}

export interface FormulationBatch {
  orderId: string;
  selectedExcipientIds: string[];
  weighedIngredients: WeighedIngredient[];
  testedPairs: TestedPair[];
  blendingSequence: string[];
  lubricationBlendingDuration: number; // in seconds (< 3 min is ideal)
  production: ProductionExecution;
  qc: QCResults;
  scores: {
    excipientSelection: number; // out of 25
    compatibilityUnderstanding: number; // out of 35
    manufacturingProcess: number; // out of 20
    qualityControl: number; // out of 20
    totalScore: number; // out of 100
  };
  starRating: 1 | 2 | 3;
  formulationQualityRating: 'Pharmacopoeial Masterpiece' | 'Commercial Batch Approved' | 'Marginal Pass' | 'Subpotent / Rejected Batch';
  mistakeSummary: string[];
  positiveHighlights: string[];
  educationalFeedback: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  category: 'compatibility' | 'formulation' | 'quality' | 'mastery';
}

export type MamaMood = 'happy' | 'starry' | 'worried' | 'thinking' | 'shocked' | 'cheering';
