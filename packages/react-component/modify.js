import {
    BrowserRouter,
    Switch,
    Route,
    Link,
    useHistory,
    useParams
  } from "react-router-dom";

const jwt_user1 = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsb2NhbGhvc3Q6MTAyMDAiLCJpYXQiOjE2MTAwNTYxMDgsImV4cCI6MTgwNTg0MTM3OCwiYXVkIjoibG9jYWxob3N0OjEwMjAwIiwic3ViIjoiMGU3ZGU5YTktN2EyZS00YjVhLWI0MmQtM2RmMmE5YzA0NTVlIn0.h7sEGkSx7z8fsycnBzPMb573UBfzPc4ZvKI7XEWD-Nw"

export default function Modify({list}) {

    const history = useHistory();

    function onSubmitModify(event){
        event.preventDefault()

        const inputs = event.target.elements;
        const inputName = inputs["name"].value;
        const inputStore = inputs["store"].value;
        const inputPrice = parseFloat(inputs["price"].value);

        ws.name=inputName
        ws.store=inputStore
        ws.price=inputPrice
        
        fetch(`/api/wishlist/${ws.uuid}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${jwt_user1}`,
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                "name": inputName,
                "store": inputStore,
                "price": inputPrice
            })
        }).then(history.push({pathname: `/${SUBJECT}`}));
    }

    const param = useParams()
    const id = param.uuid
    let ws = list.find(wishlist => wishlist.uuid==id)

    return (
        <div>
            <form id="add-form" onSubmit={onSubmitModify}>
                <label htmlFor="name">name:</label>
                <input type="text" id="name" name="name" defaultValue={ws.name} required="required"/><br/>

                <label htmlFor="store">store:</label>
                <input type="text" id="store" name="store" defaultValue={ws.store} required="required"/><br/>
                
                <label htmlFor="price">price:</label>
                <input type="number" min="0" step="0.01" id="price" name="price" defaultValue={ws.price} required="required"/><br/>

                <input type="submit" value="Modify"/>                
            </form>
            <Link to={ `/${SUBJECT}/` }><button>back</button></Link>
        </div>
    )
};
