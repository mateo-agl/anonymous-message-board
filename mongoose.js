const mongoose = require("mongoose");

const repliesSchema = mongoose.Schema({
  _id: mongoose.ObjectId,
  text: String,
  created_on: Date,
  delete_password: String,
  reported: Boolean,
});

const threadsSchema = mongoose.Schema({
  text: String,
  created_on: Date,
  bumped_on: Date,
  reported: Boolean,
  delete_password: String,
  replies: [repliesSchema]
});

const boardSchema = mongoose.Schema({
  name: String,
  threads: [threadsSchema]
});

const Boards = mongoose.model("Boards", boardSchema);

const filter = "-threads.reported -threads.delete_password -threads.replies.reported -threads.replies.delete_password";

const createThread = (board, text, password, done) => {
  const date = new Date();

  const newThread = {
    text: text,
    created_on: date,
    bumped_on: date,
    reported: false,
    delete_password: password,
    replies: []
  };

  const newBoard = new Boards({
    name: board,
    threads: [newThread]
  });

  Boards.findOne({ name: board }, (err, doc) => {
    if(err) return console.error(err);
    if(doc) {
      doc.threads.unshift(newThread);
      doc.save((err, doc) => {
        if(err) return console.error(err);
        return done(doc.threads[0]);
      });
      return;
    };

    newBoard.save((err, doc) => {
      if (err) return console.error(err);
      done(doc.threads[0]);
    });
  });
};

const createReply = (board, text, password, thread_id, done) => {
  const date = new Date();
  const id = mongoose.Types.ObjectId(thread_id);

  const newReply = {
    _id: new mongoose.Types.ObjectId(),
    text: text,
    created_on: date,
    delete_password: password,
    reported: false,
  };

  Boards.findOne({ name: board }, (err, doc) => {
    if (err) return console.error(err);
    const thread = doc.threads.id(id);
    if (!thread) return done(null);
    thread.replies.unshift(newReply);
    thread.bumped_on = date;

    doc.save(err => {
      if (err) return console.error(err);
      done(newReply);
    });
  });
};

const findRecentThreads = (limit, done) => {
  Boards.find()
    .select(filter)
    .exec((err, arr) => {
      if(err) return console.error(err);
      let threads = [];
      arr.map(b => threads = [...threads, ...b.threads]);
      threads.sort((a, b) => b.created_on - a.created_on);
      done(threads.slice(0, limit));
    });
};

const findThreadsByBoard = (board, done) => {
  Boards.findOne({ name: board })
    .select(filter)
    .exec((err, doc) => {
      if (err) return console.error(err);
      done(doc.threads);
    });
};

const findReplies = (board, thread_id, done) => {
  const id = mongoose.Types.ObjectId(thread_id);

  Boards.findOne({ name: board })
    .select(filter)
    .exec((err, doc) => {
      if (err) return console.error(err);
      done(doc.threads.id(id));
    });
};

const deleteThread = (board, thread_id, password, done) => {
  const id = mongoose.Types.ObjectId(thread_id);
  Boards.findOne({ name: board }, (err, doc) => {
    if (err) return console.error(err);
    const thread = doc.threads.id(id);
    if(!thread || thread.delete_password !== password) return done(null);
    thread.remove();
    doc.save(err => {
      if (err) return console.error(err);
      done(true);
    });
  });
};

const deleteReply = (board, thread_id, reply_id, password, done) => {
  const t_id = mongoose.Types.ObjectId(thread_id);
  const r_id = mongoose.Types.ObjectId(reply_id);
  Boards.findOne({ name: board }, (err, doc) => {
    if (err) return console.error(err);
    const thread = doc.threads.id(t_id);
    const reply = thread.replies.id(r_id);
    if (!reply || reply.delete_password !== password) return done(null);
    reply.remove();
    doc.save(err => {
      if (err) return console.error(err);
      done(true);
    });
  });
};

const reportThread = (board, thread_id, done) => {
  const id = mongoose.Types.ObjectId(thread_id);
  Boards.findOne({ name: board }, (err, doc) => {
    if (err) return console.error(err);
    const thread = doc.threads.id(id);
    if (thread.reported) return done(false);
    thread.reported = true;
    doc.save((err) => {
      if (err) return console.error(err);
      done(true);
    });
  });
};

const reportReply = (board, thread_id, reply_id, done) => {
  const t_id = mongoose.Types.ObjectId(thread_id);
  const r_id = mongoose.Types.ObjectId(reply_id);
  Boards.findOne({ name: board }, (err, doc) => {
    if (err) return console.error(err);
    const thread = doc.threads.id(t_id);
    const reply = thread.replies.id(r_id);
    if (reply.reported) return done(false);
    reply.reported = true;
    doc.save((err) => {
      if (err) return console.error(err);
      done(true);
    });
  });
};

module.exports = {
  createThread,
  createReply,
  findRecentThreads,
  findThreadsByBoard,
  findReplies,
  deleteThread,
  deleteReply,
  reportThread,
  reportReply
};