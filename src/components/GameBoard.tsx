import React from 'react';
import { PlayerData, ZoneState, PlayerState, DiceRollResult } from '../types/game';
import { getAreaSvg } from '../game/areas';

interface GameBoardProps {
  zones: ZoneState[];
  players: PlayerData[];
  currentPlayer: PlayerData;
  lastDiceRoll: DiceRollResult | null;
  onSelectArea?: (areaName: string) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  zones,
  players,
  currentPlayer,
  lastDiceRoll
}) => {
  // 6 Areas grouped into 3 zones
  return (
    <div className="relative w-full max-w-[1066px] h-[600px] mx-auto rounded-lg overflow-hidden border-2 border-[#3a3f5f] shadow-2xl bg-[#1b1c2b] select-none">
      {/* Background image */}
      <img
        src="/static/gfx/background.svg"
        alt="Game Board"
        className="absolute inset-0 w-full h-full object-cover opacity-90 pointer-events-none"
        onError={(e) => {
          // Fallback if SVG fails to load
          e.currentTarget.style.display = 'none';
        }}
      />

      {/* Top Banner / Zone 0 (Top Left / Right) & Zone 1 & Zone 2 */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4">
        {/* Zones Container */}
        <div className="grid grid-cols-3 gap-6 h-[440px] z-10">
          {zones.map((zone, zIdx) => {
            const isCurrentZone = zone.areas.some(a => a.name === currentPlayer.location);

            return (
              <div
                key={zone.id}
                className={`flex flex-col items-center justify-between p-3 rounded-xl backdrop-blur-xs transition-all duration-300 ${
                  isCurrentZone
                    ? 'border-2 border-amber-400/80 bg-amber-950/20 shadow-lg shadow-amber-500/20'
                    : 'border border-purple-500/30 bg-black/40'
                }`}
              >
                <div className="text-xs uppercase tracking-widest font-bold text-purple-300/80 px-3 py-0.5 rounded-full bg-purple-900/50">
                  Zone {zIdx + 1}
                </div>

                {/* 2 Areas per zone */}
                <div className="flex flex-col gap-3 w-full items-center my-auto">
                  {zone.areas.map(area => {
                    const playersHere = players.filter(
                      p => p.state !== PlayerState.Dead && p.location === area.name
                    );
                    const isCurrentArea = currentPlayer.location === area.name;

                    return (
                      <div
                        key={area.name}
                        className={`relative w-[210px] h-[155px] rounded-lg p-2 flex flex-col justify-between transition-transform duration-200 pointer-events-auto border ${
                          isCurrentArea
                            ? 'border-amber-400 bg-purple-900/70 scale-[1.02] shadow-md shadow-amber-500/30'
                            : 'border-[#4a4060] bg-gray-900/80 hover:border-purple-400/60'
                        }`}
                      >
                        {/* Area SVG Card Art */}
                        <div className="absolute inset-0 overflow-hidden rounded-lg opacity-40">
                          <img
                            src={getAreaSvg(area.name)}
                            alt={area.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Area Info Overlay */}
                        <div className="relative z-10 flex justify-between items-start">
                          <div className="text-xs font-bold text-white drop-shadow-md">
                            {area.name}
                          </div>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/70 text-amber-300 border border-amber-500/40">
                            Dice: {area.domain.join(', ')}
                          </span>
                        </div>

                        <div className="relative z-10 text-[10px] text-gray-200 line-clamp-2 leading-tight bg-black/60 p-1 rounded backdrop-blur-xs">
                          {area.desc}
                        </div>

                        {/* Players on this Area */}
                        <div className="relative z-10 flex flex-wrap gap-1 items-center min-h-[28px] bg-black/40 p-1 rounded">
                          {playersHere.length === 0 ? (
                            <span className="text-[10px] text-gray-500 italic">No players</span>
                          ) : (
                            playersHere.map(p => (
                              <div
                                key={p.id}
                                className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold shadow"
                                style={{
                                  backgroundColor: p.color,
                                  color: ['white', 'yellow'].includes(p.colorName) ? '#111' : '#fff'
                                }}
                                title={`${p.name} (Damage: ${p.damage}/${p.character.maxDamage})`}
                              >
                                <img
                                  src={`/static/gfx/${p.colorName}-person.svg`}
                                  alt=""
                                  className="w-3.5 h-3.5 object-contain"
                                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                                <span>{p.name}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Track / Health Bar Visualization */}
        <div className="relative z-10 bg-black/80 border border-purple-800/60 rounded-lg p-2.5 backdrop-blur-md flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-[11px] text-purple-200 font-semibold px-1">
            <span>Damage Tracker Track (0 to 14)</span>
            <span className="text-amber-400 font-mono">
              Current Turn: <strong className="underline text-white">{currentPlayer.name}</strong>
            </span>
          </div>

          <div className="grid grid-cols-15 gap-1 items-center bg-[#151224] p-1.5 rounded border border-purple-900/40">
            {Array.from({ length: 15 }).map((_, step) => {
              const playersAtDamage = players.filter(
                p => p.state !== PlayerState.Dead && p.damage === step
              );

              return (
                <div
                  key={step}
                  className="flex flex-col items-center justify-between h-[38px] border border-gray-700/40 rounded bg-gray-900/60 p-0.5"
                >
                  <span className="text-[9px] font-mono font-bold text-gray-400">{step}</span>
                  <div className="flex flex-wrap gap-0.5 justify-center items-center">
                    {playersAtDamage.map(p => (
                      <div
                        key={p.id}
                        className="w-3 h-3 rounded-full border border-black shadow"
                        style={{ backgroundColor: p.color }}
                        title={`${p.name} (${p.damage} damage)`}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Animated Dice Roll Badge */}
      {lastDiceRoll && (
        <div className="absolute top-4 right-4 z-20 flex items-center gap-3 bg-black/90 border border-amber-500/60 p-3 rounded-xl shadow-2xl backdrop-blur-md animate-fade-in pointer-events-auto">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase tracking-wide">
              {lastDiceRoll.source} ({lastDiceRoll.type})
            </span>
            <span className="text-xl font-bold text-amber-400 font-mono">
              Total: {lastDiceRoll.type === 'attack' ? `Diff: ${lastDiceRoll.diff}` : lastDiceRoll.total}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {lastDiceRoll.die4 > 0 && (
              <div className="flex flex-col items-center">
                <div className="relative w-8 h-8 flex items-center justify-center bg-purple-900/90 border border-purple-400 text-purple-200 font-bold rounded">
                  <span className="text-xs font-mono">{lastDiceRoll.die4}</span>
                </div>
                <span className="text-[9px] text-gray-400">D4</span>
              </div>
            )}

            {lastDiceRoll.die6 > 0 && (
              <div className="flex flex-col items-center">
                <div className="relative w-8 h-8 flex items-center justify-center bg-indigo-900/90 border border-indigo-400 text-indigo-200 font-bold rounded">
                  <span className="text-xs font-mono">{lastDiceRoll.die6}</span>
                </div>
                <span className="text-[9px] text-gray-400">D6</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
