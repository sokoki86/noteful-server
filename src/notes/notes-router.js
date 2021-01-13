const express = require('express')
const notesRouter = express.Router()
const jsonParser = express.json()
const xss = require('xss')
const notesService = require('./notes-service')
const path = require('path')

const serializeNote = (note) => ({ 
    folderId: note.folderId, 
    name: xss(note.name), 
    content: xss(note.content), 
    modified: note.modified, 
    id: note.id
})

notesRouter
.route('/')
.get((req, res, next) => {
    const db = req.app.get('db')
    notesService.getAllNotes(db).then((notes) => {
        return res.status(200).json(notes.map(serializeNote))
    }).catch(next)
})
.post(jsonParser,(req, res, next) => {
    const db = req.app.get('db')
    const {folderId, content, name} = req.body 
    const required = {folderId, content, name}
     for (const [key, value] of  Object.entries(required)){
         if (!value)
        return res.status(400).json({error: {message: `missing ${key} field`}})
    }
    const newNote = {...required, modified: req.body.modified}

    notesService.addNote(db, newNote)
    .then(note => {
        return res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${note.id}`))
        .json(serializeNote(note))
    }).catch(next)
})

notesRouter
.route("/:id")
.all((req, res, next) => {
    const {id} = req.params
    const db = req.app.get('db')
    notesService.getNoteById(db, id)
    .then(note => {
        if (!note) return res.status(400).json({error : {message: "Could not find note"}})
        res.note = note
        next()
    }).catch(next)
})
.get((req, res, next) => {
    return res.status(400).json(serializeNote(res.note))
})
.delete((req, res, next) => {
    const {id} = res.note
    const db = req.app.get('db')
    notesService.deleteNote(db, id)
    .then((_)=> {
        return res.status(204).end()
    }).catch(next)
})

module.exports = notesRouter