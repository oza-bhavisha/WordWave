import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NavBar from './views/NavBar';
import HomePage from './views/HomePage';
import BlogPost from './views/BlogPost';
import CreatePost from './views/CreatePost';

function App() {
  return (
    <Router>
      <NavBar />
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/post/:id" component={BlogPost} />
        <Route path="/create" component={CreatePost} />
      </Switch>
    </Router>
  );
}

export default App;
