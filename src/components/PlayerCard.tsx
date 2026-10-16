import React, { useState } from 'react';
import { PlayerData, PlayerState, Alleg } from '../types/game';
import { getCharacterPortrait } from '../game/characters';
import { getCardSvg } from '../game/cards';
import { Shield, Eye, Sparkles, Crosshair, Award } from 'lucide-react';

interface PlayerCardProps {
  player: PlayerData;
  isHuman: boolean;
  onReveal: () => void;
  onSpecial: () => void;
  canUseSpecial: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  isHuman,
  onReveal,
  onSpecial,
  canUseSpecial
}) => {
  const [peekIdentity, setPeekIdentity] = useState(false);
  const isRevealed = player.state === PlayerState.Revealed;
  const isDead = player.state === PlayerState.Dead;

  const showIdentity = isRevealed || (isHuman && peekIdentity);
  const portrait = showIdentity
    ? getCharacterPortrait(player.character.resourceId)
    : '/static/gfx/anon.png';

  const allegColors = {
    [Alleg.Shadow]: 'text-red-400 bg-red-950/60 border-red-700/60',
    [Alleg.Hunter]: 'text-blue-400 bg-blue-950/60 border-blue-700/60',
    [Alleg.Neutral]: 'text-yellow-400 bg-yellow-950/60 border-yellow-700/60'
  };

  const hpPercent = Math.min(100, Math.round((player.damage / player.character.maxDamage) * 100));

  return (
    <div className="bg-[#242136] border-2 border-[#3f385c] rounded-xl p-3.5 shadow-xl flex flex-col justify-between text-white select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-purple-900/40 pb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full border border-black shadow"
            style={{ backgroundColor: player.color }}
          />
          <span className="font-bold text-sm tracking-wide">{player.name}</span>
          {isHuman && (
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-purple-700/60 text-purple-200">
              You
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {isDead ? (
            <span className="text-xs font-bold text-red-500 bg-red-950/80 px-2 py-0.5 rounded border border-red-800">
              DEAD
            </span>
          ) : isRevealed ? (
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
              REVEALED
            </span>
          ) : (
            <span className="text-xs font-bold text-gray-400 bg-gray-900/80 px-2 py-0.5 rounded border border-gray-700">
              HIDDEN
            </span>
          )}
        </div>
      </div>

      {/* Main Character Display */}
      <div className="flex gap-3 my-2.5 items-center">
        {/* Portrait */}
        <div className="relative w-20 h-24 rounded-lg overflow-hidden border-2 border-purple-800/80 bg-black/60 shadow-inner shrink-0">
          <img
            src={portrait}
            alt={showIdentity ? player.character.name : 'Unknown Identity'}
            className="w-full h-full object-cover"
          />
          {isDead && (
            <div className="absolute inset-0 bg-red-950/80 flex items-center justify-center">
              <span className="text-xl font-bold text-red-400">†</span>
            </div>
          )}
        </div>

        {/* Character Info */}
        <div className="flex flex-col flex-1 gap-1">
          {showIdentity ? (
            <>
              <div className="flex items-center justify-between">
                <span className="font-bold text-base text-amber-300">{player.character.name}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${allegColors[player.character.alleg]}`}
                >
                  {player.character.alleg}
                </span>
              </div>
              <p className="text-[11px] text-gray-300 line-clamp-2 leading-tight">
                <strong>Goal:</strong> {player.character.winCondDesc}
              </p>
              <p className="text-[10px] text-purple-300 line-clamp-2 leading-tight">
                <strong>Ability:</strong> {player.character.specialDesc}
              </p>
            </>
          ) : (
            <div className="flex flex-col gap-1.5 py-1">
              <span className="font-bold text-sm text-gray-400">Secret Identity</span>
              <p className="text-[11px] text-gray-400 italic">
                Identity is obscured in the shadows. Reveal to unleash your special power!
              </p>
              {isHuman && (
                <button
                  type="button"
                  onClick={() => setPeekIdentity(!peekIdentity)}
                  className="flex items-center gap-1.5 text-[11px] text-purple-300 hover:text-white bg-purple-900/40 hover:bg-purple-800/60 px-2 py-1 rounded transition w-fit border border-purple-700/50 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{peekIdentity ? 'Hide Card' : 'Peek Identity'}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Health Meter */}
      <div className="flex flex-col gap-1 bg-black/40 p-2 rounded-lg border border-purple-900/40">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-300 font-semibold flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-rose-400" />
            Damage
          </span>
          <span className="font-mono font-bold text-rose-400">
            {player.damage} / {player.character.maxDamage} HP
          </span>
        </div>
        <div className="w-full h-2.5 bg-gray-900 rounded-full overflow-hidden border border-gray-700">
          <div
            className={`h-full transition-all duration-300 ${
              hpPercent > 75 ? 'bg-red-600' : hpPercent > 40 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${hpPercent}%` }}
          />
        </div>
      </div>

      {/* Arsenal / Equipment Tray */}
      <div className="mt-2.5 flex flex-col gap-1">
        <div className="text-[11px] font-bold text-purple-300 flex items-center gap-1">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>Arsenal ({player.equipment.length})</span>
        </div>
        <div className="flex flex-wrap gap-1.5 min-h-[36px] bg-black/50 p-1.5 rounded-lg border border-purple-900/30">
          {player.equipment.length === 0 ? (
            <span className="text-[10px] text-gray-500 italic my-auto">No equipment equipped</span>
          ) : (
            player.equipment.map((eq, i) => (
              <div
                key={i}
                className="flex items-center gap-1 px-2 py-1 bg-purple-950/80 border border-purple-700/70 rounded text-[10px] text-amber-200 shadow"
                title={`${eq.title}: ${eq.desc}`}
              >
                <img
                  src={getCardSvg(eq.title, eq.color)}
                  alt=""
                  className="w-3.5 h-3.5 object-contain"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <span className="font-semibold">{eq.title}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Action Buttons for Human Player */}
      {isHuman && !isDead && (
        <div className="mt-3 flex gap-2 pt-2 border-t border-purple-900/40">
          {!isRevealed && (
            <button
              type="button"
              onClick={onReveal}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg font-bold text-xs text-white bg-[#3a3f5f] hover:bg-[#4b527d] active:scale-95 transition shadow border border-purple-500/40 cursor-pointer"
            >
              <Crosshair className="w-3.5 h-3.5 text-amber-400" />
              <span>Reveal</span>
            </button>
          )}

          <button
            type="button"
            onClick={onSpecial}
            disabled={!canUseSpecial || player.specialUsed || player.modifiers.voided}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg font-bold text-xs text-white transition shadow border cursor-pointer ${
              canUseSpecial && !player.specialUsed && !player.modifiers.voided
                ? 'bg-purple-700 hover:bg-purple-600 active:scale-95 border-purple-400 text-amber-300'
                : 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed opacity-60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {player.modifiers.voided
                ? 'Voided'
                : player.specialUsed
                ? 'Special Used'
                : 'Special Ability'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
