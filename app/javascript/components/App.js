import React from "react";
import { Route, Switch } from "react-router-dom";
import Top from "../components/Top/Top";
import Topics from "../components/Topics/Topics";
import Topic from "../components/Topic/Topic";

const App = () => {
  return (
    <Switch>
      <Route exact path="/" component={Top} />
      <Route exact path="/topics" component={Topics} />
      <Route exact path="/topics/:id" component={Topic} />
    </Switch>
  );
};

export default App;
