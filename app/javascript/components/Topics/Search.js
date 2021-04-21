import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import axios from "axios";
import LoadingBar from "react-top-loading-bar";

const Search = () => {
  const [topics, setTopics] = useState([]);
  const [query, setQuery] = useState({});

  const changeHandler = (e) => {
    e.preventDefault();
    setQuery(Object.assign({}, query, { [e.target.name]: e.target.value }));
    console.log(query);
  };

  const submitHandler = (e) => {
    e.preventDefault();
  };

  return (
    <div className="search-shell">
      <h1>Search Page Test</h1>
      <form className="search-form" onSubmit={submitHandler}>
        <input type="text" placeholder="Search" onChange={changeHandler} />
      </form>
    </div>
  );
};

export default Search;
