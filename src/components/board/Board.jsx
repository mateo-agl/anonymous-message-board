import React, { useEffect, useState } from "react";
import { Thread } from "./thread/Thread.jsx";
import { CreateForm, DeleteForm } from "../shared";
import { useNavigate } from "react-router";

export const Board = ({ host, fetchData }) => {
	const currentBoard = window.location.pathname.split("/")[2];
	const url = `${host}/api/threads/${currentBoard}`;

	const navigate = useNavigate();
	
	const [data, setData] = useState({
		formClass: "",
		reqBody: "",
		threads: []
	});
	
	const getThreads = () => fetchData(
		url, threads => setData({ 
			formClass: "",
			reqBody: "",
			threads: threads 
		})
	);
	
	useEffect(() => getThreads(), [navigate]);

	const createAction = newData => newData ? (getThreads(), true) : alert("Oops, an error has ocurred");

	const delAction = data => data ? (getThreads(), true) : alert("Incorrect password");

	const handleForm = reqBody => setData({ 
		...data, 
		formClass: !data.formClass ? "show" : "",
		reqBody: reqBody 
	});
	
	return !data.threads
		? <h1>{"This board doesn't exist"}</h1>
		: (
			<div className="container board-route">
				<header>
					<h1>{currentBoard}</h1>
				</header>
				<h3>Submit a new thread:</h3>
				<div className="form-cont">
					<CreateForm
						action={createAction}
						board={currentBoard}
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