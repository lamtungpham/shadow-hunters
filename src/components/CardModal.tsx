import React from 'react';
import { DrawnCardDisplay, CardType } from '../types/game';
import { getCardSvg } from '../game/cards';

interface CardModalProps {
  cardDisplay: DrawnCardDisplay | null;
  onDismiss?: () => void;
}

export const CardModal: React.FC<CardModalProps> = ({ cardDisplay, onDismiss }) => {
  if (!cardDisplay) return null;

  const { card, drawnBy, isPrivate } = cardDisplay;
  const isHermit = card.color === CardType.Hermit;
  const cardColorClass =
    card.color === CardType.White
      ? 'border-gray-200 bg-linear-to-b from-gray-100 to-gray-300 text-gray-900'
      : card.color === CardType.Black
      ? 'border-neutral-700 bg-linear-to-b from-neutral-800 to-black text-gray-100'
      : 'border-lime-500 bg-linear-to-b from-emerald-950 to-green-950 text-emerald-100';

  const badgeColorClass =
    card.color === CardType.White
      ? 'bg-amber-100 text-amber-900 border-amber-300'
      : card.color === CardType.Black
      ? 'bg-neutral-900 text-neutral-300 border-neutral-700'
      : 'bg-emerald-900 text-lime-300 border-emerald-600';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-fade-in">
      <div
        className={`relative w-[340px] rounded-2xl p-6 shadow-2xl border-4 flex flex-col items-center text-center gap-3 ${cardColorClass}`}
      >
        <span className="text-[11px] font-bold uppercase tracking-wider opacity-75">
          {drawnBy} drew {isPrivate ? 'a secret card' : 'a card'}
        </span>

        {/* Card SVG or icon */}
        <div className="w-24 h-24 my-1 flex items-center justify-center p-2 rounded-xl bg-black/20 shadow-inner">
          <img
            src={getCardSvg(card.title, card.color)}
            alt={card.title}
            className="w-full h-full object-contain filter drop-shadow"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold font-serif">{card.title}</h3>

        {/* Type badge */}
        <div className={`text-[10px] uppercase font-bold px-3 py-1 rounded-full border ${badgeColorClass}`}>
          {card.color} Card {card.isEquip ? '• Equipment' : '• Single Use'}
        </div>

        {/* Description */}
        <p className="text-xs leading-relaxed opacity-90 my-2 px-2 bg-black/10 py-2 rounded-lg">
          {card.desc}
        </p>

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="mt-2 py-2 px-6 rounded-xl font-bold text-xs uppercase tracking-wide bg-purple-900 hover:bg-purple-800 text-white shadow transition cursor-pointer"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};
