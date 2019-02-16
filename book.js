const mongoose = require('mongoose');
const model = mongoose.model;
var Schema = mongoose.Schema;

require('dotenv').config()
mongoose.connect(process.env.DB, {useNewUrlParser: true});

const BookSchema = new Schema({
    title: {type: String, required: true},
    commentCount: {type: Number, required: false, default: 0},
    comments: [String]
})

const Book = model('book', BookSchema);

function create(title) {
    if(!title) {
        return new Promise((res) => {
            res({error: 'no title'});
        })
    }
    return Book.create({title});
}

function getAll() {
    return Book.find({}, "-comments").exec()
}

function getOne(id) {
    if(!id) {
        return new Promise((res) => {
            res({error: 'no id'});
        })
    }
    return new Promise((res) => {
        Book.findById(id).exec((err,data) => {
            if(err || data == null) res({error: 404})
            else if(data) res(data)
        });
    });
}

function addComment(id, comment) {
    const update = {$inc: {commentCount: 1}, $push: {comments: comment}}
    const opt = {new: true}
    return new Promise((res) => {
        return Book.findByIdAndUpdate(id, update, opt).exec((err, data) => {
            if(err) res({error: JSON.stringify(err)})
            else res(data)
        })
    })
}

function deleteAll() {
    return new Promise((res) => {
        Book.deleteMany({}, (err) => {
            if(err) res({error: JSON.stringify(err)})
            else res('complete delete successful')
        })
    })
}

function deleteOne(id) {
    return new Promise((res) => {
        Book.deleteOne({}, (err) => {
            if(err) res({_id: id})
            else res('delete successful')
        })
    })
}

module.exports = {create, getAll, getOne, addComment, deleteAll, deleteOne}