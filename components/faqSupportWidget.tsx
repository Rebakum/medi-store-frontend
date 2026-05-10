"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useSocket } from "@/components/hooks/useSocket";
import { sendMessageToAI } from "@/lib/chatApi";


// ================= TYPES =================
type FAQ = {
  question: string;
  answer: string;
};

type Message = {
  role: "user" | "bot" | "admin";
  text: string;
};

type SupportWidgetProps = {
  faqs?: FAQ[];
};

// ================= DEFAULT FAQ =================
const defaultFaqs: FAQ[] = [
  { question: "Paracetamol available?", answer: "Yes, it is available in stock." },
  { question: "Delivery time koto?", answer: "Usually 1–3 days depending on location." },
  { question: "Prescription lagbe naki?", answer: "Yes, for certain medicines prescription is required." },
];

export default function SupportWidget({ faqs = defaultFaqs }: SupportWidgetProps) {
  const { socket, connected } = useSocket();

  const [openChat, setOpenChat] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  // ================= HELPER =================
  const addMessage = useCallback((msg: Message) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  // ================= AUTO SCROLL =================
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  // ================= AI HANDLER =================
  const handleAIResponse = async (userText: string) => {
    setIsTyping(true);
    try {
      const reply = await sendMessageToAI(userText);
      addMessage({ role: "bot", text: reply });
    } catch {
      addMessage({
        role: "bot",
        text: "⚠️ AI is not responding right now.",
      });
    } finally {
      setIsTyping(false);
    }
  };

  // ================= SEND MESSAGE =================
  const sendMessage = async () => {
    if (!message.trim()) return;

    const userText = message.trim();
    setMessage("");

    addMessage({ role: "user", text: userText });

    // socket → admin
    socket?.emit("chat-message", userText);

    // AI
    await handleAIResponse(userText);
  };

  // ================= FAQ =================
  const handleFAQClick = (faq: FAQ) => {
    setOpenChat(true);

    addMessage({ role: "user", text: faq.question });
    addMessage({ role: "bot", text: faq.answer });

    socket?.emit("chat-message", faq.question);
  };

  // ================= SOCKET =================
 useEffect(() => {
  if (!socket) return;

  const handleMessage = (msg: string) => {
    setMessages((prev) => [...prev, { role: "admin", text: msg }]);
  };

  socket.on("chat-message", handleMessage);

  //  CLEANUP FUNCTION (IMPORTANT)
  return () => {
    socket.off("chat-message", handleMessage);
  };
}, [socket]);
// const [mounted, setMounted] = useState(false);

// useEffect(() => {
//   setMounted(true);
// }, []);

// if (!mounted) return null;

  return (
    <>
      {/* FAQ */}
      <div className="max-w-3xl p-4 mx-auto my-10">
        <h2 className="mb-4 text-2xl font-bold">❓ Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {faqs.map((faq, index) => (
            <div
              key={index}
              onClick={() => handleFAQClick(faq)}
              className="p-4 transition border rounded-lg cursor-pointer hover:bg-blue-50"
            >
              {faq.question}
            </div>
          ))}
        </div>
      </div>

      {/* BUTTON */}
      <button
        onClick={() => setOpenChat((prev) => !prev)}
        className="fixed px-6 py-3 text-white bg-linear-to-r from-[#2EB0D9] to-[#38CAE4] rounded-full right-6 bottom-6"
      >
        {openChat ? "✖ Close" : "💬 Chat"}
      </button>

      {/* CHAT BOX */}
      <div
        className={`fixed  z-[1000] shadow-lg bottom-24 right-6 w-80 md:w-96 bg-white border rounded-2xl flex flex-col transition ${
          openChat ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
        style={{ height: "400px" }}
      >
        {/* HEADER */}
        <div className="p-4 text-white bg-linear-to-r from-[#2EB0D9] to-[#38CAE4]">
          <p className="font-bold">MediStore AI</p>
          <span className="text-xs">{connected ? "● Online" : "● Offline"}</span>
        </div>

        {/* MESSAGES */}
        <div ref={scrollRef} className="flex-1 p-4 space-y-3 overflow-y-auto">
          {messages.map((msg, i) => (
            <div key={i} className={msg.role === "user" ? "text-right" : "text-left"}>
              <p className="inline-block p-2 text-sm bg-gray-200 rounded-lg">
                {msg.text}
              </p>
            </div>
          ))}
          {isTyping && <p className="text-xs text-gray-400">AI is typing...</p>}
        </div>

        {/* INPUT */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex gap-2 p-3 bg-gray-200 border-t"
        >
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-full"
            placeholder="Type..."
          />
          <button className="px-3 text-white bg-linear-to-r from-[#2EB0D9] to-[#38CAE4] rounded-full">➤</button>
        </form>
      </div>
    </>
  );
}