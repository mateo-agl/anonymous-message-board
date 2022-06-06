import { useState } from "react";

export const Reply = ({
	DeleteForm,
	ReportBtn,
	url,
	thread,
	rep,
	delRepFromState,
	index
}) => {
	const [repPassword, setRepPword] = useState("");

	const delAction = data => {
		if (data) {
			delRepFromState(index);
			setRepPword("");
			return;
		} 
		alert("Incorrect password");
	};

	const handleRepPword = e => setRepPword(e.target.value);
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
					<DeleteForm
						action={delAction}
						deletePassword={repPassword}
						handlePassword={handleRepPword}
						reqBody={{
							thread_id: thread._id,
							reply_id: rep._id,
							delete_password: repPassword
						}}
						url={url}
					/>
				</div>
			</div>
			<hr />
		</>
	);
};