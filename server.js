const express = require('express');
const app = express();
const apiRoutes = require('./js/apiRoutes');
const htmlRoutes = require('./js/htmlRoutes');
const path = require('path'); // Import the 'path' module

const PORT = process.env.PORT || 3001;

// Serve static files from the "public" directory
app.use(express.static("public"));

// Serve static files from the "js" directory
app.use('/js', express.static(path.join(__dirname, 'js')));

// Middleware to parse the JSON data
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// Use the router for API routes
app.use("/api", apiRoutes); 

// Use the router for HTML routes
app.use('/', htmlRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


module.exports = app;