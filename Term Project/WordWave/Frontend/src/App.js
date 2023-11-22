import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NavBar from './ui/NavBar';
import HomePage from './HomePage';
import BlogPost from './ui/BlogPost';
import CreatePost from './CreatePost';

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
