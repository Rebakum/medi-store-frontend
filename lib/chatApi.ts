// ================= AI SERVICE =================

export const sendMessageToAI = async (message: string): Promise<string> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data?.message || "AI request failed");
    }

    return data.data.reply;
  } catch (error) {
    console.error("AI Service Error:", error);
    throw error;
  }
};