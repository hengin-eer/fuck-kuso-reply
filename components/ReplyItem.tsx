"use client";
import { useState } from "react";
import { clsx } from "clsx";
import HackerLogs from "./HackerLogs";

export type ReplyData = {
  id: string;
  user_name: string;
  user_id: string;
  aggressive: { text: string; emoji: string };
  scared: { text: string; emoji: string };
};

export default function ReplyItem({ reply }: { reply: ReplyData }) {
  const [isDisclosed, setIsDisclosed] = useState(false);
  const [isDisclosing, setIsDisclosing] = useState(false);

  const handleDisclose = () => {
    setIsDisclosing(true);
  };

  const handleLogsComplete = () => {
    setIsDisclosing(false);
    setIsDisclosed(true);
  };

  const currentContent = isDisclosed ? reply.scared : reply.aggressive;

  return (
    <div className="border-b border-gray-200 p-4 flex gap-3 relative transition-colors duration-500 hover:bg-gray-50">
      {isDisclosing && <HackerLogs onComplete={handleLogsComplete} />}

      <div className="shrink-0 pt-1">
        <div className={clsx(
          "w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl sm:text-3xl select-none overflow-hidden",
          isDisclosed && "animate-shiver"
        )}>
          {currentContent.emoji}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-bold text-gray-900 truncate text-sm sm:text-base">{reply.user_name}</span>
          <span className="text-gray-500 text-xs sm:text-sm truncate">{reply.user_id}</span>
        </div>

        <p className="text-gray-800 mb-3 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
          {currentContent.text}
        </p>

        <div className="flex justify-end">
          {!isDisclosed ? (
            <button
              onClick={handleDisclose}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-1.5 px-4 rounded-full text-xs sm:text-sm transition-colors flex items-center gap-2 shadow-sm hover:shadow-md active:scale-95"
            >
              🚨 開示請求する
            </button>
          ) : (
            <button
              disabled
              className="bg-green-600 text-white font-bold py-1.5 px-4 rounded-full text-xs sm:text-sm cursor-not-allowed opacity-80 shadow-sm"
            >
              ✅ 示談成立 (¥300,000)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
