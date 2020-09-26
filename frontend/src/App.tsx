import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard/Dashboard';
import SignUp from './components/SignUp/SignUp';

function App() {
  return (
    <Switch>
      <Route path="/signup">
        <SignUp/>
      </Route>
      <Route path="/login">

      </Route>
      <Route path="/">
        <Dashboard>

        </Dashboard>
      </Route>
    </Switch>
  );
}

export default App;
