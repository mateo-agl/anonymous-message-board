export const Reply = ({rep}) => (
	<div className="reply">
		<label className="id">{`id: ${rep._id} (${new Date(rep.created_on).toLocaleString().slice(0,-3)})`}</label>
		<p>{rep.text}</p>
	</div>
);