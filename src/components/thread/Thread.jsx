import React, { useEffect, useState } from "react";
import { Reply } from "./Reply";

export const Thread = (props) => {
	const [thread, setThread] = useState("");
	const currentURL = window.location.pathname.split("/");
	const repliesUrl = `/api/replies/${currentURL[2]}?thread_id=${currentURL[3]}`;
	const threadsUrl = `/api/threads/${currentURL[2]}`;
	
	useEffect(() => props.fetchData(repliesUrl, data => {
		setThread(
			{
				...data,
				delete_password: "",
				newRep: {
					thread_id: data._id,
					quick_reply: true,
					text: "",
					delete_password: ""
				}
			}
		);
	}), []);

	const handleNewRep = e => {
		setThread(
			{
				...thread,
				newRep: {
					...thread.newRep,
					[e.target.name]: e.target.value
				}
			}
		);
	};

	const handleThreadPassword = e => {
		setThread(
			{
				...thread,
				delete_password: e.target.value
			}
		);
	};

	const reportThread = () => {
		props.reportElement(
			threadsUrl,
			{ thread_id: thread._id }
		);
	};
	
	const delThread = async () => {
		const res = await props.deleteElement(
			threadsUrl,
			{
				thread_id: thread._id,
				delete_password: thread.delete_password
			},
		);
		if(!res) return alert("Incorrect password");
		window.location.href = `${window.location.origin}/b/${currentURL[2]}`;
	};
		
	const sendData = () => {
		props.createElement(
			repliesUrl,
			thread.newRep,
			rep => setThread(
				{
					...thread,
					replies: [rep, ...thread.replies],
					newRep: {
						thread_id: thread._id,
						quick_reply: true,
						text: "",
						delete_password: ""
					}
				}
			)
		);
	};

	const delRepFromState = (index) => {
		const newReplies = thread.replies.slice();
		newReplies.splice(index, 1);
		setThread({ ...thread, replies: newReplies });
	};
	
	if(!thread) return "";
	return (
		<div className="container">
			<header>
				<h1 id="threadTitle">{thread._id}</h1>
			</header>
			<div id="boardDisplay">
				<div className="thread">
					<div className="actions-cont">
						<label className="id">
							{thread.created_on}
						</label>
						<div>
							<button
								className="thread-btn reportThread"
								onClick={reportThread}
							>
								Report
							</button>
							<form className="thread-form">
								<input 
									className="thread-input"
									placeholder="password"
									required
									value={thread.delete_password}
									onChange={handleThreadPassword}
								/>
								<button 
									className="thread-btn"
									type="button"
									onClick={delThread}
								>
									Delete
								</button>
							</form>
						</div>
					</div>
					<h2>{thread.text}</h2>
					<hr/>
					<div className="form-cont">
						<form>
							<textarea
								name="text"
								placeholder="Quick reply..."
								required
								value={thread.newRep.text}
								onChange={handleNewRep}
							/>
							<input
								name="delete_password"
								placeholder="password to delete"
								required
								value={thread.newRep.delete_password}
								onChange={handleNewRep}
							/>
							<button
								type="button"
								onClick={sendData}
							>
								Submit
							</button>
						</form>
					</div>
					<div className="replies">
						{
							thread.replies.map(
								(rep, i) =>
									<div key={i}>
										<Reply
											delRepFromState={delRepFromState}
											deleteElement={props.deleteElement}
											index={i}
											rep={rep}
											reportElement={props.reportElement}
											thread={thread}
											url={repliesUrl}
										/>
										<hr/>
									</div>
							)
						}
					</div>
				</div>
			</div>
		</div>
	);
};