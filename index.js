const express = require("express");
const {
  fetchPeople,
  fetchPerson,
  editPerson,
  createPerson,
  downloadPeopleList,
  removePerson,
} = require("./controlers/people");

const {
  validateID,
  validateCompressed,
  compressedToBool,
  idToInt,
  validatePostBody,
} = require("./middleware/people");

const {transformCompleted, validateUserId} = require("./middleware/jsonplaceholder");

const  {fetchData}  = require("./controlers/jsonplaceholder");

const server = express();

server.listen(3000, function () {
  console.log("alive");
});

server.use(express.json());

server.get("/todos",transformCompleted,validateUserId, fetchData);

//return whole list of people
server.get("/people", fetchPeople);

//download normal or compressed file
server.get(
  "/people/file",
  validateCompressed,
  compressedToBool,
  downloadPeopleList
);

//return 1 person from people
server.get("/people/:id", validateID, idToInt, fetchPerson);

//add 1 person
server.post("/people", validatePostBody, createPerson);

//edit 1 person
server.put("/people/:id", validateID, idToInt, editPerson);

//delete 1 person
server.delete("/people/:id", validateID, idToInt, removePerson);
