import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import UserRegistration from './components/UserRegistration';
import UserLogin from './components/UserLogin';
import BookListings from './components/BookListings';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route path="/register" component={UserRegistration} />
          <Route path="/login" component={UserLogin} />
          <Route path="/books" component={BookListings} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
