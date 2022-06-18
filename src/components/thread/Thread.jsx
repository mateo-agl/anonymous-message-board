import React, { useEffect, useState } from "react";
import { Reply } from "./reply/Reply";
import { CreateForm, DeleteBtn, DeleteForm, ReportBtn } from "../shared";

export const Thread = ({ host, fetchData }) => {
	const currentURL = window.location.pathname.split("/");
	const repliesUrl = `${host}/api/replies/${currentURL[2]}?thread_id=${currentURL[3]}`;
	const threadsUrl = `${host}/api/threads/${currentURL[2]}`;
	
	const [thread, setThread] = useState({ formClass: "", reqBody: "", replies: [] });
	
	const threadDate = new Date(thread.created_on).toLocaleString().slice(0,-3);
	
	const getThreadData = () => fetchData(
		repliesUrl,
		data => setThread({ formClass: "", reqBody: "", ...data })
	);

	useEffect(getThreadData, []);
	
	const delAction = data => data 
		? (thread.reqBody.reply_id ? getThreadData() : history.back(), true) 
		: alert("Incorrect password");

	const handleForm = reqBody => setThread({ 
		...thread,
		formClass: !thread.formClass ? "show" : "",
		reqBody: reqBody 
	});
	
	const createAction = newData => newData ? (getThreadData(), true) : alert("Oops, an error has ocurred");
	
	return !thread.replies
		? <h1>{"This thread doesn't exist"}</h1>
		: (
			<div className="container thread-route">
				<div className="thread-data">
					<h2>{thread._id}</h2>
					<label>{threadDate}</label>
				</div>
				<div className="thread">
					<p>{thread.text}</p>
					<div className="actions-cont">
						<ReportBtn
							reqBody={{ thread_id: thread._id }}
							url={threadsUrl}
						/>
						<DeleteBtn
							handleForm={handleForm}
							reqBody={{ thread_id: thread._id }} 
						/>
					</div>
					<hr/>
					<div className="form-cont">
						<CreateForm
							action={createAction}
							placeholder={"Quick Reply"}
							quick_reply={true}
							url={repliesUrl}
						/>
					</div>
					<div className="replies">
						{
							thread.replies.map(
								(rep, i) =>
									<Reply
										handleForm={handleForm}
										key={i}
										rep={rep}
										thread={thread}
										url={repliesUrl}
									/>
							)
						}
					</div>
				</div>
				<DeleteForm 
					action={delAction}
					formClass={thread.formClass}
					handleForm={handleForm}
					reqBody={thread.reqBody}
					url={thread.reqBody.reply_id ? repliesUrl : threadsUrl}
				/>
			</div>
		);
};