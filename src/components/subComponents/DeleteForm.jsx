export const DeleteForm = ({deletePassword, handlePassword, sendDelReq}) => (
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