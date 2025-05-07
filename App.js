import { apiKey } from './config.js';

export default function App() {
  let messages = [
    { role: 'assistant', content: 'Welcome to Sleek Gallery Guide. Ask me anything about art and galleries.' }
  ];
  let container = document.createElement('div');
  container.innerHTML = `
    <div id="chat" style="height: 80vh; overflow-y: auto; padding: 10px;"></div>
    <div style="display: flex;">
      <input id="input" style="flex: 1; padding: 10px;" placeholder="Ask something..." />
      <button id="send" style="padding: 10px;">Send</button>
    </div>
  `;

  const chat = container.querySelector('#chat');
  const input = container.querySelector('#input');
  const sendBtn = container.querySelector('#send');

  const render = () => {
    chat.innerHTML = '';
    messages.forEach(msg => {
      const div = document.createElement('div');
      div.style.margin = '10px 0';
      div.style.padding = '10px';
      div.style.borderRadius = '8px';
      div.style.background = msg.role === 'user' ? '#eee' : '#ddd';
      div.style.alignSelf = msg.role === 'user' ? 'flex-end' : 'flex-start';
      div.textContent = msg.content;
      chat.appendChild(div);
    });
    chat.scrollTop = chat.scrollHeight;
  };

  const sendMessage = async () => {
    const content = input.value.trim();
    if (!content) return;
    messages.push({ role: 'user', content });
    render();
    input.value = '';
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4-1106-preview",
        messages: [
          { role: "system", content: "You are the Sleek Gallery Guide, an expert in contemporary art and gallery experiences." },
          ...messages
        ]
      })
    });
    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Error.";
    messages.push({ role: 'assistant', content: reply });
    render();
  };

  sendBtn.onclick = sendMessage;
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  render();
  return container.outerHTML;
}
