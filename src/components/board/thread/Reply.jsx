export const Reply = ({rep}) => (
	<div className="reply">
		<label className="id">{`id: ${rep._id} (${rep.created_on})`}</label>
		<p>{rep.text}</p>
	</div>
);