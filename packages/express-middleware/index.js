const dal = require("./dal.js")
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.send(dal.getbyuserid(req.user.sub))//req.user = le jwt décodé
    //res.send(dal.getall())
})

router.get('/:uuid', (req, res) => {
    const wishlist = dal.getbyid(req.params.uuid)
    if(wishlist == undefined)
        res.status(404).send('Error 404: Wishlist not found');
    else
        res.send(wishlist)
})

function check(req){
    let msg
    if(!req.body.name)
        msg = "Error 422: 'name' is missing";
    else if(!req.body.store)
        msg = "Error 422: 'store' is missing";
    else if(!req.body.price)
        msg = "Error 422: 'price' is missing";
    else if(typeof req.body.price  === "string")
        msg = "Error 422: 'price' is a string "

    return msg
}

router.post('/', (req, res) => {
    let msg
    if(msg = check(req))
        res.status(422).send(msg);
    else{
        let id = dal.create(req.body.name, req.body.store, req.body.price)
        res.status(201).send(dal.getbyid(id))
    }
})

router.delete('/:uuid', (req, res) => {
    if(!dal.getbyid(req.params.uuid))
        res.status(404).send("Error 404: Wishlist not found")
    else
        res.status(204).send(dal.remove(req.params.uuid))
})

router.put('/:uuid', (req, res) => {
    let msg
    if(msg = check(req))
        res.status(422).send(msg);
    else 
        res.send(dal.update(req.params.uuid, req.body.name, req.body.store, req.body.price))
})

module.exports = router
