import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const ollamaUrl = "http://localhost:11434/api/generate";

export async function POST(req: Request) {
  try {
    // CORS Headers
    const headers = new Headers({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });

    if (req.method === "OPTIONS") {
      return new NextResponse(null, { status: 200, headers });
    }

    // Authenticate User (Optional)
    // const { userId } = auth();
    // if (!userId) {
    //   return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401, headers });
    // }

    // Parse Request Data
    const { messages, model } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid request: 'messages' must be an array." }),
        { status: 400, headers }
      );
    }

    // Construct Llama API Payload
    const payload = {
      model: model || "llama3",
      prompt: messages.map((m) => `${m.role}: ${m.content}`).join("\n"),
      stream: true,
    };

    // Call Llama API
    const response = await fetch(ollamaUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.body) {
      throw new Error("No response body from Llama API.");
    }

    // Stream Llama Response
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let assistantContent = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      console.log("[LLAMA STREAM]:", chunk);

      try {
        const jsonLine = JSON.parse(chunk);
        if (jsonLine.response) {
          assistantContent += jsonLine.response;
        }
      } catch (err) {
        console.error("Error parsing JSON:", err, chunk);
      }
    }

    return new NextResponse(
      JSON.stringify({ role: "assistant", content: assistantContent }),
      { status: 200, headers }
    );
  } catch (error: any) {
    console.error("[API ERROR]:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error", error: error.message }),
      { status: 500 }
    );
  }
}
