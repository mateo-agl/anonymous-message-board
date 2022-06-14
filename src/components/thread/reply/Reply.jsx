import { DeleteBtn, ReportBtn } from "../../shared";

export const Reply = ({ handleForm, url, thread, rep }) => {
	return (
		<>
			<div className="reply">
				<label className="id">
					{`id: ${rep._id} (${new Date(rep.created_on).toLocaleString().slice(0,-3)})`}
				</label>
				<p>{rep.text}</p>
				<div className="actions-cont">
					<ReportBtn 
						reqBody={{ 
							thread_id: thread._id,
							reply_id: rep._id
						}}
						url={url}
					/>
					<DeleteBtn
						handleForm={handleForm}
						reqBody={{ 
							thread_id: thread._id,
							reply_id: rep._id
						}} 
					/>
				</div>
			</div>
			<hr />
		</>
	);
};