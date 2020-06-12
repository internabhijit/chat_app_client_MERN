import React from "react";

import "./Message.css";

import ReactEmoji from "react-emoji";

const Message = ({
  message: { message, sentBy, sentByName, messageStatus },
  senderId,
  senderName,
}) => {
  let isSentByCurrentUser = false;

  if (sentBy === senderId) {
    isSentByCurrentUser = true;
  }

  return isSentByCurrentUser ? (
    <div className="messageContainer justifyEnd">
      <p className="sentText pr-10">{senderName}</p>
      <div className="messageBox backgroundBlue">
        <p className="messageText colorWhite">{ReactEmoji.emojify(message)}</p>
        <span>{messageStatus}</span>
      </div>
    </div>
  ) : (
    <div className="messageContainer justifyStart">
      <div className="messageBox backgroundLight">
        <p className="messageText colorDark">{ReactEmoji.emojify(message)}</p>
      </div>
      <p className="sentText pl-10 ">{sentByName}</p>
    </div>
  );
};

export default Message;
