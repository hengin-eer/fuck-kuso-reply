"use client";
import { useState } from "react";
import { Send } from "lucide-react";

export default function PostForm({ onSubmit, isLoading }: { onSubmit: (text: string) => void, isLoading: boolean }) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;
    onSubmit(text);
  };

  return (
    <form onSubmit={handleSubmit} className="border-b border-gray-200 p-4 bg-white sticky top-0 z-20">
      <div className="flex gap-3">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl shrink-0">
          😊
        </div>
        <div className="flex-1">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="何か投稿してみよう..."
            className="w-full resize-none border-none focus:ring-0 text-lg outline-none bg-transparent placeholder-gray-400"
            rows={2}
            disabled={isLoading}
          />
        </div>
      </div>
      <div className="flex justify-end mt-2 border-t border-gray-100 pt-2">
        <button
          type="submit"
          disabled={!text.trim() || isLoading}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-5 py-2 font-bold text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          {isLoading ? "クソリプ収集中..." : (
            <>
              <span>投稿する</span>
              <Send size={16} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
