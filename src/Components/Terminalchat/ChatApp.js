import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";

// ── Firebase config ──────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyA7n18krwD0_f0c8tJgymSBkgo34Oa8zQA",
  authDomain: "terminal-chat-d8787.firebaseapp.com",
  projectId: "terminal-chat-d8787",
  storageBucket: "terminal-chat-d8787.firebasestorage.app",
  messagingSenderId: "837729657835",
  appId: "1:837729657835:web:00484e1897a8cc49a56fae",
  measurementId: "G-QE75Q0DMY0",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// ── Helpers ──────────────────────────────────────────────────────
const formatTime = () =>
  new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

const generateRoomId = () =>
  Math.random().toString(36).slice(2, 8).toUpperCase();

const generateUserId = () =>
  Math.random().toString(36).slice(2, 10).toUpperCase();

const SESSION_USER_ID = generateUserId();

// ── Delete entire room (messages + presence) when empty ──────────
async function deleteRoomIfEmpty(roomId) {
  const presenceSnap = await getDocs(
    collection(db, "rooms", roomId, "presence")
  );
  if (presenceSnap.size > 0) return; // still users online, abort

  // Delete all messages
  const messagesSnap = await getDocs(
    collection(db, "rooms", roomId, "messages")
  );
  const deletions = [];
  messagesSnap.forEach((d) => deletions.push(deleteDoc(d.ref)));
  presenceSnap.forEach((d) => deletions.push(deleteDoc(d.ref)));
  await Promise.all(deletions);

  // Delete the room doc itself if it exists
  await deleteDoc(doc(db, "rooms", roomId));
}

// ── Screens ──────────────────────────────────────────────────────
const SCREEN = { SETUP: "SETUP", CHAT: "CHAT" };

// ── Boot lines ───────────────────────────────────────────────────
const BOOT_SEQUENCE = [
  "INITIALIZING TERMINAL CHAT...",
  "LOADING FIREBASE SDK................ OK",
  "ESTABLISHING FIRESTORE CONNECTION... OK",
  "REAL-TIME SYNC...................... ENABLED",
  "SCREENSHOT DETERRENT................ ACTIVE",
  "──────────────────────────────────────────",
  "READY.",
];

export default function ChatApp() {
  const { roomCode } = useParams(); // e.g. /se-chat/AB12CD
  const navigate = useNavigate();

  // If URL has a room code AND we have a username saved, auto-rejoin
  const savedRoom = sessionStorage.getItem("tc_roomId");
  const savedUser = sessionStorage.getItem("tc_username");
  const urlRoomCode = roomCode ? roomCode.toUpperCase() : null;

  // Sync sessionStorage room with URL room code if they differ
  useEffect(() => {
    if (urlRoomCode && savedUser && savedRoom !== urlRoomCode) {
      // URL has a different room — update session to match URL
      sessionStorage.setItem("tc_roomId", urlRoomCode);
      if (!sessionStorage.getItem("tc_userId")) {
        sessionStorage.setItem("tc_userId", SESSION_USER_ID);
      }
    }
  }, [urlRoomCode, savedUser, savedRoom]);

  const hasSession = !!(urlRoomCode && savedUser);

  const [screen, setScreen] = useState(hasSession ? SCREEN.CHAT : SCREEN.SETUP);
  const [bootDone, setBootDone] = useState(hasSession);
  const [bootLines, setBootLines] = useState(hasSession ? BOOT_SEQUENCE : []);
  const [windowFocused, setWindowFocused] = useState(true);

  useEffect(() => {
    if (hasSession) return;
    let i = 0;
    const iv = setInterval(() => {
      if (i < BOOT_SEQUENCE.length) {
        setBootLines((p) => [...p, BOOT_SEQUENCE[i]]);
        i++;
      } else {
        clearInterval(iv);
        setTimeout(() => setBootDone(true), 350);
      }
    }, 160);
    return () => clearInterval(iv);
  }, [hasSession]);

  // ── Screenshot deterrent: blur when window loses focus ──────────
  useEffect(() => {
    const onBlur  = () => setWindowFocused(false);
    const onFocus = () => setWindowFocused(true);
    window.addEventListener("blur",  onBlur);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("blur",  onBlur);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  // ── Block right-click ────────────────────────────────────────────
  useEffect(() => {
    const block = (e) => e.preventDefault();
    document.addEventListener("contextmenu", block);
    return () => document.removeEventListener("contextmenu", block);
  }, []);

  return (
    <div style={s.root}>
      <style>{css}</style>
      <TitleBar />

      {/* Blur overlay when window not focused */}
      {!windowFocused && (
        <div style={s.blurOverlay}>
          <span style={s.blurText}>⚠ WINDOW UNFOCUSED — CONTENT HIDDEN</span>
        </div>
      )}

      <div style={{ ...s.body, filter: windowFocused ? "none" : "blur(18px)", transition: "filter 0.2s" }}>
        {!bootDone ? (
          <Boot lines={bootLines} />
        ) : screen === SCREEN.SETUP ? (
          <SetupScreen onEnter={setScreen} navigate={navigate} urlRoomCode={urlRoomCode} />
        ) : (
          <ChatScreen onLeave={() => setScreen(SCREEN.SETUP)} navigate={navigate} />
        )}
      </div>
    </div>
  );
}

// ── Boot ─────────────────────────────────────────────────────────
function Boot({ lines }) {
  return (
    <div style={s.boot}>
      {lines.map((l, i) => (
        <div key={i} className="fade-in" style={{ animationDelay: `${i * 0.04}s`, opacity: 0 }}>
          {l}
        </div>
      ))}
      <span className="blink-cursor">█</span>
    </div>
  );
}

// ── Setup screen ─────────────────────────────────────────────────
function SetupScreen({ onEnter, navigate, urlRoomCode }) {
  const [username, setUsername] = useState("");
  const [roomInput, setRoomInput] = useState(urlRoomCode || "");
  const [mode, setMode] = useState(urlRoomCode ? "join" : null);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, [mode]);

  const handleCreate = () => {
    if (!username.trim()) { setError("USERNAME REQUIRED"); return; }
    const id = generateRoomId();
    sessionStorage.setItem("tc_username", username.trim().toUpperCase());
    sessionStorage.setItem("tc_roomId", id);
    sessionStorage.setItem("tc_userId", SESSION_USER_ID);
    sessionStorage.setItem("tc_isOwner", "true");
    navigate(`/se-chat/${id}`); // update URL to room code
    onEnter(SCREEN.CHAT);
  };

  const handleJoin = () => {
    if (!username.trim()) { setError("USERNAME REQUIRED"); return; }
    if (!roomInput.trim()) { setError("ROOM ID REQUIRED"); return; }
    sessionStorage.setItem("tc_username", username.trim().toUpperCase());
    sessionStorage.setItem("tc_roomId", roomInput.trim().toUpperCase());
    sessionStorage.setItem("tc_userId", SESSION_USER_ID);
    sessionStorage.removeItem("tc_isOwner");
    navigate(`/se-chat/${roomInput.trim().toUpperCase()}`); // update URL
    onEnter(SCREEN.CHAT);
  };

  return (
    <div style={s.setup} className="fade-in">
      <div style={s.setupTitle}>TERMINAL CHAT</div>
      <div style={s.setupSub}>end-to-end ephemeral · powered by firebase</div>
      <div style={s.divider}>{"─".repeat(46)}</div>

      <div style={s.field}>
        <span style={s.label}>SET USERNAME</span>
        <div style={s.inputRow2}>
          <span style={s.arrow}>&gt;</span>
          <input
            ref={mode === null ? inputRef : undefined}
            style={s.setupInput}
            value={username}
            onChange={(e) => { setUsername(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && mode && (mode === "create" ? handleCreate() : handleJoin())}
            placeholder="e.g. GHOST"
            autoComplete="off"
            spellCheck="false"
            maxLength={16}
          />
        </div>
      </div>

      {!mode && (
        <div style={s.modeRow}>
          <button style={s.modeBtn} onClick={() => setMode("create")}>[CREATE ROOM]</button>
          <span style={s.modeSep}>or</span>
          <button style={s.modeBtn} onClick={() => setMode("join")}>[JOIN ROOM]</button>
        </div>
      )}

      {mode === "create" && (
        <div style={s.field} className="fade-in">
          <div style={s.setupHint}>A room code will be generated for you to share.</div>
          <button style={s.actionBtn} onClick={handleCreate}>[CREATE & ENTER]</button>
          <button style={s.backBtn} onClick={() => setMode(null)}>[BACK]</button>
        </div>
      )}

      {mode === "join" && (
        <div style={s.field} className="fade-in">
          <span style={s.label}>ROOM CODE</span>
          <div style={s.inputRow2}>
            <span style={s.arrow}>&gt;</span>
            <input
              ref={inputRef}
              style={s.setupInput}
              value={roomInput}
              onChange={(e) => { setRoomInput(e.target.value.toUpperCase()); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              placeholder="e.g. AB12CD"
              autoComplete="off"
              spellCheck="false"
              maxLength={8}
            />
          </div>
          <button style={s.actionBtn} onClick={handleJoin}>[JOIN ROOM]</button>
          <button style={s.backBtn} onClick={() => setMode(null)}>[BACK]</button>
        </div>
      )}

      {error && <div style={s.error}>! {error}</div>}
    </div>
  );
}

// ── Chat screen ──────────────────────────────────────────────────
function ChatScreen({ onLeave, navigate }) {
  const username = sessionStorage.getItem("tc_username") || "ANON";
  const roomId   = sessionStorage.getItem("tc_roomId")   || "UNKNOWN";
  const userId   = sessionStorage.getItem("tc_userId")   || SESSION_USER_ID;
  const isOwner  = sessionStorage.getItem("tc_isOwner") === "true";

  const [messages, setMessages]       = useState([]);
  const [input, setInput]             = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]); // [{username, userId}]
  const [copied, setCopied]           = useState(false);
  const [kicked, setKicked]           = useState(false);
  const [roomDeleted, setRoomDeleted] = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  // ── Presence + auto-delete room when empty ───────────────────
  useEffect(() => {
    const presenceRef = doc(db, "rooms", roomId, "presence", userId);
    setDoc(presenceRef, { username, joinedAt: serverTimestamp() });

    const unsub = onSnapshot(
      collection(db, "rooms", roomId, "presence"),
      (snap) => {
        const users = snap.docs.map((d) => ({ username: d.data().username, userId: d.id }));
        setOnlineUsers(users);
        // Check if this user has been kicked or room was deleted
        const stillHere = snap.docs.find((d) => d.id === userId);
        if (!stillHere && snap.docs.length === 0) {
          setRoomDeleted(true); // everyone is gone — room was deleted
        } else if (!stillHere && snap.docs.length > 0) {
          setKicked(true); // others still here — we were kicked
        }
      }
    );

    // Warn user before leaving/refreshing — do NOT auto-remove presence
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = ""; // triggers browser's native "Leave site?" dialog
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      unsub();
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // Do NOT delete presence here — user may just be refreshing
    };
  }, [roomId, userId, username]);

  // ── Messages listener ────────────────────────────────────────
  useEffect(() => {
    const q = query(
      collection(db, "rooms", roomId, "messages"),
      orderBy("timestamp", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [roomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => { inputRef.current?.focus(); }, []);

  // ── Send ─────────────────────────────────────────────────────
  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    await addDoc(collection(db, "rooms", roomId, "messages"), {
      text,
      username,
      userId,
      timestamp: serverTimestamp(),
      localTime: formatTime(),
    });
  }, [input, roomId, username, userId]);

  const deleteRoom = async () => {
    if (!window.confirm("DELETE this room for everyone? This cannot be undone.")) return;
    // Delete all messages
    const messagesSnap = await getDocs(collection(db, "rooms", roomId, "messages"));
    const presenceSnap = await getDocs(collection(db, "rooms", roomId, "presence"));
    const deletions = [];
    messagesSnap.forEach((d) => deletions.push(deleteDoc(d.ref)));
    presenceSnap.forEach((d) => deletions.push(deleteDoc(d.ref)));
    await Promise.all(deletions);
    await deleteDoc(doc(db, "rooms", roomId));
    sessionStorage.removeItem("tc_username");
    sessionStorage.removeItem("tc_roomId");
    sessionStorage.removeItem("tc_userId");
    sessionStorage.removeItem("tc_isOwner");
    navigate("/se-chat");
    onLeave();
  };

  const kickUser = async (targetUserId, targetUsername) => {
    if (!isOwner) return;
    // Remove their presence — they will detect this and be shown the kicked screen
    await deleteDoc(doc(db, "rooms", roomId, "presence", targetUserId));
    // Post a system message
    await addDoc(collection(db, "rooms", roomId, "messages"), {
      text: `⚠ ${targetUsername} was removed from the room.`,
      username: "SYSTEM",
      userId: "SYSTEM",
      timestamp: serverTimestamp(),
      localTime: formatTime(),
      system: true,
    });
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyRoom = () => {
    const roomUrl = `${window.location.origin}/se-chat/${roomId}`;
    navigator.clipboard.writeText(roomUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const leaveRoom = async () => {
    const presenceRef = doc(db, "rooms", roomId, "presence", userId);
    await deleteDoc(presenceRef);
    await deleteRoomIfEmpty(roomId);
    // Clear session so refresh goes to setup, not back to this room
    sessionStorage.removeItem("tc_username");
    sessionStorage.removeItem("tc_roomId");
    sessionStorage.removeItem("tc_userId");
    sessionStorage.removeItem("tc_isOwner");
    navigate("/se-chat");
    onLeave();
  };

  if (roomDeleted) {
    return (
      <div style={s.kickedScreen}>
        <div style={s.kickedTitle}>⚠ ROOM DELETED</div>
        <div style={s.kickedMsg}>This room has been deleted by a user.</div>
        <button style={s.actionBtn} onClick={() => {
          sessionStorage.removeItem("tc_username");
          sessionStorage.removeItem("tc_roomId");
          sessionStorage.removeItem("tc_userId");
          sessionStorage.removeItem("tc_isOwner");
          navigate("/se-chat");
          onLeave();
        }}>[BACK TO SETUP]</button>
      </div>
    );
  }

  if (kicked) {
    return (
      <div style={s.kickedScreen}>
        <div style={s.kickedTitle}>⚠ REMOVED</div>
        <div style={s.kickedMsg}>You have been removed from this room by the host.</div>
        <button style={s.actionBtn} onClick={() => {
          sessionStorage.removeItem("tc_username");
          sessionStorage.removeItem("tc_roomId");
          sessionStorage.removeItem("tc_userId");
          sessionStorage.removeItem("tc_isOwner");
          navigate("/se-chat");
          onLeave();
        }}>[BACK TO SETUP]</button>
      </div>
    );
  }

  return (
    <>
      <div style={s.roomBar}>
        <span style={s.roomLabel}>ROOM:</span>
        <span style={s.roomId}>{roomId}</span>
        <button style={s.copyBtn} onClick={copyRoom}>
          {copied ? "[COPIED!]" : "[COPY LINK]"}
        </button>
        <span style={s.onlineLabel}>
          ONLINE: {onlineUsers.map((u) => u.username).join(", ") || "..."}
        </span>
        <button style={s.leaveBtn} onClick={leaveRoom}>[LEAVE]</button>
        <button style={s.deleteBtn} onClick={deleteRoom}>[DELETE ROOM]</button>
      </div>

      <div style={s.messages}>
        <div style={s.systemMsg}>
          ── joined as <span style={s.ownName}>{username}</span> · share link:{" "}
          <span style={s.roomCode}>{window.location.origin}/se-chat/{roomId}</span> ──
        </div>
        <div style={s.systemMsg}>
          ── content blurs when window loses focus · right-click disabled ──
        </div>

        {/* Owner kick panel */}
        {isOwner && onlineUsers.filter((u) => u.userId !== userId).length > 0 && (
          <div style={s.kickPanel}>
            <span style={s.kickPanelLabel}>HOST CONTROLS:</span>
            {onlineUsers
              .filter((u) => u.userId !== userId)
              .map((u) => (
                <button
                  key={u.userId}
                  style={s.kickBtn}
                  onClick={() => kickUser(u.userId, u.username)}
                >
                  [KICK {u.username}]
                </button>
              ))}
          </div>
        )}

        {messages.map((msg) => {
          const isOwn = msg.userId === userId;
          return (
            <div key={msg.id} style={s.msgBlock} className="line-in">
              <div style={s.prompt}>
                <span style={isOwn ? s.ownTag : s.otherTag}>{msg.username}</span>
                <span style={s.promptArrow}>&gt;</span>
                <span style={s.msgTime}>[{msg.localTime || "??:??:??"}]</span>
              </div>
              <div style={{ ...s.msgContent, color: isOwn ? "#ffffff" : "#c8c8c8" }}>
                {msg.text}
              </div>
              <div style={s.dividerLine}>{"─".repeat(60)}</div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      <div style={s.inputRow}>
        <span style={s.inputPrompt}>
          <span style={s.inputUser}>{username}</span>
          <span style={s.inputArrow}>&gt;</span>
        </span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          style={s.input}
          placeholder="TYPE MESSAGE..."
          autoComplete="off"
          spellCheck="false"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          style={{ ...s.sendBtn, opacity: !input.trim() ? 0.3 : 1 }}
        >
          [SEND]
        </button>
      </div>

      <div style={s.statusBar}>
        <span>STATUS: <span style={s.statusReady}>CONNECTED</span></span>
        <span>MSGS: {messages.length}</span>
        <span>USERS: {onlineUsers.length}</span>
        <span>{new Date().toISOString().slice(0, 19).replace("T", " ")}</span>
      </div>
    </>
  );
}

// ── Title bar ────────────────────────────────────────────────────
function TitleBar() {
  return (
    <div style={s.titleBar}>
      <div style={s.titleDots}>
        <span style={{ ...s.dot, background: "#ff5f57" }} />
        <span style={{ ...s.dot, background: "#febc2e" }} />
        <span style={{ ...s.dot, background: "#28c840" }} />
      </div>
      <span style={s.titleText}>terminal-chat · firebase realtime</span>
      <span style={s.titleRight}>NO AI</span>
    </div>
  );
}

// ── CSS ──────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(5px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes lineIn { from { opacity:0; } to { opacity:1; } }
  @keyframes blink  { 0%,49%{opacity:1;} 50%,100%{opacity:0;} }

  .fade-in       { animation: fadeIn 0.3s ease both; }
  .line-in       { animation: lineIn 0.15s ease both; }
  .blink-cursor  { animation: blink 1s step-end infinite; color:#fff; }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #0a0a0a; }
  ::-webkit-scrollbar-thumb { background: #2a2a2a; }

  input::placeholder { color: #333; font-family: 'Share Tech Mono', monospace; }
  input:focus { outline: none; }
  button { font-family: 'Share Tech Mono', monospace; cursor: pointer; }
  button:hover:not(:disabled) { background: #1a1a1a !important; color: #fff !important; border-color: #555 !important; }
  button:disabled { cursor: default; }

  /* Disable text selection across the app */
  * { -webkit-user-select: none; user-select: none; }
  /* Re-enable only for the message input */
  input { -webkit-user-select: text; user-select: text; }
`;

// ── Styles ───────────────────────────────────────────────────────
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
    position: "relative",
  },
  body: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },

  // blur overlay
  blurOverlay: {
    position: "absolute",
    inset: 0,
    zIndex: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
  },
  blurText: {
    fontSize: 12,
    color: "#444",
    letterSpacing: "0.12em",
    border: "1px solid #222",
    padding: "10px 20px",
    background: "#0a0a0a",
  },

  // title
  titleBar: {
    display: "flex", alignItems: "center", gap: 12,
    padding: "8px 16px", background: "#111",
    borderBottom: "1px solid #222", flexShrink: 0,
  },
  titleDots: { display: "flex", gap: 6 },
  dot: { width: 11, height: 11, borderRadius: "50%", display: "block" },
  titleText: { flex: 1, fontSize: 11, color: "#444", letterSpacing: "0.1em", textAlign: "center" },
  titleRight: { fontSize: 11, color: "#2a2a2a", letterSpacing: "0.08em" },

  // boot
  boot: { padding: "24px 28px", lineHeight: 2.1, fontSize: 13, letterSpacing: "0.05em", color: "#555" },

  // setup
  setup: { padding: "32px 28px", display: "flex", flexDirection: "column", gap: 18 },
  setupTitle: { fontSize: 22, color: "#fff", letterSpacing: "0.2em" },
  setupSub: { fontSize: 11, color: "#333", letterSpacing: "0.1em" },
  divider: { color: "#1e1e1e", fontSize: 12, userSelect: "none" },
  field: { display: "flex", flexDirection: "column", gap: 8 },
  label: { fontSize: 11, color: "#444", letterSpacing: "0.12em" },
  inputRow2: { display: "flex", alignItems: "center", gap: 8 },
  arrow: { color: "#333", fontSize: 14 },
  setupInput: {
    background: "transparent", border: "none", borderBottom: "1px solid #2a2a2a",
    color: "#fff", fontSize: 15, letterSpacing: "0.08em", padding: "4px 0",
    fontFamily: "'Share Tech Mono', monospace", width: "100%", caretColor: "#fff",
  },
  modeRow: { display: "flex", alignItems: "center", gap: 16, marginTop: 4 },
  modeBtn: {
    background: "transparent", border: "1px solid #2a2a2a", color: "#555",
    fontSize: 12, letterSpacing: "0.1em", padding: "7px 16px", transition: "all 0.15s",
  },
  modeSep: { color: "#2a2a2a", fontSize: 12 },
  actionBtn: {
    background: "#fff", border: "none", color: "#000",
    fontSize: 12, letterSpacing: "0.12em", padding: "8px 20px",
    transition: "all 0.15s", alignSelf: "flex-start", marginTop: 4,
  },
  backBtn: {
    background: "transparent", border: "1px solid #1e1e1e", color: "#333",
    fontSize: 11, letterSpacing: "0.1em", padding: "5px 14px",
    alignSelf: "flex-start", transition: "all 0.15s",
  },
  setupHint: { fontSize: 11, color: "#333", letterSpacing: "0.06em" },
  error: { color: "#ff5555", fontSize: 12, letterSpacing: "0.1em" },

  // room bar
  roomBar: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "7px 20px", background: "#0d0d0d",
    borderBottom: "1px solid #1e1e1e", flexShrink: 0, flexWrap: "wrap",
  },
  roomLabel: { fontSize: 10, color: "#333", letterSpacing: "0.1em" },
  roomId: { fontSize: 13, color: "#fff", letterSpacing: "0.15em" },
  copyBtn: {
    background: "transparent", border: "1px solid #2a2a2a", color: "#555",
    fontSize: 10, letterSpacing: "0.08em", padding: "3px 8px", transition: "all 0.15s",
  },
  onlineLabel: { fontSize: 10, color: "#3a3a3a", letterSpacing: "0.08em", flex: 1 },
  leaveBtn: {
    background: "transparent", border: "1px solid #2a2a2a", color: "#555",
    fontSize: 10, letterSpacing: "0.08em", padding: "3px 8px", transition: "all 0.15s",
  },
  deleteBtn: {
    background: "transparent", border: "1px solid #3a1a1a", color: "#663333",
    fontSize: 10, letterSpacing: "0.08em", padding: "3px 8px", transition: "all 0.15s",
  },

  // messages
  messages: {
    flex: 1, overflowY: "auto", padding: "16px 20px",
    display: "flex", flexDirection: "column",
  },
  systemMsg: { fontSize: 11, color: "#2e2e2e", marginBottom: 8, letterSpacing: "0.04em" },
  msgBlock: { marginBottom: 12 },
  prompt: { display: "flex", alignItems: "center", gap: 6, marginBottom: 4, fontSize: 11, letterSpacing: "0.08em" },
  ownTag: { color: "#ffffff", fontSize: 11 },
  otherTag: { color: "#666", fontSize: 11 },
  promptArrow: { color: "#333" },
  msgTime: { color: "#2a2a2a", fontSize: 10 },
  msgContent: { fontSize: 14, lineHeight: 1.75, paddingLeft: 8, whiteSpace: "pre-wrap", wordBreak: "break-word", letterSpacing: "0.02em" },
  dividerLine: { color: "#161616", fontSize: 11, marginTop: 10, userSelect: "none" },
  ownName: { color: "#fff" },
  roomCode: { color: "#888" },

  // input
  inputRow: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "10px 20px", borderTop: "1px solid #1e1e1e",
    background: "#0d0d0d", flexShrink: 0,
  },
  inputPrompt: { display: "flex", alignItems: "center", gap: 4, userSelect: "none" },
  inputUser: { color: "#666", fontSize: 11, letterSpacing: "0.08em" },
  inputArrow: { color: "#333", fontSize: 14 },
  input: {
    flex: 1, background: "transparent", border: "none",
    color: "#fff", fontSize: 14, letterSpacing: "0.04em",
    caretColor: "#fff", fontFamily: "'Share Tech Mono', monospace",
  },
  sendBtn: {
    background: "transparent", border: "1px solid #2a2a2a", color: "#555",
    fontSize: 11, letterSpacing: "0.1em", padding: "5px 12px", transition: "all 0.15s", flexShrink: 0,
  },

  // status
  statusBar: {
    display: "flex", justifyContent: "space-between",
    padding: "5px 20px", fontSize: 10, color: "#2a2a2a",
    borderTop: "1px solid #161616", letterSpacing: "0.08em",
    background: "#080808", flexShrink: 0,
  },
  statusReady: { color: "#3a3a3a" },

  // kick
  kickPanel: {
    display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
    padding: "8px 10px", marginBottom: 12,
    border: "1px solid #1e1e1e", background: "#0d0d0d",
  },
  kickPanelLabel: { fontSize: 10, color: "#333", letterSpacing: "0.1em" },
  kickBtn: {
    background: "transparent", border: "1px solid #3a1a1a", color: "#663333",
    fontSize: 10, letterSpacing: "0.1em", padding: "3px 10px", transition: "all 0.15s",
  },

  // kicked screen
  kickedScreen: {
    flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", gap: 16, padding: 32,
  },
  kickedTitle: { fontSize: 20, color: "#ff5555", letterSpacing: "0.2em" },
  kickedMsg: { fontSize: 12, color: "#444", letterSpacing: "0.08em", textAlign: "center" },
};