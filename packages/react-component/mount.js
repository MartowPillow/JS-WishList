import { render } from "react-dom"

import {
    BrowserRouter,
    Route,
    Link
  } from "react-router-dom";

  import Root from './index'


render(
    <BrowserRouter>
        <Route exact path="/">
            <h1>Index</h1>
            <div><Link to={ `/${SUBJECT}/` }>{SUBJECT}</Link></div>
        </Route>
        <Route path={`/${SUBJECT}`}>
            <Root />
        </Route>
    </BrowserRouter>,
    document.getElementById('root')
)