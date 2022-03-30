export const Reply = (props) => (
	<div className="reply">
		<label className="id">{`id: ${props.rep._id} (${props.rep.created_on})`}</label>
		<p>{props.rep.text}</p>
	</div>
);