import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Reply } from "./Reply";

export const Thread = ({
	CreateForm,
	DeleteForm,
	ReportBtn,
	fetchData
}) => {
	const [thread, setThread] = useState("");
	const currentURL = window.location.pathname.split("/");
	const repliesUrl = process.env.NODE_ENV === "development"
		? `http://localhost:8080/api/replies/${currentURL[2]}?thread_id=${currentURL[3]}`
		: `/api/replies/${currentURL[2]}?thread_id=${currentURL[3]}`;
	const threadsUrl = process.env.NODE_ENV === "development"
		? `http://localhost:8080/api/threads/${currentURL[2]}`
		: `/api/threads/${currentURL[2]}`;
	
	useEffect(() => fetchData(repliesUrl, getThreadData), []);

	const getThreadData = data => {
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
	};

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

	const delAction = data => {
		if (data) return history.back();
		alert("Incorrect password");
	};
	
	const createAction = rep => {
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
	};

	const delRepFromState = index => {
		const newReplies = thread.replies.slice();
		newReplies.splice(index, 1);
		setThread({ ...thread, replies: newReplies });
	};
	
	if(!thread) return "";
	return (
		<div className="container">
			<div className="board-cont">
				<Link className="board-link home" to="/">Home</Link>
				<Link className="board-link" to="/b/games">Games</Link>
				<Link className="board-link" to="/b/technology">Technology</Link>
				<Link className="board-link" to="/b/politics">Politics</Link>
				<Link className="board-link" to="/b/animation">Animation</Link>
				<Link className="board-link" to="/b/food">Food</Link>
			</div>
			<header>
				<h1>{thread._id}</h1>
			</header>
			<div className="thread">
				<div className="actions-cont">
					<label className="id">
						{thread.created_on}
					</label>
					<div>
						<ReportBtn
							reqBody={{ thread_id: thread._id }}
							url={threadsUrl}
						/>
						<DeleteForm
							action={delAction}
							deletePassword={thread.delete_password}
							handlePassword={handleThreadPassword}
							reqBody={{
								thread_id: thread._id,
								delete_password: thread.delete_password
							}}
							url={threadsUrl}
						/>
					</div>
				</div>
				<h2>{thread.text}</h2>
				<hr/>
				<div className="form-cont">
					<CreateForm
						action={createAction}
						deletePassword={thread.newRep.delete_password}
						handleData={handleNewRep}
						placeholder={"Quick Reply"}
						reqBody={thread.newRep}
						text={thread.newRep.text}
						url={repliesUrl}
					/>
				</div>
				<div className="replies">
					{
						thread.replies.map(
							(rep, i) =>
								<div key={i}>
									<Reply
										DeleteForm={DeleteForm}
										ReportBtn={ReportBtn}
										delRepFromState={delRepFromState}
										index={i}
										rep={rep}
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