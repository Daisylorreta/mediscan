// Demo mode: sample answers used when no ANTHROPIC_API_KEY is set (or DEMO_MODE=true).
// These are fixed, general replies for testing the app. They are not real AI output.

const has = (text, words) => words.some((w) => text.includes(w));

export function demoChatReply(message, medications) {
  const text = message.toLowerCase();

  if (has(text, ["suicid", "kill myself", "end my life", "harm myself", "self-harm"])) {
    return "I'm really sorry you're feeling this way. Please contact emergency services (112 in Nigeria) or go to the nearest emergency department now, and reach out to someone you trust so you aren't alone.";
  }

  if (
    has(text, [
      "chest pain",
      "can't breathe",
      "cannot breathe",
      "difficulty breathing",
      "trouble breathing",
      "overdose",
      "seizure",
      "unconscious",
      "fainted",
      "heavy bleeding",
      "swelling of my face",
      "swollen lips",
      "stroke",
    ])
  ) {
    return "What you describe could be an emergency. Please call 112 or go to the nearest emergency department right now. Don't wait for it to pass, and don't drive yourself if you feel faint.";
  }

  const mentioned = medications.find((m) => text.includes(m.name.toLowerCase()));
  if (mentioned) {
    const details = [mentioned.dosage, mentioned.frequency].filter(Boolean).join(", ");
    return `I can see ${mentioned.name}${details ? ` (${details})` : ""} in your uploaded medications. Take it exactly as prescribed${mentioned.prescribedBy ? ` by ${mentioned.prescribedBy}` : ""}, and don't change the dose on your own. If you have a specific problem with it, tell me what you're noticing, or ask your pharmacist or prescriber.`;
  }

  if (has(text, ["missed", "forgot", "skipped"])) {
    return "For a missed dose, check the leaflet that came with the medicine, or ask your pharmacist what to do for that exact drug. In general, don't double up on the next dose unless a health professional tells you to.";
  }

  if (has(text, ["side effect", "nausea", "dizzy", "rash", "vomit", "headache", "itch"])) {
    const names = medications.map((m) => m.name).join(", ");
    return `Side effects can come from any of your current medicines${names ? ` (${names})` : ""}. Note which one you started most recently and when the symptom began, then check with your pharmacist or prescriber. If you get swelling of the face or lips, or trouble breathing, go to an emergency department immediately.`;
  }

  if (has(text, ["interact", "together", "mix", "combine", "alcohol"])) {
    return "Some medicines don't mix well with each other or with alcohol. Tell your pharmacist every medicine and supplement you take, including herbal ones, and ask them to check before you combine anything.";
  }

  if (medications.length) {
    return `I can see ${medications.length} medication${medications.length === 1 ? "" : "s"} on your profile: ${medications.map((m) => m.name).join(", ")}. Ask me about any of them, such as timing, side effects, or a missed dose.`;
  }

  return "You haven't uploaded any medications yet. Add one on the Upload page and I can answer questions about it. You can also ask me general questions about taking medicines safely.";
}

export function demoScan() {
  return {
    name: "Paracetamol",
    dosage: "500 mg",
    frequency: "Every 6 hours if needed",
    prescribedBy: "",
  };
}
