import { Application, Request } from "express";
import { Types } from "mongoose";
import {
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
} from "../mongoose";

const apiRoutes = (app: Application) => {
	app
		.route("/api/boards")
		.post((req, res) => createBoard(req.body.name, data => res.json(data)))
		.get((req, res) => findBoards(arr => res.send(arr)));

	app
		.route("/api/threads/")
		.get((req: { query: { limit: number } }, res) => findRecentThreads(req.query.limit, arr => res.send(arr)));

	app
		.route("/api/threads/:board")
		.post((req, res) => {
			const b = req.body;
			createThread(b.board, b.text, b.delete_password, doc => res.json(doc));
		})
		.get((req, res) => findThreadsByBoard(req.params.board, arr => res.send(arr)))
		.put((req, res) => {
			const b = req.body;
			reportThread(b.state, req.params.board, b.thread_id, done => res.send(done));
		})
		.delete((req, res) => {
			const b = req.body;
			deleteThread(req.params.board, b.thread_id, b.delete_password, done => res.send(done));
		});

	app
		.route("/api/replies/:board")
		.post((req: Request & { query: { thread_id: Types.ObjectId } }, res) => {
			const b = req.body;
			createReply(req.params.board, b.text, b.delete_password, req.query.thread_id, (rep) => res.json(rep));
		})
		.get((req: Request & { query: { thread_id: Types.ObjectId } }, res) => findReplies(req.params.board, req.query.thread_id, (doc) => res.json(doc)))
		.put((req, res) => {
			const b = req.body;
			reportReply(b.state, req.params.board, b.thread_id, b.reply_id, done => res.send(done));
		})
		.delete((req, res) => {
			const b = req.body;
			deleteReply(req.params.board, b.thread_id, b.reply_id, b.delete_password, done => res.send(done));
		});
};

export default apiRoutes;