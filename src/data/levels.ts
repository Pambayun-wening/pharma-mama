import { LevelOrder } from '../types/game';
import { APIS_DATABASE } from './apis';

export const LEVEL_ORDERS: LevelOrder[] = [
  {
    id: 'level-1-paracetamol',
    levelNumber: 1,
    title: 'Level 1: Paracetamol Immediate-Release Tablet',
    medicineName: 'Paracetamol 500 mg Immediate-Release Tablets',
    api: APIS_DATABASE.paracetamol,
    dosageForm: 'tablet-ir',
    dosageFormDisplayName: 'Immediate-Release Tablet',
    clinicalScenario: 'Hospital pharmacy dispensary needs a high-quality batch of Paracetamol 500 mg tablets for acute pain and fever management in post-operative patients. The tablets must disintegrate rapidly (<15 min) and achieve >80% drug release within 30 minutes without capping, friability, or Maillard degradation.',
    targetSpecifications: {
      dosageStrength: '500 mg per tablet',
      targetWeight: 650, // total tablet weight in mg
      toleranceWeight: 15, // ± 15 mg tolerance
      disintegrationTimeLimit: 900, // 15 minutes (900 seconds)
      targetHardness: '60 – 90 N (6 – 9 kP)',
      targetDissolution: '> 80% released at 30 min (pH 5.8)',
    },
    availableExcipientIds: [
      'mcc',
      'lactose_mono',
      'magnesium_stearate',
      'croscarmellose_sodium',
      'sodium_starch_glycolate',
      'povidone_k30',
      'colloidal_silicon_dioxide',
      'talc',
      'stearic_acid',
      'calcium_carbonate',
    ],
    requiredFunctions: ['Diluent', 'Binder', 'Disintegrant', 'Lubricant', 'Glidant'],
    recommendedExcipientIds: [
      'mcc', // primary diluent & dry binder
      'croscarmellose_sodium', // or sodium_starch_glycolate
      'povidone_k30', // binder
      'colloidal_silicon_dioxide', // glidant
      'magnesium_stearate', // or stearic_acid
    ],
    incompatibleExcipientIds: [
      'calcium_carbonate', // unsuitable as diluent for high-dose paracetamol IR tablet; adds chalkiness and chemical instability
    ],
    conditionDependentExcipientIds: [
      'lactose_mono', // Maillard risk with 4-aminophenol hydrolysis impurity under heat/humidity
      'magnesium_stearate', // over-blending coats particles with hydrophobic layer, failing dissolution
    ],
    productionStageTitle: 'Rotary Tablet Punch Compression',
    specialProductionTips: [
      'Ensure lubricant blending is brief (under 3 minutes) to avoid hydrophobic coating.',
      'Calibrate tablet punch compaction force to 12–15 kN to avoid capping or soft friable tablets.',
      'Add disintegrant to ensure capillary wicking occurs rapidly.',
    ],
    difficulty: 'Beginner',
  },

  {
    id: 'level-2-vitaminc',
    levelNumber: 2,
    title: 'Level 2: Vitamin C Effervescent Tablet',
    medicineName: 'Ascorbic Acid 1000 mg Effervescent Tablets',
    api: APIS_DATABASE.ascorbic_acid,
    dosageForm: 'tablet-effervescent',
    dosageFormDisplayName: 'Effervescent Tablet',
    clinicalScenario: 'Formulate an orange-tinted effervescent tablet delivering 1000 mg of Vitamin C for immune support. When dropped into a glass of water, it must fizz vigorously and dissolve completely in under 3 minutes without leaving an insoluble oily scum or cloudy residue.',
    targetSpecifications: {
      dosageStrength: '1000 mg per tablet',
      targetWeight: 3200, // in mg
      toleranceWeight: 50,
      disintegrationTimeLimit: 180, // 3 minutes in water at 20°C
      targetHardness: '70 – 100 N',
      targetDissolution: '100% dissolved in 200 mL water',
    },
    availableExcipientIds: [
      'citric_acid',
      'sodium_bicarbonate',
      'mannitol',
      'povidone_k30',
      'colloidal_silicon_dioxide',
      'magnesium_stearate',
      'stearic_acid',
      'talc',
    ],
    requiredFunctions: ['Acidifying Agent', 'Alkalizing Agent', 'Diluent', 'Lubricant'],
    recommendedExcipientIds: [
      'citric_acid',
      'sodium_bicarbonate',
      'mannitol',
      'stearic_acid',
      'colloidal_silicon_dioxide',
    ],
    incompatibleExcipientIds: [
      'magnesium_stearate', // insoluble in water, leaves white scum, alkaline microclimate degrades ascorbic acid
    ],
    conditionDependentExcipientIds: [
      'citric_acid',
      'sodium_bicarbonate', // moisture-induced premature effervescence
    ],
    productionStageTitle: 'Moisture-Controlled Airlock Compression',
    specialProductionTips: [
      'Environmental relative humidity must be strictly maintained below 25% RH.',
      'Do not use insoluble magnesium stearate; it floats on the beverage and stains the glass.',
    ],
    difficulty: 'Intermediate',
  },

  {
    id: 'level-3-ibuprofen',
    levelNumber: 3,
    title: 'Level 3: Ibuprofen Pediatric Oral Suspension',
    medicineName: 'Ibuprofen 100 mg / 5 mL Oral Suspension',
    api: APIS_DATABASE.ibuprofen,
    dosageForm: 'suspension',
    dosageFormDisplayName: 'Pediatric Oral Suspension',
    clinicalScenario: 'Formulate a palatable, pleasant-tasting oral suspension of Ibuprofen (100 mg / 5 mL) for pediatric fever reduction. The hydrophobic drug must be uniformly dispersed, stay in suspension without rapid sedimentation, and never form an irreversible cement-like cake at the bottom of the bottle.',
    targetSpecifications: {
      dosageStrength: '100 mg / 5 mL (2% w/v)',
      targetWeight: 100, // 100 mL batch
      toleranceWeight: 2,
      targetViscosity: '300 – 600 mPa·s (shear thinning)',
      targetPH: '3.8 – 4.4',
    },
    availableExcipientIds: [
      'polysorbate_80',
      'xanthan_gum',
      'mannitol',
      'citric_acid',
      'colloidal_silicon_dioxide',
      'magnesium_stearate',
      'lactose_mono',
    ],
    requiredFunctions: ['Wetting Agent', 'Suspending Agent', 'Sweetener / Flavor', 'Buffering Agent'],
    recommendedExcipientIds: [
      'polysorbate_80',
      'xanthan_gum',
      'mannitol',
      'citric_acid',
    ],
    incompatibleExcipientIds: [
      'magnesium_stearate', // insoluble solid lubricant completely inappropriate for oral aqueous suspension
    ],
    conditionDependentExcipientIds: [
      'xanthan_gum', // hydration requires adequate high-shear mixing
    ],
    productionStageTitle: 'Wetting, Dispersion & High-Shear Homogenization',
    specialProductionTips: [
      'Wet hydrophobic ibuprofen with surfactant before adding the aqueous viscosity polymer.',
      'Homogenize under controlled shear to create uniform deflocculated droplets.',
    ],
    difficulty: 'Advanced',
  },

  {
    id: 'level-4-antacid',
    levelNumber: 4,
    title: 'Level 4: Antacid Chewable Tablet',
    medicineName: 'Calcium Carbonate 1000 mg Chewable Tablets',
    api: APIS_DATABASE.calcium_carbonate_api,
    dosageForm: 'tablet-chewable',
    dosageFormDisplayName: 'Chewable Tablet',
    clinicalScenario: 'Develop a tasty, non-chalky chewable antacid tablet for instant heartburn relief. The tablet must be pleasant to chew with zero gritty feeling, moderate hardness to prevent dental damage, and zero premature reaction before ingestion.',
    targetSpecifications: {
      dosageStrength: '1000 mg Calcium Carbonate',
      targetWeight: 1500, // in mg
      toleranceWeight: 30,
      targetHardness: '45 – 65 N (chewable range)',
      targetDissolution: 'Rapid neutralization in 0.1M HCl',
    },
    availableExcipientIds: [
      'mannitol',
      'mcc',
      'povidone_k30',
      'magnesium_stearate',
      'colloidal_silicon_dioxide',
      'citric_acid',
      'talc',
    ],
    requiredFunctions: ['Diluent', 'Sweetener / Flavor', 'Binder', 'Lubricant', 'Glidant'],
    recommendedExcipientIds: [
      'mannitol',
      'mcc',
      'povidone_k30',
      'magnesium_stearate',
      'colloidal_silicon_dioxide',
    ],
    incompatibleExcipientIds: [
      'citric_acid', // reacts with calcium carbonate in presence of saliva/moisture, liberating CO2 prematurely
    ],
    conditionDependentExcipientIds: [
      'magnesium_stearate',
    ],
    productionStageTitle: 'Direct Compression with Palatability Optimization',
    specialProductionTips: [
      'Use spray-dried mannitol for maximum refreshing cooling mouthfeel and sweetness.',
      'Keep compression force gentle (7–9 kN) so tablets are easy to chew without breaking teeth.',
    ],
    difficulty: 'Intermediate',
  },
];
