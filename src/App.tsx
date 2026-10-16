import React, { useState, useEffect, useRef } from 'react';
import { GameEngine } from './game/engine';
import { GameBoard } from './components/GameBoard';
import { PlayerCard } from './components/PlayerCard';
import { ActionControls } from './components/ActionControls';
import { CardModal } from './components/CardModal';
import { ChatLog } from './components/ChatLog';
import { RulesModal } from './components/RulesModal';
import { Lobby } from './components/Lobby';
import { Trophy, RotateCcw, Home, BookOpen } from 'lucide-react';
import { PlayerState } from './types/game';

export const App: React.FC = () => {
  const [inGame, setInGame] = useState(false);
  const [username, setUsername] = useState('Hunter1');
  const [roomId, setRoomId] = useState('TOWN_1');
  const [showRules, setShowRules] = useState(false);
  const [, setTick] = useState(0);

  const engineRef = useRef<GameEngine | null>(null);

  if (!engineRef.current) {
    engineRef.current = new GameEngine(() => {
      setTick(t => t + 1);
    });
  }

  const engine = engineRef.current;

  const handleStartGame = (user: string, room: string, count: number) => {
    setUsername(user);
    setRoomId(room);
    setInGame(true);
    engine.initializeGame(user, count);
  };

  const handleLeaveGame = () => {
    setInGame(false);
  };

  const handleRestartGame = () => {
    engine.initializeGame(username, engine.players.length || 5);
  };

  const humanPlayer = engine.players.find(p => !p.isAi) || engine.players[0];
  const currentPlayer = engine.getCurrentPlayer() || humanPlayer;

  const canUseSpecial =
    !!humanPlayer &&
    humanPlayer.state !== PlayerState.Dead &&
    !humanPlayer.specialUsed &&
    !humanPlayer.modifiers.voided;

  return (
    <div className="min-h-screen bg-[#110f1c] text-white flex flex-col font-serif select-none">
      {/* Global Rules Modal */}
      <RulesModal isOpen={showRules} onClose={() => setShowRules(false)} />

      {!inGame ? (
        <Lobby onStartGame={handleStartGame} onOpenRules={() => setShowRules(true)} />
      ) : (
        <div className="flex flex-col min-h-screen">
          {/* Top Navigation Bar */}
          <header className="bg-[#181528] border-b border-purple-900/60 px-6 py-2.5 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleLeaveGame}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#27233d] hover:bg-[#393457] text-gray-200 text-xs font-bold transition border border-purple-800/50 cursor-pointer"
                title="Return to lobby"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Lobby</span>
              </button>

              <div className="flex items-center gap-2">
                <img src="/static/gfx/logo.png" alt="Shadow Hunters" className="h-8 object-contain" />
                <span className="text-xs px-2 py-0.5 rounded bg-purple-950 text-amber-300 font-mono border border-purple-800">
                  Room: {roomId}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowRules(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#27233d] hover:bg-[#393457] text-amber-300 text-xs font-bold transition border border-purple-800/50 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Rules</span>
              </button>

              <button
                type="button"
                onClick={handleRestartGame}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-white text-xs font-bold transition border border-purple-700/60 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restart</span>
              </button>
            </div>
          </header>

          {/* Main Gameplay Screen */}
          <main className="flex-1 p-4 max-w-[1440px] w-full mx-auto flex flex-col gap-4">
            {/* Top row: Game board and Right sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
              {/* Center Game Board (col-span-3) */}
              <div className="lg:col-span-3 flex flex-col gap-3">
                <GameBoard
                  zones={engine.zones}
                  players={engine.players}
                  currentPlayer={currentPlayer}
                  lastDiceRoll={engine.lastDiceRoll}
                />

                {/* Other Players Quick Overview Bar */}
                <div className="bg-[#1c192c] border border-purple-900/50 rounded-xl p-3 shadow-md flex flex-wrap gap-2 items-center justify-between">
                  <span className="text-xs font-bold text-purple-300 uppercase tracking-wide">
                    All Players ({engine.players.length})
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {engine.players.map(p => {
                      const isTurn = p.id === currentPlayer.id;
                      const isDead = p.state === PlayerState.Dead;
                      const isRev = p.state === PlayerState.Revealed;

                      return (
                        <div
                          key={p.id}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs transition ${
                            isTurn
                              ? 'border-amber-400 bg-purple-900/80 shadow-md shadow-amber-500/20 text-white'
                              : isDead
                              ? 'border-red-900/60 bg-red-950/30 text-gray-400 line-through'
                              : 'border-purple-900/40 bg-black/40 text-gray-300'
                          }`}
                        >
                          <div
                            className="w-3 h-3 rounded-full border border-black shadow"
                            style={{ backgroundColor: p.color }}
                          />
                          <span className="font-bold">{p.name}</span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {p.damage}/{p.character.maxDamage}
                          </span>
                          {isRev ? (
                            <span className="text-[9px] px-1 bg-purple-800 text-purple-200 rounded">
                              {p.character.alleg}
                            </span>
                          ) : isDead ? (
                            <span className="text-[9px] text-red-400">†</span>
                          ) : (
                            <span className="text-[9px] text-gray-500">?</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Side: Player's Card & Chat/Log */}
              <div className="lg:col-span-1 flex flex-col gap-4">
                {humanPlayer && (
                  <PlayerCard
                    player={humanPlayer}
                    isHuman={true}
                    onReveal={() => engine.revealPlayer(humanPlayer)}
                    onSpecial={() => engine.activateSpecial(humanPlayer)}
                    canUseSpecial={canUseSpecial}
                  />
                )}

                <ChatLog
                  logs={engine.logs}
                  onSendMessage={(msg) => engine.logGameEvent(`${username}: ${msg}`, [])}
                  playerName={username}
                />
              </div>
            </div>
          </main>

          {/* Action Prompt Modal */}
          <ActionControls
            prompt={engine.currentPrompt}
            onAnswer={(val) => engine.answerPrompt(val)}
          />

          {/* Drawn Card Modal */}
          <CardModal
            cardDisplay={engine.drawnCardDisplay}
            onDismiss={() => {
              engine.drawnCardDisplay = null;
              engine.notify();
            }}
          />

          {/* Game Over Banner Modal */}
          {engine.gameOver && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
              <div className="bg-[#211d33] border-4 border-amber-500 rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl flex flex-col items-center gap-4">
                <Trophy className="w-16 h-16 text-amber-400 animate-bounce" />
                <h2 className="text-3xl font-bold font-serif text-amber-300">Game Over!</h2>

                <div className="w-full bg-black/50 p-4 rounded-xl border border-purple-800/50 flex flex-col gap-2">
                  <span className="text-sm font-bold text-purple-300 uppercase tracking-widest">
                    Victorious Players
                  </span>
                  {engine.winners.map(w => (
                    <div
                      key={w.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-purple-950/60 border border-purple-700/60"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border border-black"
                          style={{ backgroundColor: w.color }}
                        />
                        <span className="font-bold text-white">{w.name}</span>
                      </div>
                      <span className="text-xs font-bold text-amber-400">
                        {w.character.name} ({w.character.alleg})
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 w-full mt-2">
                  <button
                    type="button"
                    onClick={handleRestartGame}
                    className="flex-1 py-3 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-sm shadow transition cursor-pointer"
                  >
                    Play Again
                  </button>
                  <button
                    type="button"
                    onClick={handleLeaveGame}
                    className="flex-1 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold text-sm shadow transition cursor-pointer"
                  >
                    Back to Lobby
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
