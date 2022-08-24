import axios from "axios";
import React, { useEffect, useState } from "react";
import { ReportBtnState } from "../../../@types/types";

export const ReportBtn = ({url, reqBody}) => {
	const [btn, setBtn] = useState<ReportBtnState>({text: "Report", class: ""});
	const id = reqBody.reply_id ? reqBody.reply_id : reqBody.thread_id;

	useEffect(() => {
		const reportedList = localStorage.getItem("reported");
		
		if(reportedList) {
			const state = JSON.parse(reportedList).includes(id)
				? {text: "Reported", class: "reported"}
				: {text: "Report", class: ""};
			setBtn(state);
		}
	}, [reqBody]);

	const sendReportReq = () => axios.put(url, {state: btn.text, ...reqBody})
		.then(() => {
			const reportedList = localStorage.getItem("reported");
			let newState: ReportBtnState;
			let newList: Array<string>;

			if(btn.text === "Report") {
				newState = {text: "Reported", class: "reported"};
				newList = reportedList ? [...JSON.parse(reportedList), id] : [id];
			} else {
				newState = {text: "Report", class: ""};
				newList = reportedList ? JSON.parse(reportedList).filter((i: string) => i !== id) : [];
			}

			setBtn(newState);
			localStorage.setItem("reported", JSON.stringify(newList));
		})
		.catch(err => console.error(err));
        
	return (
		<button
			className={`rep-btn reportThread ${btn.class}`}
			onClick={sendReportReq}
		>
			{btn.text}
		</button>
	);
};