import {
    BrowserRouter,
    Switch,
    Route,
    Link,
    useHistory,
    useParams
  } from "react-router-dom";

const jwt_user1 = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsb2NhbGhvc3Q6MTAyMDAiLCJpYXQiOjE2MTAwNTYxMDgsImV4cCI6MTgwNTg0MTM3OCwiYXVkIjoibG9jYWxob3N0OjEwMjAwIiwic3ViIjoiMGU3ZGU5YTktN2EyZS00YjVhLWI0MmQtM2RmMmE5YzA0NTVlIn0.h7sEGkSx7z8fsycnBzPMb573UBfzPc4ZvKI7XEWD-Nw"

export default function FullWishlist({list, removeFunction}) {

    const history = useHistory();

    
    const param = useParams()
    const id = param.uuid
    const ws = list.find(wishlist => wishlist.uuid==id)

    const wsid = ws.uuid
    const wsname = ws.name
    const wsstore = ws.store
    const wsprice = ws.price

    function onClickDelete(id){
        fetch(`/api/wishlist/${id}`, {
           method: 'DELETE',
           headers: {Authorization: `Bearer ${jwt_user1}`},
        }).then(() => history.push({pathname: `/${SUBJECT}`})
        ).then(() => {
            removeFunction(id)
        })
    }

    return (
        <div>
            <li>name = {wsname}</li>
            <li>store = {wsstore}</li>
            <li>price = {wsprice}</li>
            <li>id = {wsid}</li>
            <Link to={ `/${SUBJECT}/modify/${wsid}` }><button>modify</button></Link>
            <button onClick={() => { onClickDelete(wsid) }}>delete</button>
            <Link to={ `/${SUBJECT}/` }><button>back</button></Link>
        </div>
    )
};
