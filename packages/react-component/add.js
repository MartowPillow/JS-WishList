import {
    BrowserRouter,
    Switch,
    Route,
    Link,
    useHistory
  } from "react-router-dom";

const jwt_user1 = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsb2NhbGhvc3Q6MTAyMDAiLCJpYXQiOjE2MTAwNTYxMDgsImV4cCI6MTgwNTg0MTM3OCwiYXVkIjoibG9jYWxob3N0OjEwMjAwIiwic3ViIjoiMGU3ZGU5YTktN2EyZS00YjVhLWI0MmQtM2RmMmE5YzA0NTVlIn0.h7sEGkSx7z8fsycnBzPMb573UBfzPc4ZvKI7XEWD-Nw"

export default function Add({list, addToList}) {
    let history = useHistory();

    function onSubmitAdd(event){
        event.preventDefault()

        let ws = {}
        const inputs = event.target.elements;
        ws.name = inputs["name"].value;
        ws.store = inputs["store"].value;
        ws.price = parseFloat(inputs["price"].value);
        
        fetch('/api/wishlist', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${jwt_user1}`,
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                "name": ws.name,
                "store": ws.store,
                "price": ws.price
            })
        }).then(data => data.json().then(wishlist=>addToList(wishlist)))
        .then(() => history.push({pathname: `/${SUBJECT}`}));
        
    }

    return (
        <div>
            <form id="add-form" onSubmit={onSubmitAdd}>
                <label htmlFor="name">name:</label>
                <input type="text" id="name" name="name" required="required"/><br/>

                <label htmlFor="store">store:</label>
                <input type="text" id="store" name="store" required="required"/><br/>
                
                <label htmlFor="price">price:</label>
                <input type="number" min="0" step="0.01" id="price" name="price" required="required"/><br/>

                <input type="submit" value="Add"/>                
            </form>
            <Link to={ `/${SUBJECT}/` }><button>back</button></Link>
        </div>
    );
}
