import React, { useState } from 'react';
import { Play, BookOpen, MessageSquare, Info } from 'lucide-react';

interface LobbyProps {
  onStartGame: (username: string, roomId: string, nPlayers: number) => void;
  onOpenRules: () => void;
}

export const Lobby: React.FC<LobbyProps> = ({ onStartGame, onOpenRules }) => {
  const [username, setUsername] = useState('Hunter1');
  const [roomId, setRoomId] = useState('TOWN_1');
  const [nPlayers, setNPlayers] = useState(5);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim();
    const cleanRoom = roomId.trim();

    if (!cleanUser || !cleanRoom) {
      setErrorMsg('Please enter a screen name and room ID.');
      return;
    }
    if (cleanUser.length > 10 || cleanRoom.length > 10) {
      setErrorMsg('Name and room ID must not exceed 10 characters.');
      return;
    }
    if (!/^[\w\d ]*$/.test(cleanUser) || !/^[\w\d ]*$/.test(cleanRoom)) {
      setErrorMsg('Name and room ID must not contain special characters.');
      return;
    }
    if (/^\d+$/.test(cleanUser) || /^\d+$/.test(cleanRoom)) {
      setErrorMsg('Name and room ID must not be pure numbers.');
      return;
    }

    setErrorMsg('');
    onStartGame(cleanUser, cleanRoom, nPlayers);
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center p-4 bg-[#141221] select-none overflow-hidden">
      {/* Background Graphic */}
      <img
        src="/static/gfx/waitRoom.svg"
        alt="Shadow Hunters"
        className="absolute inset-0 w-full h-full object-cover opacity-80 pointer-events-none"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />

      {/* Floating Rules Button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          type="button"
          onClick={onOpenRules}
          className="flex items-center gap-2 px-4 py-2 bg-black/60 hover:bg-black/80 border border-purple-500/50 rounded-xl text-white font-serif shadow-lg backdrop-blur-md transition cursor-pointer"
        >
          <img src="/static/gfx/rules.png" alt="Rules" className="w-6 h-6 object-contain" />
          <span className="text-sm font-bold">Rulebook</span>
        </button>
      </div>

      {/* Center Box */}
      <div className="relative z-10 w-full max-w-md bg-[#DFDFDF] border-4 border-black p-6 rounded-2xl shadow-[8px_10px_0px_#000000] text-gray-900 font-serif">
        <div className="flex flex-col items-center text-center gap-2 mb-4">
          <img
            src="/static/gfx/logo.png"
            alt="Shadow Hunters"
            className="h-14 object-contain filter drop-shadow"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <h2 className="text-[#3f2b6d] font-bold text-base leading-snug">
            Enter a screen name and room ID to join or host a game!
          </h2>
        </div>

        {errorMsg && (
          <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-800 text-xs rounded text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Screen Name</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Screen Name"
              maxLength={10}
              className="w-full bg-white border-2 border-gray-400 rounded-lg p-2 text-sm text-gray-900 focus:outline-hidden focus:border-[#3a3f5f]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Room ID</label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Room ID"
              maxLength={10}
              className="w-full bg-white border-2 border-gray-400 rounded-lg p-2 text-sm text-gray-900 focus:outline-hidden focus:border-[#3a3f5f]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Number of Players</label>
            <select
              value={nPlayers}
              onChange={(e) => setNPlayers(Number(e.target.value))}
              className="w-full bg-[#3a3f5f] text-white border-2 border-[#2b2f48] rounded-lg p-2 text-sm font-bold focus:outline-hidden cursor-pointer"
            >
              <option value="4">4 Players (2 Hunters, 2 Shadows)</option>
              <option value="5">5 Players (2 Hunters, 1 Neutral, 2 Shadows)</option>
              <option value="6">6 Players (2 Hunters, 2 Neutrals, 2 Shadows)</option>
              <option value="7">7 Players (2 Hunters, 3 Neutrals, 2 Shadows)</option>
              <option value="8">8 Players (3 Hunters, 2 Neutrals, 3 Shadows)</option>
            </select>
            <span className="text-[11px] text-gray-600 block mt-1">
              AI bots automatically fill any open player seats.
            </span>
          </div>

          <button
            type="submit"
            className="mt-3 w-full py-3 bg-[#3a3f5f] hover:bg-[#2b2f48] active:scale-[0.98] text-white font-bold text-base rounded-full shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Join & Start Game</span>
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-gray-300 text-[11px] text-gray-600 text-center flex flex-col gap-1">
          <div className="flex items-center justify-center gap-1 text-purple-900 font-bold">
            <Info className="w-3.5 h-3.5" />
            <span>Disconnected? Re-enter your name and room ID to rejoin.</span>
          </div>
          <span>Play instantly with smart bots or alongside friends in the same room.</span>
        </div>
      </div>

      {/* Footer Info / Links */}
      <div className="relative z-10 mt-6 flex flex-col items-center gap-2 text-xs text-white/90 font-serif">
        <div className="flex items-center gap-4">
          <a
            href="https://discord.gg/HwnNfaz9zD"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-900/60 hover:bg-indigo-900 text-indigo-200 border border-indigo-700 transition"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Join Discord</span>
          </a>

          <button
            type="button"
            onClick={onOpenRules}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/60 hover:bg-purple-900 text-purple-200 border border-purple-700 transition cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Game Rules</span>
          </button>
        </div>
        <p className="text-white/60 text-[11px]">
          Shadow Hunters — Dedicated survival and deduction board game.
        </p>
      </div>
    </div>
  );
};
