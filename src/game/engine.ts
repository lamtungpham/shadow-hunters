import {
  Alleg,
  CardDef,
  CardType,
  DiceRollResult,
  DrawnCardDisplay,
  LogMessage,
  PlayerData,
  PlayerState,
  ZoneState,
  ActionPrompt
} from '../types/game';
import { ALL_CHARACTERS } from './characters';
import { createBlackCards, createHermitCards, createWhiteCards } from './cards';
import { ALL_AREAS, shuffleZones } from './areas';
import { ALLEGIANCE_COUNTS, PLAYER_COLORS, TEXT_COLORS } from './constants';

export class GameEngine {
  public players: PlayerData[] = [];
  public turnOrder: PlayerData[] = [];
  public currentTurnIndex = 0;
  public roundCount = 0;
  public zones: ZoneState[] = [];
  public whiteDeck: CardDef[] = [];
  public whiteDiscard: CardDef[] = [];
  public blackDeck: CardDef[] = [];
  public blackDiscard: CardDef[] = [];
  public hermitDeck: CardDef[] = [];
  public hermitDiscard: CardDef[] = [];
  public logs: LogMessage[] = [];
  public gameOver = false;
  public winners: PlayerData[] = [];
  public lastDiceRoll: DiceRollResult | null = null;
  public drawnCardDisplay: DrawnCardDisplay | null = null;
  public currentPrompt: ActionPrompt | null = null;
  public revealedSecretPlayer: PlayerData | null = null;

  private onStateChange: () => void;
  private pendingResolver: ((value: string) => void) | null = null;

  constructor(onStateChange: () => void) {
    this.onStateChange = onStateChange;
  }

  public notify() {
    this.onStateChange();
  }

  public addLog(segments: { text: string; color?: string }[]) {
    const formatted = segments.map(s => ({
      text: s.text,
      color: s.color || TEXT_COLORS.server
    }));
    this.logs.push({
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      segments: formatted
    });
    this.notify();
  }

  public addSimpleLog(text: string, color = TEXT_COLORS.server) {
    this.addLog([{ text, color }]);
  }

  public logGameEvent(template: string, args: (string | number)[]) {
    const segments: { text: string; color: string }[] = [];
    const parts = template.split('{}');

    for (let i = 0; i < parts.length; i++) {
      if (parts[i]) {
        segments.push({ text: parts[i], color: TEXT_COLORS.server });
      }
      if (i < args.length) {
        const arg = args[i];
        let color = TEXT_COLORS.number;
        if (typeof arg === 'string') {
          const player = this.players.find(p => p.name === arg);
          if (player) {
            color = player.color;
          } else if (TEXT_COLORS[arg]) {
            color = TEXT_COLORS[arg];
          } else if (arg.includes('Hermit')) {
            color = TEXT_COLORS.Green;
          } else if (ALL_AREAS.some(a => a.name === arg)) {
            color = TEXT_COLORS[arg] || TEXT_COLORS.server;
          }
        }
        segments.push({ text: String(arg), color });
      }
    }
    this.addLog(segments);
  }

  public rollD4(): number {
    return Math.floor(Math.random() * 4) + 1;
  }

  public rollD6(): number {
    return Math.floor(Math.random() * 6) + 1;
  }

  public initializeGame(humanName: string, totalPlayers: number) {
    const playerCount = Math.max(4, Math.min(8, totalPlayers));
    this.whiteDeck = createWhiteCards().sort(() => Math.random() - 0.5);
    this.blackDeck = createBlackCards().sort(() => Math.random() - 0.5);
    this.hermitDeck = createHermitCards().sort(() => Math.random() - 0.5);
    this.whiteDiscard = [];
    this.blackDiscard = [];
    this.hermitDiscard = [];
    this.zones = shuffleZones();
    this.gameOver = false;
    this.winners = [];
    this.roundCount = 0;
    this.logs = [];

    // Filter characters (Bob1 for <=6, Bob2 for >=7)
    let availableChars = ALL_CHARACTERS.filter(c => {
      if (playerCount <= 6 && c.resourceId === 'bob2') return false;
      if (playerCount > 6 && c.resourceId === 'bob1') return false;
      return true;
    });

    const counts = ALLEGIANCE_COUNTS[playerCount];
    const pickedChars: typeof availableChars = [];

    const getCharsForAlleg = (alleg: Alleg, count: number) => {
      const filtered = availableChars.filter(c => c.alleg === alleg).sort(() => Math.random() - 0.5);
      return filtered.slice(0, count);
    };

    pickedChars.push(...getCharsForAlleg(Alleg.Hunter, counts.Hunter));
    pickedChars.push(...getCharsForAlleg(Alleg.Neutral, counts.Neutral));
    pickedChars.push(...getCharsForAlleg(Alleg.Shadow, counts.Shadow));
    pickedChars.sort(() => Math.random() - 0.5);

    const players: PlayerData[] = [];
    const colors = [...PLAYER_COLORS];

    // Player 1: Human
    const humanColor = colors.shift()!;
    players.push({
      id: 'p1',
      name: humanName || 'Player 1',
      socketId: 'sock_1',
      color: humanColor.hex,
      colorName: humanColor.name,
      isAi: false,
      character: pickedChars.pop()!,
      state: PlayerState.Hidden,
      damage: 0,
      location: null,
      equipment: [],
      specialActive: false,
      specialUsed: false,
      modifiers: {}
    });

    // AI Bots
    for (let i = 2; i <= playerCount; i++) {
      const color = colors.shift()!;
      players.push({
        id: `p${i}`,
        name: `CPU_${i - 1}`,
        socketId: `sock_${i}`,
        color: color.hex,
        colorName: color.name,
        isAi: true,
        character: pickedChars.pop()!,
        state: PlayerState.Hidden,
        damage: 0,
        location: null,
        equipment: [],
        specialActive: false,
        specialUsed: false,
        modifiers: {}
      });
    }

    this.players = players;
    this.turnOrder = [...players].sort(() => Math.random() - 0.5);
    this.currentTurnIndex = 0;

    this.addSimpleLog('Game initialized with ' + playerCount + ' players.', '#C8C8C8');
    this.logGameEvent('Players: {}', [this.turnOrder.map(p => p.name).join(', ')]);

    this.notify();
    this.startTurn();
  }

  public getCurrentPlayer(): PlayerData {
    return this.turnOrder[this.currentTurnIndex];
  }

  public getLivePlayers(filterFn: (p: PlayerData) => boolean = () => true): PlayerData[] {
    return this.players.filter(p => p.state !== PlayerState.Dead && filterFn(p));
  }

  public getDeadPlayers(filterFn: (p: PlayerData) => boolean = () => true): PlayerData[] {
    return this.players.filter(p => p.state === PlayerState.Dead && filterFn(p));
  }

  public getPlayersAt(locationName: string): PlayerData[] {
    return this.getLivePlayers(p => p.location === locationName);
  }

  public checkWinConditions(tell = true): PlayerData[] {
    if (this.gameOver && this.winners.length > 0) return this.winners;

    const liveHunters = this.getLivePlayers(p => p.character.alleg === Alleg.Hunter);
    const deadNeutrals = this.getDeadPlayers(p => p.character.alleg === Alleg.Neutral);
    const liveShadows = this.getLivePlayers(p => p.character.alleg === Alleg.Shadow);

    const winners: PlayerData[] = [];

    // Shadows win if all hunters dead OR >= 3 neutrals dead
    if (liveHunters.length === 0 || deadNeutrals.length >= 3) {
      this.players.filter(p => p.character.alleg === Alleg.Shadow).forEach(p => {
        if (!winners.includes(p)) winners.push(p);
      });
    }

    // Hunters win if all shadows dead
    if (liveShadows.length === 0) {
      this.players.filter(p => p.character.alleg === Alleg.Hunter).forEach(p => {
        if (!winners.includes(p)) winners.push(p);
      });
    }

    // Bob wins if 5 or more equipment cards
    for (const p of this.getLivePlayers()) {
      if (p.character.name === 'Bob' && p.equipment.length >= 5) {
        if (!winners.includes(p)) winners.push(p);
      }
    }

    // Catherine wins if first to die OR one of last two alive
    for (const p of this.players) {
      if (p.character.name === 'Catherine') {
        const firstToDie = p.state === PlayerState.Dead && this.getDeadPlayers().length === 1;
        const lastTwo = p.state !== PlayerState.Dead && this.getLivePlayers().length <= 2;
        if (firstToDie || lastTwo) {
          if (!winners.includes(p)) winners.push(p);
        }
      }
    }

    // Allie wins if alive when game ends
    if (winners.length > 0) {
      this.gameOver = true;
      for (const p of this.getLivePlayers()) {
        if (p.character.name === 'Allie') {
          if (!winners.includes(p)) winners.push(p);
        }
      }

      if (tell && winners.length > 0) {
        this.winners = winners;
        for (const w of winners) {
          this.logGameEvent('{} ({}: {}) won! {}', [
            w.name,
            w.character.alleg,
            w.character.name,
            w.character.winCondDesc
          ]);
        }
      }
    }

    this.notify();
    return winners;
  }

  public async askPlayer(player: PlayerData, type: 'confirm' | 'yesno' | 'select', prompt: string, options: string[], title?: string): Promise<string> {
    if (player.isAi) {
      // Simulate bot decision
      await new Promise(r => setTimeout(r, 600));
      if (options.includes('Decline') && options.length > 1 && Math.random() > 0.15) {
        const nonDecline = options.filter(o => o !== 'Decline');
        return nonDecline[Math.floor(Math.random() * nonDecline.length)];
      }
      return options[Math.floor(Math.random() * options.length)];
    }

    return new Promise(resolve => {
      this.pendingResolver = resolve;
      this.currentPrompt = {
        id: Math.random().toString(36).substring(2, 9),
        playerId: player.id,
        playerName: player.name,
        type,
        title,
        prompt,
        options
      };
      this.notify();
    });
  }

  public answerPrompt(value: string) {
    if (this.pendingResolver) {
      const resolver = this.pendingResolver;
      this.pendingResolver = null;
      this.currentPrompt = null;
      this.notify();
      resolver(value);
    }
  }

  public revealPlayer(player: PlayerData) {
    if (player.state === PlayerState.Revealed) return;
    player.state = PlayerState.Revealed;
    this.logGameEvent('{} revealed their identity as {} ({})!', [
      player.name,
      player.character.name,
      player.character.alleg
    ]);
    this.notify();
  }

  public async activateSpecial(player: PlayerData) {
    if (player.modifiers.voided || player.specialUsed) {
      this.addSimpleLog(`${player.name}'s special ability is void or already used.`);
      return;
    }

    this.revealPlayer(player);
    player.specialActive = true;
    const charName = player.character.name;

    if (charName === 'Allie') {
      player.damage = 0;
      player.specialUsed = true;
      this.logGameEvent("{} ({}) used their special ability: fully healed damage!", [player.name, charName]);
    } else if (charName === 'George') {
      player.specialUsed = true;
      const target = await this.choosePlayer(player, false);
      if (target) {
        const roll = this.rollD4();
        this.logGameEvent("{} rolled a {} with the 4-sided die!", [player.name, roll]);
        this.dealDamage(target, roll, player);
        this.logGameEvent("{}'s Hammer dealt {} damage to {}!", [player.name, roll, target.name]);
      }
    } else if (charName === 'Fu-ka') {
      player.specialUsed = true;
      const target = await this.choosePlayer(player, true);
      if (target) {
        target.damage = 7;
        this.logGameEvent("{} set {}'s damage to 7!", [player.name, target.name]);
      }
    } else if (charName === 'Franklin') {
      player.specialUsed = true;
      const target = await this.choosePlayer(player, false);
      if (target) {
        const roll = this.rollD6();
        this.logGameEvent("{} rolled a {} with the 6-sided die!", [player.name, roll]);
        this.dealDamage(target, roll, player);
        this.logGameEvent("{}'s Lightning dealt {} damage to {}!", [player.name, roll, target.name]);
      }
    } else if (charName === 'Ellen') {
      player.specialUsed = true;
      const target = await this.choosePlayer(player, false);
      if (target) {
        target.modifiers.voided = true;
        target.modifiers.specialUsed = true;
        this.logGameEvent("{} permanently voided {}'s special ability!", [player.name, target.name]);
      }
    } else if (charName === 'Valkyrie') {
      player.modifiers.attackDiceType = { four: true, six: false };
      player.modifiers.specialActive = true;
      this.logGameEvent("{} ({}) uses 4-sided die to attack!", [player.name, charName]);
    } else if (charName === 'Vampire') {
      player.modifiers.damageDealtFn = true;
      player.modifiers.specialActive = true;
      this.logGameEvent("{} ({}) heals 2 damage whenever inflicting damage!", [player.name, charName]);
    } else if (charName === 'Werewolf') {
      player.modifiers.counterattack = true;
      player.modifiers.specialActive = true;
      this.logGameEvent("{} ({}) can counterattack immediately when attacked!", [player.name, charName]);
    }

    this.checkWinConditions();
    this.notify();
  }

  public async startTurn() {
    if (this.gameOver) return;

    const current = this.getCurrentPlayer();
    if (current.state === PlayerState.Dead) {
      this.endTurn();
      return;
    }

    this.logGameEvent("It's {}'s turn!", [current.name]);

    // Guardian Angel wears off
    if (current.modifiers.guardianAngel) {
      this.logGameEvent("The effect of {}'s Guardian Angel wore off!", [current.name]);
      delete current.modifiers.guardianAngel;
    }

    // Catherine passive heal at start of turn
    if (current.character.name === 'Catherine' && current.state === PlayerState.Revealed && !current.modifiers.voided) {
      if (current.damage > 0) {
        current.damage = Math.max(0, current.damage - 1);
        this.logGameEvent("{}'s passive healed 1 damage!", [current.name]);
      }
    }

    // Ultra Soul passive check
    if (current.character.name === 'Ultra Soul' && current.state === PlayerState.Revealed && !current.modifiers.voided) {
      const atUg = this.getPlayersAt('Underworld Gate').filter(p => p.id !== current.id);
      if (atUg.length > 0) {
        const choice = await this.askPlayer(
          current,
          'select',
          'Use Murder Ray to deal 3 damage to a player at Underworld Gate?',
          [...atUg.map(p => p.name), 'Decline']
        );
        if (choice !== 'Decline') {
          const target = atUg.find(p => p.name === choice);
          if (target) {
            this.dealDamage(target, 3, current);
            this.logGameEvent("{}'s Murder Ray gave {} 3 damage!", [current.name, target.name]);
          }
        }
      }
    }

    // AI bot reveal check
    if (current.isAi && current.state === PlayerState.Hidden) {
      const revealChance = Math.min(0.8, this.roundCount / 12);
      if (Math.random() < revealChance) {
        await this.activateSpecial(current);
      }
    }

    if (this.checkWinConditions().length > 0 || (current.state as number) === PlayerState.Dead) {
      this.endTurn();
      return;
    }

    await this.movementPhase(current);
    if (this.checkWinConditions().length > 0 || (current.state as number) === PlayerState.Dead) {
      this.endTurn();
      return;
    }

    await this.areaPhase(current);
    if (this.checkWinConditions().length > 0 || (current.state as number) === PlayerState.Dead) {
      this.endTurn();
      return;
    }

    await this.attackPhase(current);
    this.endTurn();
  }

  public async movementPhase(player: PlayerData) {
    this.logGameEvent('{} is rolling for movement...', [player.name]);

    const hasCompass = player.equipment.some(e => e.title === 'Mystic Compass');
    let roll = await this.performMovementRoll(player);

    let chosenArea: string | null = null;

    if (roll === 7) {
      this.logGameEvent('{} rolled a 7! You can move to any area.', [player.name]);
      chosenArea = await this.chooseAreaDestination(player);
    } else if (hasCompass) {
      this.logGameEvent("{}'s Mystic Compass lets them roll again!", [player.name]);
      const secondRoll = await this.performMovementRoll(player);

      if (secondRoll === 7) {
        chosenArea = await this.chooseAreaDestination(player);
      } else {
        const choice = await this.askPlayer(
          player,
          'yesno',
          'Choose which roll to use:',
          [`Use ${roll}`, `Use ${secondRoll}`]
        );
        const finalRoll = parseInt(choice.replace('Use ', ''), 10);
        chosenArea = this.getAreaNameFromRoll(finalRoll);
      }
    } else {
      chosenArea = this.getAreaNameFromRoll(roll);
    }

    if (!chosenArea) {
      chosenArea = ALL_AREAS[0].name;
    }

    player.location = chosenArea;
    this.logGameEvent('{} moves to {}!', [player.name, chosenArea]);
    this.notify();
  }

  private async performMovementRoll(player: PlayerData): Promise<number> {
    if (!player.isAi) {
      await this.askPlayer(player, 'confirm', 'Roll the dice to move!', ['Roll the dice!']);
    } else {
      await new Promise(r => setTimeout(r, 400));
    }

    let d4 = this.rollD4();
    let d6 = this.rollD6();
    let total = d4 + d6;

    // Must re-roll if lands on same area
    while (player.location && total !== 7 && this.getAreaNameFromRoll(total) === player.location) {
      this.logGameEvent("The {} must be re-rolled because {} is already at {}...", [total, player.name, player.location]);
      d4 = this.rollD4();
      d6 = this.rollD6();
      total = d4 + d6;
    }

    this.lastDiceRoll = {
      die4: d4,
      die6: d6,
      total,
      diff: Math.abs(d6 - d4),
      type: 'movement',
      source: player.name
    };

    this.logGameEvent('{} rolled a {} (D4: {}, D6: {})!', [player.name, total, d4, d6]);
    this.notify();
    return total;
  }

  public getAreaNameFromRoll(roll: number): string {
    const found = ALL_AREAS.find(a => a.domain.includes(roll));
    return found ? found.name : ALL_AREAS[0].name;
  }

  private async chooseAreaDestination(player: PlayerData): Promise<string> {
    const valid = ALL_AREAS.filter(a => a.name !== player.location).map(a => a.name);
    return await this.askPlayer(player, 'select', 'Select an area to move to:', valid);
  }

  public async areaPhase(player: PlayerData) {
    if (!player.location) return;
    const currentArea = ALL_AREAS.find(a => a.name === player.location);
    if (!currentArea) return;

    const answer = await this.askPlayer(
      player,
      'yesno',
      `Take action at ${currentArea.name}?`,
      [currentArea.desc, 'Decline']
    );

    if (answer === 'Decline') {
      this.logGameEvent('{} declined to perform their area action.', [player.name]);
      return;
    }

    switch (currentArea.name) {
      case "Hermit's Cabin":
        await this.drawCard(player, CardType.Hermit);
        break;

      case 'Church':
        await this.drawCard(player, CardType.White);
        break;

      case 'Cemetery':
        await this.drawCard(player, CardType.Black);
        break;

      case 'Underworld Gate': {
        const deckChoice = await this.askPlayer(
          player,
          'select',
          'Underworld Gate: choose a deck to draw from:',
          ['Draw White Card', 'Draw Black Card', 'Draw Hermit Card']
        );
        if (deckChoice === 'Draw White Card') await this.drawCard(player, CardType.White);
        else if (deckChoice === 'Draw Black Card') await this.drawCard(player, CardType.Black);
        else await this.drawCard(player, CardType.Hermit);
        break;
      }

      case 'Weird Woods': {
        const target = await this.choosePlayer(player, true);
        if (target) {
          const action = await this.askPlayer(
            player,
            'select',
            'Weird Woods: Heal 1 or give 2 damage?',
            ['Heal 1 damage', 'Give 2 damage']
          );
          if (action === 'Heal 1 damage') {
            target.damage = Math.max(0, target.damage - 1);
            this.logGameEvent('The power of the Weird Woods healed {}!', [target.name]);
          } else {
            if (target.equipment.some(e => e.title === 'Fortune Brooch')) {
              this.logGameEvent("{}'s Fortune Brooch protected them from damage!", [target.name]);
            } else {
              this.dealDamage(target, 2, player);
              this.logGameEvent('The power of the Weird Woods damaged {} for 2!', [target.name]);
            }
          }
        }
        break;
      }

      case 'Erstwhile Altar': {
        const playersWithEquip = this.getLivePlayers(p => p.id !== player.id && p.equipment.length > 0);
        if (playersWithEquip.length === 0) {
          this.addSimpleLog(`Nobody has any items for ${player.name} to steal.`);
        } else {
          const target = await this.choosePlayer(player, false, p => p.equipment.length > 0);
          if (target && target.equipment.length > 0) {
            const eqTitle = await this.askPlayer(
              player,
              'select',
              `Select equipment to steal from ${target.name}:`,
              target.equipment.map(e => e.title)
            );
            const idx = target.equipment.findIndex(e => e.title === eqTitle);
            if (idx >= 0) {
              const [stolen] = target.equipment.splice(idx, 1);
              player.equipment.push(stolen);
              this.logGameEvent('{} stole {} from {}!', [player.name, stolen.title, target.name]);
            }
          }
        }
        break;
      }
    }
  }

  public async drawCard(player: PlayerData, type: CardType) {
    let deck: CardDef[];
    let discard: CardDef[];

    if (type === CardType.White) {
      deck = this.whiteDeck;
      discard = this.whiteDiscard;
    } else if (type === CardType.Black) {
      deck = this.blackDeck;
      discard = this.blackDiscard;
    } else {
      deck = this.hermitDeck;
      discard = this.hermitDiscard;
    }

    if (deck.length === 0) {
      if (discard.length === 0) {
        this.addSimpleLog(`The ${type} deck is empty!`);
        return;
      }
      deck.push(...discard.sort(() => Math.random() - 0.5));
      discard.length = 0;
    }

    const card = deck.pop()!;
    const isHermit = card.color === CardType.Hermit;

    this.drawnCardDisplay = {
      card,
      drawnBy: player.name,
      isPrivate: isHermit,
      targetPlayerId: player.id
    };
    this.notify();

    if (!isHermit) {
      this.logGameEvent('{} drew {}!', [player.name, card.title]);
    } else {
      this.logGameEvent('{} drew a Hermit Card!', [player.name]);
    }

    if (!player.isAi) {
      await this.askPlayer(player, 'confirm', `You drew: ${card.title}`, ['Continue']);
    } else {
      await new Promise(r => setTimeout(r, 600));
    }

    if (card.isEquip) {
      player.equipment.push(card);
      this.logGameEvent('{} added {} to their arsenal!', [player.name, card.title]);
      this.drawnCardDisplay = null;
      this.notify();
    } else {
      this.drawnCardDisplay = null;
      this.notify();
      if (isHermit) {
        await this.handleHermitCard(player, card);
        this.hermitDiscard.push(card);
      } else {
        await this.handleSingleUseCard(player, card);
        if (type === CardType.White) this.whiteDiscard.push(card);
        else this.blackDiscard.push(card);
      }
    }
  }

  public async handleHermitCard(drawer: PlayerData, card: CardDef) {
    const target = await this.choosePlayer(drawer, false);
    if (!target) return;

    this.logGameEvent('{} gave Hermit card secretly to {}!', [drawer.name, target.name]);

    // Show card to target if human
    if (!target.isAi) {
      this.drawnCardDisplay = {
        card,
        drawnBy: drawer.name,
        isPrivate: true,
        targetPlayerId: target.id
      };
      this.notify();
      await this.askPlayer(target, 'confirm', `Hermit Card from ${drawer.name}: ${card.title}`, ['View Card']);
      this.drawnCardDisplay = null;
      this.notify();
    }

    const char = target.character;
    let applies = false;
    let damageEffect = 0; // negative is take damage, positive is heal
    let canGiveEquip = false;

    if (card.title.includes('Blackmail')) {
      applies = char.alleg === Alleg.Hunter || char.alleg === Alleg.Neutral;
      damageEffect = -1;
      canGiveEquip = true;
    } else if (card.title.includes('Greed')) {
      applies = char.alleg === Alleg.Shadow || char.alleg === Alleg.Neutral;
      damageEffect = -1;
      canGiveEquip = true;
    } else if (card.title.includes('Anger')) {
      applies = char.alleg === Alleg.Hunter || char.alleg === Alleg.Shadow;
      damageEffect = -1;
      canGiveEquip = true;
    } else if (card.title.includes('Slap')) {
      applies = char.alleg === Alleg.Hunter;
      damageEffect = -1;
    } else if (card.title.includes('Spell')) {
      applies = char.alleg === Alleg.Shadow;
      damageEffect = -1;
    } else if (card.title.includes('Exorcism')) {
      applies = char.alleg === Alleg.Shadow;
      damageEffect = -2;
    } else if (card.title.includes('Nurturance')) {
      applies = char.alleg === Alleg.Neutral;
      damageEffect = target.damage > 0 ? 1 : -1;
    } else if (card.title.includes('Aid')) {
      applies = char.alleg === Alleg.Hunter;
      damageEffect = target.damage > 0 ? 1 : -1;
    } else if (card.title.includes('Huddle')) {
      applies = char.alleg === Alleg.Shadow;
      damageEffect = target.damage > 0 ? 1 : -1;
    } else if (card.title.includes('Lesson')) {
      applies = char.maxDamage >= 12;
      damageEffect = -2;
    } else if (card.title.includes('Bully')) {
      applies = char.maxDamage <= 11;
      damageEffect = -1;
    } else if (card.title.includes('Prediction')) {
      applies = true;
      this.logGameEvent('{} secretly reveals identity to {}!', [target.name, drawer.name]);
      if (!drawer.isAi) {
        this.revealedSecretPlayer = target;
        this.notify();
        await this.askPlayer(
          drawer,
          'confirm',
          `${target.name} is ${target.character.name} (${target.character.alleg})!`,
          ['Understood']
        );
        this.revealedSecretPlayer = null;
        this.notify();
      }
      return;
    }

    if (applies) {
      if (canGiveEquip && target.equipment.length > 0) {
        const choice = await this.askPlayer(
          target,
          'yesno',
          'Hermit effect applies to you! Choose action:',
          ['Give an equipment card', `Receive ${Math.abs(damageEffect)} damage`]
        );
        if (choice === 'Give an equipment card') {
          const eqTitle = await this.askPlayer(
            target,
            'select',
            'Select equipment card to forfeit:',
            target.equipment.map(e => e.title)
          );
          const idx = target.equipment.findIndex(e => e.title === eqTitle);
          if (idx >= 0) {
            const [given] = target.equipment.splice(idx, 1);
            drawer.equipment.push(given);
            this.logGameEvent('{} forfeited {} to {}!', [target.name, given.title, drawer.name]);
            return;
          }
        }
      }

      if (damageEffect < 0) {
        this.dealDamage(target, Math.abs(damageEffect), drawer);
        this.logGameEvent('{} took {} damage from the Hermit!', [target.name, Math.abs(damageEffect)]);
      } else if (damageEffect > 0) {
        target.damage = Math.max(0, target.damage - damageEffect);
        this.logGameEvent('{} healed {} damage from the Hermit!', [target.name, damageEffect]);
      }
    } else {
      if (!target.isAi) {
        await this.askPlayer(target, 'confirm', "Card doesn't apply to you. Do nothing.", ['Do nothing']);
      }
      this.logGameEvent('{} did nothing.', [target.name]);
    }
  }

  public async handleSingleUseCard(player: PlayerData, card: CardDef) {
    switch (card.title) {
      case 'First Aid': {
        const target = await this.choosePlayer(player, true);
        if (target) {
          target.damage = 7;
          this.logGameEvent('{} placed {}\'s damage marker to 7!', [player.name, target.name]);
        }
        break;
      }

      case 'Flare of Judgement': {
        this.logGameEvent('{} unleashed Flare of Judgement!', [player.name]);
        for (const p of this.getLivePlayers(p => p.id !== player.id)) {
          this.dealDamage(p, 2, player);
        }
        break;
      }

      case 'Holy Water of Healing': {
        player.damage = Math.max(0, player.damage - 2);
        this.logGameEvent('{} healed 2 damage with Holy Water!', [player.name]);
        break;
      }

      case 'Advent': {
        if (player.character.alleg === Alleg.Hunter) {
          const opts = player.state === PlayerState.Hidden ? ['Reveal and heal fully', 'Do nothing'] : ['Heal fully', 'Do nothing'];
          const ans = await this.askPlayer(player, 'yesno', 'Advent card effect:', opts);
          if (ans.includes('heal')) {
            this.revealPlayer(player);
            player.damage = 0;
            this.logGameEvent('{} used Advent and healed fully!', [player.name]);
          } else {
            this.logGameEvent('{} did nothing.', [player.name]);
          }
        } else {
          this.logGameEvent('{} did nothing with Advent.', [player.name]);
        }
        break;
      }

      case 'Disenchant Mirror': {
        if (player.character.alleg === Alleg.Shadow) {
          this.revealPlayer(player);
          this.logGameEvent('{} was forced to reveal by Disenchant Mirror!', [player.name]);
        } else {
          this.logGameEvent('{} did nothing with Disenchant Mirror.', [player.name]);
        }
        break;
      }

      case 'Blessing': {
        const target = await this.choosePlayer(player, false);
        if (target) {
          const roll = this.rollD6();
          target.damage = Math.max(0, target.damage - roll);
          this.logGameEvent('{} blessed {} for {} healing (rolled {})!', [player.name, target.name, roll, roll]);
        }
        break;
      }

      case 'Chocolate': {
        const eligible = ['Allie', 'Ellen', 'Ultra Soul'];
        if (eligible.includes(player.character.name)) {
          const opts = player.state === PlayerState.Hidden ? ['Reveal and heal fully', 'Do nothing'] : ['Heal fully', 'Do nothing'];
          const ans = await this.askPlayer(player, 'yesno', 'Chocolate card effect:', opts);
          if (ans.includes('heal')) {
            this.revealPlayer(player);
            player.damage = 0;
            this.logGameEvent('{} ate Chocolate and healed fully!', [player.name]);
          }
        } else {
          this.logGameEvent('{} did nothing with Chocolate.', [player.name]);
        }
        break;
      }

      case 'Concealed Knowledge': {
        // Insert current player right after current turn
        this.turnOrder.splice(this.currentTurnIndex + 1, 0, player);
        this.logGameEvent('{} will take another turn immediately after this one!', [player.name]);
        break;
      }

      case 'Guardian Angel': {
        player.modifiers.guardianAngel = true;
        this.logGameEvent('{} summoned a Guardian Angel!', [player.name]);
        break;
      }

      case 'Bloodthirsty Spider': {
        const target = await this.choosePlayer(player, false);
        if (target) {
          if (target.equipment.some(e => e.title === 'Talisman')) {
            this.logGameEvent("{}'s Talisman protected them from damage!", [target.name]);
          } else {
            this.dealDamage(target, 2, player);
          }
          this.dealDamage(player, 2, player);
        }
        break;
      }

      case 'Vampire Bat': {
        const target = await this.choosePlayer(player, false);
        if (target) {
          if (target.equipment.some(e => e.title === 'Talisman')) {
            this.logGameEvent("{}'s Talisman protected them from damage!", [target.name]);
          } else {
            this.dealDamage(target, 2, player);
            player.damage = Math.max(0, player.damage - 1);
            this.logGameEvent('{} healed 1 damage from Vampire Bat!', [player.name]);
          }
        }
        break;
      }

      case 'Moody Goblin': {
        const withEquip = this.getLivePlayers(p => p.id !== player.id && p.equipment.length > 0);
        if (withEquip.length === 0) {
          this.addSimpleLog(`Nobody has equipment for ${player.name} to steal.`);
        } else {
          const target = await this.choosePlayer(player, false, p => p.equipment.length > 0);
          if (target && target.equipment.length > 0) {
            const eqTitle = await this.askPlayer(
              player,
              'select',
              `Select equipment to steal from ${target.name}:`,
              target.equipment.map(e => e.title)
            );
            const idx = target.equipment.findIndex(e => e.title === eqTitle);
            if (idx >= 0) {
              const [stolen] = target.equipment.splice(idx, 1);
              player.equipment.push(stolen);
              this.logGameEvent('{} stole {} from {}!', [player.name, stolen.title, target.name]);
            }
          }
        }
        break;
      }

      case 'Diabolic Ritual': {
        if (player.character.alleg === Alleg.Shadow) {
          const ans = await this.askPlayer(player, 'yesno', 'Diabolic Ritual:', ['Reveal and heal fully', 'Do nothing']);
          if (ans === 'Reveal and heal fully') {
            this.revealPlayer(player);
            player.damage = 0;
            this.logGameEvent('{} performed Diabolic Ritual and healed fully!', [player.name]);
          }
        } else {
          this.logGameEvent('{} did nothing with Diabolic Ritual.', [player.name]);
        }
        break;
      }

      case 'Banana Peel': {
        if (player.equipment.length > 0) {
          const choice = await this.askPlayer(player, 'yesno', 'Banana Peel effect:', ['Give an equipment card', 'Receive 1 damage']);
          if (choice === 'Give an equipment card') {
            const eqTitle = await this.askPlayer(player, 'select', 'Choose equipment to give:', player.equipment.map(e => e.title));
            const receiver = await this.choosePlayer(player, false);
            if (receiver) {
              const idx = player.equipment.findIndex(e => e.title === eqTitle);
              if (idx >= 0) {
                const [given] = player.equipment.splice(idx, 1);
                receiver.equipment.push(given);
                this.logGameEvent('{} slipped and gave {} to {}!', [player.name, given.title, receiver.name]);
              }
            }
          } else {
            this.dealDamage(player, 1, player);
          }
        } else {
          this.dealDamage(player, 1, player);
          this.logGameEvent('{} slipped on a banana peel and took 1 damage!', [player.name]);
        }
        break;
      }

      case 'Dynamite': {
        this.logGameEvent('{} lit the Dynamite fuse! Rolling for location...', [player.name]);
        const d4 = this.rollD4();
        const d6 = this.rollD6();
        const total = d4 + d6;
        this.logGameEvent('Dynamite rolled {} (D4: {}, D6: {})', [total, d4, d6]);

        if (total === 7) {
          this.addSimpleLog('Nothing happens on a 7!');
        } else {
          const destArea = this.getAreaNameFromRoll(total);
          this.logGameEvent('Dynamite exploded at {}!', [destArea]);
          for (const p of this.getPlayersAt(destArea)) {
            if (p.equipment.some(e => e.title === 'Talisman')) {
              this.logGameEvent("{}'s Talisman protected them from Dynamite!", [p.name]);
            } else {
              this.dealDamage(p, 3, player);
            }
          }
        }
        break;
      }

      case 'Spiritual Doll': {
        const target = await this.choosePlayer(player, false);
        if (target) {
          const roll = this.rollD6();
          if (roll >= 5) {
            this.dealDamage(player, 3, player);
            this.logGameEvent('Spiritual Doll backfired on {} for 3 damage (rolled {})!', [player.name, roll]);
          } else {
            this.dealDamage(target, 3, player);
            this.logGameEvent('Spiritual Doll cursed {} for 3 damage (rolled {})!', [target.name, roll]);
          }
        }
        break;
      }
    }
  }

  public async attackPhase(player: PlayerData) {
    if (!player.location) return;

    const hasMasamune = player.equipment.some(e => e.title === 'Cursed Sword Masamune');
    const hasHandgun = player.equipment.some(e => e.title === 'Handgun');
    const hasMachineGun = player.equipment.some(e => e.title === 'Machine Gun');

    const playerZone = this.zones.find(z => z.areas.some(a => a.name === player.location));
    if (!playerZone) return;

    const liveOtherPlayers = this.getLivePlayers(p => p.id !== player.id && !!p.location);
    const validTargets = liveOtherPlayers.filter(p => {
      const targetZone = this.zones.find(z => z.areas.some(a => a.name === p.location));
      if (!targetZone) return false;
      if (hasHandgun) {
        return targetZone.id !== playerZone.id;
      } else {
        return targetZone.id === playerZone.id;
      }
    });

    if (validTargets.length === 0) {
      this.addSimpleLog(`No players in attack range for ${player.name}.`);
      return;
    }

    const options = ['Attack other players!'];
    if (!hasMasamune) options.push('Decline');

    const ans = await this.askPlayer(player, 'yesno', 'Attack Phase:', options);
    if (ans === 'Decline') {
      this.logGameEvent('{} declined to attack.', [player.name]);
      return;
    }

    const targetOpts = validTargets.map(t => t.name);
    if (!hasMasamune) targetOpts.push('Decline');

    const chosenTargetName = await this.askPlayer(player, 'select', 'Choose a target to attack:', targetOpts);
    if (chosenTargetName === 'Decline') {
      this.logGameEvent('{} declined to attack.', [player.name]);
      return;
    }

    const primaryTarget = validTargets.find(t => t.name === chosenTargetName)!;
    const finalTargets = hasMachineGun ? validTargets : [primaryTarget];

    this.logGameEvent('{} is attacking {}!', [player.name, hasMachineGun ? 'everyone in attack range' : primaryTarget.name]);

    // Attack roll
    let rollResult = 0;
    if (hasMasamune || player.modifiers.attackDiceType?.six === false) {
      const d4 = this.rollD4();
      rollResult = d4;
      this.lastDiceRoll = { die4: d4, die6: 0, total: d4, diff: d4, type: 'attack', source: player.name };
      this.logGameEvent('{} rolled a {} with the 4-sided die!', [player.name, rollResult]);
    } else {
      const d4 = this.rollD4();
      const d6 = this.rollD6();
      rollResult = Math.abs(d6 - d4);
      this.lastDiceRoll = { die4: d4, die6: d6, total: d4 + d6, diff: rollResult, type: 'attack', source: player.name };
      this.logGameEvent('{} rolled a {} (D4: {}, D6: {})!', [player.name, rollResult, d4, d6]);
    }

    if (rollResult === 0) {
      this.logGameEvent("{}'s attack missed completely!", [player.name]);
      return;
    }

    // Equipment attack damage modifiers
    let bonusDamage = 0;
    if (player.equipment.some(e => e.title === 'Butcher Knife')) bonusDamage += 1;
    if (player.equipment.some(e => e.title === 'Chainsaw')) bonusDamage += 1;
    if (player.equipment.some(e => e.title === 'Rusted Broad Axe')) bonusDamage += 1;
    if (player.equipment.some(e => e.title === 'Holy Robe')) bonusDamage -= 1;
    if (player.character.alleg === Alleg.Hunter && player.state === PlayerState.Revealed && player.equipment.some(e => e.title === 'Spear of Longinus')) {
      bonusDamage += 2;
      this.logGameEvent('{} strikes with Spear of Longinus (+2 damage)!', [player.name]);
    }

    const finalDamageDealt = Math.max(1, rollResult + bonusDamage);

    for (const target of finalTargets) {
      // Bob special: if damage >= 2, can steal equipment instead of giving damage
      if (player.character.name === 'Bob' && finalDamageDealt >= 2 && target.equipment.length > 0 && player.character.resourceId === 'bob1') {
        const stealOrDmg = await this.askPlayer(
          player,
          'yesno',
          `Bob's ability: Steal equipment or deal ${finalDamageDealt} damage?`,
          ['Steal equipment', `Deal ${finalDamageDealt} damage`]
        );
        if (stealOrDmg === 'Steal equipment') {
          const eqTitle = await this.askPlayer(
            player,
            'select',
            `Select equipment to steal from ${target.name}:`,
            target.equipment.map(e => e.title)
          );
          const idx = target.equipment.findIndex(e => e.title === eqTitle);
          if (idx >= 0) {
            const [stolen] = target.equipment.splice(idx, 1);
            player.equipment.push(stolen);
            this.logGameEvent("{} stole {}'s {} instead of dealing damage!", [player.name, target.name, stolen.title]);
            continue;
          }
        }
      }

      this.dealDamage(target, finalDamageDealt, player);

      // Vampire heal 2 on damage dealt
      if (player.character.name === 'Vampire' && player.state === PlayerState.Revealed) {
        player.damage = Math.max(0, player.damage - 2);
        this.logGameEvent('{} healed 2 damage from Vampire bite!', [player.name]);
      }

      // Werewolf counterattack trigger
      if (target.character.name === 'Werewolf' && (target.state as number) === PlayerState.Revealed && (target.state as number) !== PlayerState.Dead) {
        const counter = await this.askPlayer(target, 'yesno', 'Werewolf counterattack?', ['Counterattack', 'Decline']);
        if (counter === 'Counterattack') {
          this.logGameEvent('{} is counterattacking {}!', [target.name, player.name]);
          const cd4 = this.rollD4();
          const cd6 = this.rollD6();
          const cRoll = Math.abs(cd6 - cd4);
          if (cRoll > 0) {
            this.dealDamage(player, cRoll, target);
          } else {
            this.logGameEvent('Counterattack missed!', []);
          }
        }
      }
    }
  }

  public dealDamage(target: PlayerData, amount: number, attacker: PlayerData) {
    if (target.state === PlayerState.Dead) return;

    if (target.modifiers.guardianAngel) {
      this.logGameEvent("{}'s Guardian Angel shielded them from damage!", [target.name]);
      return;
    }

    let actualDamage = amount;
    if (target.equipment.some(e => e.title === 'Holy Robe')) {
      actualDamage = Math.max(0, actualDamage - 1);
    }

    target.damage = Math.min(target.character.maxDamage, target.damage + actualDamage);
    this.logGameEvent('{} took {} damage! (Current: {}/{})', [
      target.name,
      actualDamage,
      target.damage,
      target.character.maxDamage
    ]);

    if (target.damage >= target.character.maxDamage) {
      this.killPlayer(target, attacker);
    }
    this.notify();
  }

  public killPlayer(victim: PlayerData, killer: PlayerData) {
    victim.state = PlayerState.Dead;
    this.revealPlayer(victim);
    this.logGameEvent('{} ({}: {}) has died!', [
      victim.name,
      victim.character.alleg,
      victim.character.name
    ]);

    // Equipment stealing
    if (victim.equipment.length > 0 && killer.id !== victim.id) {
      const killerHasSilverRosary = killer.equipment.some(e => e.title === 'Silver Rosary');
      const killerIsBob2 = killer.character.name === 'Bob' && killer.character.resourceId === 'bob2';

      if (killerHasSilverRosary || killerIsBob2) {
        this.logGameEvent("{} took all of {}'s equipment!", [killer.name, victim.name]);
        killer.equipment.push(...victim.equipment);
        victim.equipment = [];
      } else {
        // Killer picks 1 equipment
        const eqToTake = victim.equipment[0];
        killer.equipment.push(eqToTake);
        victim.equipment.shift();
        this.logGameEvent('{} took {} from {}!', [killer.name, eqToTake.title, victim.name]);
      }
    }

    // Remaining equipment goes to discard
    while (victim.equipment.length > 0) {
      const eq = victim.equipment.pop()!;
      if (eq.color === CardType.White) this.whiteDiscard.push(eq);
      else if (eq.color === CardType.Black) this.blackDiscard.push(eq);
    }

    this.checkWinConditions();
    this.notify();
  }

  public endTurn() {
    this.checkWinConditions();
    if (this.gameOver) return;

    this.currentTurnIndex++;
    if (this.currentTurnIndex >= this.turnOrder.length) {
      this.currentTurnIndex = 0;
      this.roundCount++;
    }

    this.notify();
    // Trigger next turn
    setTimeout(() => {
      this.startTurn();
    }, 400);
  }

  public async choosePlayer(
    chooser: PlayerData,
    includeSelf = false,
    filterFn: (p: PlayerData) => boolean = () => true
  ): Promise<PlayerData | null> {
    const valid = this.getLivePlayers(p => {
      if (!includeSelf && p.id === chooser.id) return false;
      return filterFn(p);
    });

    if (valid.length === 0) return null;

    const chosenName = await this.askPlayer(chooser, 'select', 'Choose a player:', valid.map(p => p.name));
    return valid.find(p => p.name === chosenName) || null;
  }
}
