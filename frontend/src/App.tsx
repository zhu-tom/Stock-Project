import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Forms/LogIn/LogIn';
import SignUp from './components/Forms/SignUp/SignUp';
import History from './components/History/History';
import Home from './components/Home/Home';
import Market from './components/Market/Market';
import News from './components/News/News';
import Orders from './components/Orders/Orders';
import Portfolio from './components/Portfolio/Portfolio';
import Subscriptions from './components/Subscriptions/Subscriptions';
import Watchlists from './components/Watchlists/Watchlists';

function App() {
  return (
    <Switch>
      <Route path="/signup">
        <SignUp/>
      </Route>
      <Route path="/login">
        <Login/>
      </Route>
      <Route path="/">
        <Dashboard>
          <Switch>
            <Route path="/account/portfolio">
              <Portfolio/>
            </Route>
            <Route path="/account/watchlist">
              <Watchlists/>
            </Route>
            <Route path="/account/subscriptions">
              <Subscriptions/>
            </Route>
            <Route path="/account/orders">
              <Orders/>
            </Route>
            <Route path="/account/history">
              <History/>
            </Route>
            <Route path="/market">
              <Market/>
            </Route>
            <Route path="/news">
              <News/>
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
