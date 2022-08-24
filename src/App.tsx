import React, { useEffect, useState } from 'react';
import { Link, Location, Route, Routes, useLocation } from "react-router-dom";
import { Main, Board, Thread } from "./components";
import { Search } from './Search';
import axios from 'axios';
import "./app.styles.css";
import { BoardObj, FetchData } from '../@types/types';

const Error = () => <h1>{"This route doesn't exist"}</h1>;

const App = () => {
	const [boards, setBoards] = useState<Array<BoardObj>>([]);

	const devHostName = "http://localhost:8080";
	const host = `${process.env.NODE_ENV === "development" ? devHostName : ""}`;

	const fetchBoards = () => {
		const url = `${host}/api/boards`;
		axios.get(url)
			.then(res => setBoards(res.data))
			.catch(err => console.error(err));
	};

	const location: Location = useLocation();

	const pathname: Array<string> = location.pathname.split("/");

	useEffect(fetchBoards, [location]);

	const fetchData: FetchData = (url, action) => {
		axios.get(url)
			.then(res => action(res.data))
			.catch(err => console.error(err));
	};
	
	return (
		<>
			<Search boards={boards} pathname={pathname}/>
			<nav>
				<h2>Popular boards</h2>
				<div className="board-cont">
					{
						boards.slice(0,5).map(({name}, i: number) => (
							<Link className="board-link" key={i} to={`/b/${name}`}>{name}</Link>
						))
					}
				</div>
			</nav>
			<Routes>
				<Route path="/">
					<Route
						element={
							<Main 
								boards={boards}
								fetchData={fetchData}
								host={host}
							/>
						}
						index
					/>
					<Route
						element={
							<Board
								currentBoard={pathname[2]}
								fetchData={fetchData}
								host={host}	
							/>
						}
						path="b/:board"
					/>
					<Route
						element={
							<Thread
								currentBoard={pathname[2]}
								currentId={pathname[3]}
								fetchData={fetchData}
								host={host}
							/>
						}
						path="b/:board/:thread"
					/>
					<Route element={<Error/>} path="*"/>
				</Route>
			</Routes>
		</>
	);
};

export default App;