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
		<div className="reply">
			<div className="actions-cont">
				<label className="id">
					{`id: ${rep._id} (${rep.created_on})`}
				</label>
				<div>
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
			<h3>{rep.text}</h3>
		</div>
	);
};