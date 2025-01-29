CREATE TABLE User
(
    id        INTEGER PRIMARY KEY,
    name      TEXT        NOT NULL,
    email     TEXT UNIQUE NOT NULL,
    surname   TEXT        NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);