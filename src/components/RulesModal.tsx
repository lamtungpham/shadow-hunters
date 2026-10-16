import React, { useState } from 'react';
import { X, BookOpen, Users, Compass, ShieldAlert, Award } from 'lucide-react';
import { ALL_CHARACTERS } from '../game/characters';
import { ALL_AREAS } from '../game/areas';
import { Alleg } from '../types/game';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'characters' | 'areas' | 'cards'>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-[#1f1c2e] border-2 border-purple-600/70 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl text-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-purple-800/60 bg-[#161324]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold font-serif text-amber-300">Shadow Hunters Rulebook</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-purple-900/40 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-purple-900/50 bg-[#191629] px-4 gap-2">
          {[
            { id: 'overview', label: 'How to Play', icon: Compass },
            { id: 'characters', label: 'Characters & Factions', icon: Users },
            { id: 'areas', label: 'Game Areas', icon: ShieldAlert },
            { id: 'cards', label: 'Cards & Items', icon: Award }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 py-3 px-3 text-xs font-bold border-b-2 transition cursor-pointer ${
                  isActive
                    ? 'border-amber-400 text-amber-300'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-4 font-serif text-sm leading-relaxed text-gray-200">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-800/40">
                <h3 className="font-bold text-amber-400 text-base mb-1">Premise</h3>
                <p className="text-xs text-gray-300 leading-normal">
                  Shadow Hunters is a social deduction survival game where players belong to three secret factions:
                  <strong className="text-red-400"> Shadows</strong> (underworld demons),
                  <strong className="text-blue-400"> Hunters</strong> (mortal protectors), and
                  <strong className="text-yellow-400"> Neutrals</strong> (unaligned individuals with unique motives).
                  Your identity is hidden at the start. Figure out who is friend and who is foe before striking!
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm mb-1">Turn Sequence</h4>
                <ol className="list-decimal pl-5 space-y-1.5 text-xs text-gray-300">
                  <li>
                    <strong className="text-amber-300">Start of Turn:</strong> Catherine heals 1 damage; Ultra Soul can target Underworld Gate; one-time specials (George, Fu-ka, Franklin, Ellen) can be activated.
                  </li>
                  <li>
                    <strong className="text-amber-300">Movement Phase:</strong> Roll both the 4-sided (D4) and 6-sided (D6) dice. The sum (2-10) determines your new location. If you roll a 7, you choose any area to move to.
                  </li>
                  <li>
                    <strong className="text-amber-300">Area Phase:</strong> Choose whether to activate the action of the area you landed on (e.g., drawing cards, stealing equipment, or healing/damaging).
                  </li>
                  <li>
                    <strong className="text-amber-300">Attack Phase:</strong> You may attack another player in your zone (or other zones if you hold the Handgun). Roll both dice and deal damage equal to the difference between them (|D6 - D4|). If the difference is 0, your attack misses!
                  </li>
                </ol>
              </div>

              <div className="bg-black/40 p-3 rounded-lg border border-purple-900/40 text-xs">
                <h4 className="font-bold text-amber-300 mb-1">Victory Conditions</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                  <li><strong className="text-red-400">Shadows:</strong> Win when all Hunters are dead, or when 3 Neutrals are dead.</li>
                  <li><strong className="text-blue-400">Hunters:</strong> Win when all Shadows are dead.</li>
                  <li><strong className="text-yellow-400">Neutrals:</strong> Win individually by completing their personal win conditions (Allie survives; Bob acquires 5 equipment cards; Catherine is the 1st to die or top 2 alive).</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'characters' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {ALL_CHARACTERS.map((char, idx) => (
                <div
                  key={idx}
                  className="bg-black/40 border border-purple-900/50 p-3 rounded-xl flex flex-col justify-between gap-1.5"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-amber-300">{char.name}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        char.alleg === Alleg.Shadow
                          ? 'bg-red-950 text-red-400 border border-red-800'
                          : char.alleg === Alleg.Hunter
                          ? 'bg-blue-950 text-blue-400 border border-blue-800'
                          : 'bg-yellow-950 text-yellow-400 border border-yellow-800'
                      }`}
                    >
                      {char.alleg} • {char.maxDamage} HP
                    </span>
                  </div>
                  <p className="text-gray-300">
                    <strong>Goal:</strong> {char.winCondDesc}
                  </p>
                  <p className="text-purple-300">
                    <strong>Ability:</strong> {char.specialDesc}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'areas' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {ALL_AREAS.map((area) => (
                <div
                  key={area.name}
                  className="bg-black/40 border border-purple-900/50 p-3 rounded-xl flex flex-col gap-1"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm text-amber-300">{area.name}</span>
                    <span className="font-mono text-[10px] bg-purple-950 px-2 py-0.5 rounded text-purple-300 border border-purple-800">
                      Roll: {area.domain.join(', ')}
                    </span>
                  </div>
                  <p className="text-gray-300">{area.desc}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'cards' && (
            <div className="space-y-3 text-xs">
              <div className="bg-black/30 p-3 rounded-lg border border-purple-900/40">
                <h4 className="font-bold text-white mb-1">White Cards (Holy & Healing)</h4>
                <p className="text-gray-300 mb-2">
                  Drawn at the Church or Underworld Gate. Includes protective equipment like Holy Robe, Talisman, Mystic Compass, and healing spells like Advent and Blessing.
                </p>
              </div>

              <div className="bg-black/30 p-3 rounded-lg border border-purple-900/40">
                <h4 className="font-bold text-neutral-300 mb-1">Black Cards (Dark & Offensive)</h4>
                <p className="text-gray-300 mb-2">
                  Drawn at the Cemetery or Underworld Gate. Includes vicious weapons like Chainsaw, Butcher Knife, Machine Gun, Handgun, and destructive rituals like Dynamite and Vampire Bat.
                </p>
              </div>

              <div className="bg-black/30 p-3 rounded-lg border border-purple-900/40">
                <h4 className="font-bold text-lime-400 mb-1">Hermit Cards (Investigation)</h4>
                <p className="text-gray-300 mb-2">
                  Drawn at the Hermit's Cabin or Underworld Gate. You secretly hand the card to another player. If the card's bet matches their faction or HP, they must suffer damage or forfeit equipment!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-purple-800/60 bg-[#161324] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="py-1.5 px-5 bg-[#3a3f5f] hover:bg-[#4b527d] text-white font-bold text-xs rounded-xl shadow cursor-pointer transition"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
