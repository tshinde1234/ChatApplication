import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:5000");

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket.on("chatMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("chatHistory", (history) => {
      setMessages(history);
    });

    return () => {
      socket.off("chatMessage");
      socket.off("chatHistory");
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("chatMessage", input);
      setInput("");
    }
  };

  const clearChat = () => {
    socket.emit("clearHistory");
  };

  return (
    <div className="chat-container">
      <h2>💬 Welcome To Sumit Chatapp</h2>
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className="message">{msg}</div>
        ))}
      </div>
      <div className="input-group">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
        <button className="clear-btn" onClick={clearChat}>Clear</button>
      </div>
    </div>
  );
}
