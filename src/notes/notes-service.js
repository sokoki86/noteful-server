const notesService = {
    getAllNotes(knex){
        return knex('notes').
        select('*')
    }, 
    getNoteById(knex, id){
        return knex('notes')
        .select('*')
        .where({id})
        .first()
    }, 
    addNote(knex, note){
        return knex('notes')
        .insert(note)
        .returning('*')
        .then(rows => rows[0])
    }, 
    deleteNote(knex, id){
        console.log('THIS IS AN ID' + id)
        return knex('notes')
        .where({id})
        .delete()
    }

}

module.exports = notesService