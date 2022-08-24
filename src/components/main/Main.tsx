import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import { MainState, ThreadState } from "../../../@types/types";
import { CreateForm } from "../shared";

export const Main = ({ boards, host, fetchData }) => {
	const [mainState, setMainState] = useState<MainState>({});
	
	const threadsUrl = `${host}/api/threads?limit=10`;

	const navigate: NavigateFunction = useNavigate();

	const getRecentThreads = (data: Array<ThreadState>) => setMainState({
		bFormClass: "", board: "", threadList: data
	});

	useEffect(() => fetchData(threadsUrl, getRecentThreads), []);

	const createAction = (data: ThreadState) => data && navigate(`b/${data.board}/${data._id}`);

	const handleBoardForm = () => setMainState({
		...mainState,
		bFormClass: !mainState.bFormClass ? "show" : "",
		board: ""
	});

	const createBoard = () => {
		axios.post(`${host}/api/boards`, { name: mainState.board })
			.then(res => res.data 
				? navigate(`b/${res.data.name}`)
				: alert("This board already exists")
			)
			.catch(err => console.error(err));
	};

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => setMainState({ ...mainState, board: e.target.value });

	const newThreadUrl = `${host}/api/threads/`;

	if (!mainState.threadList) return null;
	return (
		<div className="container">
			<div className="form-cont">
				<CreateForm
					action={createAction}
					board={undefined}
					boards={boards}
					handleBoardForm={handleBoardForm}
					placeholder={"Thread text..."}
					url={newThreadUrl}
				/>
			</div>
			<div id="recent-threads">
				<h2>Threads sorted by most recent</h2>
				{
					mainState.threadList.map((t, i) => 
						<div className="thread-cont main-thread" key={i}>
							<div className="thread">
								<div className="thread-data">
									<Link className="board-link" to={`b/${t.board}`}>{t.board}</Link>
									<label className="id">
										{`id: ${t._id} (${t.created_on ? new Date(t.created_on).toLocaleString().slice(0,-3) : ""})`}
									</label>
								</div>
								<p className="thread-text">{t.text}</p>
							</div>
							<label className="main-replies">{`${t.replies ? t.replies.length : 0} replies`}</label>
							<Link className="thread-link" to={`b/${t.board}/${t._id}`}/>
						</div>
					)
				}
			</div>
			<div className={`pop-up form-cont ${mainState.bFormClass}`}>
				<div className="form">
					<input 
						className="pop-up-input"
						placeholder="Board name"
						type="text"
						value={mainState.board}
						onChange={handleInput}
					/>
					<button 
						className="pop-up-btn submit"
						type="button"
						onClick={createBoard}
					>
						Submit
					</button>
				</div>
			</div>
			<span 
				className={`background ${mainState.bFormClass}`} 
				onClick={handleBoardForm}
			/>
		</div>
	);
};
