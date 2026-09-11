const messagesEl = document.getElementById("messages");
const form = document.getElementById("form");
const input = document.getElementById("input");

const history = [
  { role: "system", content: "Ты полезный ассистент." }
];

function addMessage(role, text) {
  const div = document.createElement("div");
  div.className = "msg " + (role === "user" ? "user" : "bot");
  div.textContent = text;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  addMessage("user", text);
  history.push({ role: "user", content: text });
  input.value = "";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history })
    });
    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content ?? "Ошибка ответа";
    addMessage("bot", reply);
    history.push({ role: "assistant", content: reply });
  } catch {
    addMessage("bot", "Ошибка сети");
  }
});