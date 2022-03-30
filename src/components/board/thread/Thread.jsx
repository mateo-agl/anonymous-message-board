import { useState } from "react";
import { Reply } from "./Reply";

export const Thread = (props) => {
	const [threadPword, setThreadPword] = useState("");
	const replies = props.thread.replies.slice(0, 3);
	const hiddenCount = props.thread.replies.length > 3 
		? props.thread.replies.length - 3
		: 0;
	
	const handlePassword = e => setThreadPword(e.target.value);

	const sendQuickDelReq = () => {
		props.deleteElement(
			props.url,
			{
				thread_id: props.thread._id,
				delete_password: threadPword,
			},
			data => {
				if(!data) return alert("Incorrect password");
				props.delFromState(props.index);
				setThreadPword("");
			}
		);
	};

	const sendQuickRepReq = () => props.reportElement(
		props.url,
		{ thread_id: props.thread._id }
	);
	
	return (
		<div className="thread-cont">
			<div className="thread">
				<div className="actions-cont">
					<label className="id">
						{`id: ${props.thread._id} (${props.thread.created_on})`}
					</label>
					<div>
						<button
							className="thread-btn reportThread"
							onClick={sendQuickRepReq}
						>
							Report
						</button>
						<form className="thread-form">
							<input
								className="thread-input"
								placeholder="password"
								required
								value={threadPword}
								onChange={handlePassword}
							/>
							<button 
								className="thread-btn"
								type="button"
								onClick={sendQuickDelReq}
							>
								Delete
							</button>
						</form>
					</div>
				</div>
				<p>{props.thread.text}</p>
			</div>
			<h5 className="thread-link">
				{`${props.thread.replies.length} replies total (${hiddenCount} hidden)- `}
				<a href={`${props.thread.board}/${props.thread._id}`}>
					See the full thread here.
				</a>
			</h5>
			<div className="replies">
				{
					replies.map(
						(rep, i) =>
							<Reply
								key={i}
								rep={rep}
								thread={props.thread}
							/>
					)
				}
			</div>
		</div>
	);
};