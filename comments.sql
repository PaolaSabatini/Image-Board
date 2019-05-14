DROP TABLE IF EXISTS comments;

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    comment VARCHAR(1000),
    username VARCHAR(250),
    imageid INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
