import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "ok", message: "API is working" });
}

export async function POST(req: Request) {
  console.log("API Route: POST /api/generate-replies called");
  try {
    const { postText } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key not found" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-lite-001",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      あなたは性格の悪いSNSユーザーの集団です。ユーザーの投稿に対し、理不尽で不快な「クソリプ」を3つ考えてください。
      同時に、もし身元特定（開示請求）された場合に、情けなく許しを請う「謝罪文」も考えてください。
      各状態にふさわしい「絵文字」も1つずつ選定せよ。

      ユーザーの投稿: "${postText}"

      出力は必ず以下のJSON形式のみにしてください。
      {
        "replies": [
          {
            "id": "unique_id_1", // ランダムなID
            "user_name": "クソリプおじさん", // バリエーションを持たせる
            "user_id": "@kuso_oji", // バリエーションを持たせる
            "aggressive": {
              "text": "それ科学的根拠ある？ｗ 頭悪そうｗ",
              "emoji": "🤪"
            },
            "scared": {
              "text": "すいません！適当言いました！訴訟だけは！",
              "emoji": "😱"
            }
          }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    console.log("Raw Gemini response:", text);

    // Clean up markdown code blocks if present
    text = text.replace(/^```json\s*/, "").replace(/\s*```$/, "");

    const json = JSON.parse(text);
    console.log("Parsed JSON:", json);

    return NextResponse.json(json);
  } catch (error: any) {
    console.error("Gemini API Error:", error);

    // Check for 429 Too Many Requests from Gemini API
    if (error?.status === 429 || error?.response?.status === 429 || error?.message?.includes("429")) {
      return NextResponse.json(
        { error: "Too Many Requests. Please try again later." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate replies", details: error?.message },
      { status: 500 }
    );
  }
}
