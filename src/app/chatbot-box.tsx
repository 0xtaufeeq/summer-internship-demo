"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Content } from "@google/generative-ai";
import { useEffect, useState } from "react";
import { getGeminiResponse } from "./actions";
import ReactMarkdown from "react-markdown";

export default function ChatbotBox() {
    const initialChatHistory: Content[] = [
        {
            role: "user",
            parts: [
                {
                    text: 'You are a friendly AI tutor and chat support agent for Tenacity Learn, speaking in a personal and reflective tone."',
                },
            ],
        },
        {
            role: "model",
            parts: [
                { text: "Hello, I am Tenacity Learn AI. How can I help you today?" },
            ],
        },
    ];

    const [open, setOpen] = useState(false);
    const [chatHistory, setChatHistory] = useState<Content[]>(initialChatHistory);
    const [input, setInput] = useState("");
    const [isSendDisabled, setIsSendDisabled] = useState(false);

    const handleSend = async () => {
        if (input.trim()) {
            setIsSendDisabled(true);
            const prompt = input.trim();
            setInput("");
            const oldChat = chatHistory;
            const newChat = {
                role: "user",
                parts: [{ text: prompt }],
            };
            setChatHistory([...oldChat, newChat]);
            const response = await getGeminiResponse(prompt, chatHistory);
            setChatHistory(response.newHistory);
            setIsSendDisabled(false);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent the default action of the Enter key (like submitting a form)
            handleSend();
        }
    };

    const scrollToBottom = () => {
        const scrollArea = document.getElementById("scroll-area");
        if (scrollArea) {
            scrollArea.scrollTop = scrollArea.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    return (
        <div className="p-4">
            {!open ? (
                <div className="mr-8 mb-8">
                    <Button onClick={() => setOpen(true)}>Open Chatbot</Button>
                </div>
            ) : (
                <div className="w-80 mx-2 drop-shadow-lg flex flex-col items-end h-[30rem] p-4 bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg">
                    <div className="flex w-full justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                            <Avatar>
                                    <AvatarImage src="https://media.istockphoto.com/id/1355110818/photo/studio-shot-of-a-handsome-and-happy-young-man-posing-against-a-grey-background.jpg?s=612x612&w=0&k=20&c=T39jUOOjC8H-Op0cfd-uiNXk1a2XBn1sXkQbKIWwY7E=" />
                                <AvatarFallback className="text-[hsl(var(--muted-foreground))]">
                                    LA
                                </AvatarFallback>
                            </Avatar>
                            <p className="text-lg font-bold text-[hsl(var(--foreground))]">Tenacity Learn Chat</p>
                        </div>
                        <Button
                            variant={"ghost"}
                            onClick={() => setOpen(false)}
                            className="rounded-full font-bold hover:bg-[hsl(var(--muted))] text-lg text-[hsl(var(--foreground))]"
                        >
                            ×
                        </Button>
                    </div>
                    <div className="flex flex-col justify-center w-full h-full">
                        <div
                            id="scroll-area"
                            className="h-[23rem] overflow-y-auto w-full bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded p-2"
                        >
                            {chatHistory.slice(1).map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex mb-2 ${message.role === "model"
                                        ? "justify-start"
                                        : "justify-end"
                                        }`}
                                >
                                    <div
                                        className={`py-2 max-w-max px-3 rounded-3xl ${message.role === "user"
                                            ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-br-none text-right"
                                            : "bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] rounded-bl-none text-left"
                                            }`}
                                    >
                                        <ReactMarkdown>{message.parts[0].text}</ReactMarkdown>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex py-1 items-center mt-1 w-full">
                            <Input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="flex-grow bg-[hsl(var(--input))] text-[hsl(var(--foreground))] placeholder-[hsl(var(--muted-foreground))]"
                                placeholder="Type your message..."
                            />
                            <Button
                                onClick={handleSend}
                                disabled={isSendDisabled}
                                className="ml-2 bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] hover:bg-[hsl(var(--accent-foreground))] hover:text-[hsl(var(--accent))]"
                            >
                                Send
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}