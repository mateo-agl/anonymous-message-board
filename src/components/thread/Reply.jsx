import { useState } from "react";

export const Reply = (props) => {
	const [repPassword, setRepPword] = useState("");

	const sendDelRepReq = () => {
		props.deleteElement(
			props.url,
			{
				thread_id: props.thread._id,
				reply_id: props.rep._id
			},
			data => {
				if (!data) return alert("Incorrect password");
				props.delRepFromState(props.index);
				setRepPword("");
			}
		);
	};

	const handleRepPword = e => setRepPword(e.target.value);

	const sendReportRepReq = () => {
		props.reportElement(
			props.url,
			{ 
				thread_id: props.thread._id,
				reply_id: props.rep._id
			}
		);
	};
	return (
		<div className="reply">
			<div className="actions-cont">
				<label className="id">
					{`id: ${props.rep._id} (${props.rep.created_on})`}
				</label>
				<div>
					<button
						className="thread-btn reportThread"
						type="button"
						onClick={sendReportRepReq}
					>
						Report
					</button>
					<form className="thread-form">
						<input 
							className="thread-input"
							placeholder="password"
							required
							value={repPassword}
							onChange={handleRepPword}
						/>
						<button 
							className="thread-btn"
							type="button"
							onClick={sendDelRepReq}
						>
							Delete
						</button>
					</form>
				</div>
			</div>
			<h3>{props.rep.text}</h3>
		</div>
	);
};