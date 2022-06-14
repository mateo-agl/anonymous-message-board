import { useEffect, useState } from "react";
import { Link, useHref } from "react-router-dom";
import { Reply } from "./reply/Reply";
import { CreateForm, DeleteBtn, DeleteForm, ReportBtn } from "../shared";

export const Thread = ({fetchData}) => {
	const currentURL = window.location.pathname.split("/");
	const devHostName = "http://localhost:8080";
	const devMode = process.env.NODE_ENV === "development";
	const repliesUrl = `${devMode ? devHostName : ""}/api/replies/${currentURL[2]}?thread_id=${currentURL[3]}`;
	const threadsUrl = `${devMode ? devHostName : ""}/api/threads/${currentURL[2]}`;
	
	const [thread, setThread] = useState({
		formClass: "",
		reqBody: "",
		replies: []
	});
	
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
	
	return (
		<div className="container">
			<div className="board-cont">
				<Link className="board-link" to="/">Home</Link>
				<Link className="board-link" to="/b/games">Games</Link>
				<Link className="board-link" to="/b/technology">Technology</Link>
				<Link className="board-link" to="/b/politics">Politics</Link>
				<Link className="board-link" to="/b/animation">Animation</Link>
				<Link className="board-link" to="/b/food">Food</Link>
			</div>
			<header>
				<h2>{thread._id}</h2>
				<label>{threadDate}</label>
			</header>
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
						url={repliesUrl}
						quick_reply={true}
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