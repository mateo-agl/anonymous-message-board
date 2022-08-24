import axios from "axios";
import React, { useState } from "react";
import { BoardObj, CreateFormState } from "../../../@types/types";

export const CreateForm = ({ boards, board, placeholder, url, action, handleBoardForm }) => {
	const [cFormState, SetCFormState] = useState<CreateFormState>({
		selectClass: "",
		input: "",
		newThread: {
			board: board ? board : "",
			delete_password: "",
			text: ""
		}
	});

	const enableBtn = cFormState.newThread.delete_password 
		&& cFormState.newThread.text 
		&& (boards ? cFormState.newThread.board : true) 
		? "enabled" 
		: "";

	const sendNewEleReq = () => {		
		if (!enableBtn) return;		
		axios.post(url + cFormState.newThread.board, cFormState.newThread)
			.then(res => action({
				...res.data,
				board: cFormState.newThread.board
			}))
			.then(res => res && SetCFormState({
				selectClass: "",
				input: "",
				newThread: {
					board: board ? board : "",
					delete_password: "",
					text: ""
				}
			}))
			.catch(err => console.error(err));
	};

	const handleData = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
		SetCFormState({
			...cFormState,
			newThread: { 
				...cFormState.newThread,
				[e.target.name]: e.target.value
			}
		});
	};

	const handleBoardInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		SetCFormState({
			...cFormState,
			input: e.target.value
		});
	};

	const handleOpts = (e: React.FocusEvent<HTMLInputElement>) => {
		if (e.type === "blur"
			&& e.relatedTarget?.className.includes("select")) return;

		SetCFormState({
			...cFormState,
			input: cFormState.newThread.board,
			selectClass: e.type === "blur" ? "" : "show"
		});
	};

	const selectBoard = (e: React.MouseEvent<HTMLDivElement>) => {
		SetCFormState({
			...cFormState,
			input: e.currentTarget.textContent || "",
			selectClass: "",
			newThread: {
				...cFormState.newThread,
				board: e.currentTarget.textContent || ""
			}
		});
	};

	const createBoard = () => {
		SetCFormState({ ...cFormState, selectClass: "" });
		handleBoardForm();
	};

	return (
		<div className="form">
			{
				boards && 
				<div className="select-cont" tabIndex={-1}>
					<input
						autoComplete="off"
						className="select-input"
						name="input"
						placeholder="Select a board"
						type="text"
						value={cFormState.input}
						onBlur={handleOpts}
						onChange={handleBoardInput}
						onFocus={handleOpts}
					/>
					<div className={`select-matches ${cFormState.selectClass}`}>
						<div className="select match" onClick={createBoard}>
							Create Board
						</div>
						{
						 	boards.filter((b: BoardObj) => b.name.startsWith(cFormState.input))
								.map(({name}, i: number) => (
									<div className="select match" key={i} onClick={selectBoard}>
										{name}
									</div>
								))
						}
					</div>
				</div>
			}
			<textarea
				name="text"
				placeholder={placeholder}
				value={cFormState.newThread.text}
				onChange={handleData}
			/>
			<input
				name="delete_password"
				placeholder="password to delete"
				type="password"
				value={cFormState.newThread.delete_password}
				onChange={handleData}
			/>
			<button
				className={`post-btn submit ${enableBtn}`}
				type="button"
				onClick={sendNewEleReq}
			>
				Post
			</button>
		</div>
	);
};