import React from 'react';
import { Route, Routes } from "react-router-dom";
import { Main, Board, Thread } from "./components";
import "./app.css";
import axios from 'axios';

const App = () => {
	const fetchData = (url, action) => {
		axios.get(url)
			.then(res => action(res.data))
			.catch(err => console.error(err));
	};

	const createElement = (url, reqBody, action) => {
		axios.post(url, reqBody)
			.then(res => action(res.data))
			.catch(err => console.error(err));
	};

	const reportElement = (url, reqBody) => {
		axios.put(url, reqBody)
			.then(res => alert(res.data))
			.catch(err => console.error(err));

	};

	const deleteElement = (url, reqBody, action) => {
		axios.delete(url, { data: reqBody })
			.then(res => action(res.data))
			.catch(err => console.error(err));
	};

	return (
		<Routes>
			<Route path="/">
				<Route
					element={
						<Main
							createElement={createElement}
						/>
					}
					index
				/>
				<Route
					element={
						<Board
							createElement={createElement}
							deleteElement={deleteElement}
							fetchData={fetchData}
							reportElement={reportElement}
						/>
					}
					path="b/:board"
				/>
				<Route
					element={
						<Thread
							createElement={createElement}
							deleteElement={deleteElement}
							fetchData={fetchData}
							reportElement={reportElement}
						/>
					}
					path="b/:board/:thread"
				/>
			</Route>
		</Routes>
	);
};

export default App;