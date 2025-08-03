"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { Send, Smile, Meh, Frown } from "lucide-react";
import { simulateChat } from "@/ai/flows/ai-chat-simulation";
import { analyzeSentiment, type SentimentAnalysisOutput } from "@/ai/flows/sentiment-analysis";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  text: string;
  sender: "user" | "morpheus";
  timestamp: string;
  sentiment?: SentimentAnalysisOutput['sentiment'];
};

const sentimentIcons: { [key: string]: JSX.Element } = {
  positive: <Smile className="h-4 w-4 text-green-500" />,
  negative: <Frown className="h-4 w-4 text-red-500" />,
  neutral: <Meh className="h-4 w-4 text-yellow-500" />,
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const addWelcomeMessage = () => {
    setMessages([
        {
            id: crypto.randomUUID(),
            text: "Hello! It's so good to hear from you. What's on your mind?",
            sender: "morpheus",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
    ]);
  }

  useEffect(() => {
    // Load chat history from localStorage on initial render
    try {
      const savedMessages = localStorage.getItem("chatHistory");
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        // Add a welcome message if there's no history
        addWelcomeMessage();
      }
    } catch (error) {
      console.error("Failed to load chat history from localStorage", error);
      addWelcomeMessage();
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
     // Save chat history to localStorage whenever it changes
    try {
        if (messages.length > 1) { // Don't save initial welcome message alone
            localStorage.setItem("chatHistory", JSON.stringify(messages));
        }
    } catch (error) {
        console.error("Failed to save chat history to localStorage", error);
    }
  }, [messages, isLoading]);

  const handleToolCall = (toolRequest: any) => {
    if (toolRequest.toolName === 'updateUserDetails') {
        const { name } = toolRequest.input;
        localStorage.setItem('userName', name);
        // Maybe show a toast or some other non-chat-blocking UI element
        toast({
            title: "Name Updated!",
            description: `Morpheus will now call you ${name}.`,
        });
    }
  };

  const handleClearChat = () => {
    // This clears the visual chat, but keeps the history in localStorage
    // so the AI can still use it for context.
    setMessages([]);
    toast({
      title: "Chat Cleared",
      description: "The chat screen has been cleared, but our memories remain!",
    });
  }
  
  const handleClearHistory = () => {
    setMessages([]);
    localStorage.removeItem("chatHistory");
    localStorage.removeItem("userName");
    toast({
        title: "History Cleared",
        description: "Morpheus has forgotten your conversation. Start fresh!",
    });
    // Give a new welcome message after clearing
    setTimeout(addWelcomeMessage, 500);
  }

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const command = input.trim();

    if (command === '{clearChat}') {
      handleClearChat();
      setInput("");
      return;
    }

    if (command === '{clearHistory}') {
        handleClearHistory();
        setInput("");
        return;
    }

    const userMessageId = crypto.randomUUID();
    const userMessage: ChatMessage = {
      id: userMessageId,
      text: input,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMessage];

    const currentChatHistory = updatedMessages
        .map((msg) => `${msg.sender === 'user' ? (localStorage.getItem("userName") || 'You') : 'Morpheus'}: ${msg.text}`)
        .join("\\n");
    
    const userName = localStorage.getItem("userName") || undefined;

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const sentimentPromise = analyzeSentiment({ message: userMessage.text });
      const chatPromise = simulateChat({
        message: userMessage.text,
        chatHistory: currentChatHistory,
        userName,
      });

      const [sentimentResult, aiResponse] = await Promise.all([sentimentPromise, chatPromise]);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessageId ? { ...msg, sentiment: sentimentResult.sentiment } : msg
        )
      );

      // This is a bit of a hack since the tool call is not directly exposed.
      // We check if the response is empty, which might indicate a tool call happened.
      // A more robust solution would involve a streaming response that handles tool calls.
      if (!aiResponse.response) {
          // This is a simplified check. A production app would need a more robust
          // way to handle tool calls, probably involving streaming.
          // For now, we assume if the response is empty, a tool was called.
          // We can't get the tool output directly here without more complex state management.
          // We will rely on another mechanism to update the UI (e.g. reading from local storage on the profile page)
      } else {
        const morpheusMessage: ChatMessage = {
            id: crypto.randomUUID(),
            text: aiResponse.response,
            sender: "morpheus",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, morpheusMessage]);
      }


    } catch (error: any) {
        console.error("AI Error:", error);
        // This is a temporary workaround to handle tool calls.
        // Genkit throws an error-like object for tool calls that we can catch.
        if (error.cause && error.cause.data?.toolRequest) {
             handleToolCall(error.cause.data.toolRequest);
        } else {
            toast({
                variant: "destructive",
                title: "Oh no! Something went wrong.",
                description: "Morpheus is a bit busy right now. Please try again later.",
            });
            setMessages((prev) => prev.filter(msg => msg.id !== userMessageId));
        }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6 pr-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex animate-in fade-in-20 slide-in-from-bottom-4 duration-300 items-end gap-3",
                msg.sender === "user" ? "justify-end" : "justify-start"
              )}
            >
              {msg.sender === "morpheus" && (
                <Avatar className="h-8 w-8">
                   <AvatarImage src="https://placehold.co/100x100.png" alt="Morpheus" data-ai-hint="woman portrait" />
                   <AvatarFallback>M</AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "max-w-xs rounded-2xl p-3 shadow-md md:max-w-md",
                  msg.sender === "user"
                    ? "rounded-br-none bg-primary text-primary-foreground"
                    : "rounded-bl-none bg-card"
                )}
              >
                <p className="text-sm">{msg.text}</p>
                 <div className="mt-1.5 flex items-center gap-2">
                    <span className={cn(
                        "text-xs",
                        msg.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}>
                        {msg.timestamp}
                    </span>
                    {msg.sender === 'user' && msg.sentiment && sentimentIcons[msg.sentiment]}
                 </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-end gap-3 justify-start">
              <Avatar className="h-8 w-8">
                 <AvatarImage src="https://placehold.co/100x100.png" alt="Morpheus" data-ai-hint="woman portrait" />
                 <AvatarFallback>M</AvatarFallback>
              </Avatar>
              <div className="rounded-2xl p-3 rounded-bl-none bg-card shadow-md">
                <div className="flex items-center space-x-1">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-foreground/50 [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 animate-pulse rounded-full bg-foreground/50 [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 animate-pulse rounded-full bg-foreground/50"></span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>
      <div className="border-t bg-background/80 p-4 backdrop-blur-sm">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Say something lovely..."
            className="flex-1"
            disabled={isLoading}
            autoComplete="off"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()} aria-label="Send message">
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
