import { useState } from "react";
import { DeleteForm, ReportBtn } from "../../subComponents";
import { Reply } from "./Reply";

export const Thread = ({
	thread,
	index,
	url,
	reportElement,
	delFromState,
	deleteElement
}) => {
	const [threadPword, setThreadPword] = useState("");
	const replies = thread.replies.slice(0, 3);
	const hiddenCount = thread.replies.length > 3 
		? thread.replies.length - 3
		: 0;
	
	const handlePassword = e => setThreadPword(e.target.value);

	const sendQuickDelReq = () => {
		deleteElement(
			url,
			{
				thread_id: thread._id,
				delete_password: threadPword,
			},
			data => {
				if(data) {
					delFromState(index);
					setThreadPword("");
					return;
				};
				alert("Incorrect password");
			}
		);
	};

	const sendQuickRepReq = () => reportElement(
		url,
		{ thread_id: thread._id }
	);
	
	return (
		<div className="thread-cont">
			<div className="thread">
				<div className="actions-cont">
					<label className="id">
						{`id: ${thread._id} (${thread.created_on})`}
					</label>
					<div>
						<ReportBtn sendReportReq={sendQuickRepReq}/>
						<DeleteForm
							deletePassword={threadPword}
							handlePassword={handlePassword}
							sendDelReq={sendQuickDelReq}
						/>
					</div>
				</div>
				<p>{thread.text}</p>
			</div>
			<h5 className="thread-link">
				{`${thread.replies.length} replies total (${hiddenCount} hidden)- `}
				<a href={`${thread.board}/${thread._id}`}>
					See the full thread here.
				</a>
			</h5>
			{
				replies.map(
					(rep, i) =>
						<Reply
							key={i}
							rep={rep}
						/>
				)
			}
		</div>
	);
};