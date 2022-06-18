import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ReactComponent as Arrow } from "./assests/arrow-left-short.svg";

export const Search = ({boards}) => {
	const [board, setBoard] = useState({name: "", matches: []});

	const navigate = useNavigate();

	const reset = () => setBoard({name: "", matches: []});

	const handleBoardName = e => setBoard({
		name: e.target.value,
		matches: findMatch(e.target.value.toLowerCase())
	});

	const handleEnter = e => e.key === "Enter" && board.name && navigate(`b/${board.name}`);

	const findMatch = input => boards.filter(
		({name}) => !input ? false : name.startsWith(input)
	);

	return (
		<div className="search form-cont">
			{
				window.location.pathname !== "/" && 
				<Link to="/"><Arrow className="home"/></Link>
			}
			<div id="search-cont">
				<input
					autoComplete="off"
					id="search"
					name="search"
					placeholder="Search a board"
					value={board.name}
					onBlur={reset}
					onChange={handleBoardName}
					onKeyDown={handleEnter}
				/>
				<div id="matches">
					{
						board.matches.map(({name}, i) => (
							<Link className="match" key={i} to={`b/${name}`}>{name}</Link>
						))
					}
				</div>
			</div>
		</div>
	);
};