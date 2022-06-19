import axios from "axios";
import React, { useState } from "react";

export const CreateForm = ({ boards, board, placeholder, url, action, quick_reply, handleBoardForm }) => {
	const [newThread, setNewThread] = useState({
		board: "",
		delete_password: "",
		text: ""
	});
	
	const enableBtn = boards
		? newThread.delete_password && newThread.text && newThread.board ? "enabled" : ""
		: newThread.delete_password && newThread.text ? "enabled" : "";

	const sendNewEleReq = () => {
		const newObj = board 
			? {...newThread, board: board} 
			: quick_reply 
				? { ...newThread, quick_reply: true }
				: newThread;

		const newUrl = url + newThread.board;
		
		enableBtn && (
			axios.post(newUrl, newObj)
				.then(res => action({
					...res.data,
					board: board ? board : newThread.board
				}))
				.then(res => res && setNewThread({
					board: "",
					delete_password: "",
					text: ""
				}))
				.catch(err => console.error(err))
		);
	};

	const handleData = e => {
		!e.target.value && handleBoardForm();
		
		setNewThread({
			...newThread,
			[e.target.name]: e.target.value
		});
	};
	
	return (
		<div className="form">
			{
				boards && 
				<select name="board" onChange={handleData}>
					<option hidden>Select a board</option>
					<option value="">Create a board</option>
					{
						boards.map(({name}, i) => (
							<option key={i}>{name}</option>
						))
					}
				</select>
			}
			<textarea
				name="text"
				placeholder={placeholder}
				value={newThread.text}
				onChange={handleData}
			/>
			<input
				name="delete_password"
				placeholder="password to delete"
				type="password"
				value={newThread.delete_password}
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