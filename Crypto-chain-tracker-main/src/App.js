import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import BaseLayout from "./components/layout/BaseLayout";
import Login from "./Login";
import Signup from "./Signup";
import Analytics from "./components/Analytics";
import BalanceComponent from "./components/BalanceComponent";
import BlockchainTxns from "./components/BlockchainTxns";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <BaseLayout>
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/signup" />} />
          <Route path="/signup" component={Signup} />
          <Route path="/login" render={(props) => <Login {...props} onLogin={handleLogin} />} />
          <Route path="/analytics" render={() => (isAuthenticated ? <Analytics /> : <Redirect to="/login" />)} />
          <Route path="/balance" render={() => (isAuthenticated ? <BalanceComponent /> : <Redirect to="/login" />)} />
        </Switch>
      </BaseLayout>
    </Router>
  );
};

export default App;
