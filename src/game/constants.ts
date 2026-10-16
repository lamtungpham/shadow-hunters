export const TEXT_COLORS: Record<string, string> = {
  server: '#C8C8C8',
  number: '#99CCFF',
  White: '#FFFFFF',
  Black: '#8C8C8C',
  Green: '#8FC200',
  Shadow: '#DD3333',
  shadow: '#DD3333',
  Neutral: '#FFE169',
  neutral: '#FFE169',
  Hunter: '#4A90E2',
  hunter: '#4A90E2',
  'Weird Woods': '#669999',
  Church: '#FFFFFF',
  Cemetery: '#8C8C8C',
  'Erstwhile Altar': '#CC4400',
  "Hermit's Cabin": '#8FC200',
  'Underworld Gate': '#960096'
};

export const PLAYER_COLORS = [
  { name: 'white', hex: 'rgb(245,245,245)', dotSvg: '/static/gfx/whiteDot.svg', personSvg: '/static/gfx/white-person.svg' },
  { name: 'black', hex: 'rgb(100,100,100)', dotSvg: '/static/gfx/blackDot.svg', personSvg: '/static/gfx/black-person.svg' },
  { name: 'green', hex: 'rgb(79,182,78)', dotSvg: '/static/gfx/greenDot.svg', personSvg: '/static/gfx/green-person.svg' },
  { name: 'blue', hex: 'rgb(62,99,171)', dotSvg: '/static/gfx/blueDot.svg', personSvg: '/static/gfx/blue-person.svg' },
  { name: 'pink', hex: 'rgb(197,97,163)', dotSvg: '/static/gfx/pinkDot.svg', personSvg: '/static/gfx/pink-person.svg' },
  { name: 'red', hex: 'rgb(219,62,62)', dotSvg: '/static/gfx/redDot.svg', personSvg: '/static/gfx/red-person.svg' },
  { name: 'yellow', hex: 'rgb(249,234,48)', dotSvg: '/static/gfx/yellowDot.svg', personSvg: '/static/gfx/yellow-person.svg' },
  { name: 'orange', hex: 'rgb(239,136,43)', dotSvg: '/static/gfx/orangeDot.svg', personSvg: '/static/gfx/orange-person.svg' }
];

export const ALLEGIANCE_COUNTS: Record<number, { Hunter: number; Neutral: number; Shadow: number }> = {
  4: { Hunter: 2, Neutral: 0, Shadow: 2 },
  5: { Hunter: 2, Neutral: 1, Shadow: 2 },
  6: { Hunter: 2, Neutral: 2, Shadow: 2 },
  7: { Hunter: 2, Neutral: 3, Shadow: 2 },
  8: { Hunter: 3, Neutral: 2, Shadow: 3 }
};
