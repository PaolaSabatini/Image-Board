const express = require("express");
const app = express();
const db = require("./db");
var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");
const s3 = require("./s3");
const config = require("./config");

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(express.static("./public"));

app.use(require("body-parser").json());

app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    console.log("req.file: ", req.file);
    const url = config.s3Url + req.file.filename;
    db.insertImage(url, req.body.username, req.body.title, req.body.description)
        .then(function(results) {
            res.json(results.rows);
        })
        .catch(function(err) {
            console.log(err);
            res.json({
                success: false
            });
        });
});

app.get("/images", (req, res) => {
    db.getImage()
        .then(results => {
            console.log("results in images", results);
            res.json(results.rows);
        })
        .catch(err => {
            console.log(err, "error in get images");
        });

    let lastId = req.params.id;
    console.log("lastId", lastId);

    db.getMoreImages(15).then(result => {
        console.log("resposta in getMoreImages", result);
        res.json(result.rows);
    });
    // db.getComments()
    //     .then(results => {
    //         res.json(results.rows);
    //     })
    //     .catch(err => {
    //         console.log(err, "error in get Comments");
    //     });
});

app.get("/images/:id", (req, res) => {
    console.log("hi, i am working");
    let id = req.params.id;
    console.log(id);
    db.getImageId(id).then(results => {
        console.log("results.rows", results.rows);
        res.json(results.rows[0]);
    });
    // db.getComments().then(results => {
    //     res.json(results.rows);
    // });
});

app.post("/images/:id", (req, res) => {
    console.log("post images:id insert comments");
    let imageid = req.params.id;
    console.log("imageid", imageid);
    let comment = req.body.comment;
    console.log("comment", comment);
    let username = req.body.username;
    console.log("username", username);

    db.insertComments(comment, username, imageid).then(results => {
        res.json(results.rows);
    });
    // db.getComments().then(results => {
    //     res.json(results.rows);
    // });
});

app.listen(8080, () => console.log("L I S T E N I N G . . . "));
