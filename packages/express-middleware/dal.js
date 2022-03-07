const { 
    v1: uuidv1,
    v4: uuidv4,
  } = require('uuid');

const db = require('better-sqlite3')(process.env.DB_PATH, {})
db.pragma('foreign_keys = ON');

module.exports = {
    update: update,
    remove: remove,
    create: create,
    getbyid : getbyid,
    getbyuserid: getbyuserid
}

function update(id, name=undefined, store=undefined, price=undefined){
    let sql = "UPDATE wishlist SET "
    
    let check_other = false

    if(name){
        sql += "name = '" + name + "'"
        check_other = true
    }
    if(store){
        if(check_other)
            sql += ", "
        else 
            check_other = true
        sql += "store = '" + store + "'"        
    }
    if(price){
        if(check_other)
            sql += ", "
        sql += "price = '" + price + "'"
    }

    sql += "WHERE uuid = '" + id + "'"
    const statement = db.prepare(sql)
    const rep = statement.run()
    return rep
}

function remove(id){
    const statement = db.prepare("DELETE FROM wishlist WHERE uuid = '"+ id +"'")

    const rep = statement.run()
    return rep
}

function create(name, store, price){
    let myid = uuidv4()
    let userid = "0e7de9a9-7a2e-4b5a-b42d-3df2a9c0455e"
    const statement = db.prepare("INSERT INTO wishlist VALUES (?, ?, ?, ?, ?)")

    statement.run(myid, name, store, price, userid)
    return myid
}

function getbyid(id){
    const statement = db.prepare("SELECT * FROM wishlist WHERE uuid = '" + id + "'")
    const wishlist = statement.get()

    return wishlist
}

function getbyuserid(uid){
    const statement = db.prepare("SELECT * FROM wishlist WHERE user = '" + uid + "'")
    const wishlists = [ ...statement.iterate()].reduce((wishlists, wishlist) => {
        return [...wishlists, wishlist]
    }, []);

    return wishlists
}

function getall(){
    const statement = db.prepare('SELECT * FROM wishlist')
    const wishlists = [ ...statement.iterate()].reduce((wishlists, wishlist) => {
        return [...wishlists, wishlist]
    }, []);

    return wishlists
}