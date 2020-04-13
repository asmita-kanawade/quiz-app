const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    language: {
        type: String,
        required: true
    },
    difficulty_level: {
        type: String,
        required:true
    },
    question_No: {
        type: Number,
        required:true
    },
    question: {
        type: String,
        required: true
    },
    options: {
        type: Array,
        required:true
    },
    correct_index: {
        type: Number,
        required:true
    } 
})

module.exports = mongoose.model('Quiz',quizSchema, `quiz`);