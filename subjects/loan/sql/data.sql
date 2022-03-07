PRAGMA foreign_keys = ON;

CREATE TABLE user (
    uuid TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

INSERT INTO user VALUES (
    "0e7de9a9-7a2e-4b5a-b42d-3df2a9c0455e",
    "me",
    "$2y$10$RB7qqL34O0byt8zt.loYguHBTW5Q1dg4XQnFpsuxPWzMVZ7eIs7Qq"
);
INSERT INTO user VALUES (
    "4302b97f-b429-4648-8b51-73645e6fd269",
    "you",
    "$2y$10$XNHYnYv4fUxKCFM3S.c6W.DDc6HI6Bay3.YmgpQpFt1Iui8l5lw8K"
);


CREATE TABLE loan (
    uuid TEXT PRIMARY KEY,
	name TEXT NOT NULL,
	borrow TEXT NOT NULL,
	date TEXT NOT NULL,
	user TEXT NOT NULL,
    FOREIGN KEY(user) REFERENCES user(uuid)
);

INSERT INTO loan VALUES (
    "ad1afbd2-77d2-404e-bbca-3f352f7f09a2",
	"Star Wars episode 3", 
	"Tahar", 
	"23/05/2006", 
	"0e7de9a9-7a2e-4b5a-b42d-3df2a9c0455e"
);
INSERT INTO loan VALUES (
    "c067b934-d98f-4d0a-a4a3-c89c05a00e4a",
	"Git Pro", 
	"Laurent", 
	"16/01/2021", 
	"0e7de9a9-7a2e-4b5a-b42d-3df2a9c0455e"
);
INSERT INTO loan VALUES (
    "b2d3ff2a-9d6a-4347-9bf9-98bb7f196c2d",
	"RJ45 Tester", 
	"Bobo", 
	"18/01/2021", 
	"4302b97f-b429-4648-8b51-73645e6fd269"
);

