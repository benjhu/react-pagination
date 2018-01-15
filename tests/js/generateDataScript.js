#!/usr/bin/env node

// Generates a data set that can be paginated.

const fs = require("fs-extra");
const path = require("path");

const test = "Hello, I'm the best!";
const authors = ["Ben", "Billy", "John", "Jonathan", "Cynthia", "Devin", "Clark", "Henry", "Christopher", "Bruce", "Leo", "Danny", "Dan"];
const dynamicString = name => `Hello, my name is ${name}.`;

function shuffle(str) {
    return str.split("")
        .sort(() => 0.5 - Math.random())
        .join("");
}

function generate(entries) {
    const mockData = [];

    for (let i = 0; i < entries; i++) {
        const chosen = authors[Math.floor(Math.random() * authors.length)];

        mockData.push(
            {
                id: i + 1,
                author: chosen,
                data: dynamicString(chosen).concat(": ", shuffle(test.concat(Math.random())))
            }
        );
    }

    return mockData;
}

function writeToFile(destination, entries, rootName) {
    const save = {};

    if (!rootName)
        rootName = "data";

    save[rootName] = generate(entries);

    fs.writeJsonSync(destination, save, { spaces: 4 });
}

const dump = process.argv[2] || "./data";
const fileName = process.argv[3] || "data.json";

writeToFile(path.resolve(dump, fileName), 500, "entries");