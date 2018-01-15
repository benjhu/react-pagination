import React from "react";
import ReactDOM from "react-dom";
import { Wrapper as Test } from "./pagination/Paginator.test";
import testData from "./data/data.json";

const mock = [
    { data: "Ben" },
    { data: "Jerry" },
    { data: "Bob" },
    { data: "Hill" },
    { data: "Billy" },
    { data: "Porter" },
    { data: "Sung Kyung" },
    { data: "Jong Suk" },
    { data: "Min Young" },
    { data: "Robin" }
];

const prom = new Promise((resolve) => {
    setTimeout(() => { resolve(mock); }, 4000);
});

ReactDOM.render(
    <Test data={ testData.entries } />,
    document.querySelector("#root")
);