
import { useState } from "react";
import { Card } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Send, Info, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { features } from "@/components/layout/MainLayout";

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
          "dashboard-card"
        )}>
          <div className="absolute top-2 right-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="feature-tag feature-tag-enhanced flex items-center gap-1">
                    {features.aiHealthAssistant.type}
                    <Info className="w-3 h-3 info-icon" />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs">
                  <p>{features.aiHealthAssistant.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="flex items-center p-4 border-b border-border/50">
            <Bot className="h-5 w-5 text-primary mr-2" />
            <div className="font-medium">AI Health Assistant</div>
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
                    "max-w-[80%] rounded-2xl px-4 py-3",
                    message.role === "user"
                      ? "bg-primary/20 text-foreground"
                      : "bg-secondary text-foreground"
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-border/50">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 bg-background/50 border border-border/50 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <Button onClick={handleSendMessage} className="rounded-xl bg-primary hover:bg-primary/80">
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
