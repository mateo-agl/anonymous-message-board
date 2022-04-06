import { useEffect, useState } from "react";
import { CreateForm } from "../subComponents";
import { Thread } from "./thread/Thread.jsx";

export const Board = ({
	fetchData,
	createElement,
	deleteElement,
	reportElement
}) => {
	const [data, setData] = useState("");
	const currentBoard = window.location.pathname.slice(3);
	const url = process.env.NODE_ENV === "development"
		? `http://localhost:5000/api/threads/${currentBoard}`
		: `/api/threads/${currentBoard}`;
	const title = `Welcome to ${currentBoard}`;
	
	useEffect(() => fetchData(url, data => {
		setData({
			threads: data,
			newThread: {
				board: currentBoard,
				delete_password: "",
				text: ""
			}
		});
	}), []);

	const handleNewThreadData = e => {
		setData({
			...data,
			newThread: {
				...data.newThread,
				[e.target.name]: e.target.value
			}
		});
	};

	const sendCreateReq = () => {
		createElement(
			url,
			data.newThread,
			newData => {
				setData({
					threads: [newData, ...data.threads],
					newThread: {
						board: currentBoard,
						delete_password: "",
						text: ""
					}
				});
			}
		);
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
			<header>
				<h1 className="title">{title}</h1>
			</header>
			<div id="submitNewThread">
				<h3>Submit a new thread:</h3>
				<div className="form-cont">
					<CreateForm
						deletePassword={data.newThread.delete_password}
						handleData={handleNewThreadData}
						placeholder={"Thread"}
						sendNewEleReq={sendCreateReq}
						text={data.newThread.text}
					/>
				</div>
			</div>
			<hr />
			{
				data.threads.map(
					(ele, i) => (
						<div key={i}>
							<Thread 
								delFromState={delFromState}
								deleteElement={deleteElement}
								index={i}
								reportElement={reportElement}
								thread={ele}
								url={url}
							/>
							<hr/>
						</div>
					)
				)
			}
		</div>
	);
};