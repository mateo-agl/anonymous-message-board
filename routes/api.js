const {
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
} = require("../mongoose.js");

const apiRoutes = app => {
  app
    .route("/api/boards")
    .get((req, res) => findBoards(arr => res.send(arr)));

  app
    .route("/api/threads/")
    .get((req, res) => findRecentThreads(req.query.limit, arr => res.send(arr)));

  app
    .route("/api/threads/:board")
    .post((req, res) => {
      const b = req.body;
      createThread(b.board, b.text, b.delete_password, doc => res.json(doc));
    })
    .get((req, res) => findThreadsByBoard(req.params.board, arr => res.send(arr)))
    .put((req, res) => {
      const b = req.body;
      reportThread(req.params.board, b.thread_id, () => res.send(b.thread_id));
    })
    .delete((req, res) => {
      const b = req.body;
      deleteThread(req.params.board, b.thread_id, b.delete_password, doc => {
        res.json(doc);
      });
    });

  app
    .route("/api/replies/:board")
    .post((req, res) => {
      const b = req.body;
      createReply(req.params.board, b.text, b.delete_password, req.query.thread_id, (rep) => {
        if (b.quick_reply) return res.json(rep);
        res.redirect(`/b/${req.params.board}/${req.query.thread_id}`);
      });
    })
    .get((req, res) => findReplies(req.params.board, req.query.thread_id, (doc) => res.json(doc)))
    .put((req, res) => {
      const b = req.body;
      reportReply(req.params.board, b.thread_id, b.reply_id, () => res.send(b.reply_id));
    })
    .delete((req, res) => {
      const b = req.body;
      deleteReply(req.params.board, b.thread_id, b.reply_id, b.delete_password, (doc) => {
        res.json(doc);
      });
    });
};
module.exports = apiRoutes;