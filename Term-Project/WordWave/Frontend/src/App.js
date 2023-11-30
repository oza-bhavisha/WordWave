import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NavBar from "./views/NavBar";
import HomePage from "./views/HomePage";
import BlogPost from "./views/BlogPost";
import CreatePost from "./views/CreatePost";
import Login from "./views/Login";
import Register from "./views/Register";

function App() {
  const token = window.localStorage.getItem("token");

  return (
    <Router>
      {/* <NavBar /> */}
      <Switch>
        {token ? (
          <>
            <Route path="/post/:id" exact component={BlogPost} />
            <Route path="/create" exact component={CreatePost} />
            <Route path="/" exact component={HomePage} />
          </>
        ) : (
          <>
            <Route path="/register" exact component={Register} />
            <Route path="/login" exact component={Login} />
            <Route path="/" exact component={Login} />
          </>
        )}
      </Switch>
    </Router>
  );
}

export default App;
