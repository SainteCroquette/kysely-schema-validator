CREATE TABLE User
(
    id        INTEGER PRIMARY KEY,
    name      TEXT        NOT NULL,
    email     TEXT UNIQUE NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Item
(
    id        INTEGER PRIMARY KEY,
    name      TEXT        NOT NULL,
    price     FLOAT        NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);