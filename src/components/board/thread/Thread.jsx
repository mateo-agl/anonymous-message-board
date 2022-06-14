import { Link } from "react-router-dom";
import { DeleteBtn, ReportBtn } from "../../shared";

export const Thread = ({ thread, url, handleForm }) => {
	const replies = thread.replies.slice(0, 3);
	const hiddenCount = thread.replies.length > 3 ? thread.replies.length - 3 : 0;
	const threadDate = new Date(thread.created_on).toLocaleString().slice(0,-3);
	
	return (
		<>
			<div className="thread-cont">
				<div className="thread">
					<label className="id">{`id: ${thread._id} (${threadDate})`}</label>
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
					<DeleteBtn 
						handleForm={handleForm}
						reqBody={{ thread_id: thread._id }} 
					/>
				</div>
				{
					replies.map((rep, i) => (
						<div className="reply" key={i}>
							<label className="id">{`id: ${rep._id} (${new Date(rep.created_on).toLocaleString().slice(0,-3)})`}</label>
							<p>{rep.text}</p>
						</div>
					))
				}
			</div>
			<hr/>
		</>
	);
};