import React from 'react';
import { ActionPrompt } from '../types/game';

interface ActionControlsProps {
  prompt: ActionPrompt | null;
  onAnswer: (value: string) => void;
}

export const ActionControls: React.FC<ActionControlsProps> = ({ prompt, onAnswer }) => {
  if (!prompt) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-[#242136] border-2 border-amber-500/80 rounded-2xl p-6 shadow-2xl max-w-lg w-full flex flex-col gap-4 text-center">
        {prompt.title && (
          <h3 className="text-xl font-bold text-amber-300 font-serif border-b border-purple-800/50 pb-2">
            {prompt.title}
          </h3>
        )}

        <div className="text-base text-gray-200 font-medium">
          {prompt.prompt}
        </div>

        {/* Buttons List */}
        <div className="flex flex-wrap gap-2.5 justify-center mt-2">
          {prompt.options.map((opt, i) => {
            const isDecline = opt === 'Decline' || opt === 'Do nothing';
            return (
              <button
                key={i}
                type="button"
                onClick={() => onAnswer(opt)}
                className={`py-2.5 px-5 rounded-xl font-bold text-sm transition-all duration-150 transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg cursor-pointer ${
                  isDecline
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600'
                    : 'bg-[#3a3f5f] hover:bg-[#4b527d] text-white border border-purple-400/60 shadow-purple-900/40'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
