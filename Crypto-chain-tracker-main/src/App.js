import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import BaseLayout from "./components/layout/BaseLayout";
import Home from "./Home";
import Analytics from "./components/Analytics";
import BalanceComponent from "./components/BalanceComponent";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/home" component={Home} />
        <Route render={() => (
          <BaseLayout>
            <Switch>
              <Route exact path="/" render={() => <Redirect to="/home" />} />
              <Route path="/analytics" component={Analytics} />
              <Route path="/balance" component={BalanceComponent} />
            </Switch>
          </BaseLayout>
        )} />
      </Switch>
    </Router>
  );
};

export default App;
