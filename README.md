# Shadow Hunters

Shadow Hunters is an online social deduction and survival board game implemented in React, TypeScript, and Vite. Players assume the secret identities of characters belonging to three opposing factions:
- **The Shadows**: Inhabitants of the underworld aiming to destroy all Hunters or eliminate three Neutrals.
- **The Hunters**: Protectors of the mortal realm seeking to banish all Shadows.
- **The Neutrals**: Caught in the crossfire, pursuing their own unique survival objectives.

## Features

- **Original Game Logic**: 100% faithful port of characters, character specials, allegiance distributions, areas, Hermit cards, White cards, and Black cards.
- **Dynamic Player Support**: 4 to 8 players with AI bot automation for open seats.
- **Visuals & Art**: Preserves original gothic aesthetics, cards, character portraits, zone layouts, damage tracks, and color coding.
- **Interactive Gameplay**:
  - Movement rolls (D4 + D6) with re-roll rules and Mystic Compass support.
  - Area actions across all 6 areas (Hermit's Cabin, Underworld Gate, Church, Cemetery, Weird Woods, Erstwhile Altar).
  - Combat system with attack range (zones & Handgun), damage calculation (|D6 - D4|), equipment modifiers, and counterattacks.
  - Real-time colored event log and game action prompts.
  - Comprehensive in-game Rulebook and character reference modal.

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
