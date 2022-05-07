import { useEffect, useState } from "react";
import { ReportBtn, CreateForm, DeleteForm } from "../subComponents";
import { Reply } from "./Reply";

export const Thread = ({
	fetchData,
	reportElement,
	deleteElement,
	createElement
}) => {
	const [thread, setThread] = useState("");
	const currentURL = window.location.pathname.split("/");
	const repliesUrl = process.env.NODE_ENV === "development"
		? `http://localhost:5000/api/replies/${currentURL[2]}?thread_id=${currentURL[3]}`
		: `/api/replies/${currentURL[2]}?thread_id=${currentURL[3]}`;
	const threadsUrl = process.env.NODE_ENV === "development"
		? `http://localhost:5000/api/threads/${currentURL[2]}`
		: `/api/threads/${currentURL[2]}`;
	
	useEffect(() => fetchData(repliesUrl, data => {
		setThread({
			...data,
			delete_password: "",
			newRep: {
				thread_id: data._id,
				quick_reply: true,
				text: "",
				delete_password: ""
			}
		});
	}), []);

	const handleNewRep = e => {
		setThread({
			...thread,
			newRep: {
				...thread.newRep,
				[e.target.name]: e.target.value
			}
		});
	};

	const handleThreadPassword = e => {
		setThread({
			...thread,
			delete_password: e.target.value
		});
	};

	const sendReportThreatReq = () => {
		reportElement(
			threadsUrl,
			{ thread_id: thread._id }
		);
	};
	
	const sendDelThreadReq = () => {
		deleteElement(
			threadsUrl,
			{
				thread_id: thread._id,
				delete_password: thread.delete_password
			},
			data => {
				if (data) return (window.location.pathname = `/b/${currentURL[2]}`);
				alert("Incorrect password");
			}
		);
	};
		
	const sendNewRepReq = () => {
		createElement(
			repliesUrl,
			thread.newRep,
			rep => {
				setThread({
					...thread,
					replies: [rep, ...thread.replies],
					newRep: {
						thread_id: thread._id,
						quick_reply: true,
						text: "",
						delete_password: ""
					}
				});
			}
		);
	};

	const delRepFromState = index => {
		const newReplies = thread.replies.slice();
		newReplies.splice(index, 1);
		setThread({ ...thread, replies: newReplies });
	};
	
	if(!thread) return "";
	return (
		<div className="container">
			<header>
				<h1 className="title">{thread._id}</h1>
			</header>
			<div className="thread">
				<div className="actions-cont">
					<label className="id">
						{thread.created_on}
					</label>
					<div>
						<ReportBtn sendReportReq={sendReportThreatReq}/>
						<DeleteForm
							deletePassword={thread.delete_password}
							handlePassword={handleThreadPassword}
							sendDelReq={sendDelThreadReq}
						/>
					</div>
				</div>
				<h2>{thread.text}</h2>
				<hr/>
				<div className="form-cont">
					<CreateForm
						deletePassword={thread.newRep.delete_password}
						handleData={handleNewRep}
						placeholder={"Reply"}
						sendNewEleReq={sendNewRepReq}
						text={thread.newRep.text}
					/>
				</div>
				<div className="replies">
					{
						thread.replies.map(
							(rep, i) =>
								<div key={i}>
									<Reply
										delRepFromState={delRepFromState}
										deleteElement={deleteElement}
										index={i}
										rep={rep}
										reportElement={reportElement}
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
	);
};