// Ce fichier permet de mettre en place le routing react
// de vos différents composant react

import {
    BrowserRouter,
    Switch,
    Route,
    Link
  } from "react-router-dom";

import { useState, useEffect } from 'react';
import Wishlist from './models/wishlist';
import Add from './add.js'
import Modify from './modify.js'
import FullWishlist from "./models/fullWishlist.js";


const jwt_user1 = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsb2NhbGhvc3Q6MTAyMDAiLCJpYXQiOjE2MTAwNTYxMDgsImV4cCI6MTgwNTg0MTM3OCwiYXVkIjoibG9jYWxob3N0OjEwMjAwIiwic3ViIjoiMGU3ZGU5YTktN2EyZS00YjVhLWI0MmQtM2RmMmE5YzA0NTVlIn0.h7sEGkSx7z8fsycnBzPMb573UBfzPc4ZvKI7XEWD-Nw"

function List({list, delFunc }) {

    let WishlistList = list.map(wishlist => <Wishlist 
        wishlist = {wishlist}
        removeFunction = {delFunc}
        key={wishlist.uuid}
    />);


    return (
        <div>   
            <Link to={ `/${SUBJECT}/add` }>ADD</Link>
            {WishlistList}
        </div>
    )
        
}


export default function Root () {
    let [wishlistData, setWishlistData] = useState([]);
    useEffect(() => 
        fetch('/api/wishlist', {headers: {Authorization: `Bearer ${jwt_user1}` }})
        .then(response => response.json())
        .then(json => setWishlistData(json))
        ,[]);

    function removeWishlist(delId){
        let updatedWhislist = wishlistData.filter((wishlist) => {
            return wishlist.uuid != delId
        })
        setWishlistData(updatedWhislist)
    }

    function addWs(elmt){
        let newlist = wishlistData
        newlist.push(elmt)
        setWishlistData(newlist)
    }
    
    return (    
            <Switch>            

                <Route exact path={`/${SUBJECT}`} >
                    <List list={wishlistData} delFunc={removeWishlist} />
                </Route>

                <Route exact path={`/${SUBJECT}/add`} >
                    <Add list={wishlistData} addToList={addWs}/>
                </Route>

                <Route exact path={`/${SUBJECT}/modify/:uuid`} >
                    <Modify list={wishlistData}/>
                </Route>

                <Route exact path={`/${SUBJECT}/:uuid`} >
                    <FullWishlist list={wishlistData} removeFunction={removeWishlist}/>
                </Route>

            </Switch>
    )
}