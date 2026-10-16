import { CardDef, CardType } from '../types/game';

export function getCardSvg(title: string, color: CardType): string {
  switch (title) {
    case 'Mystic Compass': return '/static/gfx/mystic-compass.svg';
    case 'Talisman': return '/static/gfx/talisman.svg';
    case 'Fortune Brooch': return '/static/gfx/fortune-brooch.svg';
    case 'Silver Rosary': return '/static/gfx/silver-rosary.svg';
    case 'Spear of Longinus': return '/static/gfx/spear-of-longinus.svg';
    case 'Advent': return '/static/gfx/advent.svg';
    case 'Disenchant Mirror': return '/static/gfx/disenchant-mirror.svg';
    case 'Blessing': return '/static/gfx/blessing.svg';
    case 'Chocolate': return '/static/gfx/chocolate.svg';
    case 'Concealed Knowledge': return '/static/gfx/hidden-knowledge.svg';
    case 'Guardian Angel': return '/static/gfx/guardian-angel.svg';
    case 'Holy Robe': return '/static/gfx/holy-robe.svg';
    case 'Flare of Judgement': return '/static/gfx/flare-of-judgement.svg';
    case 'First Aid': return '/static/gfx/first-aid.svg';
    case 'Holy Water of Healing': return '/static/gfx/holy-water-of-healing.svg';

    case 'Cursed Sword Masamune': return '/static/gfx/cursed-sword-masamune.svg';
    case 'Machine Gun': return '/static/gfx/machine-gun.svg';
    case 'Handgun': return '/static/gfx/handgun.svg';
    case 'Butcher Knife': return '/static/gfx/butcher-knife.svg';
    case 'Chainsaw': return '/static/gfx/chainsaw.svg';
    case 'Rusted Broad Axe': return '/static/gfx/rusted-broad-axe.svg';
    case 'Moody Goblin': return '/static/gfx/moody-goblin.svg';
    case 'Bloodthirsty Spider': return '/static/gfx/bloodthirsty-spider.svg';
    case 'Vampire Bat': return '/static/gfx/vampire-bat.svg';
    case 'Diabolic Ritual': return '/static/gfx/diabolic-ritual.svg';
    case 'Banana Peel': return '/static/gfx/banana-peel.svg';
    case 'Dynamite': return '/static/gfx/dynamite.svg';
    case 'Spiritual Doll': return '/static/gfx/spiritual-doll.svg';

    default:
      if (color === CardType.White) return '/static/gfx/whitecard.svg';
      if (color === CardType.Black) return '/static/gfx/blackcard.svg';
      return '/static/gfx/hermit.svg';
  }
}

export function createWhiteCards(): CardDef[] {
  return [
    {
      id: 'w-compass',
      title: 'Mystic Compass',
      desc: 'When you move, you may roll twice and choose which result to use.',
      color: CardType.White,
      isEquip: true
    },
    {
      id: 'w-talisman',
      title: 'Talisman',
      desc: "You receive no damage from Black cards 'Bloodthirsty Spider', 'Vampire Bat', or 'Dynamite'.",
      color: CardType.White,
      isEquip: true
    },
    {
      id: 'w-fortune-brooch',
      title: 'Fortune Brooch',
      desc: "You receive no damage from the area card 'Weird Woods'. You can still be healed by it.",
      color: CardType.White,
      isEquip: true
    },
    {
      id: 'w-silver-rosary',
      title: 'Silver Rosary',
      desc: 'If you kill another character, you take all of their equipment cards.',
      color: CardType.White,
      isEquip: true
    },
    {
      id: 'w-spear',
      title: 'Spear of Longinus',
      desc: 'If you are a Hunter who has revealed their identity and your attack is successful, you give 2 points of extra damage.',
      color: CardType.White,
      isEquip: true
    },
    {
      id: 'w-advent',
      title: 'Advent',
      desc: 'If you are a Hunter, you may reveal your identity. If you do, or if you are already revealed, you heal fully.',
      color: CardType.White,
      isEquip: false
    },
    {
      id: 'w-mirror',
      title: 'Disenchant Mirror',
      desc: 'If you are a Shadow, except for Unknown, you must reveal your identity.',
      color: CardType.White,
      isEquip: false
    },
    {
      id: 'w-blessing',
      title: 'Blessing',
      desc: 'Pick a character other than yourself and roll the 6-sided die. That character heals an amount of damage equal to the die roll.',
      color: CardType.White,
      isEquip: false
    },
    {
      id: 'w-chocolate',
      title: 'Chocolate',
      desc: 'If you are Allie, Agnes, Emi, Ellen, Unknown, or Ultra Soul, you may reveal your identity. If you do, or if you are already revealed, you heal fully.',
      color: CardType.White,
      isEquip: false
    },
    {
      id: 'w-knowledge',
      title: 'Concealed Knowledge',
      desc: 'When this turn is over, it will be your turn again.',
      color: CardType.White,
      isEquip: false
    },
    {
      id: 'w-guardian-angel',
      title: 'Guardian Angel',
      desc: 'You take no damage from the direct attacks of other characters until the start of your next turn.',
      color: CardType.White,
      isEquip: false
    },
    {
      id: 'w-robe',
      title: 'Holy Robe',
      desc: 'Your attacks do 1 less damage and the amount of damage you receive from attacks is reduced by 1 point.',
      color: CardType.White,
      isEquip: true
    },
    {
      id: 'w-judgement',
      title: 'Flare of Judgement',
      desc: 'All characters except yourself receive 2 points of damage.',
      color: CardType.White,
      isEquip: false
    },
    {
      id: 'w-first-aid',
      title: 'First Aid',
      desc: "Place a character's damage marker to 7 (You can choose yourself).",
      color: CardType.White,
      isEquip: false
    },
    {
      id: 'w-holy-water-1',
      title: 'Holy Water of Healing',
      desc: 'Heal 2 points of your damage.',
      color: CardType.White,
      isEquip: false
    },
    {
      id: 'w-holy-water-2',
      title: 'Holy Water of Healing',
      desc: 'Heal 2 points of your damage.',
      color: CardType.White,
      isEquip: false
    }
  ];
}

export function createBlackCards(): CardDef[] {
  return [
    {
      id: 'b-masamune',
      title: 'Cursed Sword Masamune',
      desc: 'You must attack another character on your turn. This attack uses the 4-sided die.',
      color: CardType.Black,
      isEquip: true
    },
    {
      id: 'b-machine-gun',
      title: 'Machine Gun',
      desc: 'Your attack will affect all characters in your attack range (the dice are rolled only once).',
      color: CardType.Black,
      isEquip: true
    },
    {
      id: 'b-handgun',
      title: 'Handgun',
      desc: 'All ranges but yours become your attack range.',
      color: CardType.Black,
      isEquip: true
    },
    {
      id: 'b-butcher-knife',
      title: 'Butcher Knife',
      desc: 'If your attack is successful, you give 1 point of extra damage.',
      color: CardType.Black,
      isEquip: true
    },
    {
      id: 'b-chainsaw',
      title: 'Chainsaw',
      desc: 'If your attack is successful, you give 1 point of extra damage.',
      color: CardType.Black,
      isEquip: true
    },
    {
      id: 'b-broad-axe',
      title: 'Rusted Broad Axe',
      desc: 'If your attack is successful, you give 1 point of extra damage.',
      color: CardType.Black,
      isEquip: true
    },
    {
      id: 'b-goblin-1',
      title: 'Moody Goblin',
      desc: 'You steal an equipment card from any character.',
      color: CardType.Black,
      isEquip: false
    },
    {
      id: 'b-goblin-2',
      title: 'Moody Goblin',
      desc: 'You steal an equipment card from any character.',
      color: CardType.Black,
      isEquip: false
    },
    {
      id: 'b-spider',
      title: 'Bloodthirsty Spider',
      desc: 'You give 2 points of damage to any character and receive 2 points of damage yourself.',
      color: CardType.Black,
      isEquip: false
    },
    {
      id: 'b-bat-1',
      title: 'Vampire Bat',
      desc: 'You give 2 points of damage to any character and heal 1 point of your own damage.',
      color: CardType.Black,
      isEquip: false
    },
    {
      id: 'b-bat-2',
      title: 'Vampire Bat',
      desc: 'You give 2 points of damage to any character and heal 1 point of your own damage.',
      color: CardType.Black,
      isEquip: false
    },
    {
      id: 'b-bat-3',
      title: 'Vampire Bat',
      desc: 'You give 2 points of damage to any character and heal 1 point of your own damage.',
      color: CardType.Black,
      isEquip: false
    },
    {
      id: 'b-ritual',
      title: 'Diabolic Ritual',
      desc: 'If you are a Shadow, you may reveal your identity. If you do, you fully heal you damage.',
      color: CardType.Black,
      isEquip: false
    },
    {
      id: 'b-banana',
      title: 'Banana Peel',
      desc: 'Give one of your equipment cards to another character. If you have no equipment cards, you receive 1 point of damage.',
      color: CardType.Black,
      isEquip: false
    },
    {
      id: 'b-dynamite',
      title: 'Dynamite',
      desc: 'Roll 2 dice and give 3 points of damage to all characters in the area designated by the total number rolled (nothing happens if a 7 is rolled).',
      color: CardType.Black,
      isEquip: false
    },
    {
      id: 'b-doll',
      title: 'Spiritual Doll',
      desc: 'Pick a character and roll the 6-sided die. If the die number is 1 to 4, you give 3 points of damage to that character. If the die number is 5 or 6, you get 3 points of damage.',
      color: CardType.Black,
      isEquip: false
    }
  ];
}

export function createHermitCards(): CardDef[] {
  return [
    {
      id: 'h-blackmail-1',
      title: "Hermit's Blackmail",
      desc: "I bet you're either a Neutral or a Hunter. If so, you must either give an Equipment card to the current player or receive 1 damage!",
      color: CardType.Hermit,
      isEquip: false
    },
    {
      id: 'h-blackmail-2',
      title: "Hermit's Blackmail",
      desc: "I bet you're either a Neutral or a Hunter. If so, you must either give an Equipment card to the current player or receive 1 damage!",
      color: CardType.Hermit,
      isEquip: false
    },
    {
      id: 'h-greed-1',
      title: "Hermit's Greed",
      desc: "I bet you're either a Neutral or a Shadow. If so, you must either give an Equipment card to the current player or receive 1 damage!",
      color: CardType.Hermit,
      isEquip: false
    },
    {
      id: 'h-greed-2',
      title: "Hermit's Greed",
      desc: "I bet you're either a Neutral or a Shadow. If so, you must either give an Equipment card to the current player or receive 1 damage!",
      color: CardType.Hermit,
      isEquip: false
    },
    {
      id: 'h-anger-1',
      title: "Hermit's Anger",
      desc: "I bet you're either a Hunter or a Shadow. If so, you must either give an Equipment card to the current player or receive 1 damage!",
      color: CardType.Hermit,
      isEquip: false
    },
    {
      id: 'h-anger-2',
      title: "Hermit's Anger",
      desc: "I bet you're either a Hunter or a Shadow. If so, you must either give an Equipment card to the current player or receive 1 damage!",
      color: CardType.Hermit,
      isEquip: false
    },
    {
      id: 'h-slap-1',
      title: "Hermit's Slap",
      desc: "I bet you're a Hunter. If so, you receive 1 damage!",
      color: CardType.Hermit,
      isEquip: false
    },
    {
      id: 'h-slap-2',
      title: "Hermit's Slap",
      desc: "I bet you're a Hunter. If so, you receive 1 damage!",
      color: CardType.Hermit,
      isEquip: false
    },
    {
      id: 'h-spell',
      title: "Hermit's Spell",
      desc: "I bet you're a Shadow. If so, you receive 1 damage!",
      color: CardType.Hermit,
      isEquip: false
    },
    {
      id: 'h-exorcism',
      title: "Hermit's Exorcism",
      desc: "I bet you're a Shadow. If so, you receive 2 damage!",
      color: CardType.Hermit,
      isEquip: false
    },
    {
      id: 'h-nurturance',
      title: "Hermit's Nurturance",
      desc: "I bet you're a Neutral. If so, you heal 1 damage! (However, if you have no damage, then you receive 1 damage!)",
      color: CardType.Hermit,
      isEquip: false
    },
    {
      id: 'h-aid',
      title: "Hermit's Aid",
      desc: "I bet you're a Hunter. If so, you heal 1 damage! (However, if you have no damage, then you receive 1 damage!)",
      color: CardType.Hermit,
      isEquip: false
    },
    {
      id: 'h-huddle',
      title: "Hermit's Huddle",
      desc: "I bet you're a Shadow. If so, you heal 1 damage! (However, if you have no damage, then you receive 1 damage!)",
      color: CardType.Hermit,
      isEquip: false
    },
    {
      id: 'h-lesson',
      title: "Hermit's Lesson",
      desc: "I bet your maximum HP is 12 or more. If so, you receive 2 damage!",
      color: CardType.Hermit,
      isEquip: false
    },
    {
      id: 'h-bully',
      title: "Hermit's Bully",
      desc: "I bet your maximum HP is 11 or less. If so, you receive 1 damage!",
      color: CardType.Hermit,
      isEquip: false
    },
    {
      id: 'h-prediction',
      title: "Hermit's Prediction",
      desc: 'You must reveal your character information secretly to the current player!',
      color: CardType.Hermit,
      isEquip: false
    }
  ];
}
