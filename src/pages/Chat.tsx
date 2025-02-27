
import { useState } from "react";
import { Card } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Send, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your Hamilton Health Hub assistant. How can I help you today?",
    },
  ]);

  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: inputValue.trim() },
      {
        role: "assistant",
        content: "I'm a demo chatbot. This is a placeholder response to demonstrate the chat interface. In a real implementation, this would be connected to an AI service.",
      },
    ]);
    setInputValue("");
  };

  const chatFeature = {
    type: "new",
    description: "AI-powered health assistant capable of answering questions, providing recommendations, and accessing local health resources."
  };

  return (
    <MainLayout>
      <div className="space-y-8 pt-16">
        <div>
          <h2 className="text-3xl font-bold tracking-tight animate-fade-in">
            Health Assistant
          </h2>
          <p className="text-muted-foreground mt-2 animate-fade-in">
            Chat with our AI health assistant
          </p>
        </div>

        <Card className={cn(
          "h-[600px] flex flex-col animate-fade-in relative",
          "glass"
        )}>
          <div className="absolute top-2 right-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="feature-tag feature-tag-new flex items-center gap-1">
                    {chatFeature.type}
                    <Info className="w-3 h-3" />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs">
                  <p>{chatFeature.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-4 py-2",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 bg-transparent border rounded-md px-3 py-2"
              />
              <Button onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Chat;
