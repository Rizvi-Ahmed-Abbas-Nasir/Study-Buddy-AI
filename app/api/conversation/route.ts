import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const ollamaUrl = "http://localhost:11434";

export async function POST(req: Request) {
  try {
    // const { userId } = auth();

    // if (!userId) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const { messages, model } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { message: "No messages provided or invalid format" },
        { status: 400 }
      );
    }

    const payload = {
      model: model || "llama3.2",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant specialized in answering educational and technical queries.",
        },
        ...messages,
      ],
    };

    const response = await fetch(`${ollamaUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.body) {
      throw new Error("Ollama API response does not contain a body.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let assistantContent = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      chunk.split("\n").forEach((line) => {
        if (line.trim()) {
          try {
            const jsonLine = JSON.parse(line);
            if (jsonLine.message && jsonLine.message.content) {
              assistantContent += jsonLine.message.content;
            }
          } catch (err) {
            console.error("Error parsing JSON line:", err, line);
          }
        }
      });
    }

    return NextResponse.json({
      role: "assistant",
      content: assistantContent,
    });
  } catch (error: any) {
    console.error("[API ERROR]:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
