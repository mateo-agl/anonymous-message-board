import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CreateForm } from "../shared";

export const Main = ({ boards, host, fetchData }) => {
	const [threadList, setThreadList] = useState([]);
	
	const threadsUrl = `${host}/api/threads?limit=10`;

	const navigate = useNavigate();

	const getRecentThreads = data => setThreadList(data);

	useEffect(() => fetchData(threadsUrl, getRecentThreads), []);

	const createAction = data => data && navigate(`b/${data.board}/${data._id}`);

	const newThreadUrl = `${host}/api/threads/`;
	
	return (
		<div className="container">
			<div className="form-cont">
				<CreateForm
					action={createAction}
					boards={boards}
					placeholder={"Thread text..."}
					url={newThreadUrl}
				/>
			</div>
			<div id="recent-threads">
				<h2>Threads sorted by most recent</h2>
				{
					threadList.map((t, i) => 
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
