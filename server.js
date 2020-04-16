const express = require('express');
const bodyParser = require("body-parser");
const fs = require('fs');
const mongoose = require("mongoose");
const QuizModel = require("./model/quizModel");
const dotenv = require("dotenv");

dotenv.config();
mongoose.set("useFindAndModify", false);

// -- create server --
const app = express();

// -- use body parser middleware to parse the req body --
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Render home page
app.get('/', function (req, res) {

  console.log("inside app.get:/");

  fs.readFile("view/admin/homepage.html", function (err, data) {
    res.send(data.toString())
  })
});

//Render admmin html
app.get('/admin', function (req, res) {

  console.log("inside app.get:/");

  fs.readFile("view/admin/admin.html", function (err, data) {
    res.send(data.toString())
  })
});

//Render Student html
app.get('/student', function (req, res) {

  console.log("inside app.get:/");

  fs.readFile("view/admin/student.html", function (err, data) {
    res.send(data.toString())
  })
});


//get all Questions
app.post('/api/search-questions', async (req, res) => {

  console.log("inside /api/search-questions");

  try {
    let conditions = req.body ;
    console.log(`conditions: ${JSON.stringify(conditions)}`);
  
    let quiz = await QuizModel.find(conditions, null, { sort: {question_No: 1} });

    //console.log(`Questions: ${quiz}`);
    res.send(quiz);

  } catch (error) {

    console.log(`Search Questions Error: ${error}`);
    res.send(error);

  }
  
});



//-------add-question-------
app.post('/api/admin/add-question',  async (req, res) => {

  //receive data from client
  console.log("inside app.post:/add-que");
  
  const question = req.body;
  //console.log(`Question by post: ${JSON.stringify(question)}`);
  try {

    const quizSchema = new QuizModel(question);
 
    await quizSchema.save();
    
    //let quiz = await QuizModel.find({}, null, { sort: {question_No: 1} });
    //console.log(`Questions: ${quiz}`);
    //res.send(quiz);
    //res.redirect(307, "/api/search-questions");

    res.send({status:"success"});
 
  } catch (err) {
    console.log("error in post :"+ err);
    
    res.redirect("/");
  
  }

});

//----update quetion----
app.post('/api/admin/update-question',  async (req, res) => {

  console.log("inside /api/admin/update-question");
  
  const questions = req.body;
  
  try {

    await QuizModel.findByIdAndUpdate(questions._id, 
      {
        language:questions.language, 
        difficulty_level: questions.difficulty_level, 
        question_No:questions.question_No,
        question:questions.question,
        options:questions.options,
        correct_index:questions.correct_index
      });

    //let quiz = await QuizModel.find({}, null, { sort: {question_No: 1} });
    //console.log(`Questions: ${quiz}`);
    //res.send(quiz);
    //res.redirect(307, "/api/search-questions");

    res.send({status:"success"});
     
  } catch (err) {
 
    console.log(`Update Error: ${err}`);
    
    res.redirect("/");
  
  }
});

//--- Remove question---
app.post(`/api/admin/delete-question`, async (req, res) => {

  //receive data from client
  console.log("inside /api/admin/delete-question");
  
  const questions = req.body;
  try {

    await QuizModel.findByIdAndRemove(questions._id);

    //let quiz = await QuizModel.find({}, null, { sort: {question_No: 1} });
    //console.log(`Questions: ${quiz}`);
    //res.send(quiz);
    //res.redirect(307, "/api/search-questions");

    res.send({status:"success"});
 
  } catch (err) {
    console.log(`Delete Error: ${err}`);
    res.redirect("/admin");
  
  }

});


// --- connect to mongodb ---
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
  console.log("Connected to mongoDB...");
});


// --- start the server ---
const PORT = process.env.PORT || 2001; 

app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}...`);
});



