const express = require('express')
const jsonParser = express.json()
const FoldersService = require('./folders-service')
const xss = require('xss')
const foldersRouter = express.Router()
const path = require('path')
const foldersService = require('./folders-service')


const serializeFolder = (folder) => ({
    name: xss(folder.name), 
    id: folder.id
})
foldersRouter
.route("/")
.get((req, res, next) => {
    const db = req.app.get('db')
    foldersService.getAllFolders(db)
    .then(folders => {
        return res.status(200).json(folders.map(serializeFolder))
    })
    .catch(next)
})
.post(jsonParser, (req, res, next) => {
    const db = req.app.get('db')
    const {name} = req.body
    const newFolder = {name}
    if (!name){
        return res.status(400).json({error: {message: "Missing name in request body"}})
    }
    FoldersService.addFolder(db, newFolder).then(folder => {
        return res
        .location(path.posix.join(req.originalUrl, `/${folder.id}`))
        .status(201)
        .json(folder)
    })
})

foldersRouter
.route('/:id')
.all((req, res, next) => {
    const {id} = req.params
    const db = req.app.get('db')
    foldersService
    .getFolderById(db, id)
    .then(folder => {
        if (!folder) return res.status(404).json({error: {message: 'Folder not found'}})
        res.folder = folder
        next()
    }).catch(next)
})
.get((req, res, next) => {
    return res.status(200).json(serializeFolder(res.folder))
})

module.exports = foldersRouter