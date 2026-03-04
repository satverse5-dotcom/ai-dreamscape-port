const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const askAI = async (message: string) => {
  const res = await fetch(`${API_URL}/api/ai`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  return res.json();
};