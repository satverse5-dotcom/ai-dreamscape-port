import "dotenv/config";

const key = process.env.GEMINI_API_KEY;

if (!key || key === "your_gemini_api_key_here") {
    console.error("❌ GEMINI_API_KEY not set or still placeholder in .env");
    process.exit(1);
}

console.log("🔑 API Key loaded:", key.slice(0, 10) + "...");

const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
    {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: "Say hello in one sentence" }] }],
        }),
    }
);

const data = await res.json();

if (data.error) {
    console.error("❌ Gemini API Error:", data.error.code, data.error.message);
} else {
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log("✅ Gemini API working!");
    console.log("💬 Reply:", reply);
}
