import { useState } from "react";
import { ReportBtn, DeleteForm } from "../subComponents";

export const Reply = ({
	deleteElement,
	url,
	thread,
	rep,
	delRepFromState,
	index,
	reportElement,
}) => {
	const [repPassword, setRepPword] = useState("");

	const sendDelRepReq = () => {
		deleteElement(
			url,
			{
				thread_id: thread._id,
				reply_id: rep._id
			},
			data => {
				if (data) {
					delRepFromState(index);
					setRepPword("");
					return;
				} 
				alert("Incorrect password");
			}
		);
	};

	const handleRepPword = e => setRepPword(e.target.value);

	const sendReportRepReq = () => {
		reportElement(
			url,
			{ 
				thread_id: thread._id,
				reply_id: rep._id
			}
		);
	};
	return (
		<div className="reply">
			<div className="actions-cont">
				<label className="id">
					{`id: ${rep._id} (${rep.created_on})`}
				</label>
				<div>
					<ReportBtn sendReportReq={sendReportRepReq}/>
					<DeleteForm
						deletePassword={repPassword}
						handlePassword={handleRepPword}
						sendDelReq={sendDelRepReq}
					/>
				</div>
			</div>
			<h3>{rep.text}</h3>
		</div>
	);
};