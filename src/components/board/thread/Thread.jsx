import { useState } from "react";
import { Link } from "react-router-dom";
import { Reply } from "./Reply";

export const Thread = ({
	DeleteForm,
	ReportBtn,
	thread,
	index,
	url,
	delFromState,
}) => {
	const [threadPword, setThreadPword] = useState("");
	const replies = thread.replies.slice(0, 3);
	const hiddenCount = thread.replies.length > 3 ? thread.replies.length - 3 : 0;
	const threadDate = new Date(thread.created_on).toLocaleString().slice(0,-3);
	
	const handlePassword = e => setThreadPword(e.target.value);

	const delAction = data => {
		if(data) {
			delFromState(index);
			setThreadPword("");
			return;
		};
		alert("Incorrect password");
	};
	
	return (
		<>
			<div className="thread-cont">
				<div className="thread">
					<label className="id">
						{`id: ${thread._id} (${threadDate})`}
					</label>
					<p>{thread.text}</p>
				</div>
				<h5 className="thread-link">
					{`${thread.replies.length} replies total (${hiddenCount} hidden)- `}
					<Link to={`${thread._id}`}>See the full thread here.</Link>
				</h5>
				<div className="actions-cont">
					<ReportBtn
						reqBody={{ thread_id: thread._id }}
						url={url}
					/>
					<DeleteForm
						action={delAction}
						deletePassword={threadPword}
						handlePassword={handlePassword}
						reqBody={{
							thread_id: thread._id,
							delete_password: threadPword
						}}
						url={url}
					/>
				</div>
				{
					replies.map((rep, i) => <Reply key={i} rep={rep} />)
				}
			</div>
			<hr/>
		</>
	);
};