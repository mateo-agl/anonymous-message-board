import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export const Search = ({boards}) => {
	const [board, setBoard] = useState({name: "", matches: []});

	const navigate = useNavigate();

	const handleBoardName = e => setBoard({name: e.target.value, matches: findMatch(e.target.value)});

	const handleEnter = e => e.key === "Enter" && board.name && navigate(`b/${board.name}`);

	const findMatch = input => boards.filter(({name}) => !input ? false : name.startsWith(input));

	const reset = () => setBoard({name: "", matches: []});
	
	return (
		<div className="search form-cont">
			<div id="search-cont">
				<input
					autoComplete="off"
					id="search"
					name="search"
					placeholder="Search a board"
					value={board.name}
					onChange={handleBoardName}
					onKeyDown={handleEnter}
				/>
				<div id="matches">
					{
						board.matches.map(({name}, i) => (
							<Link className="match" key={i} to={`b/${name}`} onClick={reset}>{name}</Link>
						))
					}
				</div>
			</div>
		</div>
	);
};