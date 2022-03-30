import { useEffect, useState } from "react";
import { Thread } from "./thread/Thread";

export const Board = (props) => {
	const [data, setData] = useState("");
	const currentBoard = window.location.pathname.slice(3);
	const url = `/api/threads/${currentBoard}`;
	const title = `Welcome to ${currentBoard}`;
	
	useEffect(() => props.fetchData(url, data => {
		setData(
			{
				threads: data,
				newThread: {
					board: currentBoard,
					delete_password: "",
					text: ""
				}
			}
		);
	}), []);

	const handleNewThreadData = e => {
		setData(
			{
				...data,
				newThread: {
					...data.newThread,
					[e.target.name]: e.target.value
				}
			}
		);
	};

	const sendCreateReq = () => {
		props.createElement(
			url,
			data.newThread,
			newData => setData(
				{
					threads: [newData, ...data.threads],
					newThread: {
						board: currentBoard,
						delete_password: "",
						text: ""
					}
				}
			)
		);
	};

	const delFromState = index => {
		const newThreads = data.threads.slice();
		newThreads.splice(index, 1);
		setData(
			{
				...data,
				threads: newThreads
			}
		);
	};

	if(!data) return "";
	return (
		<div className="container">
			<header>
				<h1 id="boardTitle">{title}</h1>
			</header>
			<div id="submitNewThread">
				<h3>Submit a new thread:</h3>
				<div className="form-cont">
					<form>
						<textarea
							name="text"
							placeholder="Thread text..."
							required
							value={data.newThread.text}
							onChange={handleNewThreadData}
						/>
						<input
							name="delete_password"
							placeholder="password to delete"
							required
							value={data.newThread.delete_password}
							onChange={handleNewThreadData}
						/>
						<button
							type="button"
							onClick={sendCreateReq}
						>
							Submit
						</button>
					</form>
				</div>
			</div>
			<hr />
			<div id="boardDisplay">
				{
					data.threads.map(
						(ele, i) => 
							<div key={i}>
								<Thread 
									delFromState={delFromState}
									deleteElement={props.deleteElement}
									index={i}
									reportElement={props.reportElement}
									thread={ele}
									url={url}
								/>
								<hr/>
							</div>
					)
				}
			</div>
		</div>
	);
};