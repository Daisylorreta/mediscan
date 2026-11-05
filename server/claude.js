import Anthropic from "@anthropic-ai/sdk";

// Demo mode runs with sample answers and needs no API key.
// A blank key, or the "your-key-here" placeholder from the old .env.example, also counts as no key.
export const isDemo = () => {
  const key = (process.env.ANTHROPIC_API_KEY || "").trim();
  return !key || key === "your-key-here" || process.env.DEMO_MODE === "true";
};

let client;
export function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    const err = new Error("The AI service is not configured on the server.");
    err.status = 503;
    throw err;
  }
  client ??= new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return client;
}

export const MODEL = () => process.env.CLAUDE_MODEL || "claude-sonnet-5-5";
