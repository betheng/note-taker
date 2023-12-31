var $noteTitle = $(".note-title");
var $noteText = $(".note-textarea");
var $saveNoteBtn = $(".save-note");
var $newNoteBtn = $(".new-note");
var $noteList = $(".list-container .list-group");

var activeNote = {};

// gets all notes from the db
var getNotes = function() {
  return $.ajax({
    url: "/api/notes"  ,
    method: "GET"
  });
};

// saves note to the db
var saveNote = function(note) {
  return $.ajax({
    url: "/api/notes",
    data: note,
    method: "POST"
  });
};

// deletes note from the db
var deleteNote = function(id) {
  return $.ajax({
    url: "api/notes/" + id,
    method: "DELETE"
  });
};

// displayes active note, otherwise render empty
var renderActiveNote = function() {
  $saveNoteBtn.hide();

  if (activeNote.id) {
    $noteTitle.attr("readonly", true);
    $noteText.attr("readonly", true);
    $noteTitle.val(activeNote.title);
    $noteText.val(activeNote.text);
  } else {
    $noteTitle.attr("readonly", false);
    $noteText.attr("readonly", false);
    $noteTitle.val("");
    $noteText.val("");
  }
};

// Get the note data from the inputs, save it to the db, update the view
var handleNoteSave = function() {
  var newNote = {
    title: $noteTitle.val(),
    text: $noteText.val()
  };

  saveNote(newNote).then(function(data) {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// deletes note
var handleNoteDelete = function(event) {
  // prevents the click listener for the list from being called when the button inside of it is clicked
  event.stopPropagation();

  var note = $(this)
    .parent(".list-group-item")
    .data();

  if (activeNote.id === note.id) {
    activeNote = {};
  }
  deleteNote(note.id).then(function() {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// sets and displays active notes
var handleNoteView = function() {
  activeNote = $(this).data();
  renderActiveNote();
};

// sets active note to new empty object
var handleNewNoteView = function() {
  activeNote = {};
  renderActiveNote();
};

// If a note's title or text are empty, hide the save button or else show it
var handleRenderSaveBtn = function() {
  if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
    $saveNoteBtn.hide();
  } else {
    $saveNoteBtn.show();
  }
};

// renders list of note titles
var renderNoteList = function(notes) {
  console.log("Rendering note list:", notes);
  $noteList.empty();

  var noteListItems = [];

  for (var i = 0; i < notes.length; i++) {
    var note = notes[i];

    var $li = $("<li class='list-group-item'>").data(note);
    var $span = $("<span>").text(note.title);
    var $delBtn = $(
      "<i class='fas fa-trash-alt float-right text-danger delete-note'>"
    );

    $li.append($span, $delBtn);
    noteListItems.push($li);
  }

  $noteList.append(noteListItems);
};

// get notes from the db, display on sidebar
var getAndRenderNotes = function() {
  return getNotes().then(function(data) {
    notes = data;
    renderNoteList(data);
  });
};

$saveNoteBtn.on("click", handleNoteSave);
$noteList.on("click", ".list-group-item", handleNoteView);
$newNoteBtn.on("click", handleNewNoteView);
$noteList.on("click", ".delete-note", handleNoteDelete);
$noteTitle.on("keyup", handleRenderSaveBtn);
$noteText.on("keyup", handleRenderSaveBtn);

// gets and renders the initial list of notes
getAndRenderNotes();