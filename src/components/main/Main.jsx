import React, { useState } from "react";

export const Main = ({createElement}) => {
	const [newThread, setNewThread] = useState(
		{
			board: "",
			delete_password: "",
			text: ""
		}
	);
	const url = "/api/threads/";

	const handleNewThreadData = e => {
		setNewThread({
			...newThread,
			[e.target.name]: e.target.value
		});
	};

	const sendNewThreadReq = () => {
		const newUrl = url + newThread.board;
		createElement(newUrl, newThread, data => {
			if (data) window.location.href = `b/${data.board}/${data._id}`;
		});
	};

	return (
		<div className="container">
			<header>
				<h1 className="main-title title">Anonymous Message Board</h1>
			</header>
			<div className="board-cont">
				<h2>Boards</h2>
				<a className="board-link" href="/b/games">Games</a>
				<a className="board-link" href="/b/technology">Technology</a>
				<a className="board-link" href="/b/politics">Politics</a>
				<a className="board-link" href="/b/animation">Animation</a>
				<a className="board-link" href="/b/food">Food</a>
			</div>
			<div className="form-cont">
				<h4>New thread (POST /api/threads/:board)</h4>
				<form>
					<input
						name="board"
						placeholder="board"
						required
						onChange={handleNewThreadData}
					/>
					<textarea
						name="text"
						placeholder="Thread text..."
						required
						onChange={handleNewThreadData}
					/>
					<input
						name="delete_password"
						placeholder="password to delete"
						required
						onChange={handleNewThreadData}
					/>
					<button
						type="button"
						onClick={sendNewThreadReq}
					>
						Submit
					</button>
				</form>
			</div>
		</div>
	);
};
