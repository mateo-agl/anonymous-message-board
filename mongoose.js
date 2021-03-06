const mongoose = require("mongoose");

const repliesSchema = mongoose.Schema({
  _id: mongoose.ObjectId,
  text: String,
  created_on: Date,
  bumped_on: Date,
  delete_password: String,
  reported: Number,
});

const threadsSchema = mongoose.Schema({
  _id: mongoose.ObjectId,
  text: String,
  created_on: Date,
  bumped_on: Date,
  reported: Number,
  delete_password: String,
  replies: [repliesSchema],
  board: String
});

const boardSchema = mongoose.Schema({
  name: String,
  threads: [threadsSchema]
});

const Boards = mongoose.model("Boards", boardSchema);

const filter = "-threads.reported -threads.delete_password -threads.replies.reported -threads.replies.delete_password";

const createBoard = (board, done) => {
  const newBoard = Boards({
    name: board,
    threads: []
  });

  Boards.findOne({ name: board }, (err, doc) => {
    if(err) return console.error(err);
    if(doc) return done(null);
    newBoard.save((err, doc) => {
      if(err) return console.error(err);
      done(doc);
    });
  });
};

const createThread = (board, text, password, done) => {
  const date = new Date();

  const newThread = {
    _id: mongoose.Types.ObjectId(),
    text: text,
    created_on: date,
    bumped_on: date,
    reported: 0,
    delete_password: password,
    replies: []
  };

  Boards.findOne({ name: board }, (err, doc) => {
    if(err) return console.error(err);
    doc.threads.unshift(newThread);
    return doc.save(err => {
      if(err) return console.error(err);
      delete newThread.delete_password;
      delete newThread.reported;
      return done(newThread);
    });
  });
};

const createReply = (board, text, password, thread_id, done) => {
  const date = new Date();
  const id = mongoose.Types.ObjectId(thread_id);

  const newReply = {
    _id: mongoose.Types.ObjectId(),
    text: text,
    created_on: date,
    delete_password: password,
    reported: 0,
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

const findBoards = done => {
  Boards.find()
    .select("-_id name")
    .sort("-__v")
    .exec((err, arr) => {
      if(err) return console.error(err);
      done(arr);
    });
};

const findRecentThreads = (limit, done) => {
  Boards.find()
    .select(filter)
    .exec((err, arr) => {
      if(err) return console.error(err);
      let threads = [];
      arr.map(b => {
        for(let i = 0; i < b.threads.length; i++) b.threads[i].board = b.name;
        threads = [...threads, ...b.threads];
      });
      threads.sort((a, b) => b.created_on - a.created_on);
      done(threads.slice(0, limit));
    });
};

const findThreadsByBoard = (board, done) => {
  Boards.findOne({ name: board })
    .select(filter)
    .exec((err, doc) => {
      if (err) return console.error(err);
      if (!doc) return done(null);
      done(doc.threads);
    });
};

const findReplies = (board, thread_id, done) => {
  const ObjectId = mongoose.Types.ObjectId;

  if (ObjectId.isValid(thread_id)) {
      if (String(new ObjectId(thread_id)) !== thread_id) return done(null);
  } else {
    return done(null)
  };
  
  const id = ObjectId(thread_id);

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
    if(!thread || thread.delete_password !== password) return done(false);
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
    if (!reply || reply.delete_password !== password) return done(false);
    reply.remove();
    doc.save(err => {
      if (err) return console.error(err);
      done(true);
    });
  });
};

const deleteBoard = name => Boards.findOneAndRemove({ name: name });

const reportThread = (state, board, thread_id, done) => {
  const id = mongoose.Types.ObjectId(thread_id);
  Boards.findOne({ name: board }, (err, doc) => {
    if (err) return console.error(err);
    const thread = doc.threads.id(id);
    state === "Reported" ? thread.reported=-1 : thread.reported=+1;
    thread.bumped_on = new Date();
    doc.save(err => {
      if (err) return console.error(err);
      done(state === "Reported" ? false : true);
    });
  });
};

const reportReply = (state, board, thread_id, reply_id, done) => {
  const t_id = mongoose.Types.ObjectId(thread_id);
  const r_id = mongoose.Types.ObjectId(reply_id);
  Boards.findOne({ name: board }, (err, doc) => {
    if (err) return console.error(err);
    const thread = doc.threads.id(t_id);
    const reply = thread.replies.id(r_id);
    state === "Reported" ? reply.reported=-1 : reply.reported=+1;
    thread.bumped_on = new Date();
    doc.save(err => {
      if (err) return console.error(err);
      done(state === "Reported" ? false : true);
    });
  });
};

module.exports = {
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