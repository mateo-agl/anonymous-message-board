import axios from "axios";
import React, { useState } from "react";

export const DeleteForm = ({ url, reqBody, action, formClass, handleForm }) => {
	const [password, setPassword] = useState("");
    
	const handlePassword = e => setPassword(e.target.value);

	const sendDelReq = () => !password 
		? alert("The password input is empty.")
		: axios.delete(url, { data: { ...reqBody, delete_password: password } })
			.then(res => action(res.data))
			.then(res => res && setPassword(""))
			.catch(err => console.error(err));

	return (
		<>
			<div className={`pop-up form-cont ${formClass}`}>
				<div className="form">
					<input 
						className="pop-up-input"
						placeholder="password"
						type="password"
						value={password}
						onChange={handlePassword}
					/>
					<button 
						className="pop-up-btn submit"
						type="button"
						onClick={sendDelReq}
					>
						Submit
					</button>
				</div>
			</div>
			<span 
				className={`background ${formClass}`} 
				onClick={() => (handleForm(""), setPassword(""))}
			/>
		</>
	);
};