import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare, faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import LoadingBar from "react-top-loading-bar";

const Topic = (props) => {
  const [topic, setTopic] = useState({});
  const [points, setPoints] = useState([]);
  const [point, setPoint] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  const userPresence = document.querySelector(".user-presence");
  let loginStatus = userPresence.getAttribute("data-user");
  // console.log("Props: ", props);

  useEffect(() => {
    // Get Topic
    // Get Points
    setProgress(30);
    const topicId = props.match.params.id;
    const topicUrl = `/api/v1/topics/${topicId}`;
    axios
      .get(topicUrl)
      .then((resp) => {
        setTopic(resp.data);
        setPoints(resp.data.included);
        setLoaded(true);
        setProgress(100);
        console.log("Then Response: ", resp);
      })
      .catch((resp) => {
        console.log((resp) => console.log("Catch Response: ", resp));
      });
  }, [points.length]);

  // loaded ? console.log(topic.data.attributes.title) : console.log("No");

  // loaded && points[0].attributes.position === true
  //   ? console.log("Pro")
  //   : console.log("No");

  const proPoint = [];
  const conPoint = [];
  points.forEach((point) => {
    point.attributes.position === true
      ? proPoint.push(point)
      : conPoint.push(point);
  });

  const pros = proPoint.map((item) => {
    return (
      <ul
        className={`point pro-${proPoint.indexOf(item)}`}
        key={`pro-point-${item.id}`}
      >
        <li
          className={`point-title pro-${proPoint.indexOf(item)}`}
          key={`pro-title-${item.id}`}
        >
          <Link to={`/points/${item.id}`}>{item.attributes.title}</Link>
        </li>
        <li
          className={`point-user pro-${proPoint.indexOf(item)}`}
          key={item.attributes.user.username}
        >
          {item.attributes.user.username}
        </li>
        <li
          className={`point-date pro-${proPoint.indexOf(item)}`}
          key={`pro-date-${item.id}`}
        >
          {`Posted On: ${new Date(item.attributes.created_at).toDateString()}`}
        </li>
      </ul>
    );
  });

  const cons = conPoint.map((item) => {
    return (
      <ul
        className={`point con-${conPoint.indexOf(item)}`}
        key={`con-point-${item.id}`}
      >
        <li
          className={`point-title con-${conPoint.indexOf(item)}`}
          key={`con-title-${item.id}`}
        >
          <Link to={`/points/${item.id}`}>{item.attributes.title}</Link>
        </li>
        <li
          className={`point-user con-${conPoint.indexOf(item) + 10}`}
          key={item.attributes.user.username}
        >
          {item.attributes.user.username}
        </li>
        <li
          className={`point-date con-${conPoint.indexOf(item) + 10}`}
          key={`con-date-${item.id}`}
        >
          {`Posted On: ${new Date(item.attributes.created_at).toDateString()}`}
        </li>
      </ul>
    );
  });

  const handleChange = (e) => {
    e.preventDefault();
    setPoint(Object.assign({}, point, { [e.target.name]: e.target.value }));
    console.log("Point: ", point);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const csrfToken = document.querySelector("[name=csrf-token]").content;
    axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;
    const topic_id = topic.data.id;
    axios
      .post("/api/v1/points", { point, topic_id })
      .then((resp) => {
        console.log(resp);
        const titleField = document.getElementById("title");
        const argumentField = document.getElementById("argument");

        setPoints([...points, resp.data.data]);
        setPoint({ title: "", argument: "", position: "" });

        titleField.value = "";
        argumentField.value = "";

        const newId = resp.data.data.id;
        window.location = `/points/${newId}`;
      })
      .catch((resp) => console.log(resp));
  };

  const showForm = (e) => {
    e.preventDefault();

    const plus = document.querySelector(".add-point");
    const formContent = document.getElementById("form-content");
    const title = document.querySelector(".topic-title");
    const desc = document.querySelector(".topic-description");
    const back = document.querySelector(".return-form");
    const close = document.querySelector(".close-form");

    plus.style.display = "none";
    title.style.display = "none";
    desc.style.display = "none";
    back.style.display = "none";
    close.style.display = "none";

    formContent.style.display = "grid";
    formContent.classList.add("formContent");
    setFormOpen(true);
    console.log("Show Ok");
  };

  const hideForm = (e) => {
    e.preventDefault();

    const back = document.querySelector(".return-form");
    const close = document.querySelector(".close-form");
    const formContent = document.getElementById("form-content");
    const title = document.querySelector(".topic-title");
    const desc = document.querySelector(".topic-description");

    title.style.display = "";
    desc.style.display = "";
    back.style.display = "flex";
    close.style.display = "flex";
    formContent.classList.remove("formContent");
    formContent.style.display = "none";
    console.log("Hide Ok");
  };

  const closeForm = (e) => {
    const close = document.querySelector(".close-form");
    const back = document.querySelector(".return-form");
    const titleField = document.getElementById("title");
    const argumentField = document.getElementById("argument");
    const plus = document.querySelector(".add-point");

    setFormOpen(true);
    titleField.value = "";
    argumentField.value = "";
    plus.style.display = "flex";
    back.style.display = "none";
    close.style.display = "none";
  };

  const openPreview = (e) => {
    e.preventDefault();
    const preview = document.querySelector(".preview-shell");
    console.log(preview);
    preview.style.display = "flex";
  };

  const closePreview = (e) => {
    e.preventDefault();
    const preview = document.querySelector(".preview-shell");
    console.log(preview);
    preview.style.display = "none";
  };

  const charCountTit = document.getElementById("title");
  const charCountArg = document.getElementById("argument");

  return (
    loaded && (
      <div className="topic-shell">
        <LoadingBar
          color="#f11946"
          height={5}
          shadow={true}
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
        />

        <div className="topic-head">
          <h2 className="topic-title">{topic.data.attributes.title}</h2>
          <p className="topic-description">
            {topic.data.attributes.description}
          </p>
          <button className="return-form" onClick={showForm}>
            Show Form
          </button>
          <button className="close-form" onClick={closeForm}>
            Close Form
          </button>
        </div>

        {loginStatus === "true" && (
          <FontAwesomeIcon
            icon={faPlusSquare}
            onClick={showForm}
            className="add-point"
          />
        )}

        <div className="pro-shell">
          <p className="pro">{topic.data.attributes.pro}</p>
          <div className="pro-container">{pros}</div>
        </div>

        <div className="con-shell">
          <p className="con">{topic.data.attributes.con}</p>
          <div className="con-container">{cons}</div>
        </div>

        {/* Point Form */}
        <form className="point-form" onSubmit={handleSubmit} id="form-content">
          <textarea
            name="title"
            maxLength="150"
            placeholder="Point Title: Max Char Length 150"
            onChange={handleChange}
            className="point-form-title"
            id="title"
          />

          <div className="point-form-position">
            <p>Argue For:</p>
            <select
              name="position"
              onChange={handleChange}
              className="select-position"
              id="select-p"
            >
              <option value={null}>--</option>
              <option value={true}>{topic.data.attributes.pro}</option>
              <option value={false}>{topic.data.attributes.con}</option>
            </select>
          </div>

          <button className="see-desc" onClick={hideForm}>
            Hide Form
          </button>

          <div className="point-form-format">
            <p>Format</p>
            <select
              name="markdown"
              onChange={handleChange}
              className="select-format"
              id="select-f"
            >
              <option value={null}>--</option>
              <option value={true}>Markdown</option>
              <option value={false}>Text</option>
            </select>
          </div>

          <textarea
            name="argument"
            maxLength="5000"
            placeholder="Max Char Length 5000"
            onChange={handleChange}
            className="point-form-argument"
            id="argument"
          />
          <ul className="point-field-counts">
            <li>
              Title: {formOpen && 150 - charCountTit.value.length} Char Left
            </li>
            <li>
              Argument: {formOpen && 5000 - charCountArg.value.length} Char Left
            </li>
            <button onClick={openPreview}>Markdown Preview</button>
          </ul>
          <button type="submit" className="point-submit">
            Post
          </button>
        </form>
        <div className="preview-shell">
          <FontAwesomeIcon
            icon={faTimes}
            onClick={closePreview}
            className="close-preview"
          />
          {formOpen && (
            <ReactMarkdown plugins={[gfm]} className="point-preview">
              {charCountArg.value}
            </ReactMarkdown>
          )}
        </div>
      </div>
    )
  );
};

export default Topic;
