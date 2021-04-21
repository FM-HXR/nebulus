import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import axios from "axios";
import LoadingBar from "react-top-loading-bar";

const Search = () => {
  const [topics, setTopics] = useState([]);
  const [query, setQuery] = useState({});
  const [loaded, setLoaded] = useState(false);

  const changeHandler = (e) => {
    e.preventDefault();
    setQuery(Object.assign({}, query, { [e.target.name]: e.target.value }));
    console.log(query);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const csrfToken = document.querySelector("[name=csrf-token]").content;
    axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;

    axios
      .get(`/api/v1/topics/search`, { params: query })
      .then((resp) => {
        console.log(resp);
      })
      .catch((resp) => {
        console.log(resp);
      });
  };

  return (
    <div className="search-shell">
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
    </div>
  );
};

export default Search;
