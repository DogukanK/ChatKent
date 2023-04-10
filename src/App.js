import React, { Component } from "react";
import NavBar from "./components/NavBar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Users from "./components/Users";
import Chats from "./components/Chats";
import ErrorModal from "./components/ErrorModal";
import LoadingModal from "./components/LoadingModal";
import "react-chat-elements/dist/main.css";
import "./index.css";
import io from "socket.io-client";
import { fetchUsers } from "./requests";
import axios from "axios";

const SOCKET_URI = process.env.REACT_APP_SERVER_URI;

class App extends Component {
  socket = null;

  state = {
    signInModalShow: false,
    users: [],
    userChatData: [],
    user: null,
    selectedUserIndex: null,
    showChats: false,
    showChatList: true,
    error: false,
    errorMessage: "",
    success: false,
    successMessage: ""
  };

  componentDidMount() {
    this.initAxios();
    this.initSocketConnection();
    fetchUsers().then((users) =>
      this.setState({ users, signInModalShow: true })
    );
    this.setupSocketListeners();
  }

  initSocketConnection() {
    this.socket = io.connect(SOCKET_URI);
  }

  initAxios() {
    axios.interceptors.request.use(
      (config) => {
        this.setState({ loading: true });
        return config;
      },
      (error) => {
        this.setState({ loading: false });
        this.setState({
          errorMessage: `Couldn't connect to server. try refreshing the page.`,
          error: true,
        });
        return Promise.reject(error);
      }
    );
    axios.interceptors.response.use(
      (response) => {
        this.setState({ loading: false });
        return response;
      },
      (error) => {
        this.setState({ loading: false });
        this.setState({
          errorMessage: `Some error occured. try after sometime`,
          error: true,
        });
        return Promise.reject(error);
      }
    );
  }

  onClientDisconnected() {
    this.setState({
      errorMessage: "Connection lost from server please check your connection.",
      error: true,
    });
  }

  onReconnection() {
    if (this.state.user) {
      this.socket.emit("sign-in", this.state.user);
      this.setState({
        successMessage: "Connection established.",
        success: true
      })
    }
  }

  setupSocketListeners() {
    this.socket.on("message", this.onMessageRecieved.bind(this));
    this.socket.on("reconnect", this.onReconnection.bind(this));
    this.socket.on("disconnect", this.onClientDisconnected.bind(this));
  }

  onMessageRecieved(message) {
    let userChatData = this.state.userChatData;
    let messageData = message.message;
    let targetId;
    if (message.from === this.state.user.id) {
      messageData.position = "right";
      targetId = message.to;
    } else {
      messageData.position = "left";
      targetId = message.from;
    }
    let targetIndex = userChatData.findIndex((u) => u.id === targetId);
    if (!userChatData[targetIndex].messages) {
      userChatData[targetIndex].messages = [];
    }
    if (targetIndex !== this.state.selectedUserIndex) {
      if (!userChatData[targetIndex].unread) {
        userChatData[targetIndex].unread = 0;
      }
      userChatData[targetIndex].unread++;
    }
    userChatData[targetIndex].messages.push(messageData);
    this.setState({ userChatData });
  }

  onUserClicked(e) {
    let user = e.user;
    this.socket.emit("sign-in", user);
    let userChatData = this.state.users.filter((u) => u.id !== user.id);
    this.setState({ user, signInModalShow: false, userChatData });
  }

  onChatClicked(e) {
    this.toggleViews();
    let users = this.state.userChatData;
    for (let index = 0; index < users.length; index++) {
      if (users[index].id === e.user.id) {
        users[index].unread = 0;
        this.setState({ selectedUserIndex: index, userChatData: users });
        return;
      }
    }
  }

  createMessage(text) {
    let message = {
      to: this.state.userChatData[this.state.selectedUserIndex].id,
      message: {
        type: "text",
        text: text,
        date: +new Date(),
        className: "message",
      },
      from: this.state.user.id,
    };
    this.socket.emit("message", message);
  }

  toggleViews() {
    this.setState({
      showChats: !this.state.showChats,
      showChatList: !this.state.showChatList,
    });
  }

  render() {
    let ChatsProps = this.state.showChats
      ? {
          xs: 12,
          sm: 12,
        }
      : {
          xshidden: "true",
          smhidden: "true",
        };

    let chatListProps = this.state.showChatList
      ? {
          xs: 12,
          sm: 12,
        }
      : {
          xshidden: "true",
          smhidden: "true",
        };

    return (
      <div>
        <NavBar signedInUser={this.state.user} />
        <Container>
          <Row className="show-grid">
            <Col {...chatListProps} md={4}>
              <Users
                userData={this.state.userChatData}
                onChatClicked={this.onChatClicked.bind(this)}
              />
            </Col>
            <Col {...ChatsProps} md={8}>
              <Chats
                signedInUser={this.state.user}
                onSendClicked={this.createMessage.bind(this)}
                onBackPressed={this.toggleViews.bind(this)}
                targetUser={
                  this.state.userChatData[this.state.selectedUserIndex]
                }
              />
            </Col>
          </Row>
        </Container>
        <Modal show={this.state.signInModalShow} animation={false} centered>
          <Modal.Header>
            <Modal.Title>Sign In as:</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Users
              userData={this.state.users}
              onUserClicked={this.onUserClicked.bind(this)}
              showSignInList
            />
          </Modal.Body>
        </Modal>
        <ErrorModal
          show={this.state.error}
          errorMessage={this.state.errorMessage}
        />
        <LoadingModal show={this.state.loading} />
      </div>
    );
  }
}

export default App;
