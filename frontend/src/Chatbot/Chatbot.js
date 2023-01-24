import React, { useState } from "react";
import bot from "./bot.svg";
import user from "./user.svg";
import send from "./send.svg";
import Loader from "./Loader";
import "./style.css";

const generateUniqueId = () => {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);
  return `id-${timestamp}-${hexadecimalString}`;
};

const chatStripe = (isAi, value, uniqueId) => {
  return `
          <div class="wrapper ${isAi && "ai"}">
              <div class="chat">
                  <div class="profile">
                      <img 
                        src=${isAi ? bot : user} 
                        alt="${isAi ? "bot" : "user"}" 
                      />
                  </div>
                  <div class="message" id=${uniqueId}>${value}</div>
              </div>
          </div>
      `;
};

const Chatbot = () => {
  const [formData, setFormData] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const chatContainer = document.querySelector(".chat-container");
    chatContainer.innerHTML += chatStripe(false, formData);
    const uniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    const messageDiv = document.getElementById(uniqueId);
    setFormData("");
    const response = await fetch("http://localhost:5000/api/chatbot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: formData,
      }),
    });

    messageDiv.innerHTML = " ";

    if (response.ok) {
      const data = await response.json();
      const parsedData = data.bot.trim();
      setLoading(false);
      messageDiv.textContent = parsedData;
    } else {
      const err = await response.text();
      messageDiv.innerHTML = "Something went wrong";
      alert(err);
    }
  };
  return (
    <div className="chatbot-container">
      <div className="chat-container">
        <div></div>
      </div>
      <form className="chatbot-form" onSubmit={handleSubmit}>
        {loading && <Loader />}
        {!loading && (
          <input
            name="prompt"
            className="textarea"
            rows="1"
            cols="1"
            placeholder="Ask Chatbot..."
            value={formData}
            onChange={(e) => setFormData(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setFormData(e.target.value);
              }
            }}
          ></input>
        )}
        <button type="submit" className="send">
          <img src={send} />
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
