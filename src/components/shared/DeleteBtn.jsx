export const DeleteBtn = ({ reqBody, handleForm }) => (
	<button 
		className="del-btn"
		type="button"
		onClick={() => handleForm(reqBody)}
	>
		Delete
	</button>
);