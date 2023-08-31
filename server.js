const htmlRoutes = require('./js/htmlRoutes');
const express = require('express');
const app = express();
const apiRoutes = require('./js/apiRoutes');
const PORT = process.env.PORT || 3003;

// Folder to retrieve CSS and JS Files
app.use(express.static("public"));

// Middleware to parse the JSON data
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use('/', htmlRoutes);

// Use the router for API routes
app.use("/api", apiRoutes); 

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;