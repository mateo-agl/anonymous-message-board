import React, { useState } from 'react';
import { Route, Routes } from "react-router-dom";
import { Main, Board, Thread } from "./components";
import axios from 'axios';
import "./app.styles.css";

const Error = () => <h1>{"This board doesn't exist"}</h1>;

const App = () => {
	const fetchData = (url, action) => {
		axios.get(url)
			.then(res => action(res.data))
			.catch(err => console.error(err));
	};
	
	return (
		<Routes>
			<Route path="/">
				<Route
					element={<Main fetchData={fetchData}/>}
					index
				/>
				<Route
					element={<Board fetchData={fetchData}/>}
					path="b/:board"
				/>
				<Route
					element={<Thread fetchData={fetchData}/>}
					path="b/:board/:thread"
				/>
				<Route element={<Error/>} path="b/*"/>
			</Route>
		</Routes>
	);
};

export default App;