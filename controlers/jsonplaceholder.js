const axios = require("axios");
const express = require("express");

function fetchData(req, res) {
  const selected = [];
  axios
    .get("https://jsonplaceholder.typicode.com/todos")
    .then((response) => {
      const completed = req.query.completed;
      const userId = req.query.userId;
      const todos = response.data.map((todo) => {
        const { id, ...rest } = todo;
        return rest;
      });

      todos.forEach((element) => {
        if (element.completed === completed && element.userId === userId) {
          selected.push(element);
        }
      });
      console.log(selected);
      return res.json(selected);
    });
}
module.exports = { fetchData };
