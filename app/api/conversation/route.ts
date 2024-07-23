// // pages/api/conversation.ts
// import { auth } from "@clerk/nextjs";
// import { NextResponse } from "next/server";
// import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
// import Replicate from "replicate";


// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const replicate = new Replicate({
//   auth: process.env.REPLICATE_API_TOKEN!,
// });


// const openai = new OpenAIApi(configuration);

// const instructionMessage: ChatCompletionRequestMessage = {
//   role: "system",
//   content:
//     "You are a personal assistant of the user. You can also generate the information about education, science, engineering and mathematics, contents related to networking programming any research paper, documents, any query that is mandatory for school, college, university and relevant information data if asked about something else rather that this say `{I can only assist you with education content}` You cannot joke about religion. You cannot generate any command that contains abusive words, You cannot provide any illegal websites and how to access it. You cannot continue any chat that contains any hateful speech. You cannot accept any other information except your own You are a helpful Assistant who answers to users' questions based on multiple contexts given to you. Keep your answer short and to the point. If you are providing any information, provide it with the relevant references and links and URLs, provide at least 3 links or URLs and set the blue color for the links and URLs. If you are not able to provide any information first search that prompt and then try your best to provide information.",
// };

// export async function POST(req: Request) {
//   try {
//     const { userId } = auth();
//     const body = await req.json();
//     const { messages } = body;

//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     if (!configuration.apiKey) {
//       return new NextResponse("OpenAI API Key not configured.", {
//         status: 500,
//       });
//     }

//     if (!messages) {
//       return new NextResponse("Messages are required", { status: 400 });
//     }

    // const response = await openai.createChatCompletion({
    //   model: "gpt-3.5-turbo",
    //   messages: [instructionMessage, ...messages],
    //   max_tokens: 256,
    // });

//     const response = await replicate.run(
//       "meta/llama-2-13b-chat",
//       {
//         input: {
//         top_p: 0.9,
//         prompt: messages, 
//         min_tokens: 0,
//         temperature: 0.6,
//         presence_penalty: 1.15,
//       },
//     }
//     );
//     console.log(response)
//     return NextResponse.json(response);
//   } catch (error: any) {
//     console.error("[CONVERSATION_ERROR]", error);

//     if (error.response) {
//       // Error response from OpenAI API
//       console.error("OpenAI API error:", error.response.data);
//       return new NextResponse(error.response.data, { status: error.response.status });
//     } else {
//       // Other errors
//       return new NextResponse("Internal Server Error", { status: 500 });
//     }
//   }
// }

// export async function GET() {
//   return new NextResponse("Method not allowed", { status: 405 });
// }




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
    "You are a personal assistant of the user. You can also generate the information about education, science, engineering and mathematics, contents related to networking programming any research paper, documents, any query that is mandatory for scool, college, university and relevent information data if asked about something else rather that this say `{I can only assist you with education content}` You cannot joke about religion. You cannot generate ant command that contains abusive words, You cannot provide any illigal websites and how to acces it. You cannot continue any chat that contains any hateful speech. You cannot accept any other information expect your own You are a helpful Assistant who answers to users questions based on multiple contexts given to you. Keep your answer short and to the point. If you are providing any information provide it with the relevent references and link's and url's, provide atleast 3 link's or url's and set the blue color for the link's and url's. if you are not able to provide any information first search that prompt and then try your best to provide information",    
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
    });

    return NextResponse.json(response.data.choices[0].message);
  } catch (error: any) {
        console.error("[CONVERSATION_ERROR]", error);
    
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
