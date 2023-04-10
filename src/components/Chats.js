import React, {useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import {
  MessageList,
  Navbar as NavbarComponent,
  Avatar,
} from "react-chat-elements";
import Col from "react-bootstrap/Col";
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

export default function Chats(props) {
  const [messageText, setMessageText] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);

  const onSendClicked = () => {
    if (!messageText) {
      return;
    }
    props.onSendClicked(messageText);
    setMessageText("");
  }

  const onShowEmojis = () => {
    setShowEmojis(!showEmojis);
  }

  const onMessageInputChange = e => {
    setMessageText(e.target.value);
  }

  const onMessageKeyPress = e => {
    if (e.key === "Enter") {
      onSendClicked();
    }
  }

  const addEmoji = e => {
    let emoji = e.native;
    setMessageText(messageText + emoji);
  };

    return (
      <div>
        {props.targetUser ? (
          <div>
            <NavbarComponent
              left={
                <div>
                  <Avatar
                    src={require(`../static/images/avatar/${props.targetUser.id}.jpeg`)}
                    alt={"logo"}
                    size="large"
                    type="circle flexible"
                  />
                  <p className="navBarText">{props.targetUser.name}</p>
                </div>
              }
              type="dark"
            />
            <MessageList
              className="message-list"
              lockable={true}
              toBottomHeight={"100%"}
              dataSource={props.targetUser.messages ? props.targetUser.messages : []}
            />
            <Form.Group as={Row} className="mb-3">
              <Col sm="10">
                <Form.Control
                  type="text"
                  style={{ fontSize: "15px" }}
                  value={messageText}
                  onChange={onMessageInputChange}
                  onKeyDown={onMessageKeyPress}
                  placeholder="Type a message here..."
                  className="messageTextBox"
                  maxLength="3000"
                  autoFocus
                  onClick={onShowEmojis}
                />
              </Col>
              {showEmojis ?
                <Picker data={data} onEmojiSelect={addEmoji}/>
               : <Col sm="1">
                <Button
                  style={{ fontSize: "15px" }}
                  className="sendButton"
                  onClick={onShowEmojis}
                >
                  Emoji
                </Button></Col>}
              <Col sm="1">
                <Button
                  style={{ fontSize: "15px" }}
                  disabled={!messageText}
                  className="sendButton"
                  onClick={onSendClicked}
                >
                  Send
                </Button>
              </Col>

            </Form.Group>
          </div>
        ) : (
          <div>
            <div className="container-fluid bg-dark text-light p-5">
              <div className="container bg-dark p-5">
                <h2>Hello, {(props.signedInUser || {}).name}!</h2>
                <p>
                  Select a friend to start a chat.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );

}
