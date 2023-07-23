const path = require("path");
const router = require("express").Router();

// GET request responds by sending the "notes.html" file back to the client
router.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/notes.html"));
});

// GET request to send user back to main index
router.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = htmlRouter;