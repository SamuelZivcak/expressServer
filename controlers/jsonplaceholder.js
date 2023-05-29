const axios = require("axios");
const express = require("express");

function fetchData(req, res) {
  axios
    .get("https://jsonplaceholder.typicode.com/todos")
    .then((response) => {
      const todos = response.data.map((todo) => {
        const { id, ...rest } = todo;
        return rest;
      });
      return res.json(todos).send();
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" }).send();
    });
}
module.exports = { fetchData };
