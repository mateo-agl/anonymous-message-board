import React, { useEffect, useState } from "react";

export const Main = ({CreateForm, fetchData}) => {
	const [newThread, setNewThread] = useState(
		{
			board: "",
			delete_password: "",
			text: "",
			threads: []
		}
	);

	const threadsUrl = process.env.NODE_ENV === "development"
		? "http://localhost:8080/api/threads/"
		: "api/threads/";

	const getRecentThreads = data => setNewThread({ ...newThread, threads: data });

	useEffect(() => fetchData(threadsUrl, getRecentThreads));

	const handleNewThreadData = e => {
		setNewThread({
			...newThread,
			[e.target.name]: e.target.value
		});
	};

	const createAction = data => {
		if (data) window.location.href = `b/${data.board}/${data._id}`;
	};

	const newThreadUrl = process.env.NODE_ENV === "development"
		? `http://localhost:8080/api/threads/${newThread.board}`
		: `api/threads/${newThread.board}`;
	
	return (
		<div className="container">
			<header>
				<h1 className="main-title">Anonymous Message Board</h1>
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
						<a 
							className="main-thread"
							href={`/b/${t.board}/${t._id}`}
							key={i}
						>
							<div className="thread-cont">
								<div className="thread">
									<div className="actions-cont">
										<a href={`/b/${t.board}`}>
											{t.board}
										</a>
										<label className="id">
											{`id: ${t._id} (${new Date(t.created_on).toLocaleDateString()})`}
										</label>
									</div>
									<p>{t.text}</p>
								</div>
								<h5 className="thread-link">
									{`${t.replies.length} replies`}
								</h5>
							</div>
						</a>
					)
				}
			</div>
		</div>
	);
};
