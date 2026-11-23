# Pharma Mama: The Formulation Lab

An interactive educational pharmaceutical compounding game inspired by the visual design and gameplay mechanics of **Cooking Mama**. Players formulate, weigh, check compatibility, blend, manufacture, and test pharmaceutical dosage forms with immediate feedback from **Pharma Mama**, a cheerful cartoon pharmacist guide.

## Quick Start

```bash
# 1. Install dependencies (if not already installed)
npm install

# 2. Run the development server
npm run dev

# 3. Or build and preview the production build
npm run build
npm run preview
```

## Features

- **5 Compounding Mini-Games**:
  1. **Weighing & Dispensing**: Precision analytical balance with tolerance zone indicator.
  2. **Compatibility Lab**: 35% weighted reaction assay exploring solid-state interactions (Maillard, hydrophobic film, acid-base, etc.).
  3. **Powder Mixing**: Rotating V-blender with RPM control, RSD% uniformity gauge, and over-lubrication timer.
  4. **Production**: Rotary punch press (kN force gauge), cleanroom airlock dehumidifier (<25% RH), and high-shear rotor-stator.
  5. **Quality Control (QC)**: Visual inspection, disintegration bath (37°C), tablet hardness jaw, and paddle dissolution curve.
- **Scientific Reference**: Full compendium based on the **Handbook of Pharmaceutical Excipients (HOPE)** (Rowe, Sheskey, Cook, Quinn, Allen).
- **Pharma Mama Guide**: Cheerful SVG mascot with 6 emotional states (`happy`, `starry`, `worried`, `thinking`, `shocked`, `cheering`).
- **Sound Engine**: Procedural retro sound synthesizer built with the Web Audio API.

## Project Structure

```
pharma-mama/
├── src/
│   ├── types/game.ts             # Core data contracts & interfaces
│   ├── data/
│   │   ├── excipients.ts         # HOPE monographs (MCC, Lactose, Mg Stearate, etc.)
│   │   ├── apis.ts               # API monographs (Paracetamol, Vit C, Ibuprofen, etc.)
│   │   ├── compatibility.ts      # Scientific compatibility matrix
│   │   ├── levels.ts             # Formulation orders
│   │   ├── references.ts         # HOPE and pharmacopoeial citations
│   │   └── achievements.ts       # Unlockable trophies & awards
│   ├── services/
│   │   ├── soundEngine.ts        # Web Audio procedural sound synthesizer
│   │   └── gameState.ts          # Score engine (25/35/20/20 weights) & storage
│   ├── components/
│   │   ├── MamaMascot.tsx        # Animated cartoon mascot
│   │   ├── Navbar.tsx            # Top pastel header
│   │   ├── MainMenu.tsx          # Title screen & stats ribbon
│   │   ├── HowToPlayModal.tsx    # Visual gameplay guide
│   │   ├── OrderSelectModal.tsx  # Prescription clipboard selector
│   │   ├── KnowledgeBookModal.tsx# HOPE compendium & reference explorer
│   │   ├── AchievementsModal.tsx # Trophy cabinet
│   │   └── stages/               # 5 Mini-game stages + Report Card
│   ├── App.tsx                   # Main stage router & state machine
│   ├── index.css                 # Cooking Mama styles & animations
│   └── main.tsx                  # React entry point
├── index.html                    # HTML entry point with Fredoka font
├── tailwind.config.js            # Custom pastel palette & shadows
├── vite.config.ts
└── tsconfig.json
```
