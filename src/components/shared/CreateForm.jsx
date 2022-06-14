import axios from "axios";
import { useState } from "react";

export const CreateForm = ({ boardInput, board, placeholder, url, action, quick_reply }) => {
	const [newThread, setNewThread] = useState({
		board: "",
		delete_password: "",
		text: ""
	});
	
	const enableBtn = boardInput
		? newThread.delete_password && newThread.text && newThread.board ? "enabled" : ""
		: newThread.delete_password && newThread.text ? "enabled" : "";

	const sendNewEleReq = () => {
		const newObj = board 
			? {...newThread, board: board} 
			: quick_reply 
				? { ...newThread, quick_reply: true }
				: newThread;
		
		enableBtn && (
			axios.post(url, newObj)
				.then(res => action(res.data))
				.then(res => res && setNewThread({
					board: "",
					delete_password: "",
					text: ""
				}))
				.catch(err => console.error(err))
		);
	};

	const handleData = e => setNewThread({
		...newThread,
		[e.target.name]: e.target.value
	});

	return (
		<div className="form">
			{
				boardInput && 
				<input 
					name="board"
					placeholder="board"
					onChange={handleData}
				/>
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