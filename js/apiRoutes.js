// required filesnpm init
const fs = require("fs");
const util = require("util");
const express = require("express");
const router = express.Router();
const writeFileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);

var notesDataFormat;

// read contents of the "db.json" file, parse it as JSON, send JSON data back to client as a response
router.get("/notes", (req, res) => {
  readFileAsync("db/db.json", "utf8").then(function (data) {
    notesDataFormat = JSON.parse(data);
    res.json(notesDataFormat);
  });
});

// read existing notes from "db.json" file, add new note to the list, write updated list of notes back to file
router.post("/notes", (req, res) => {
  readFileAsync("db/db.json", "utf8").then(function (data) {
    notesDataFormat = JSON.parse(data);

    let newNote = req.body;
    let currentID = notesDataFormat.length;

    newNote.id = currentID + 1;
    notesDataFormat.push(newNote);

    notesDataFormat = JSON.stringify(notesDataFormat);

    writeFileAsync("db/db.json", notesDataFormat).then(function () {
      console.log("Note has been added.");
      res.json(newNote); // Send back the newNote as the response
    });
  });
});

// search for note ID in the notesDataFormat array, delete it from the array, update the "db.json" file with the modified array, respond with the updated array of notes
router.delete("/notes/:id", (req, res) => {
  let selID = parseInt(req.params.id);
  for (let i = 0; i < notesDataFormat.length; i++) {
    if (selID === notesDataFormat[i].id) {
      notesDataFormat.splice(i, 1);
      let noteJSON = JSON.stringify(notesDataFormat, null, 2);

      writeFileAsync("db/db.json", noteJSON).then(function () {
        console.log("Note has been deleted.");
      });
    }
  }
  res.json(notesDataFormat);
});

module.exports = router;