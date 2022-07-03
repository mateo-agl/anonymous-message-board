require("ignore-styles");

require("@babel/register")({
    ignore: [/(node_module)/],
    presets: ["@babel/preset-env", "@babel/preset-react"]
});

const suite = require("mocha").suite;
const test = require("mocha").test;
const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
const { deleteBoard } = require("../mongoose");

chai.use(chaiHttp);

const boardName = "test";
const password = "password";
let id;
let rep_id;

suite("Routing tests", () => {
    suite("POST requests", () => {
        test("Create a board", done => {
            chai.request(server)
                .post("/api/boards")
                .send({ name: boardName })
                .end((err, res) => {
                    if (err) return done(err);
                    assert.equal(res.status, 200);
                    assert.hasAnyKeys(res.body, [ "name", "threads" ], "Does not have the required properties");
                    done();
                });
        }).timeout(10000);

        test("Trying to create an existing board", done => {
            chai.request(server)
                .post("/api/boards")
                .send({ name: boardName })
                .end((err, res) => {
                    if (err) return done(err);
                    assert.equal(res.status, 200);
                    assert.isNull(res.body, "Shouldn't return any board data");
                    done();
                });
        });

        test("Create a thread", done => {
            chai.request(server)
                .post(`/api/threads/${boardName}`)
                .send({ board: boardName, text: "text", delete_password: password })
                .end((err, res) => {
                    if (err) return done(err);
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, "Should be an object");
                    assert.hasAnyKeys(res.body, [
                        "text", "created_on", "bumped_on", "reported", "delete_password", "replies"
                    ], "Does not have the required properties");
                    id = res.body._id;
                    done();
                });
        });

        test("Create a reply", done => {
            chai.request(server)
                .post(`/api/replies/${boardName}?thread_id=${id}`)
                .send({ text: "text", delete_password: password })
                .end((err, res) => {
                    if (err) return done(err);
                    assert.equal(res.status, 200);
                    assert.isObject(res.body, "Should be an object");
                    assert.hasAnyKeys(res.body, [
                        "text", "created_on", "bumped_on", "reported", "delete_password"
                    ], "Does not have the required properties");
                    rep_id = res.body._id;
                    done();
                });
        });
    });

    suite("GET requests", () => {
        test("Get all boards", done => {
            chai.request(server)
                .get("/api/boards")
                .end((err, res) => {
                    if (err) return done(err);
                    assert.equal(res.status, 200);
                    assert.isArray(res.body, "Should be an array");
                    assert.isNotEmpty(res.body, "Should have boards");
                    done();
                });
        });

        test("Get recent threads", done => {
            chai.request(server)
                .get("/api/threads?limit=5")
                .end((err, res) => {
                    if (err) return done(err);
                    assert.equal(res.status, 200);
                    assert.isArray(res.body, "Should be an array");
                    assert.equal(res.body.length, 5, "Array's length should be equal to limit");
                    done();
                });
        });

        test("Get threads from a board", done => {
            chai.request(server)
                .get(`/api/threads/${boardName}`)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.equal(res.status, 200);
                    assert.isArray(res.body, "Should be an array");
                    assert.isNotEmpty(res.body, "Array should have a thread");
                    done();
                });
        });

        test("Get replies from a thread", done => {
            chai.request(server)
                .get(`/api/replies/${boardName}?thread_id=${id}`)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.equal(res.status, 200);
                    assert.isArray(res.body.replies, "Should be an array");
                    assert.isNotEmpty(res.body.replies, "Array should have a reply");
                    done();
                });
        });
    });

    suite("PUT requests", () => {
        test("Report thread", done => {
            chai.request(server)
                .put(`/api/threads/${boardName}`)
                .send({ state: "Report", thread_id: id })
                .end((err, res) => {
                    if (err) return done(err);
                    assert.equal(res.status, 200);
                    assert.equal(res.body, true, "Thread is not reported");
                    done();
                });
        });

        test("Report reply", done => {
            chai.request(server)
                .put(`/api/replies/${boardName}`)
                .send({ state: "Report", thread_id: id, reply_id: rep_id })
                .end((err, res) => {
                    if (err) return done(err);
                    assert.equal(res.status, 200);
                    assert.equal(res.body, true, "Reply is not reported");
                    done();
                });
        });
    });

    suite("DELETE requests", () => {
        test("Delete reply", done => {
            chai.request(server)
                .delete(`/api/replies/${boardName}`)
                .send({ thread_id: id, reply_id: rep_id, delete_password: password })
                .end((err, res) => {
                    if (err) return done(err);
                    assert.equal(res.status, 200);
                    assert.equal(res.body, true, "Reply is not deleted");
                    done();
                });
        });

        test("Delete thread", done => {
            chai.request(server)
                .delete(`/api/threads/${boardName}`)
                .send({ thread_id: id, delete_password: password })
                .end((err, res) => {
                    if (err) return done(err);
                    assert.equal(res.status, 200);
                    assert.equal(res.body, true, "Thread is not deleted");
                    done();
                });
        });

        after(() => deleteBoard(boardName));
    });
});