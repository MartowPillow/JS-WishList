import {
    BrowserRouter,
    Switch,
    Route,
    Link
  } from "react-router-dom";

const jwt_user1 = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsb2NhbGhvc3Q6MTAyMDAiLCJpYXQiOjE2MTAwNTYxMDgsImV4cCI6MTgwNTg0MTM3OCwiYXVkIjoibG9jYWxob3N0OjEwMjAwIiwic3ViIjoiMGU3ZGU5YTktN2EyZS00YjVhLWI0MmQtM2RmMmE5YzA0NTVlIn0.h7sEGkSx7z8fsycnBzPMb573UBfzPc4ZvKI7XEWD-Nw"

function Wishlist({wishlist, removeFunction}) {
    
    function onClickDelete(wishlist){
        fetch(`/api/wishlist/${wishlist.uuid}`, {
           method: 'DELETE',
           headers: {Authorization: `Bearer ${jwt_user1}`},
        }).then(() => {
            removeFunction(wishlist.uuid)
        })
    }

    return (
        <ul>
            <li>name = {wishlist.name}</li>
            <li>store = {wishlist.store}</li>
            <li>price = {wishlist.price}</li>
            <li hidden>id = {wishlist.uuid}</li>
            <li hidden>userid = {wishlist.user}</li>
            <Link to={ `/${SUBJECT}/modify/${wishlist.uuid}` }><button>modify</button></Link>
            <button onClick={() => { onClickDelete(wishlist) }}>delete</button>
            <Link to={ `/${SUBJECT}/${wishlist.uuid}`}><button>more</button></Link>
        </ul>
    );
}

export default Wishlist;