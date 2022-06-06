import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Thread } from "./thread/Thread.jsx";

export const Board = ({
	CreateForm,
	DeleteForm,
	ReportBtn,
	fetchData
}) => {
	const [data, setData] = useState("");
	const devHostName = "http://localhost:8080";
	const currentBoard = window.location.pathname.slice(3);
	const url = `${process.env.NODE_ENV === "development" ? devHostName : ""}/api/threads/${currentBoard}`;
	const title = `Welcome to ${currentBoard}`;
	const resetData = () => setData({...data});

	useEffect(() => fetchData(url, data => {
		setData({
			threads: data,
			newThread: {
				board: currentBoard,
				delete_password: "",
				text: ""
			}
		});
	}), [setData, currentBoard]);

	const handleNewThreadData = e => {
		setData({
			...data,
			newThread: {
				...data.newThread,
				[e.target.name]: e.target.value
			}
		});
	};

	const createAction = newData => {
		setData({
			threads: [newData, ...data.threads],
			newThread: {
				...data.newThread,
				delete_password: "",
				text: ""
			}
		});
	};

	const delFromState = index => {
		const newThreads = data.threads.slice();
		newThreads.splice(index, 1);
		setData({
			...data,
			threads: newThreads
		});
	};
	
	if(!data) return "";
	return (
		<div className="container">
			<div className="board-cont">
				<Link className="board-link" to="/">Home</Link>
				<Link className="board-link" to="/b/games" onClick={resetData}>Games</Link>
				<Link className="board-link" to="/b/technology" onClick={resetData}>Technology</Link>
				<Link className="board-link" to="/b/politics" onClick={resetData}>Politics</Link>
				<Link className="board-link" to="/b/animation" onClick={resetData}>Animation</Link>
				<Link className="board-link" to="/b/food" onClick={resetData}>Food</Link>
			</div>
			<header>
				<h1>{title}</h1>
			</header>
			<div id="submitNewThread">
				<h3>Submit a new thread:</h3>
				<div className="form-cont">
					<CreateForm
						action={createAction}
						deletePassword={data.newThread.delete_password}
						handleData={handleNewThreadData}
						placeholder={"Quick Thread"}
						reqBody={data.newThread}
						text={data.newThread.text}
						url={url}
					/>
				</div>
			</div>
			<hr />
			{
				data.threads.map(
					(ele, i) => (
						<Thread 
							CreateForm={CreateForm}
							DeleteForm={DeleteForm}
							ReportBtn={ReportBtn}
							delFromState={delFromState}
							index={i}
							key={i}
							thread={ele}
							url={url}
						/>
					)
				)
			}
		</div>
	);
};