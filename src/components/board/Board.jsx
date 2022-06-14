import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Thread } from "./thread/Thread.jsx";
import { CreateForm, DeleteForm } from "../shared";

export const Board = ({fetchData}) => {
	const devHostName = "http://localhost:8080";
	const currentBoard = window.location.pathname.slice(3);
	const url = `${process.env.NODE_ENV === "development" ? devHostName : ""}/api/threads/${currentBoard}`;
	const title = `Welcome to ${currentBoard}`;

	const [data, setData] = useState({
		formClass: "",
		reqBody: "",
		threads: []
	});

	const getThreads = () => fetchData(
		url, threads => setData({ 
			formClass: "",
			reqBody: "",
			threads: threads 
		})
	);
	
	useEffect(() => getThreads(), [currentBoard]);

	const reset = () => setData({...data});

	const createAction = newData => newData ? (getThreads(), true) : alert("Oops, an error has ocurred");

	const delAction = data => data ? (getThreads(), true) : alert("Incorrect password");

	const handleForm = reqBody => setData({ 
		...data, 
		formClass: !data.formClass ? "show" : "",
		reqBody: reqBody 
	});
	
	return (
		<div className="container">
			<div className="board-cont">
				<Link className="board-link" to="/" onClick={reset}>Home</Link>
				<Link className="board-link" to="/b/games" onClick={reset}>Games</Link>
				<Link className="board-link" to="/b/technology" onClick={reset}>Technology</Link>
				<Link className="board-link" to="/b/politics" onClick={reset}>Politics</Link>
				<Link className="board-link" to="/b/animation" onClick={reset}>Animation</Link>
				<Link className="board-link" to="/b/food" onClick={reset}>Food</Link>
			</div>
			<header>
				<h1>{title}</h1>
			</header>
			<div id="submitNewThread">
				<h3>Submit a new thread:</h3>
				<div className="form-cont">
					<CreateForm
						action={createAction}
						board={currentBoard}
						placeholder={"Quick Thread"}
						url={url}
					/>
				</div>
			</div>
			<hr />
			{
				data.threads.map(
					(ele, i) => (
						<Thread 
							handleForm={handleForm}
							key={i}
							thread={ele}
							url={url}
						/>
					)
				)
			}
			<DeleteForm 
				action={delAction}
				formClass={data.formClass}
				handleForm={handleForm}
				reqBody={data.reqBody}
				url={url}
			/>
		</div>
	);
};