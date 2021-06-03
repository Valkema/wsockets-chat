import React, { Component } from "react";
import { emitTest, emitMessage } from "./api/ws/api.js";
import socket from "./api/ws";
import styles from "./App.css";
import MessagesList from "./components/MessagesList";
import UserList from "./components/UserList";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			users: new Map(),
			currentUser: "",
			message: "",
		};
	}
	componentDidMount() {
		socket.emit("get-users");
		socket.on("get-users", (users) => {
			const userMap = new Map();
			userMap.forEach((user) => {
				userMap.set(user, []);
			});
			this.setState({
				users: userMap,
			});
		});
		socket.on("new-user", this.addUser);
		socket.on("user-leave", this.deleteUser);
		socket.on("private-message", (message) => {
			this.state.users.get(message.author).push(message);
			this.setState({
				users: this.state.users,
			});
		});
	}

	selectUser = (user) => {
		this.setState({ currentUser: user });
	};

	addUser = (id) => {
		this.state.users.set(id, []);
		this.setState({ users: this.state.users });
	};

	deleteUser = (id) => {
		this.state.users.delete(id);
		this.setState({ users: this.state.users });
	};

	sendMessage = () => {
		if (this.state.currentUser) {
			this.state.currentUser.get(this.state.currentUser).push({
				body: this.state.message,
				timestamp: new Date(),
			});
			socket.emit("send-message", this.state.currentUser, {
				body: this.state.message,
				timestamp: new Date(),
			});
			this.setState({ message: "" });
		}
	};

	render() {
		return (
			<div>
				<UserList
					onSelect={this.selectUser}
					users={[...this.state.users.keys()]}
					currentUser={this.state.currentUser}
				/>
				<div>
					<MessagesList
						messages={this.state.users.get(this.state.currentUser)}
					/>
					<div>
						<input
							type="text"
							value={this.state.message}
							onChange={(e) => {
								this.setState({ message: e.target.value });
							}}
						/>
						<button onClick={this.sendMessage}>send message </button>
					</div>
				</div>
			</div>
		);
	}
}
export default App;
