const users = {
    user1: [
        "0e7de9a9-7a2e-4b5a-b42d-3df2a9c0455e",
        "me",
        "$2y$10$RB7qqL34O0byt8zt.loYguHBTW5Q1dg4XQnFpsuxPWzMVZ7eIs7Qq"
    ],
    user2: [
        "4302b97f-b429-4648-8b51-73645e6fd269",
        "you",
        "$2y$10$XNHYnYv4fUxKCFM3S.c6W.DDc6HI6Bay3.YmgpQpFt1Iui8l5lw8K"
    ]
}

const uuids = [
    "ad1afbd2-77d2-404e-bbca-3f352f7f09a2",
    "c067b934-d98f-4d0a-a4a3-c89c05a00e4a",
    "b2d3ff2a-9d6a-4347-9bf9-98bb7f196c2d", 
    "a0220d6b-2431-474c-bf07-1940932442b8",
    "301b133b-3ea2-4ef0-926d-3abaf903b4f2"
]

function getSQLType(type) {
    if (type == "integer") {
        return "INTEGER"
    }
    if (type == "float") {
        return "REAL"
    }
    return "TEXT"
}

function getSQLExample(type, value) {
    if (type == "integer") {
        return `${value}`
    }
    if (type == "float") {
        return `${value}`
    }

    return `"${value}"`
}

function SQL(subjectName, config) {
    return `PRAGMA foreign_keys = ON;

CREATE TABLE user (
    uuid TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

${ Object.getOwnPropertyNames(users).reduce((c, p) => {
    return `${c}INSERT INTO user VALUES (
    "${users[p][0]}",
    "${users[p][1]}",
    "${users[p][2]}"
);
`
}, '') }

CREATE TABLE ${subjectName} (
    uuid TEXT PRIMARY KEY,${ Object.getOwnPropertyNames(config.properties).reduce((p, c) => {
    return `${p}\t${c} ${getSQLType(config.properties[c].type)} NOT NULL,
`
            }, '\n') }\tuser TEXT NOT NULL,
    FOREIGN KEY(user) REFERENCES user(uuid)
);

${ config.examples.reduce((c, e, i) => {
    return `${c}INSERT INTO ${subjectName} VALUES (
    "${uuids[i]}",
${ Object.getOwnPropertyNames(config.properties).reduce((p, value) => {
        return `${p}\t${getSQLExample(config.properties[value].type, e[value])}, \n`
    }, '') }\t"${users[e['user']][0]}"
);
`;
}, '') }
`;

// CREATE TABLE user (
//     uuid TEXT PRIMARY KEY,
//     username TEXT NOT NULL UNIQUE,
//     password TEXT NOT NULL
// );

// INSERT INTO user VALUES (
//     "0e7de9a9-7a2e-4b5a-b42d-3df2a9c0455e", 
//     "me", 
//     "$2y$10$.knSRSDupeeSwtJZMxBP1.r/O0tcBNSCDVu1hTM/7UFz0jGT.o.OW"
// );

// CREATE TABLE ${dbName} (
//     uuid TEXT PRIMARY KEY,
// ${ Object.getOwnPropertyNames(properties).reduce((p, c) => {

//             return `${p}\t${c} ${getSQLType(properties[c].type)} NOT NULL,\n`
//         }, '') }\tuser TEXT NOT NULL,
//     FOREIGN KEY(user) REFERENCES user(uuid)
// );

// INSERT INTO ${dbName} VALUES (
//     "ad1afbd2-77d2-404e-bbca-3f352f7f09a2",
// ${ Object.getOwnPropertyNames(properties).reduce((p, c) => {
//         return `${p}\t${getSQLExample(properties[c])},\n`
//     }, '')}\t"0e7de9a9-7a2e-4b5a-b42d-3df2a9c0455e"
// );`

}


module.exports = (config, subjectName) => {
    return [
        {
            path: 'data.sql',
            content: SQL(subjectName, config)
        }
    ]
}