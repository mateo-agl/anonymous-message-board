export const CreateForm = ({
	placeholder,
	text,
	handleData,
	deletePassword,
	sendNewEleReq
}) => (
	<form>
		<textarea
			name="text"
			placeholder={`Quick ${placeholder}...`}
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