const axios = require("axios");

function fetchData(req, res) {
  const selected = [];
  const textOnly = req.query.textOnly;

  axios
    .get("https://jsonplaceholder.typicode.com/todos")
    .then((response) => {
      const completed = req.query.completed;
      const userId = req.query.userId;
      let todos = response.data.map((todo) => {
        const { id, ...rest } = todo;
        return rest;
      });

      if (completed) todos = todos.filter((todo) => todo.completed);
      else if (completed === false)
        todos = todos.filter((todo) => !todo.completed);

      todos = todos.filter((todo) => userId === todo.userId);
      if (!textOnly) {
        return res.status(200).json(todos);
      }

      console.log("inside");
      const titles = todos.reduce((acc, currentValue) => {
        acc.push(currentValue.title);
        return acc;
      }, []);

      return res.status(200).send({ todos: titles });
    })
    .catch((err) => {
      console.log({ err });
    });
}
module.exports = { fetchData };
