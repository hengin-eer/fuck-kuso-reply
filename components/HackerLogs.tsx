"use client";
import { useEffect, useState } from "react";

const LOGS = [
  "Analyzing network...",
  "IP Found: 203.0.113.5",
  "Device: Android (Cheap model)",
  "Location: Mom's Basement",
  "Accessing Social Media History...",
  "SENDING LEGAL NOTICE...",
  "DONE."
];

export default function HackerLogs({ onComplete }: { onComplete: () => void }) {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex >= LOGS.length) {
        clearInterval(interval);
        setTimeout(onComplete, 800);
        return;
      }
      setLogs((prev) => [...prev, LOGS[currentIndex]]);
      currentIndex++;
    }, 200);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="absolute inset-0 bg-black/90 z-10 flex flex-col justify-center p-4 font-mono text-green-500 text-sm overflow-hidden rounded-lg">
      {logs.map((log, i) => (
        <div key={i} className="animate-pulse">{">"} {log}</div>
      ))}
    </div>
  );
}
