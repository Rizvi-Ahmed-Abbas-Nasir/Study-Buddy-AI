"use client";

import * as z from "zod";
import axios from "axios";
import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import { BotAvatar } from "@/components/bot-avatar";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/loader";
import { UserAvatar } from "@/components/user-avatar";
import { Empty } from "@/components/ui/empty";
import { useProModal } from "@/hooks/use-pro-modal";

import { formSchema } from "./constants";

const ConversationPage = () => {
  const router = useRouter();
  const proModal = useProModal();

 type ChatCompletionRequestMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};
  
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3.2",
          messages: [{ role: "user", content: values.prompt }],
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to get a response from the API.");
      }
  
      const data = await response.json();
      console.log("Assistant Response:", data.content);
  
      setMessages((current) => [
        ...current,
        { role: "user", content: values.prompt },
        { role: "assistant", content: data.content },
      ]);
  
      form.reset();
    } catch (error) {
      console.error("Error communicating with the API:", error);
    }
  };
  
  

  return (
    <div className="w-full ">
    <Heading
      title="Chat"
      description="Our most advanced conversation model."
      icon={MessageSquare}
      iconColor="text-violet-500"
      bgColor="bg-violet-500/10"
    />
    <div className="px-4 lg:px-8 w-[100%]">
      <div className="space-y-4 w-full  mt-4 h-[70vh]">
        {messages.length === 0 && !isLoading && <Empty label="" />}
  
        <div className="flex flex-col gap-y-4 p-4 overflow-y-auto rounded-lg">
        {messages.map((message) => (
  <div
    key={message.content}
    className={cn(
      "p-4 flex items-start gap-x-4 rounded-lg shadow-sm",
      "inline-block max-w-[75%] whitespace-pre-wrap break-words",
      message.role === "user"
        ? "bg-blue-500 text-white rounded-br-none self-end"
        : "bg-white text-gray-800 rounded-bl-none self-start"
    )}
  >
    {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
    <p className="text-sm">{message.content}</p>
  </div>
))}

          {isLoading && (
            <div className="flex items-center gap-2">
              <BotAvatar />
              <div className="px-4 py-2">
                <div className="flex text-[1.2rem] gap-1">
                  <span className="animate-bounce delay-100">.</span>
                  <span className="animate-bounce delay-200">.</span>
                  <span className="animate-bounce delay-300">.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
  
      <div className="w-full flex flex-col justify-center items-center mt-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className=" w-[80%] rounded-lg border p-4 px-3 md:px-6 focus-within:shadow-sm flex items-center gap-2"
          >
            <FormField
              name="prompt"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl className="m-0 p-0">
                    <Input
                      className="w-full border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                      disabled={isLoading}
                      placeholder="Ask me anything..."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              className=" lg:w-[15%] flex-shrink-0"
              type="submit"
              disabled={isLoading}
              size="icon"
            >
              Generate
            </Button>
          </form>
        </Form>
      </div>
    </div>
  </div>
  
  );
};

export default ConversationPage;
