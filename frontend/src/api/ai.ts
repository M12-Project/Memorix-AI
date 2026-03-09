export async function checkAnswer(question: string, correct: string, user: string) {
  const prompt = `
Vergleiche die Nutzerantwort mit der korrekten Antwort.

Frage: ${question}
Korrekte Antwort: ${correct}
Nutzerantwort: ${user}

Gib zurück:
- Bewertung (richtig / teilweise / falsch)
- Korrektur
- Erklärung
`;

  const response = await fetch("https://api.githubcopilot.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${import.meta.env.VITE_COPILOT_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    })
  });

  return response.json();
}
