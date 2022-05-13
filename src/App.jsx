import React from 'react';
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
		const sendReportReq = () => axios.put(url, reqBody)
			.then(res => alert(res.data))
			.catch(err => console.error(err));
		return (
			<button
				className="rep-btn reportThread"
				onClick={sendReportReq}
			>
				Report
			</button>
		);
	};

	const DeleteForm = ({deletePassword, handlePassword, url, reqBody, action}) => {
		const sendDelReq = () => axios.delete(url, { data: reqBody })
			.then(res => action(res.data))
			.catch(err => console.error(err));
		return (
			<form className="del-form">
				<input 
					className="del-input"
					placeholder="password"
					required
					value={deletePassword}
					onChange={handlePassword}
				/>
				<button 
					className="del-btn"
					type="button"
					onClick={sendDelReq}
				>
					Delete
				</button>
			</form>
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
		const sendNewEleReq = () => axios.post(url, reqBody)
			.then(res => action(res.data))
			.catch(err => console.error(err));
		
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
					element={<Main CreateForm={CreateForm}/>}
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