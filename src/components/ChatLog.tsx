import React, { useEffect, useRef, useState } from 'react';
import { LogMessage } from '../types/game';
import { Send } from 'lucide-react';

interface ChatLogProps {
  logs: LogMessage[];
  onSendMessage: (message: string) => void;
  playerName: string;
}

export const ChatLog: React.FC<ChatLogProps> = ({ logs, onSendMessage, playerName }) => {
  const [inputMsg, setInputMsg] = useState('');
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    onSendMessage(inputMsg.trim());
    setInputMsg('');
  };

  return (
    <div className="bg-[#1e1b2d] border border-purple-900/50 rounded-xl p-3 shadow-xl flex flex-col h-[320px] text-white">
      <div className="flex items-center justify-between border-b border-purple-800/40 pb-1.5 mb-2">
        <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
          Game Log & Chat
        </span>
        <span className="text-[10px] text-gray-400">{logs.length} events</span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 font-serif text-[12px] leading-snug">
        {logs.map((log) => (
          <div key={log.id} className="break-words">
            {log.segments.map((seg, idx) => (
              <span key={idx} style={{ color: seg.color }}>
                {seg.text}
              </span>
            ))}
          </div>
        ))}
        <div ref={logEndRef} />
      </div>

      {/* Input Field */}
      <form onSubmit={handleSubmit} className="mt-2 flex gap-1.5 pt-2 border-t border-purple-900/40">
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          placeholder={`Chat as ${playerName}...`}
          className="flex-1 bg-black/50 border border-purple-800/60 rounded-lg px-2.5 py-1 text-xs text-white placeholder-gray-500 focus:outline-hidden focus:border-purple-400"
        />
        <button
          type="submit"
          className="bg-[#3a3f5f] hover:bg-[#4b527d] text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center justify-center transition cursor-pointer"
        >
          <Send className="w-3 h-3" />
        </button>
      </form>
    </div>
  );
};
