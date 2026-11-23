import { APIMonograph } from '../types/game';

export const APIS_DATABASE: Record<string, APIMonograph> = {
  paracetamol: {
    id: 'paracetamol',
    name: 'Paracetamol (Acetaminophen)',
    chemicalName: 'N-(4-hydroxyphenyl)acetamide',
    therapeuticClass: 'Non-opioid analgesic and antipyretic',
    dosageForms: ['tablet-ir'],
    structureDescription: 'Contains a phenolic hydroxyl group and an aromatic secondary amide moiety (acetamido group). Notably, does NOT possess a primary aliphatic/aromatic amine in its intact form.',
    pKa: 9.38,
    solubility: 'Sparingly soluble in water (1 in 70 at 20°C); freely soluble in ethanol (1 in 7); soluble in boiling water (1 in 20).',
    bcsClass: 'BCS Class III / borderline Class I (High solubility at human dose/volume ratio in some classifications, high permeability/intermediate).',
    stabilityConcerns: [
      'Hydrolytic degradation: Under warm, moist, or extreme pH conditions, paracetamol hydrolyzes to form 4-aminophenol (a toxic degradation impurity with a free primary aromatic amine) and acetic acid.',
      'Oxidation: 4-aminophenol readily undergoes oxidative dimerization to pink/brown benzoquinoneimine complexes.',
      'Compression capping: Paracetamol crystals exhibit high elastic recovery and poor plastic deformation, predisposing tablets to capping or lamination unless formulated with plastically deforming binders like MCC.',
    ],
    criticalFunctionalGroups: ['Phenolic OH', 'Secondary Amide (Acetamido)'],
    formulationChallenges: 'Poor inherent compactibility and high dose loading (500 mg) require excipients with exceptional binding capacity (such as MCC) and rapid superdisintegration to achieve compendial dissolution (>80% in 30 min).',
    pharmacopoeialStandards: 'USP/BP monograph: Disintegration time < 15 minutes; Dissolution > 80% (Q) at 30 minutes in pH 5.8 phosphate buffer or 0.05M HCl.',
    hopeReference: {
      edition: '6th Edition',
      refId: 'hope6',
    },
  },

  ascorbic_acid: {
    id: 'ascorbic_acid',
    name: 'Ascorbic Acid (Vitamin C)',
    chemicalName: '(5R)-[(1S)-1,2-dihydroxyethyl]-3,4-dihydroxyfuran-2(5H)-one',
    therapeuticClass: 'Essential water-soluble vitamin / antioxidant',
    dosageForms: ['tablet-effervescent'],
    structureDescription: 'Enediol lactone ring system that functions as a potent electron donor / reducing agent. Rapidly oxidized reversibly to dehydroascorbic acid and irreversibly to 2,3-diketogulonic acid.',
    pKa: 4.17,
    solubility: 'Freely soluble in water (1 in 3); soluble in ethanol (95%) (1 in 25); practically insoluble in chloroform and ether.',
    bcsClass: 'BCS Class I (High solubility, good absorption)',
    stabilityConcerns: [
      'Extreme sensitivity to moisture, atmospheric oxygen, heat, light, and trace transition metal ions (Fe³⁺, Cu²⁺).',
      'Readily degrades in alkaline conditions, turning yellow to dark brown.',
      'In effervescent formulations, contact with trace moisture triggers the citric acid - sodium bicarbonate reaction prematurely, releasing water that accelerates vitamin C degradation exponentially.',
    ],
    criticalFunctionalGroups: ['Enediol system', 'Lactone ring', 'Primary and secondary alcohol groups'],
    formulationChallenges: 'Effervescent processing must occur in dry-room environments (<20% RH). Insoluble metallic lubricants like magnesium stearate must be avoided as they leave an unappealing oily scum on the glass upon effervescence and accelerate ascorbic acid oxidation via trace metals.',
    pharmacopoeialStandards: 'USP/Ph. Eur. Effervescent Tablet: Complete effervescent dissolution in 200 mL water at 15–25°C within 5 minutes without residue.',
    hopeReference: {
      edition: '6th Edition',
      refId: 'hope6',
    },
  },

  ibuprofen: {
    id: 'ibuprofen',
    name: 'Ibuprofen',
    chemicalName: '2-[4-(2-methylpropyl)phenyl]propanoic acid',
    therapeuticClass: 'Nonsteroidal anti-inflammatory drug (NSAID)',
    dosageForms: ['suspension'],
    structureDescription: 'Arylpropionic acid derivative with a hydrophobic isobutyl-substituted aromatic ring and a terminal carboxylic acid group.',
    pKa: 4.4,
    solubility: 'Practically insoluble in water (<0.1 mg/mL); freely soluble in ethanol, acetone, and aqueous alkali solutions.',
    bcsClass: 'BCS Class II (Low solubility, high permeability)',
    stabilityConcerns: [
      'Low melting point (~75–77°C) creates manufacturing challenges during thermal processing or high-shear milling.',
      'Strongly hydrophobic particle surfaces have an air contact angle >70°, causing dry powder to float on water without wetting.',
      'Unwetted particles aggregate into dense irreversible cakes (caking) over time in liquid media unless properly deflocculated with surfactants and suspended with pseudoplastic polymers.',
    ],
    criticalFunctionalGroups: ['Carboxylic acid', 'Hydrophobic aromatic core', 'Isobutyl aliphatic tail'],
    formulationChallenges: 'Must overcome surface tension with a compatible wetting agent (e.g. Polysorbate 80) and formulate a structured vehicle with shear-thinning rheology (e.g. Xanthan gum) to prevent phase separation and hard caking while preserving pleasant taste.',
    pharmacopoeialStandards: 'USP Oral Suspension: Uniformity of dosage units, pH between 3.6 and 4.6, smooth redispersibility with mild shaking (within 10 seconds), no caking.',
    hopeReference: {
      edition: '6th Edition',
      refId: 'hope6',
    },
  },

  calcium_carbonate_api: {
    id: 'calcium_carbonate_api',
    name: 'Calcium Carbonate & Magnesium Hydroxide',
    chemicalName: 'Calcium carbonate (CaCO3) + Magnesium hydroxide (Mg(OH)2)',
    therapeuticClass: 'Gastric antacid and mineral supplement',
    dosageForms: ['tablet-chewable'],
    structureDescription: 'Inorganic alkaline mineral salts that neutralize gastric stomach acid through chemical stoichiometry: CaCO3 + 2HCl -> CaCl2 + H2O + CO2.',
    solubility: 'Practically insoluble in water; dissolves in dilute acids with effervescence.',
    bcsClass: 'Locally acting in the gastrointestinal lumen (non-systemic)',
    stabilityConcerns: [
      'Chemically very stable in dry form.',
      'Incompatible with acidic excipients or active drugs sensitive to alkaline microenvironments.',
      'Chewable tablets must not produce a gritty, chalky, or dry mouthfeel, which leads to poor pediatric and geriatric compliance.',
    ],
    criticalFunctionalGroups: ['Inorganic Carbonate', 'Inorganic Hydroxide'],
    formulationChallenges: 'The chalky, astringent taste of high-dose minerals must be masked using non-cariogenic polyols with pleasant negative heat of solution (Mannitol) and direct-compression binders with good friability resistance.',
    pharmacopoeialStandards: 'USP Chewable Tablet: Hardness controlled for comfortable mastication (typically 4–7 kP), pleasant palatable taste, acid-neutralizing capacity (ANC) > 10 mEq per tablet.',
    hopeReference: {
      edition: '6th Edition',
      refId: 'hope6',
    },
  },
};
