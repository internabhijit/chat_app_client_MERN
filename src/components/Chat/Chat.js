import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";

import { getFromStorage } from "../../utils/storage";

import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";

import "./Chat.css";

let socket;

const Chat = ({ location }) => {
  const [senderId, setSenderId] = useState("");
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  // const ENDPOINT = "https://react-chat-application10.herokuapp.com/";
  const ENDPOINT = "localhost:3001";

  useEffect(() => {
    const { senderId, name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setSenderId(Number(senderId));
    setName(name);
    setRoom(room);

    socket.emit("join", { senderId, name, room }, () => {});

    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [ENDPOINT, location.search]);

  // Get Message List From Db
  useEffect(() => {
    const { room } = queryString.parse(location.search);
    setRoom(room);

    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: getFromStorage("the_main_app"),
      },
    };

    fetch(
      `http://localhost:3001/messages?conversationId=${room}`,
      requestOptions
    )
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setMessages(json.data);
        } else if (!json.success) {
          console.error("No Message Found");
        }
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });
  }, [messages]);

  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} senderId={senderId} senderName={name} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
};

export default Chat;
