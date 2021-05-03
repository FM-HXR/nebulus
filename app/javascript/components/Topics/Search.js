import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import axios from "axios";
import LoadingBar from "react-top-loading-bar";

const Search = () => {
  const [topics, setTopics] = useState([]);
  const [query, setQuery] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  const changeHandler = (e) => {
    e.preventDefault();
    setQuery(Object.assign({}, query, { [e.target.name]: e.target.value }));
    console.log(query);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setProgress(30);
    const csrfToken = document.querySelector("[name=csrf-token]").content;
    axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;

    axios
      .get(`/api/v1/topics/search`, { params: query })
      .then((resp) => {
        console.log(resp);
        setTopics(resp.data.data);
        console.log("Result Hits: ", resp.data.data.length);
        setLoaded(true);
        setProgress(100);
      })
      .catch((resp) => {
        console.log(resp);
      });
  };

  const topicsList = topics.map((item) => {
    return (
      <div key={`result-${item.id}`}>
        <p>{item.attributes.title}</p>
        <p>{item.attributes.description}</p>
        <p>{item.attributes.user.username}</p>
      </div>
    );
  });

  return (
    <div className="search-shell">
      <LoadingBar
        color="#f11946"
        height={5}
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
        className="load-bar"
      />
      <h1>Search Page Test</h1>
      <form className="search-form" onSubmit={submitHandler}>
        <input
          type="text"
          name="query"
          placeholder="Search Here"
          onChange={changeHandler}
        />
        <button type="submit">Submit</button>
      </form>
      {loaded && topics.length > 0 && (
        <div className="search-result-shell">{topicsList}</div>
      )}
      {loaded && topics.length === 0 && <h2>No Results</h2>}
    </div>
  );
};

export default Search;
