import React, { useState, useEffect } from 'react';
import { Route, Routes } from "react-router-dom";
import { Main, Board, Thread } from "./components";
import axios from 'axios';
import "./app.css";

const App = () => {
	const fetchData = (url, action) => {
		axios.get(url)
			.then(res => action(res.data))
			.catch(err => console.error(err));
	};

	const ReportBtn = ({url, reqBody}) => {
		const [btn, setBtn] = useState({text: "Report", class: ""});
		const id = reqBody.reply_id ? reqBody.reply_id : reqBody.thread_id;

		useEffect(() => {
			const reportedList = localStorage.getItem("reported");
			if(reportedList) {
				const state = JSON.parse(reportedList).includes(id)
					? {text: "Reported", class: "reported"}
					: {text: "Report", class: ""};
				setBtn(state);
			};
		}, []);

		const sendReportReq = () => axios.put(url, reqBody)
			.then(() => {
				const reportedList = localStorage.getItem("reported");
				let newState = {};
				let newList = [];
				if(btn.text === "Report") {
					newState = {text: "Reported", class: "reported"};
					newList = reportedList ? [...JSON.parse(reportedList), id] : [id];
				} else {
					newState = {text: "Report", class: ""};
					newList = JSON.parse(reportedList).filter(i => i !== id);
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

	const DeleteForm = ({deletePassword, handlePassword, url, reqBody, action}) => {
		const [formClass, setFormClass] = useState("");

		const sendDelReq = () => {
			if (!deletePassword) return alert("The password input is empty.");
			axios.delete(url, { data: reqBody })
				.then(res => {
					changeClass();
					action(res.data);
				})
				.catch(err => console.error(err));
		};

		const changeClass = () => {
			const className = !formClass ? "show" : "";
			setFormClass(className);
		};

		return (
			<>
				<div className={`del form-cont ${formClass}`}>
					<form className="del-form">
						<input 
							className="del-input"
							placeholder="password"
							required
							type="password"
							value={deletePassword}
							onChange={handlePassword}
						/>
						<button 
							className="submit-password"
							type="button"
							onClick={sendDelReq}
						>
							Submit
						</button>
					</form>
				</div>
				<button 
					className="del-btn"
					type="button"
					onClick={changeClass}
				>
					Delete
				</button>
			</>
		);
	};

	const CreateForm = ({
		children,
		placeholder,
		text,
		handleData,
		deletePassword,
		url,
		reqBody,
		action
	}) => {
		const sendNewEleReq = () => {
			if(!deletePassword || !text) return;
			axios.post(url, reqBody)
				.then(res => action(res.data))
				.catch(err => console.error(err));
		};

		const enableBtn = deletePassword && text ? "enabled" : "";

		return (
			<form>
				{children}
				<textarea
					name="text"
					placeholder={placeholder}
					required
					value={text}
					onChange={handleData}
				/>
				<input
					name="delete_password"
					placeholder="password to delete"
					required
					value={deletePassword}
					onChange={handleData}
				/>
				<button
					type="button"
					onClick={sendNewEleReq}
				>
					Submit
				</button>
			</form>
		);
	};
	
	return (
		<Routes>
			<Route path="/">
				<Route
					element={
						<Main 
							CreateForm={CreateForm}
							fetchData={fetchData}
						/>
					}
					index
				/>
				<Route
					element={
						<Board
							CreateForm={CreateForm}
							DeleteForm={DeleteForm}
							ReportBtn={ReportBtn}
							fetchData={fetchData}
						/>
					}
					path="b/:board"
				/>
				<Route
					element={
						<Thread
							CreateForm={CreateForm}
							DeleteForm={DeleteForm}
							ReportBtn={ReportBtn}
							fetchData={fetchData}
						/>
					}
					path="b/:board/:thread"
				/>
			</Route>
		</Routes>
	);
};

export default App;