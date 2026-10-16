import { Alleg, CharacterDef } from '../types/game';

export const ALL_CHARACTERS: CharacterDef[] = [
  // Shadows
  {
    name: 'Valkyrie',
    alleg: Alleg.Shadow,
    maxDamage: 13,
    winCondDesc: 'All of the Hunters (or 3 Neutrals) are dead.',
    specialDesc: 'When you attack, you only roll the 4-sided die and inflict the amount of damage rolled.',
    resourceId: 'valkyrie'
  },
  {
    name: 'Vampire',
    alleg: Alleg.Shadow,
    maxDamage: 13,
    winCondDesc: 'All of the Hunters (or 3 Neutrals) are dead.',
    specialDesc: 'If you attack a player and inflict damage, you heal 2 points of your own damage.',
    resourceId: 'vampire'
  },
  {
    name: 'Werewolf',
    alleg: Alleg.Shadow,
    maxDamage: 14,
    winCondDesc: 'All of the Hunters (or 3 Neutrals) are dead.',
    specialDesc: 'After you are attacked, you can counterattack immediately.',
    resourceId: 'werewolf'
  },
  {
    name: 'Ultra Soul',
    alleg: Alleg.Shadow,
    maxDamage: 11,
    winCondDesc: 'All of the Hunters (or 3 Neutrals) are dead.',
    specialDesc: 'When your turn starts, you can give 3 damage to one player who is at the Underworld Gate.',
    resourceId: 'ultra-soul'
  },

  // Neutrals
  {
    name: 'Allie',
    alleg: Alleg.Neutral,
    maxDamage: 8,
    winCondDesc: "You're not dead when the game is over.",
    specialDesc: 'Once per game, you may fully heal your damage.',
    resourceId: 'allie'
  },
  {
    name: 'Bob',
    alleg: Alleg.Neutral,
    maxDamage: 10,
    winCondDesc: 'You have 5 or more equipment cards.',
    specialDesc: 'If your attack inflicts 2 or more damage, you may steal an Equipment card from your target instead of giving damage.',
    resourceId: 'bob1',
    minPlayers: 4,
    maxPlayers: 6
  },
  {
    name: 'Bob',
    alleg: Alleg.Neutral,
    maxDamage: 10,
    winCondDesc: 'You have 5 or more equipment cards.',
    specialDesc: 'If you kill another player, you may take all of their Equipment cards.',
    resourceId: 'bob2',
    minPlayers: 7,
    maxPlayers: 8
  },
  {
    name: 'Catherine',
    alleg: Alleg.Neutral,
    maxDamage: 11,
    winCondDesc: 'You are either the first to die or one of the last two players alive.',
    specialDesc: 'When your turn starts, you heal 1 damage.',
    resourceId: 'catherine'
  },

  // Hunters
  {
    name: 'George',
    alleg: Alleg.Hunter,
    maxDamage: 14,
    winCondDesc: 'All of the Shadows are dead.',
    specialDesc: 'Once per game, when your turn starts, you can pick a player and damage them for the roll of a 4-sided die.',
    resourceId: 'george'
  },
  {
    name: 'Fu-ka',
    alleg: Alleg.Hunter,
    maxDamage: 12,
    winCondDesc: 'All of the Shadows are dead.',
    specialDesc: 'Once per game, when your turn starts, you can set the damage of any player to 7.',
    resourceId: 'fu-ka'
  },
  {
    name: 'Franklin',
    alleg: Alleg.Hunter,
    maxDamage: 12,
    winCondDesc: 'All of the Shadows are dead.',
    specialDesc: 'Once per game, when your turn starts, you can pick a player and damage them for the roll of a 6-sided die.',
    resourceId: 'franklin'
  },
  {
    name: 'Ellen',
    alleg: Alleg.Hunter,
    maxDamage: 10,
    winCondDesc: 'All of the Shadows are dead.',
    specialDesc: 'Once per game, when your turn starts, you can choose a player and permanently void their special ability.',
    resourceId: 'ellen'
  }
];

export function getCharacterPortrait(resourceId: string): string {
  switch (resourceId) {
    case 'allie': return '/static/gfx/Allie.png';
    case 'bob1':
    case 'bob2': return '/static/gfx/Bob.png';
    case 'catherine': return '/static/gfx/Catherine.png';
    case 'ellen': return '/static/gfx/Ellen.png';
    case 'franklin': return '/static/gfx/Franklin.png';
    case 'fu-ka': return '/static/gfx/Fu-ka.png';
    case 'george': return '/static/gfx/George.png';
    case 'ultra-soul': return '/static/gfx/Ultrasoul.png';
    case 'valkyrie': return '/static/gfx/Valkyrie.png';
    case 'vampire': return '/static/gfx/Vampire.png';
    case 'werewolf': return '/static/gfx/Werewolf.png';
    default: return '/static/gfx/anon.png';
  }
}
