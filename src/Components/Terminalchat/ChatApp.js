import { useState, useRef, useEffect } from "react";

const formatTime = () =>
  new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

const SESSION_ID = Math.random().toString(36).slice(2, 10).toUpperCase();

// Moved outside component to fix ESLint react-hooks/exhaustive-deps warning
const BOOT_SEQUENCE = [
  "INITIALIZING CLAUDE TERMINAL...",
  "LOADING LANGUAGE MODEL.............. OK",
  "ESTABLISHING API CONNECTION......... OK",
  "MEMORY MODE: EPHEMERAL (NO STORAGE). OK",
  "ENCRYPTION: NONE (LOCAL SESSION).... OK",
  "────────────────────────────────────────",
  "READY.",
];

export default function ChatApp() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content:
        "CLAUDE AI TERMINAL v2.4.1 — SESSION " +
        SESSION_ID +
        "\nAll messages are ephemeral. No data is stored or persisted.\nType your query and press ENTER to transmit.\n\nSystem ready.",
      time: formatTime(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [bootDone, setBootDone] = useState(false);
  const [bootLines, setBootLines] = useState([]);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const streamingRef = useRef("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < BOOT_SEQUENCE.length) {
        setBootLines((prev) => [...prev, BOOT_SEQUENCE[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setBootDone(true), 400);
      }
    }, 180);
    return () => clearInterval(interval);
  }, []); // no warning now — BOOT_SEQUENCE is a module-level constant

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText, bootLines]);

  useEffect(() => {
    if (bootDone) inputRef.current?.focus();
  }, [bootDone]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg = { id: Date.now(), role: "user", content: text, time: formatTime() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);
    setStreamingText("");
    streamingRef.current = "";

    try {
      const apiMessages = updatedMessages.map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          stream: true,
          system:
            "You are a terminal AI assistant. Respond in a clear, direct, slightly technical tone. No markdown formatting — plain text only. No asterisks, no headers. Short to medium responses unless detail is needed.",
          messages: apiMessages,
        }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((l) => l.trim());
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.type === "content_block_delta" && parsed.delta?.text) {
                streamingRef.current += parsed.delta.text;
                setStreamingText(streamingRef.current);
              }
            } catch {}
          }
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant",
          content: streamingRef.current,
          time: formatTime(),
        },
      ]);
      setStreamingText("");
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant",
          content: "ERROR: Connection failed. Check API access and retry.",
          time: formatTime(),
          error: true,
        },
      ]);
    } finally {
      setIsTyping(false);
      streamingRef.current = "";
      inputRef.current?.focus();
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={s.root}>
      <style>{css}</style>

      {/* Title bar */}
      <div style={s.titleBar}>
        <div style={s.titleDots}>
          <span style={{ ...s.dot, background: "#ff5f57" }} />
          <span style={{ ...s.dot, background: "#febc2e" }} />
          <span style={{ ...s.dot, background: "#28c840" }} />
        </div>
        <span style={s.titleText}>claude-terminal — session:{SESSION_ID}</span>
        <span style={s.titleRight}>NO STORAGE</span>
      </div>

      {/* Body */}
      <div style={s.body}>
        {!bootDone ? (
          <div style={s.boot}>
            {bootLines.map((line, i) => (
              <div
                key={i}
                className="fade-in"
                style={{ ...s.bootLine, animationDelay: `${i * 0.05}s` }}
              >
                {line}
              </div>
            ))}
            <span className="blink-cursor">█</span>
          </div>
        ) : (
          <>
            {/* Messages */}
            <div style={s.messages}>
              {messages.map((msg) => (
                <TerminalMessage key={msg.id} msg={msg} />
              ))}

              {isTyping && (
                <div style={s.msgBlock}>
                  <div style={s.prompt}>
                    <span style={s.sysTag}>SYS</span>
                    <span style={s.promptArrow}>&gt;</span>
                  </div>
                  <div style={s.msgContent}>
                    {streamingText ? (
                      <>
                        {streamingText}
                        <span className="blink-cursor" style={s.inlineCursor}>
                          █
                        </span>
                      </>
                    ) : (
                      <span style={s.processing}>
                        PROCESSING<span className="ellipsis-anim" />
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={s.inputRow}>
              <span style={s.inputPrompt}>
                <span style={s.inputUser}>USR</span>
                <span style={s.inputArrow}>&gt;</span>
              </span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                style={s.input}
                placeholder={isTyping ? "AWAITING RESPONSE..." : "ENTER COMMAND..."}
                disabled={isTyping}
                autoComplete="off"
                spellCheck="false"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isTyping}
                style={{
                  ...s.sendBtn,
                  opacity: !input.trim() || isTyping ? 0.3 : 1,
                  cursor: !input.trim() || isTyping ? "default" : "pointer",
                }}
              >
                [SEND]
              </button>
            </div>

            {/* Status bar */}
            <div style={s.statusBar}>
              <span>
                STATUS:{" "}
                {isTyping ? (
                  <span style={s.statusActive}>TRANSMITTING</span>
                ) : (
                  <span style={s.statusReady}>READY</span>
                )}
              </span>
              <span>MSGS: {messages.length}</span>
              <span>MEM: EPHEMERAL</span>
              <span>{new Date().toISOString().slice(0, 19).replace("T", " ")}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function TerminalMessage({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div style={s.msgBlock} className="line-in">
      <div style={s.prompt}>
        <span style={isUser ? s.userTag : s.sysTag}>{isUser ? "USR" : "SYS"}</span>
        <span style={s.promptArrow}>&gt;</span>
        <span style={s.msgTime}>[{msg.time}]</span>
      </div>
      <div
        style={{
          ...s.msgContent,
          color: msg.error ? "#ff5555" : isUser ? "#ffffff" : "#c8c8c8",
        }}
      >
        {msg.content}
      </div>
      <div style={s.divider}>{"─".repeat(60)}</div>
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes lineIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes blink {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0; }
  }

  .fade-in { animation: fadeIn 0.25s ease both; }
  .line-in  { animation: lineIn 0.15s ease both; }
  .blink-cursor { animation: blink 1s step-end infinite; color: #ffffff; }

  .ellipsis-anim { display: inline-block; }
  .ellipsis-anim::after {
    content: '';
    animation: ellipsisAnim 1.2s steps(4, end) infinite;
  }
  @keyframes ellipsisAnim {
    0%   { content: ''; }
    25%  { content: '.'; }
    50%  { content: '..'; }
    75%  { content: '...'; }
  }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #0a0a0a; }
  ::-webkit-scrollbar-thumb { background: #333; border-radius: 0; }

  input::placeholder { color: #3a3a3a; font-family: 'Share Tech Mono', monospace; }
  input:focus { outline: none; }
  button:hover:not(:disabled) { background: #1a1a1a !important; color: #ffffff !important; border-color: #555 !important; }
`;

const s = {
  root: {
    fontFamily: "'Share Tech Mono', monospace",
    background: "#0a0a0a",
    color: "#c8c8c8",
    height: "100vh",
    maxWidth: 860,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    borderLeft: "1px solid #1e1e1e",
    borderRight: "1px solid #1e1e1e",
  },
  titleBar: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "8px 16px",
    background: "#111111",
    borderBottom: "1px solid #222",
    flexShrink: 0,
  },
  titleDots: { display: "flex", gap: 6 },
  dot: { width: 11, height: 11, borderRadius: "50%", display: "block" },
  titleText: {
    flex: 1,
    fontSize: 11,
    color: "#444",
    letterSpacing: "0.1em",
    textAlign: "center",
  },
  titleRight: { fontSize: 11, color: "#2a2a2a", letterSpacing: "0.08em" },
  body: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  boot: {
    padding: "24px 28px",
    lineHeight: 2,
    fontSize: 13,
    letterSpacing: "0.05em",
    color: "#555",
  },
  bootLine: { opacity: 0 },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "16px 20px",
    display: "flex",
    flexDirection: "column",
  },
  msgBlock: { marginBottom: 14 },
  prompt: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
    fontSize: 11,
    letterSpacing: "0.08em",
  },
  promptArrow: { color: "#444" },
  userTag: { color: "#888", fontSize: 11 },
  sysTag: { color: "#555", fontSize: 11 },
  msgTime: { color: "#2e2e2e", fontSize: 10 },
  msgContent: {
    fontSize: 14,
    lineHeight: 1.75,
    paddingLeft: 8,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    letterSpacing: "0.02em",
  },
  divider: { color: "#1a1a1a", fontSize: 11, marginTop: 10, userSelect: "none" },
  processing: { color: "#555", fontSize: 13, letterSpacing: "0.1em" },
  inlineCursor: { marginLeft: 2, fontSize: 14 },
  inputRow: {
    display: "flex",
    alignItems: "center",
    padding: "10px 20px",
    borderTop: "1px solid #1e1e1e",
    background: "#0d0d0d",
    flexShrink: 0,
    gap: 8,
  },
  inputPrompt: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    userSelect: "none",
  },
  inputUser: { color: "#666", fontSize: 11, letterSpacing: "0.08em" },
  inputArrow: { color: "#444", fontSize: 14 },
  input: {
    flex: 1,
    background: "transparent",
    border: "none",
    color: "#ffffff",
    fontSize: 14,
    letterSpacing: "0.04em",
    caretColor: "#ffffff",
    fontFamily: "'Share Tech Mono', monospace",
  },
  sendBtn: {
    background: "transparent",
    border: "1px solid #2a2a2a",
    color: "#444",
    fontSize: 11,
    letterSpacing: "0.1em",
    padding: "5px 12px",
    transition: "all 0.15s",
    flexShrink: 0,
  },
  statusBar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "5px 20px",
    fontSize: 10,
    color: "#2a2a2a",
    borderTop: "1px solid #161616",
    letterSpacing: "0.08em",
    background: "#080808",
    flexShrink: 0,
  },
  statusReady: { color: "#3a3a3a" },
  statusActive: { color: "#aaaaaa", animation: "blink 1s step-end infinite" },
};