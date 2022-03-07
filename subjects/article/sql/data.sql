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


CREATE TABLE article (
    uuid TEXT PRIMARY KEY,
	state TEXT NOT NULL,
	url TEXT NOT NULL,
	priority INTEGER NOT NULL,
	user TEXT NOT NULL,
    FOREIGN KEY(user) REFERENCES user(uuid)
);

INSERT INTO article VALUES (
    "ad1afbd2-77d2-404e-bbca-3f352f7f09a2",
	"read", 
	"https://www.conseil-constitutionnel.fr/sites/default/files/as/root/bank_mm/anglais/constiution_anglais_oct2009.pdf", 
	4, 
	"0e7de9a9-7a2e-4b5a-b42d-3df2a9c0455e"
);
INSERT INTO article VALUES (
    "c067b934-d98f-4d0a-a4a3-c89c05a00e4a",
	"wait", 
	"https://www.clever-cloud.com/blog/engineering/2019/01/07/git-am-how-to-fork/", 
	7, 
	"0e7de9a9-7a2e-4b5a-b42d-3df2a9c0455e"
);
INSERT INTO article VALUES (
    "b2d3ff2a-9d6a-4347-9bf9-98bb7f196c2d",
	"wait", 
	"https://www.uca.fr/actualites/toutes-les-actualites/vie-de-luniversite/suivi-de-levolution-du-nombre-de-personnels-et-detudiants-covid-et-analyse-de-lorigine-de-leur-contamination-a-luniversite-clermont-auvergne-et-etablissements-associes", 
	1, 
	"4302b97f-b429-4648-8b51-73645e6fd269"
);

