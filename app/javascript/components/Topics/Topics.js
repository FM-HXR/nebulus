import React, { useState, useEffect } from "react";
import axios from "axios";

const Topics = () => {
  const [topics, setTopics] = useState([]);
  const userPresence = document.querySelector(".user-presence");
  let loginStatus = userPresence.getAttribute("data-user");
  console.log(`Logged In?: ${loginStatus}`);

  useEffect(() => {
    // Get Topics from API
    // Get Login Boolean
    // Update Topics in state
    axios
      .get("/api/v1/topics")
      .then((resp) => console.log(resp))
      .catch((resp) => console.log(resp));
  }, [topics.count]);
  return <h2>Show Topics Test</h2>;
};

export default Topics;
