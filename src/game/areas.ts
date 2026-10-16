import { AreaDef, ZoneState } from '../types/game';

export const ALL_AREAS: AreaDef[] = [
  {
    name: "Hermit's Cabin",
    desc: 'Draw a Hermit Card.',
    domain: [2, 3],
    resourceId: 'hermits-cabin',
    svgName: "Hermit's Cabin"
  },
  {
    name: 'Underworld Gate',
    desc: 'Draw a card from the deck of your choice.',
    domain: [4, 5],
    resourceId: 'underworld-gate',
    svgName: 'Underworld Gate'
  },
  {
    name: 'Church',
    desc: 'Draw a White Card.',
    domain: [6],
    resourceId: 'church',
    svgName: 'Church'
  },
  {
    name: 'Cemetery',
    desc: 'Draw a Black Card.',
    domain: [8],
    resourceId: 'cemetery',
    svgName: 'Cemetery'
  },
  {
    name: 'Weird Woods',
    desc: 'Heal 1 damage or give 2 damage to any player.',
    domain: [9],
    resourceId: 'weird-woods',
    svgName: 'Weird Woods'
  },
  {
    name: 'Erstwhile Altar',
    desc: 'Steal an equipment card from any player.',
    domain: [10],
    resourceId: 'erstwhile-altar',
    svgName: 'Erstwhile Altar'
  }
];

export function shuffleZones(): ZoneState[] {
  const shuffled = [...ALL_AREAS].sort(() => Math.random() - 0.5);
  return [
    { id: 0, areas: [shuffled[0], shuffled[1]] },
    { id: 1, areas: [shuffled[2], shuffled[3]] },
    { id: 2, areas: [shuffled[4], shuffled[5]] }
  ];
}

export function getAreaSvg(name: string): string {
  switch (name) {
    case "Hermit's Cabin": return '/static/gfx/hermits_cabin.svg';
    case 'Underworld Gate': return '/static/gfx/underworld_gate.svg';
    case 'Church': return '/static/gfx/church.svg';
    case 'Cemetery': return '/static/gfx/cemetery.svg';
    case 'Weird Woods': return '/static/gfx/weird_woods.svg';
    case 'Erstwhile Altar': return '/static/gfx/erstwhile_altar.svg';
    default: return '/static/gfx/room.svg';
  }
}
