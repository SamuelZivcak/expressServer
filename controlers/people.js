const fs = require("fs");
const AdmZip = require("adm-zip");
const beautify = require("json-beautify");
const whitelistParams = ["age", "name", "surname", "email", "telephone","password"];

function createPerson(req, res) {
  const peopleData = fs.readFileSync("people.json", "utf-8");
  const peopleArray = JSON.parse(peopleData);
  const id = Number.parseInt(peopleArray[peopleArray.length - 1].id) + 1;
  const human = { id };
  for (const k of Object.keys(req.body)) {
    if (whitelistParams.includes(k)) {
      human[k] = req.body[k];
    }
  }
  peopleArray.push(human);
  fs.writeFileSync("people.json", beautify(peopleArray, null, 2, 50), "utf-8");
  return res.status(201).send();
}
function fetchPerson(req, res, next) {
  const personID = req.params.id;
  const peopleArray = JSON.parse(fs.readFileSync("people.json", "utf-8"));
  const person = peopleArray.find((person) => person.id === personID);
  console.log(person);
  if (person) return res.status(200).json(person);
  return res.status(404).send();
}
function editPerson(req, res) {
  const peopleArray = JSON.parse(fs.readFileSync("people.json", "utf-8"));
  const personID = req.params.id;
  const person = peopleArray.find((person) => person.id === personID);
  if (!person) return res.status(404).send();

  const index = peopleArray.indexOf(person);
  Object.keys(req.body).forEach((key) => {
    if (whitelistParams.includes(key)) {
      peopleArray[index][key] = req.body[key];
    }
  });
  fs.writeFileSync("people.json", beautify(peopleArray, null, 2, 50), "utf-8");
  return res.status(200).send(peopleArray[index]);
}
function removePerson(req, res) {
  const personID = req.params.id;
  const peopleArray = JSON.parse(fs.readFileSync("people.json", "utf-8"));
  const person = peopleArray.find((person) => person.id === personID);
  if (!person) return res.status(404).send();
  const deleted = peopleArray.splice(peopleArray.indexOf(person), 1);
  fs.writeFileSync("people.json", beautify(peopleArray, null, 2, 50), "utf-8");
  return res.status(200).send(deleted);
}
function downloadPeopleList(req, res, next) {
  const compressed = req.query;
  console.log(req.query);
  const zip = new AdmZip();
  if (!compressed) {
    return res.download("people.json");
  }
  const data = fs.readFileSync("people.json");
  const inBuffer = Buffer.from(data, "utf8");
  zip.addFile("people.json", inBuffer);
  res.set({
    "Content-Type": "application/zip",
    "Content-Disposition": 'attachment; filename="people.zip"',
  });
  return res.send(zip.toBuffer());
}
function fetchPeople(req, res, next) {
  const listPeople = fs.readFileSync("people.json", "utf-8");
  if (listPeople === "") return res.status(204).send();
  return res.status(200).json(JSON.parse(listPeople));
}

module.exports = {fetchPeople, fetchPerson, editPerson, createPerson, downloadPeopleList,removePerson};
