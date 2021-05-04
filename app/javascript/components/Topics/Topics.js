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
  const [topics_tag, setTopicsTag] = useState({});
  const [tags, setTags] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [tagParams, setTagParams] = useState(false);
  const [submitTags, setSubmitTags] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  // -------------------------- User Detection --------------------------
  const userPresence = document.querySelector(".user-presence");
  const loginStatus = userPresence.getAttribute("data-user");

  // -------------------------- Use Effect ------------------------------
  useEffect(() => {
    const title = document.querySelector(".topic-center");
    const centerText = document.querySelector(".topics-title");
    // Get Topics from API
    // Get Login Boolean
    // Update Topics in state
    setProgress(30);
    axios
      .get("/api/v1/topics.json")
      .then((resp) => {
        setTopics(resp.data.data);
        title.classList.add("title-fade-out");

        setTimeout(() => {
          setLoaded(true);
          setProgress(100);
          title.classList.remove("title-fade-out");
          centerText.classList.add("topics-title-two");
          centerText.classList.remove("topics-title");
        }, 500);

        console.log("Topics resp: ", resp);
      })
      .catch((resp) => console.log(resp));

    axios
      .get("/api/v1/tags.json")
      .then((resp) => {
        setTags(resp.data.data);
        console.log("Tags resp: ", resp);
      })
      .catch((resp) => {
        console.log(resp);
      });
  }, []);

  // -------------------------- Category Icons & Form Options -----------------------------------
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
    "--",
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

  // -------------------------- Load Animation Bars -----------------------------------

  const loadBar = [];
  for (var i = 1; i <= 5; i++) {
    var bar = <div className={`loadbar-${i}`}></div>;
    loadBar.push(bar);
  }

  // -------------------------- Set Topics --------------------------------------------

  const list = topics.map((item) => {
    return (
      <ul className={`topic-${topics.indexOf(item)}`} key={`topic-${item.id}`}>
        <FontAwesomeIcon
          icon={icons[item.attributes.category - 1]}
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

  // -------------------------- Split Topics to 2 columns --------------------------------------------

  const topicCount = topics.length;
  const topicQuarter = Math.round(topicCount / 4);
  const listOne = [];
  const listTwo = [];
  const listThree = [];
  const listFour = [];

  for (var i = 0; i <= topicQuarter - 1; i++) {
    listOne.push(list[i]);
  }

  for (var i = topicQuarter; i <= topicQuarter * 2 - 1; i++) {
    listTwo.push(list[i]);
  }

  for (var i = topicQuarter * 2; i <= topicQuarter * 3 - 1; i++) {
    listThree.push(list[i]);
  }

  for (var i = topicQuarter * 3; i <= topicCount; i++) {
    listFour.push(list[i]);
  }

  // -------------------------- Add/Remove Tags Handler for Form --------------------------------------------

  const addTagHandler = (e) => {
    // Searching through existing tags with input
    if (e.target.value !== "") {
      const tagSearch = tags.filter((c) =>
        c.attributes.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      console.log("Results: ", tagSearch);
      setSearchResult(tagSearch);
    } else if (e.target.value === "") {
      console.log("No Results.");
      setSearchResult([]);
    }

    var filter = submitTags.filter(
      (c) => c.name === e.target.value.split(",")[0]
    );
    console.log("matches: ", filter);

    // Adding tags via comma
    if (e.key === ",") {
      if (e.target.value !== "" && filter.length === 0) {
        var tag = { name: e.target.value.split(",")[0] };

        setSubmitTags([...submitTags, tag]);
        setTagParams(true);
        setSearchResult([]);

        e.target.value = "";
      } else {
        setSearchResult([]);
        e.target.value = "";
      }
    }
  };

  const removeTagHandler = (indexToRemove) => {
    // Finding the tag that matches passed index No. and excluding it from submission list
    setSubmitTags(submitTags.filter((c) => c !== submitTags[indexToRemove]));
    setTagParams(true);
  };

  // Add tag from suggestions by click event
  const addTagByClick = (tagName) => {
    const tagInputField = document.querySelector(".tags-input");

    var filter = submitTags.filter((c) => c.name === tagName);
    console.log("matches: ", filter);

    if (filter.length === 0) {
      var tag = { name: tagName };
      setSubmitTags([...submitTags, tag]);
      setTagParams(true);
    }
    setSearchResult([]);
    tagInputField.value = "";
  };

  // Adding tags to topics_tag param
  if (tagParams === true) {
    var tagParam = [];

    submitTags.forEach((item) => {
      tagParam.push(item.name);
    });

    setTopicsTag(Object.assign({}, topics_tag, { names: tagParam }));

    setTagParams(false);
    console.log("Tags: ", submitTags);
    console.log("Topic Params: ", topics_tag);
  }

  // ----------------------------- Existing Tags List Generator --------------------------------------------

  const tagSelection = searchResult.map((item) => {
    return (
      <li
        className={`search-result ${item.id}`}
        key={`result-${item.id}`}
        onClick={() => addTagByClick(item.attributes.name)}
      >
        <span>{item.attributes.name}</span>
      </li>
    );
  });

  // ----------------------------- Added Tags List Generator --------------------------------------------

  const tagList = submitTags.map((item) => {
    return (
      <li
        key={item.name}
        className={`newTag ${item.name}`}
        data-name={item.name}
      >
        <span>{item.name}</span>
        <FontAwesomeIcon
          icon={faTimes}
          className="delete-tag"
          key={`close-${item.name}`}
          data-name={item.name}
          onClick={() => removeTagHandler(submitTags.indexOf(item))}
        />
      </li>
    );
  });

  // ------------------------------ Topics Form Handlers --------------------------------------------

  const handleChange = (e) => {
    e.preventDefault();

    setTopicsTag(
      Object.assign({}, topics_tag, {
        [e.target.name]: e.target.value,
        views: 0,
      })
    );

    console.log("Topic Params: ", topics_tag);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const csrfToken = document.querySelector("[name=csrf-token]").content;
    axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;

    axios
      .post("/api/v1/topics", { topics_tag })
      .then((resp) => {
        const titleField = document.getElementById("title");
        const descriptionField = document.getElementById("description");
        const proField = document.getElementById("pro");
        const conField = document.getElementById("con");
        const categoryField = document.getElementById("select-c");

        console.log(resp, resp.data.data);

        setTopics([...topics, resp.data.data]);
        setTopicsTag({
          title: "",
          description: "",
          pro: "",
          con: "",
          category: 0,
          names: [],
        });
        titleField.value = "";
        descriptionField.value = "";
        proField.value = "";
        conField.value = "";
        categoryField.value = 0;

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

  // const animTitle = (seconds) => {
  //
  //   setShow(true);
  // };

  // loaded && animTitle();

  // ----------------------------- Component ------------------------------------------

  return (
    <div className="topics-shell">
      <LoadingBar
        color="#f11946"
        height={5}
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
        className="load-bar"
      />

      {/* Loading Animation */}
      {loaded !== true && <div className="loading-shell">{loadBar}</div>}

      <div className="content-space">
        {/* Title & Add Button */}
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

        {/* Topics Display */}
        <div className="core-content">
          <div className="topics one">{loaded && listOne}</div>
          <div className="topics two">{loaded && listTwo}</div>
          <div className="topics three">{loaded && listThree}</div>
          <div className="topics four">{loaded && listFour}</div>
        </div>
      </div>

      {/* New Topic Form */}
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
          <div className="tags-field-shell">
            <ul className="tagSpace">{tagList}</ul>
            <input
              type="text"
              placeholder="Tags (Hit comma to add Tag)"
              className="tags-input"
              onKeyUp={addTagHandler}
            />
            <ul className="tag-search-result">{tagSelection}</ul>
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
