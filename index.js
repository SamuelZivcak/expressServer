const fs = require("fs");
const express = require("express");
const AdmZip = require("adm-zip");
const beautify = require("json-beautify");
const { forEach } = require("jszip");

const whitelistParams = ["age", "name", "surname"];

const server = express();

server.listen(3000, function () {
  console.log("alive");
});

server.use(express.json());

//return whole list of people
server.get("/people", (req, res, next) => {
  const listPeople = fs.readFileSync("people.json", "utf-8");
  if (listPeople === "") return res.status(204).send();
  return res.status(200).json(JSON.parse());
});

//download normal or compressed file
server.get("/people/file", (req, res, next) => {
  const { compressed } = req.query;
  const zip = new AdmZip();
  console.log(compressed);
  if (compressed !== true && compressed !== false) {
    return res.status(400).send();
  }
  if (compressed === "false") {
    return res.download("people.json");
  }
  const data = fs.readFileSync("people.json");
  const inBuffer = Buffer.from(data, "utf8");
  zip.addFile("people.json", inBuffer);
  res.set({
    "Content-Type": "application/zip",
    "Content-Disposition": 'attachment; filename="people.zip"',
  });
  res.send(zip.toBuffer());
});

//return 1 person from people
server.get("/people/:id", (req, res, next) => {
  const personID = Number.parseInt(req.params.id);
  if (!Number.isInteger(personID)) {
    next();
  }

  const peopleArray = JSON.parse(fs.readFileSync("people.json", "utf-8"));
  const person = peopleArray.find((person) => person.id === personID);
  console.log(person);
  if (person) return res.status(200).json(person);
  else return res.status(404).send();
});

//add 1 person
server.post("/people", (req, res) => {
  const peopleData = fs.readFileSync("people.json", "utf-8");
  const peopleArray = JSON.parse(peopleData);
  const id = Number.parseInt(peopleArray[peopleArray.length - 1].id) + 1;
  const isBodyValid = req.body.name && req.body.surname;
  if (!isBodyValid) {
    return res
      .status(400)
      .send(
        "ID must be int and bigger than 0,\nname is required,\nsurname is required"
      );
  }

  const human = { id };
  for (const k of Object.keys(req.body)) {
    if (whitelistParams.includes(k)) {
      human[k] = req.body[k];
    }
  }
  peopleArray.push(human);
  fs.writeFileSync("people.json", beautify(peopleArray, null, 2, 50), "utf-8");
  return res.status(201).send();
});

//edit 1 person
server.put("/people/:id", (req, res) => {
  const peopleArray = JSON.parse(fs.readFileSync("people.json", "utf-8"));
  const personID = Number.parseInt(req.params.id);
  const isBodyValid =
    personID && personID >= 0 ;
  const person = peopleArray.find((person) => person.id === personID);
  if (!person)
    return res.status(404).send();
  console.log(person);
  if (!isBodyValid) {
    return res
      .status(400)
      .send(
        "ID must be int and bigger than 0,\nname is required,\nsurname is required"
      );
  }
  const index = peopleArray.indexOf(person);
  Object.keys(req.body).forEach((key) => {
    if (whitelistParams.includes(key)) {
      peopleArray[index][key] = req.body[key];
    }
  });
  fs.writeFileSync("people.json", beautify(peopleArray, null, 2, 50), "utf-8");
  return res.status(200).send(peopleArray[index]);
});

//delete 1 person
server.delete("/people/:id", (req, res) => {
  const personID = Number.parseInt(req.params.id);
  const isIDValid = personID && personID >= 0;
  if (!isIDValid) return res.status(400).send("ID must be integer!!");
  const person = peopleArray.find((person) => person.id === personID);
  const peopleArray = JSON.parse(fs.readFileSync("people.json", "utf-8"));
  if (!person) return res.status(404).send();
  const deleted = peopleArray.splice(peopleArray.indexOf(person), 1);
  fs.writeFileSync("people.json", beautify(peopleArray, null, 2, 50), "utf-8");
  return res.status(200).send(deleted);
});
