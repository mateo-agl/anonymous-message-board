import { Schema, model, Types, Document } from "mongoose";
import { Board, Done, Reply, Thread } from "../@types/types";

const repliesSchema = new Schema<Reply>({
	_id: Types.ObjectId,
	text: String,
	created_on: Date,
	bumped_on: Date,
	delete_password: String,
	reported: Number,
});

const threadsSchema = new Schema<Thread>({
	_id: Types.ObjectId,
	text: String,
	created_on: Date,
	bumped_on: Date,
	reported: Number,
	delete_password: String,
	replies: [repliesSchema],
	board: String
});

const boardSchema = new Schema<Board>({
	name: String,
	threads: [threadsSchema]
});

const Boards = model<Board>("Boards", boardSchema);

const filter = "-threads.reported -threads.delete_password -threads.replies.reported -threads.replies.delete_password";

const createBoard = (board: string, done: Done) => {
	const newBoard = new Boards({
		name: board,
		threads: []
	});

	Boards.findOne({ name: board }, (err: Error | null, doc: Board & Document) => {
		if(err) return console.error(err);
		if(doc) return done(null);
		newBoard.save((err, doc) => {
			if(err) return console.error(err);
			done(doc);
		});
	});
};

const createThread = (board: string, text: string, password: string, done: Done) => {
	const date = new Date();

	const newThread: Thread = {
		_id: new Types.ObjectId(),
		text: text,
		created_on: date,
		bumped_on: date,
		reported: 0,
		delete_password: password,
		replies: [],
		board: board
	};

	Boards.findOne({ name: board }, (err: Error | null, doc: Board & Document) => {
		if(err) return console.error(err);
		doc.threads.unshift(newThread);
		return doc.save((err: Error | null) => {
			if(err) return console.error(err);
			delete newThread.delete_password;
			delete newThread.reported;
			return done(newThread);
		});
	});
};

const createReply = (board: string, text: string, password: string, thread_id: Types.ObjectId, done: Done) => {
	const date = new Date();
	const id = new Types.ObjectId(thread_id);

	const newReply = {
		_id: new Types.ObjectId(),
		text: text,
		created_on: date,
		delete_password: password,
		reported: 0,
	};

	Boards.findOne({ name: board }, (err: Error | null, doc: Board & Document) => {
		if (err) return console.error(err);
		const thread = doc.threads.id(id);
		if (!thread) return done(null);
		thread.replies.unshift(newReply);
		thread.bumped_on = date;

		doc.save((err: Error | null) => {
			if (err) return console.error(err);
			done(newReply);
		});
	});
};

const findBoards = (done: Done) => {
	Boards.find()
		.select("-_id name")
		.sort("-__v")
		.exec((err: Error | null, arr) => {
			if(err) return console.error(err);
			done(arr);
		});
};

const findRecentThreads = (limit: number, done: Done) => {
	Boards.find()
		.select(filter)
		.exec((err: Error | null, arr) => {
			if(err) return console.error(err);
			let threads: Array<Thread> = [];
			arr.map(b => {
				for(let i = 0; i < b.threads.length; i++) b.threads[i].board = b.name;
				threads = [...threads, ...b.threads];
			});
			threads.sort((a: any, b: any) => b.created_on - a.created_on);
			done(threads.slice(0, limit));
		});
};

const findThreadsByBoard = (board: string, done: Done) => {
	Boards.findOne({ name: board })
		.select(filter)
		.exec((err, doc) => {
			if (err) return console.error(err);
			if (!doc) return done(null);
			done(doc.threads);
		});
};

const findReplies = (board: string, thread_id: Types.ObjectId | string, done: Done) => {
	const ObjectId = Types.ObjectId;

	if (ObjectId.isValid(thread_id)) {
		if (String(new ObjectId(thread_id)) !== thread_id) return done(null);
	} else {
		return done(null);
	}
  
	const id = new ObjectId(thread_id);

	Boards.findOne({ name: board })
		.select(filter)
		.exec((err, doc) => {
			if (err) return console.error(err);
			if (doc) done(doc.threads.id(id));
		});
};

const deleteThread = (board: string, thread_id: Types.ObjectId, password: string, done: Done) => {
	const id = new Types.ObjectId(thread_id);
	Boards.findOne({ name: board }, (err: Error | null, doc: Board & Document) => {
		if (err) return console.error(err);
		const thread = doc.threads.id(id);
		if(!thread || thread.delete_password !== password) return done(false);
		thread.remove();
		doc.save((err: Error | null) => {
			if (err) return console.error(err);
			done(true);
		});
	});
};

const deleteReply = (board: string, thread_id: Types.ObjectId, reply_id: Types.ObjectId, password: string, done: Done) => {
	const t_id = new Types.ObjectId(thread_id);
	const r_id = new Types.ObjectId(reply_id);
	Boards.findOne({ name: board }, (err: Error | null, doc: Board & Document) => {
		if (err) return console.error(err);
		const thread = doc.threads.id(t_id);
		const reply = thread.replies.id(r_id);
		if (!reply || reply.delete_password !== password) return done(false);
		reply.remove();
		doc.save((err: Error | null) => {
			if (err) return console.error(err);
			done(true);
		});
	});
};

const deleteBoard = (name: string) => Boards.findOneAndRemove({ name: name });

const reportThread = (state: string, board: string, thread_id: Types.ObjectId, done: Done) => {
	const id = new Types.ObjectId(thread_id);
	Boards.findOne({ name: board }, (err: Error | null, doc: Board & Document) => {
		if (err) return console.error(err);
		const thread = doc.threads.id(id);
		state === "Reported" ? thread.reported=-1 : thread.reported=+1;
		thread.bumped_on = new Date();
		doc.save((err: Error | null) => {
			if (err) return console.error(err);
			done(state === "Reported" ? false : true);
		});
	});
};

const reportReply = (state: string, board: string, thread_id: Types.ObjectId, reply_id: Types.ObjectId, done: Done) => {
	const t_id = new Types.ObjectId(thread_id);
	const r_id = new Types.ObjectId(reply_id);
	Boards.findOne({ name: board }, (err: Error | null, doc: Board & Document) => {
		if (err) return console.error(err);
		const thread = doc.threads.id(t_id);
		const reply = thread.replies.id(r_id);
		state === "Reported" ? reply.reported=-1 : reply.reported=+1;
		thread.bumped_on = new Date();
		doc.save((err: Error | null) => {
			if (err) return console.error(err);
			done(state === "Reported" ? false : true);
		});
	});
};

export {
	createBoard,
	createThread,
	createReply,
	findBoards,
	findRecentThreads,
	findThreadsByBoard,
	findReplies,
	deleteThread,
	deleteReply,
	reportThread,
	reportReply,
	deleteBoard
};