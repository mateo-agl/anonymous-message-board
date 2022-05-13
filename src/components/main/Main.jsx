import React, { useState } from "react";

export const Main = ({CreateForm}) => {
	const [newThread, setNewThread] = useState(
		{
			board: "",
			delete_password: "",
			text: ""
		}
	);

	const handleNewThreadData = e => {
		setNewThread({
			...newThread,
			[e.target.name]: e.target.value
		});
	};

	const createAction = data => {
		if (data) window.location.href = `b/${data.board}/${data._id}`;
	};

	const url = process.env.NODE_ENV === "development"
		? `http://localhost:5000/api/threads/${newThread.board}`
		: `api/threads/${newThread.board}`;
	
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
				<CreateForm
					action={createAction}
					deletePassword={newThread.delete_password}
					handleData={handleNewThreadData}
					placeholder={"Thread text..."}
					reqBody={newThread}
					text={newThread.text}
					url={url}
				>
					<input name="board" placeholder="board" required onChange={handleNewThreadData}/>
				</CreateForm>
			</div>
		</div>
	);
};
