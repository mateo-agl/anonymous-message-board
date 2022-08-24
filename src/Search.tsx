import React, { useState } from "react";
import { useNavigate, Link, NavigateFunction } from "react-router-dom";
import { SearchState } from "../@types/types";

export const Search = ({ boards, pathname }) => {
	const [board, setBoard] = useState<SearchState>({name: "", matches: []});

	const navigate: NavigateFunction = useNavigate();

	const reset = () => setBoard({name: "", matches: []});

	const handleBoardName = (e: React.ChangeEvent<HTMLInputElement>) => setBoard({
		name: e.target.value,
		matches: findMatch(e.target.value.toLowerCase())
	});

	const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && board.name && navigate(`b/${board.name}`);

	const findMatch = (input: string) => boards.filter(
		({name}) => !input ? false : name.startsWith(input)
	);

	return (
		<div className="search form-cont">
			{
				pathname.length > 2 && 
				<Link to="/">
					<svg className="bi bi-arrow-left-short" fill="currentColor" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
						<path d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z" fillRule="evenodd"/>
					</svg>
				</Link>
			}
			<div id="search-cont">
				<input
					autoComplete="off"
					id="search"
					name="search"
					placeholder="Search a board"
					value={board.name}
					onBlur={e => !e.relatedTarget && setBoard({ ...board, matches: [] })}
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