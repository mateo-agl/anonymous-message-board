import React, { useEffect, useState } from "react";
import { Thread } from "./thread/Thread";
import { CreateForm, DeleteForm } from "../shared";
import { BoardState, ThreadReqBody, ThreadState } from "../../../@types/types.js";

export const Board = ({ host, fetchData, currentBoard }) => {
	const url = `${host}/api/threads/${currentBoard}`;
	
	const [data, setData] = useState<BoardState>({});
	
	const getThreads = () => fetchData(
		url, (threads: Array<ThreadState>) => setData({ 
			formClass: "",
			reqBody: {},
			threads: threads 
		})
	);
	
	useEffect(() => getThreads(), [currentBoard]);

	const createAction = (newData: ThreadState) => newData ? (getThreads(), true) : alert("Oops, an error has ocurred");

	const delAction = (data: ThreadState) => data ? (getThreads(), true) : alert("Incorrect password");

	const handleForm = (reqBody: ThreadReqBody) => setData({ 
		...data, 
		formClass: !data.formClass ? "show" : "",
		reqBody: reqBody 
	});
	if (!data.threads) return null;
	return (
		<div className="container board-route">
			<header>
				<h1>{currentBoard}</h1>
			</header>
			<h3>Submit a new thread:</h3>
			<div className="form-cont">
				<CreateForm
					action={createAction}
					board={currentBoard}
					boards={undefined}
					handleBoardForm={undefined}
					placeholder={"Quick Thread"}
					url={url}
				/>
			</div>
			<hr />
			{
				data.threads.map(
					(ele, i) => (
						<Thread 
							handleForm={handleForm}
							key={i}
							thread={ele}
							url={url}
						/>
					)
				)
			}
			<DeleteForm 
				action={delAction}
				formClass={data.formClass}
				handleForm={handleForm}
				reqBody={data.reqBody}
				url={url}
			/>
		</div>
	);
};