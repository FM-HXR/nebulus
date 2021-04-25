import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Redirect, Link } from "react-router-dom";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusSquare,
  faTimes,
  faQuestionCircle,
  faCommentsDollar,
  faLandmark,
  faBook,
  faIcons,
  faAtom,
  faAtlas,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { csrfToken } from "@rails/ujs";
import LoadingBar from "react-top-loading-bar";

const Topics = () => {
  // -------------------------- Use States --------------------------
  const [topics, setTopics] = useState([]);
  const [topic, setTopic] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  // -------------------------- User Detection --------------------------
  const userPresence = document.querySelector(".user-presence");
  const loginStatus = userPresence.getAttribute("data-user");

  // -------------------------- Use Effect --------------------------
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

        console.log("Resp Data: ", resp.data.data);
      })
      .catch((resp) => console.log(resp));
  }, [topics.length]);

  // Misc, Economics & Finance, Politics & Society, Philosophy, Pop Culture, Science & Math, History
  const icons = [
    faQuestionCircle,
    faCommentsDollar,
    faLandmark,
    faBook,
    faIcons,
    faAtom,
    faAtlas,
  ];

  const options = [
    "Misc",
    "Economics",
    "Politics",
    "Philosophy",
    "Pop Culture",
    "Science & Math",
    "History",
  ];

  const optionsList = options.map((item) => {
    return (
      <option
        value={options.indexOf(item)}
        key={`option-${options.indexOf(item)}`}
      >
        {item}
      </option>
    );
  });

  const loadBar = [];
  for (var i = 1; i <= 5; i++) {
    var bar = <div className={`loadbar-${i}`}></div>;
    loadBar.push(bar);
  }

  const list = topics.map((item) => {
    return (
      <ul className={`topic-${topics.indexOf(item)}`} key={`topic-${item.id}`}>
        <FontAwesomeIcon
          icon={icons[item.attributes.category]}
          className={`topic-icon-${topics.indexOf(item)}`}
          key={`icon-${item.id}`}
        />
        <Link
          to={`/topics/${item.id}`}
          className={`topic-title-${topics.indexOf(item)}`}
          key={`title-${item.id}`}
        >
          {item.attributes.title}
        </Link>
        <Link
          to="#"
          className={`topic-user-${topics.indexOf(item)}`}
          key={item.attributes.user.username}
        >
          By: {item.attributes.user.username}
        </Link>
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
  const topicHalf = Math.floor(topicCount / 2) - 1;
  const listOne = [];
  const listTwo = [];

  for (var i = 0; i <= topicHalf; i++) {
    listOne.push(list[i]);
  }

  for (var i = topicHalf + 1; i <= topicCount - 1; i++) {
    listTwo.push(list[i]);
  }

  const handleChange = (e) => {
    e.preventDefault();

    setTopic(Object.assign({}, topic, { [e.target.name]: e.target.value }));

    console.log("Topic: ", topic);
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
      {loaded !== true && <div className="loading-shell">{loadBar}</div>}
      {/* <p className="topics-loading">{loaded ? "" : "Loading..."}</p> */}
      <div className="topic-center">
        <h1 className="topics-title">TOPICS</h1>
        {loginStatus === "true" && (
          <FontAwesomeIcon
            icon={faPlusSquare}
            onClick={handleClickOne}
            className="add-topic"
          />
        )}
      </div>
      <div className="topics one">{loaded && listOne}</div>
      <div className="topics two">{loaded && listTwo}</div>

      <div className="topic-form-shell">
        <FontAwesomeIcon
          icon={faTimes}
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
          <div className="topic-form-category">
            <p className="category-label">Category</p>
            <select
              name="category"
              onChange={handleChange}
              className="select-category"
              id="select-c"
            >
              {optionsList}
            </select>
          </div>
          <button type="submit" className="topic-submit">
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default Topics;
