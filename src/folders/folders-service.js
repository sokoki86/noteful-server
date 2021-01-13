  
const foldersService = {
    getAllFolders(knex){
       return knex('folders').select('*')
    }, 
    getFolderById(knex, id){
       return knex.select('*').from('folders').where({id})
    }, 
    addFolder(knex, folder){
       return knex.into('folders').insert(folder).returning('*').then(rows => rows[0])
    }
}

module.exports = foldersService