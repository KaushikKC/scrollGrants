"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ORAAI_ABI, ORAAI_CONTRACT_ADDRESS } from "@/lib/const";
import { opSepoliaClient, opSepoliaPublicClient } from "@/lib/viem";

export function ChatbotPageComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>(
    [
      {
        text: "Hello! I am your Grant assistant.Lemme get you the projects in this round for you !",
        isUser: false,
      },
    ]
  );
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      setMessages([...messages, { text: inputMessage, isUser: true }]);
      const prompt = inputMessage;
      setInputMessage("");
      // Simulate bot response
      setLoading(true);
      const gasFee = await opSepoliaPublicClient.readContract({
        address: ORAAI_CONTRACT_ADDRESS,
        abi: ORAAI_ABI,
        functionName: "estimateFee",
        args: [11],
      });
      console.log(gasFee);

      const txHash = await opSepoliaClient.writeContract({
        address: ORAAI_CONTRACT_ADDRESS,
        abi: ORAAI_ABI,
        functionName: "calculateAIResult",
        args: [11, prompt],
        value: gasFee as bigint,
      });

      const pollResult = async () => {
        const result = await opSepoliaPublicClient.readContract({
          address: ORAAI_CONTRACT_ADDRESS,
          abi: ORAAI_ABI,
          functionName: "getAIResult",
          args: [11, prompt],
        });

        console.log(result);
        if (
          result &&
          result !== "" &&
          result !== undefined &&
          result !== null
        ) {
          setLoading(false);
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              text: result as string,
              isUser: false,
            },
          ]);

          clearInterval(pollingInterval);
        } else {
          console.log("Result not ready, continuing to poll...");
        }
      };

      // Start polling every 5 seconds
      const pollingInterval = setInterval(pollResult, 5000);
    }
  };

  return (
    <div className="min-h-screen  p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to Our Website</h1>
      <p className="mb-4">
        This is a dummy page to demonstrate the chatbot feature.
      </p>

      <Button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-4 right-4 z-10"
        aria-label="Open chat"
      >
        &#128172; Open Chat
      </Button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-full max-w-md rounded-lg shadow-lg overflow-hidden">
            <div className=" p-4  flex justify-between items-center">
              <h2 className="text-lg font-semibold">Chat with us</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsModalOpen(false)}
                className=" hover:text-white hover:bg-red-500"
                aria-label="Close chat"
              >
                &times;
              </Button>
            </div>
            <ScrollArea className="h-80 p-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-2 ${
                    message.isUser ? "text-right" : "text-left"
                  }`}
                >
                  <span
                    className={`inline-block p-2 rounded-lg ${
                      message.isUser
                        ? "bg-gray-400 text-white"
                        : "bg-stone-500 text-white"
                    }`}
                  >
                    {message.text}
                  </span>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start mb-2">
                  <div className="bg-stone-500 text-white p-2 rounded-lg flex items-center space-x-2">
                    <span>Thinking</span>
                    <div className="flex space-x-1">
                      <div
                        className="w-2 h-2 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "0s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </ScrollArea>
            <div className="p-4 border-t">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex space-x-2"
              >
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-grow"
                />
                <Button type="submit" aria-label="Send message">
                  Send
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
