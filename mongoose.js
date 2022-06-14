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
  replies: [repliesSchema],
  board: String,
});

const Threads = mongoose.model("Threads", threadsSchema);

const createThread = (board, text, password, done) => {
  const date = new Date();
  const newThread = new Threads({
    text: text,
    created_on: date,
    bumped_on: date,
    reported: false,
    delete_password: password,
    replies: [],
    board: board,
  });
  newThread.save((err, doc) => {
    if (err) return console.error(err);
    done(doc);
  });
};

const createReply = (text, password, thread_id, done) => {
  const date = new Date();
  const id = mongoose.Types.ObjectId(thread_id);
  const newReply = {
    _id: new mongoose.Types.ObjectId(),
    text: text,
    created_on: date,
    delete_password: password,
    reported: false,
  };
  Threads.findById(id, (err, doc) => {
    if (err) return console.error(err);
    if (doc === null) return done(null);
    doc.replies.unshift(newReply);
    doc.bumped_on = date;
    doc.save((err) => {
      if (err) return console.error(err);
      done(newReply);
    });
  });
};

const findRecentThreads = (limit, done) => {
  Threads
    .find()
    .limit(limit)
    .sort("-created_on")
    .exec((err, arr) => {
      if (err) return console.error(err);
      done(arr);
    });
};

const findThreadsByBoard = (board, done) => {
  Threads.find({ board: board })
    .select(
      "-reported -delete_password -replies.reported -replies.delete_password"
    )
    .sort("-bumped_on")
    .exec((err, arr) => {
      if (err) return console.error(err);
      done(arr);
    });
};

const findReplies = (thread_id, done) => {
  const id = mongoose.Types.ObjectId(thread_id);
  Threads.findById(id)
    .select(
      "-reported -delete_password -replies.reported -replies.delete_password"
    )
    .exec((err, doc) => {
      if (err) return console.error(err);
      done(doc);
    });
};

const deleteThread = (thread_id, password, done) => {
  const id = mongoose.Types.ObjectId(thread_id);
  Threads.findOneAndDelete(
    {
      _id: id,
      delete_password: password,
    },
    (err, doc) => {
      if (err) return console.error(err);
      done(doc);
    }
  );
};

const deleteReply = (thread_id, reply_id, password, done) => {
  const t_id = mongoose.Types.ObjectId(thread_id);
  const r_id = mongoose.Types.ObjectId(reply_id);
  Threads.findById(t_id, (err, doc) => {
    if (err) return console.error(err);
    const reply = doc.replies.id(r_id);
    if (reply.delete_password != password) return done(null);
    reply.remove();
    doc.save((err, doc) => {
      if (err) return console.error(err);
      done(doc);
    });
  });
};

const reportThread = (thread_id, done) => {
  const id = mongoose.Types.ObjectId(thread_id);
  Threads.findById(id, (err, doc) => {
    if (err) return console.error(err);
    if (doc.reported) return done();
    doc.reported = true;
    doc.save((err) => {
      if (err) return console.error(err);
      done();
    });
  });
};

const reportReply = (thread_id, reply_id, done) => {
  const t_id = mongoose.Types.ObjectId(thread_id);
  const r_id = mongoose.Types.ObjectId(reply_id);
  Threads.findById(t_id, (err, doc) => {
    if (err) return console.error(err);
    if (doc.replies.id(r_id).reported === true) return done();
    doc.replies.id(r_id).reported = true;
    doc.save((err) => {
      if (err) return console.error(err);
      done();
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