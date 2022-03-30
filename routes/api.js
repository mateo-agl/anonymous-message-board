const {
  createThread,
  createReply,
  findThreads,
  findReplies,
  deleteThread,
  deleteReply,
  reportThread,
  reportReply,
} = require("../mongoose.js");

module.exports = apiRoutes = (app) => {
  app
    .route("/api/threads/:board")
    .post((req, res) => {
      const b = req.body;
      createThread(b.board, b.text, b.delete_password, doc => {
        res.json(doc);
      });
    })
    .get((req, res) => findThreads(req.params.board, (arr) => res.send(arr)))
    .put((req, res) => {
      const b = req.body;
      reportThread(b.thread_id, () => res.send("Thread successfully reported"));
    })
    .delete((req, res) => {
      const b = req.body;
      deleteThread(b.thread_id, b.delete_password, doc => {
        res.json(doc);
      });
    });

  app
    .route("/api/replies/:board")
    .post((req, res) => {
      const b = req.body;
      createReply(b.text, b.delete_password, b.thread_id, (rep) => {
        if (b.quick_reply) return res.json(rep);
        res.redirect(`/b/${req.params.board}/${b.thread_id}`);
      });
    })
    .get((req, res) => findReplies(req.query.thread_id, (doc) => res.json(doc)))
    .put((req, res) => {
      const b = req.body;
      reportReply(b.thread_id, b.reply_id, () =>
        res.send("Reply successfully reported")
      );
    })
    .delete((req, res) => {
      const b = req.body;
      deleteReply(b.thread_id, b.reply_id, b.delete_password, (doc) => {
        if (!doc) return res.send("Incorrect password");
      });
    });
};
