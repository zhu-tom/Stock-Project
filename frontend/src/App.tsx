import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard/Dashboard';
import SignUp from './components/Forms/SignUp/SignUp';
import Home from './components/Home/Home';
import Portfolio from './components/Portfolio/Portfolio';

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
          <Switch>
            <Route path="/account/portfolio">
              <Portfolio/>
            </Route>
            <Route path="/market">

            </Route>
            <Route path="/">
              <Home/>
            </Route>
            <Route>
              <Redirect to="/"/>
            </Route>
          </Switch>
        </Dashboard>
      </Route>
      
    </Switch>
  );
}

export default App;
