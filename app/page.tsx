"use client";
import { useState } from "react";
import PostForm from "@/components/PostForm";
import ReplyItem, { ReplyData } from "@/components/ReplyItem";

export default function Home() {
  const [replies, setReplies] = useState<ReplyData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userPost, setUserPost] = useState<string | null>(null);

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setUserPost(text);
    setReplies([]); // Clear previous replies

    try {
      const res = await fetch("/api/generate-replies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postText: text }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage = errorData.error || res.statusText;

        if (res.status === 429) {
          alert(`⚠️ リクエストが集中しています。\n少し時間を置いてから再度お試しください。\n(Status: ${res.status})`);
        } else {
          alert(`🚫 エラーが発生しました。\nStatus: ${res.status}\nMessage: ${errorMessage}`);
        }
        throw new Error(`API Error: ${res.status} ${errorMessage}`);
      }

      const data = await res.json();
      console.log("API Response Data:", data);

      if (data.replies && Array.isArray(data.replies)) {
        setReplies(data.replies);
      } else {
        console.warn("Unexpected API response format:", data);
        alert("データの取得に失敗しました（形式エラー）");
      }
    } catch (error) {
      console.error(error);
      alert("エラーが発生しました。もう一度試してください。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white max-w-xl mx-auto border-x border-gray-200 shadow-sm">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 p-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <h1 className="text-xl font-bold text-gray-900">ホーム</h1>
      </header>

      <PostForm onSubmit={handlePost} isLoading={isLoading} />

      <div className="divide-y divide-gray-200">
        {userPost && (
          <div className="p-4 hover:bg-gray-50 transition-colors border-b border-gray-200">
            <div className="flex gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl shrink-0">
                😊
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-bold text-gray-900">自分</span>
                  <span className="text-gray-500 text-sm">@me</span>
                </div>
                <p className="text-gray-900 text-lg whitespace-pre-wrap">{userPost}</p>
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            <p>クソリプを収集中...</p>
          </div>
        )}

        {replies.map((reply) => (
          <ReplyItem key={reply.id} reply={reply} />
        ))}

        {replies.length > 0 && (
          <div className="p-8 text-center text-gray-400 text-sm">
            すべてのクソリプを表示しました
          </div>
        )}
      </div>
    </main>
  );
}
