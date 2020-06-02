/*!

=========================================================
* Now UI Dashboard PRO React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/now-ui-dashboard-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/now-ui-dashboard.scss?v=1.3.0";
import "assets/css/demo.css";

import AdminLayout from "layouts/Admin.jsx";
import AuthLayout from "layouts/Auth.jsx";


/* //Redux
import { createStore } from 'redux';
import combinedReducer from './redux/reducer/combinedReducer'
import { Provider } from 'react-redux' //Connects global store to the whole app

const store = createStore(
  combinedReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() //For google chrome extension
); */


const hist = createBrowserHistory();

/* var isLoggedIn = localStorage.getItem('isLoggedIn') */

ReactDOM.render(
  
    <Router history={hist}>
      
      <Switch>
        <Route
          path="/admin"
          render={props => {
            return <AdminLayout {...props} />;
          }}
        />
        <Route
          path="/auth"
          render={props => {
            return <AuthLayout {...props} />;
          }}
        />
        <Redirect to="/auth" />
      </Switch>
    </Router>,
  document.getElementById("root")
);
