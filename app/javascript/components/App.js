import React from "react";
import { Route, Switch } from "react-router-dom";
import Top from "../components/Top/Top";
import Topics from "../components/Topics/Topics";
import Topic from "../components/Topic/Topic";
import Point from "../components/Point/Point";
import Search from "../components/Topics/Search";

const App = () => {
  return (
    <Switch>
      <Route exact path="/" component={Top} />
      <Route exact path="/topics" component={Topics} />
      <Route exact path="/topics/search" component={Search} />
      <Route exact path="/topics/:id" component={Topic} />
      <Route exact path="/points/:id" component={Point} />
    </Switch>
  );
};

export default App;
