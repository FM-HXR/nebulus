import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Redirect, Link } from "react-router-dom";
import ReactDOM from "react-dom";
import FontAwesome from "react-fontawesome";
import axios from "axios";
import { csrfToken } from "@rails/ujs";
import LoadingBar from "react-top-loading-bar";

const Topics = () => {
  const [topics, setTopics] = useState([]);
  const [topic, setTopic] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const userPresence = document.querySelector(".user-presence");
  let loginStatus = userPresence.getAttribute("data-user");

  useEffect(() => {
    // Get Topics from API
    // Get Login Boolean
    // Update Topics in state
    setProgress(30);
    axios
      .get("/api/v1/topics.json")
      .then((resp) => {
        setTopics(resp.data.data);
        setLoaded(true);
        setProgress(100);
        // console.log(resp);
      })
      .catch((resp) => console.log(resp));
  }, [topics.length]);

  const list = topics.map((item) => {
    return (
      <ul className={`topic-${topics.indexOf(item)}`} key={`topic-${item.id}`}>
        <li
          className={`topic-title-${topics.indexOf(item)}`}
          key={`title-${item.id}`}
        >
          <Link to={`/topics/${item.id}`}>{item.attributes.title}</Link>
        </li>
        <li
          className={`topic-user-${topics.indexOf(item)}`}
          key={item.attributes.user.username}
        >
          By: {item.attributes.user.username}
        </li>
        <li
          className={`topic-date-${topics.indexOf(item)}`}
          key={`topic-date-${item.id}`}
        >
          {`Posted On: ${new Date(item.attributes.created_at).toDateString()}`}
        </li>
      </ul>
    );
  });

  const topicCount = topics.length;

  const listOne = [];
  const listTwo = [];

  for (var i = 0; i <= 7; i++) {
    listOne.push(list[i]);
  }

  for (var i = 8; i <= 15; i++) {
    listTwo.push(list[i]);
  }

  const handleChange = (e) => {
    e.preventDefault();

    setTopic(Object.assign({}, topic, { [e.target.name]: e.target.value }));

    // console.log("Topic: ", topic);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const csrfToken = document.querySelector("[name=csrf-token]").content;
    axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;

    axios
      .post("/api/v1/topics", { topic })
      .then((resp) => {
        const titleField = document.getElementById("title");
        const descriptionField = document.getElementById("description");
        const proField = document.getElementById("pro");
        const conField = document.getElementById("con");

        setTopics([...topics, resp.data.data]);
        setTopic({ title: "", description: "", pro: "", con: "" });

        titleField.value = "";
        descriptionField.value = "";
        proField.value = "";
        conField.value = "";

        const newId = resp.data.data.id;
        window.location = `/topics/${newId}`;
      })
      .catch((resp) => {});
  };

  const handleClickOne = (e) => {
    e.preventDefault();
    const topicForm = document.querySelector(".topic-form-shell");
    const formInternal = document.querySelector(".topic-form");
    topicForm.style.display = "grid";
    topicForm.classList.add("formAnim");
    formInternal.classList.add("formAnim-internal");
  };

  const handleClickTwo = (e) => {
    e.preventDefault();
    const topicForm = document.querySelector(".topic-form-shell");
    const formInternal = document.querySelector(".topic-form");
    topicForm.classList.remove("formAnim");
    formInternal.classList.remove("formAnim-internal");
    topicForm.style.display = "none";
  };

  return (
    <div className="topics-shell">
      <LoadingBar
        color="#f11946"
        height={5}
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
        className="load-bar"
      />
      <p className="topics-loading">{loaded ? "" : "Loading..."}</p>
      <div className="topic-center">
        <h1 className="topics-title">TOPICS</h1>
        {loginStatus === "true" && (
          <FontAwesome
            name="plus-square"
            onClick={handleClickOne}
            className="add-topic"
          />
        )}
      </div>
      <div className="topics one">{loaded && listOne}</div>
      <div className="topics two">{loaded && listTwo}</div>

      <div className="topic-form-shell">
        <FontAwesome
          tag="i"
          name="times"
          onClick={handleClickTwo}
          className="close-new-topic"
        />
        <form className="topic-form" onSubmit={handleSubmit}>
          <textarea
            name="title"
            maxLength="200"
            placeholder="Topic Title: Max Char Length 200"
            onChange={handleChange}
            className="topic-form-title"
            id="title"
          />
          <textarea
            name="description"
            maxLength="500"
            placeholder="Describe Topic: Max Char Length 500"
            onChange={handleChange}
            className="topic-form-description"
            id="description"
          />
          <input
            type="text"
            name="pro"
            maxLength="30"
            placeholder="Pro Position Name"
            onChange={handleChange}
            className="topic-form-position"
            id="pro"
          />
          <input
            type="text"
            name="con"
            maxLength="30"
            placeholder="Con Position Name"
            onChange={handleChange}
            className="topic-form-position"
            id="con"
          />
          <button type="submit" className="topic-submit">
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default Topics;
