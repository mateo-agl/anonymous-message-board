import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Main = ({CreateForm, fetchData}) => {
	const [newThread, setNewThread] = useState(
		{
			board: "",
			delete_password: "",
			text: "",
			threads: []
		}
	);
	
	const devHostName = "http://localhost:8080";
	const threadsUrl = `${process.env.NODE_ENV === "development" ? devHostName : ""}/api/threads?limit=10`;

	const getRecentThreads = data => setNewThread({ ...newThread, threads: data });

	useEffect(() => fetchData(threadsUrl, getRecentThreads), []);

	const handleNewThreadData = e => {
		setNewThread({
			...newThread,
			[e.target.name]: e.target.value
		});
	};

	const createAction = data => {
		if (data) window.location.href = `b/${data.board}/${data._id}`;
	};

	const newThreadUrl = `${process.env.NODE_ENV === "development" ? devHostName : ""}/api/threads/${newThread.board}`;
	
	return (
		<div className="container">
			<header>
				<h1 className="main-title">Anonymous Message Board</h1>
			</header>
			<div className="board-cont">
				<h2>Boards</h2>
				<Link className="board-link" to="/b/games">Games</Link>
				<Link className="board-link" to="/b/technology">Technology</Link>
				<Link className="board-link" to="/b/politics">Politics</Link>
				<Link className="board-link" to="/b/animation">Animation</Link>
				<Link className="board-link" to="/b/food">Food</Link>
			</div>
			<div className="form-cont">
				<CreateForm
					action={createAction}
					deletePassword={newThread.delete_password}
					handleData={handleNewThreadData}
					placeholder={"Thread text..."}
					reqBody={newThread}
					text={newThread.text}
					url={newThreadUrl}
				>
					<input name="board" placeholder="board" required onChange={handleNewThreadData}/>
				</CreateForm>
			</div>
			<div id="recent-threads">
				<h2>Threads sorted by most recent</h2>
				{
					newThread.threads.map((t, i) => 
						<div
							className="thread-cont main-thread"
							key={i}
						>
							<div className="thread">
								<div className="thread-data">
									<Link className="board-link" to={`b/${t.board}`}>{t.board}</Link>
									<label className="id">
										{`id: ${t._id} (${new Date(t.created_on).toLocaleString().slice(0,-3)})`}
									</label>
								</div>
								<p className="thread-text">{t.text}</p>
							</div>
							<p className="main-replies">{`${t.replies.length} replies`}</p>
							<Link className="thread-link" to={`b/${t.board}/${t._id}`}/>
						</div>
					)
				}
			</div>
		</div>
	);
};
