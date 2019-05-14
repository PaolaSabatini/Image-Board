var spicedPg = require("spiced-pg");

var db = spicedPg("postgres:postgres:postres@localhost:5432/imageboard");

exports.getImage = function getImage() {
    let q = `SELECT * FROM images
            ORDER BY id DESC
            LIMIT 15;`;
    let params = [];
    return db.query(q, params);
};

exports.insertImage = function insertImage(url, username, title, description) {
    let q = `INSERT INTO images (url, username, title, description) VALUES ($1, $2, $3, $4) RETURNING *;`;
    let params = [url, username, title, description];
    return db.query(q, params);
};

exports.getImageId = function getImageId(id) {
    let q = `SELECT * FROM images WHERE id = $1;`;
    let params = [id];
    return db.query(q, params);
};

exports.getMoreImages = lastId =>
    db
        .query(
            `SELECT * FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 15`,
            [lastId]
        )
        .then(({ rows }) => rows);

exports.moreButton = function moreButton() {
    let q = `SELECT id FROM images
            ORDER BY id ASC
            LIMIT 1;`;
    let params = [];
    return db.query(q, params);
};

// another option is make a query inside a query
//
// SELECT *, (
//     SELECT id FROM images
//     ORDER BY id ASC
//     LIMIT 1
// ) AS lowest_id FROM images
// WHERE id < $1 // $1 will be the smallest id of the images array in Vue's data object
// ORDER BY ID DESC
// LIMIT 15;

//-----------                 COMMENTS                    -----------//

exports.getComments = function getComments() {
    let q = `SELECT comment, username, created_at FROM comments;`;
    let params = [];
    return db.query(q, params);
};

exports.insertComments = function insertComments(comment, username, imageid) {
    let q = `INSERT INTO comments (comment, username, imageid) VALUES ($1, $2, $3) RETURNING *;`;
    let params = [comment, username, imageid];
    return db.query(q, params);
};
