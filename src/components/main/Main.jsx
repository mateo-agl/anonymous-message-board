import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CreateForm } from "../shared";

export const Main = ({fetchData}) => {
	const [threadList, setThreadList] = useState({ threads: [] });
	
	const devHostName = "http://localhost:8080";
	const threadsUrl = `${process.env.NODE_ENV === "development" ? devHostName : ""}/api/threads?limit=10`;

	const navigate = useNavigate();

	const getRecentThreads = data => setThreadList({ ...threadList, threads: data });

	useEffect(() => fetchData(threadsUrl, getRecentThreads), []);

	const createAction = data => data && navigate(`b/${data.board}/${data._id}`);

	const newThreadUrl = `${process.env.NODE_ENV === "development" ? devHostName : ""}/api/threads/`;
	
	return (
		<div className="container">
			<header>
				<h1 className="main-title">Anonymous Message Board</h1>
			</header>
			<div className="board-cont">
				<h2>Boards</h2>
				<div>
					<Link className="board-link" to="/b/games">Games</Link>
					<Link className="board-link" to="/b/technology">Technology</Link>
					<Link className="board-link" to="/b/politics">Politics</Link>
					<Link className="board-link" to="/b/animation">Animation</Link>
					<Link className="board-link" to="/b/food">Food</Link>
				</div>
			</div>
			<div className="form-cont">
				<CreateForm
					action={createAction}
					boardInput={true}
					placeholder={"Thread text..."}
					url={newThreadUrl}
				/>
			</div>
			<div id="recent-threads">
				<h2>Threads sorted by most recent</h2>
				{
					threadList.threads.map((t, i) => 
						<div className="thread-cont main-thread" key={i}>
							<div className="thread">
								<div className="thread-data">
									<Link className="board-link" to={`b/${t.board}`}>{t.board}</Link>
									<label className="id">
										{`id: ${t._id} (${new Date(t.created_on).toLocaleString().slice(0,-3)})`}
									</label>
								</div>
								<p className="thread-text">{t.text}</p>
							</div>
							<label className="main-replies">{`${t.replies.length} replies`}</label>
							<Link className="thread-link" to={`b/${t.board}/${t._id}`}/>
						</div>
					)
				}
			</div>
		</div>
	);
};
