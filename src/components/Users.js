import React, { useState } from "react";
import { ChatList } from "react-chat-elements";
import FormControl from "react-bootstrap/FormControl";
import Form from "react-bootstrap/Form";

export default function Users(props) {
  const[searchQuery, setSearchQuery] = useState(null);

  const searchInput = e => {
    let value = e.target.value;
    let sQuery = null;
    if (value) {
      sQuery = value;
    }
    setSearchQuery(sQuery);
  }

  const getFilteredUserList = () => {
    return !searchQuery
      ? props.userData
      : props.userData.filter(user =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }

  let users = getFilteredUserList();

  return (
    <div>
      <Form.Group>
        <FormControl
          style={{ fontSize: "14px" }}
          type="text"
          placeholder="Search for a user here..."
          onInput={searchInput}
        />
      </Form.Group>
      {users.length ? (
        <ChatList
          className={!props.showSignInList ? "chat-list" : "user-list"}
          dataSource={users.map((u, i) => {
            let date = null;
            let subtitle = "";
            if (
              !props.showSignInList &&
              u.messages &&
              u.messages.length
            ) {
              let lastMessage = u.messages[u.messages.length - 1];
              date = new Date(lastMessage.timeStamp);
              subtitle =
                (lastMessage.position === "right" ? "You: " : u.name + ": ") +
                lastMessage.text;
            }
            return {
              className: "chat-item",
              id: i,
              avatar: require(`../static/images/avatar/${u.id}.jpeg`),
              alt: u.name,
              title: u.name,
              subtitle: subtitle,
              date: date,
              unread: u.unread,
              user: u
            };
          })}
          onClick = {
            !props.showSignInList
              ? props.onChatClicked
              : props.onUserClicked
          }
        />
      ) : (
        <div className="text-center no-users" style={{ fontSize: "16px" }}>No users to show.</div>
      )}
      </div>
    );

}
