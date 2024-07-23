import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const instructionMessage: ChatCompletionRequestMessage = {
  role: "system",
  content:
    "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations. You are a code generator you cannot answer any question which does not contains code, program, snippit. Don't provide any information other then programming, coding, debugging error solving code improvements. when you provide any answers also provide the reference to the code and link's and url's also documentions link's.",    
};

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!configuration.apiKey) {
      return new NextResponse("OpenAI API Key not configured.", {
        status: 500,
      });
    }

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [instructionMessage, ...messages],
      max_tokens:256
    });

    console.log(response.data.choices[0].message);

    return NextResponse.json(response.data.choices[0].message);
  } catch (error:any) {
    console.log("[CODE_ERROR]", error);
    
    if (error.response) {
      // Error response from OpenAI API
      console.error("OpenAI API error:", error.response.data);
      return new NextResponse(error.response.data, { status: error.response.status });
    } else {
      // Other errors
      return new NextResponse("Internal Server Error", { status: 500 });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}
