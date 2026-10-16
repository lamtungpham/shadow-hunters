export enum Alleg {
  Shadow = 'Shadow',
  Neutral = 'Neutral',
  Hunter = 'Hunter'
}

export enum CardType {
  White = 'White',
  Black = 'Black',
  Hermit = 'Hermit'
}

export enum PlayerState {
  Dead = 0,
  Revealed = 1,
  Hidden = 2
}

export interface CharacterDef {
  name: string;
  alleg: Alleg;
  maxDamage: number;
  winCondDesc: string;
  specialDesc: string;
  resourceId: string;
  minPlayers?: number;
  maxPlayers?: number;
}

export interface CardDef {
  id: string;
  title: string;
  desc: string;
  color: CardType;
  isEquip: boolean;
  resourceId?: string;
}

export interface AreaDef {
  name: string;
  desc: string;
  domain: number[];
  resourceId: string;
  svgName: string;
}

export interface ZoneState {
  id: number;
  areas: AreaDef[];
}

export interface PlayerData {
  id: string;
  name: string;
  socketId: string;
  color: string;
  colorName: string;
  isAi: boolean;
  character: CharacterDef;
  state: PlayerState;
  damage: number;
  location: string | null; // Area name
  equipment: CardDef[];
  specialActive: boolean;
  specialUsed: boolean;
  modifiers: {
    guardianAngel?: boolean;
    stealForDamage?: boolean;
    stealAllOnKill?: boolean;
    counterattack?: boolean;
    attackDiceType?: { four: boolean; six: boolean };
    specialUsed?: boolean;
    specialActive?: boolean;
    damageDealtFn?: boolean;
    voided?: boolean;
  };
}

export interface LogMessage {
  id: string;
  timestamp: number;
  segments: {
    text: string;
    color: string;
  }[];
}

export interface ActionPrompt {
  id: string;
  playerId: string;
  playerName: string;
  type: 'confirm' | 'yesno' | 'select';
  title?: string;
  prompt: string;
  options: string[];
  context?: any;
}

export interface DiceRollResult {
  die4: number;
  die6: number;
  total: number;
  diff: number;
  type: 'movement' | 'attack' | 'special' | 'dynamite';
  source: string;
}

export interface DrawnCardDisplay {
  card: CardDef;
  drawnBy: string;
  isPrivate?: boolean;
  targetPlayerId?: string;
}
