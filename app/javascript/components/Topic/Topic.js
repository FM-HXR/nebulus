import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusSquare,
  faTrashAlt,
  faPenSquare,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import LoadingBar from "react-top-loading-bar";

const Topic = (props) => {
  const [showTopic, setShowTopic] = useState({});
  const [topic, setTopic] = useState({});
  const [points, setPoints] = useState([]);
  const [point, setPoint] = useState({});
  const [tags, setTags] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [views, setViews] = useState(0);
  const [viewSetPermit, setViewSetPermit] = useState(false);
  const [submitPermitView, setSubmitPermitView] = useState(false);
  const [progress, setProgress] = useState(0);

  const userPresence = document.querySelector(".user-presence");
  const loginStatus = userPresence.getAttribute("data-user");
  const loginId = userPresence.getAttribute("data-id");

  useEffect(() => {
    // Get Topic
    // Get Points
    setProgress(30);

    const topicId = props.match.params.id;
    const topicUrl = `/api/v1/topics/${topicId}`;

    axios
      .get(topicUrl)
      .then((resp) => {
        const pointsResp = resp.data.included.filter((c) =>
          c.type.includes("point")
        );
        const tagsResp = resp.data.included.filter((c) =>
          c.type.includes("tag")
        );

        setShowTopic(resp.data);
        setPoints(pointsResp);
        setTags(tagsResp);
        setLoaded(true);
        setViews(resp.data.data.attributes.views + 1);
        setViewSetPermit(true);
        setProgress(100);

        console.log("Then Response: ", resp);
      })
      .catch((resp) => {
        console.log((resp) => console.log("Catch Response: ", resp));
      });
  }, [points.length]);

  // -------------------------- Add View Count ---------------------------------------

  if (viewSetPermit === true) {
    setTopic(
      Object.assign({}, topic, {
        views: views,
        user_id: showTopic.data.attributes.user.id,
      })
    );
    setViewSetPermit(false);
    setSubmitPermitView(true);
  } else {
    //
  }

  if (
    submitPermitView === true &&
    showTopic.data.attributes.user.id != loginId
  ) {
    const accessCounter = document.querySelector(".topic-count");

    const csrfToken = document.querySelector("[name=csrf-token]").content;
    axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;

    const topic_id = showTopic.data.id;
    axios
      .patch(`/api/v1/topics/${topic_id}/update_views`, { topic })
      .then((resp) => {
        console.log("View +1");
        console.log(resp);
        accessCounter.innerHTML = `Access Count: ${topic.views}`;
        setTopic({});
      })
      .catch((resp) => {
        console.log(resp);
      });

    setSubmitPermitView(false);
  } else {
    //
  }

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
          className={`point-count pro-${proPoint.indexOf(item)}`}
          key={`pro-count-${item.id}`}
        >
          {`Access Count: ${item.attributes.views}`}
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
          className={`point-user con-${conPoint.indexOf(item)}`}
          key={item.attributes.user.username}
        >
          {item.attributes.user.username}
        </li>
        <li
          className={`point-count pro-${proPoint.indexOf(item)}`}
          key={`pro-count-${item.id}`}
        >
          {`Access Count: ${item.attributes.views}`}
        </li>
        <li
          className={`point-date con-${conPoint.indexOf(item)}`}
          key={`con-date-${item.id}`}
        >
          {`Posted On: ${new Date(item.attributes.created_at).toDateString()}`}
        </li>
      </ul>
    );
  });

  // let pros = null;
  // let cons = null;
  // if (points.length > 0) {

  // } else {
  //   pros = <h1>No Points</h1>;
  //   cons = <h1>No Points</h1>;
  // }

  // -------------------------- New Point Handlers --------------------------
  const handleChange = (e) => {
    e.preventDefault();
    setPoint(Object.assign({}, point, { [e.target.name]: e.target.value }));
    console.log("Point: ", point);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const csrfToken = document.querySelector("[name=csrf-token]").content;
    axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;
    const topic_id = showTopic.data.id;
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

  // -------------------------- Edit/Delete Topic Handlers --------------------------

  const handleEditChange = (e) => {
    e.preventDefault();
    setTopic(Object.assign({}, topic, { [e.target.name]: e.target.value }));
    console.log("Edited Topic: ", topic);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    const csrfToken = document.querySelector("[name=csrf-token]").content;
    axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;

    const topic_id = showTopic.data.id;
    const editForm = document.querySelector(".topic-form");
    const penIcon = document.querySelector(".topic-edit");
    const targetTitle = document.querySelector(".topic-title");
    const targetDesc = document.querySelector(".topic-description");
    const targetPro = document.querySelector(".pro");
    const targetCon = document.querySelector(".con");

    axios
      .patch(`/api/v1/topics/${topic_id}`, { topic })
      .then((resp) => {
        console.log("New Topic: ", resp.data);
        setTopic(resp.data);

        targetTitle.innerHTML = resp.data.data.attributes.title;
        targetDesc.innerHTML = resp.data.data.attributes.description;
        targetPro.innerHTML = resp.data.data.attributes.pro;
        targetCon.innerHTML = resp.data.data.attributes.con;

        editForm.classList.remove("formContent");
        editForm.style.display = "none";
        penIcon.style.display = null;
      })
      .catch((resp) => {
        console.log(resp);
      });
  };

  const handleTopicDelete = (e) => {
    e.preventDefault();

    const csrfToken = document.querySelector("[name=csrf-token]").content;
    axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;

    const topic_id = showTopic.data.id;

    axios
      .delete(`/api/v1/topics/${topic_id}`)
      .then((resp) => {
        console.log(resp);
        window.location = "/topics";
      })
      .catch((resp) => {
        console.log(resp);
      });
  };

  // -------------------------- New Point Form Animations --------------------------
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
    e.preventDefault();

    const close = document.querySelector(".close-form");
    const back = document.querySelector(".return-form");
    const titleField = document.getElementById("title");
    const argumentField = document.getElementById("argument");
    const plus = document.querySelector(".add-point");

    setFormOpen(false);
    titleField.value = "";
    argumentField.value = "";
    plus.style.display = "flex";
    back.style.display = "none";
    close.style.display = "none";
  };

  // -------------------------- Markdown Preview Action --------------------------

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

  // -------------------------- Edit/Delete Topic Form/Warning Animation ----------------------

  const showEditForm = (e) => {
    e.preventDefault();
    const editForm = document.querySelector(".topic-form");
    const penIcon = document.querySelector(".topic-edit");

    penIcon.style.display = "none";

    editForm.style.display = "grid";
    editForm.classList.add("formContent");
  };

  const closeEditForm = (e) => {
    e.preventDefault();
    const editForm = document.querySelector(".topic-form");
    const penIcon = document.querySelector(".topic-edit");

    editForm.classList.remove("formContent");
    editForm.style.display = "none";
    penIcon.style.display = null;
  };

  const showWarning = (e) => {
    e.preventDefault();
    const warning = document.querySelector(".delete-warning");
    const trashIcon = document.querySelector(".topic-delete");

    trashIcon.style.display = "none";
    warning.style.display = "grid";
    warning.classList.add("formContent");
  };

  const closeWarning = (e) => {
    e.preventDefault();
    const warning = document.querySelector(".delete-warning");
    const trashIcon = document.querySelector(".topic-delete");

    trashIcon.style.display = null;
    warning.style.display = "none";
    warning.classList.remove("formContent");
  };

  // -------------------------- Vars For Components --------------------------

  const charCountTit = document.getElementById("title");
  const charCountArg = document.getElementById("argument");

  // -------------------------- Component ------------------------------------
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

        {/* Topic Content/Info */}
        <div className="topic-head">
          <h2 className="topic-title">{showTopic.data.attributes.title}</h2>
          <p className="topic-count">
            {showTopic.data.attributes.user.id == loginId &&
              `Access Count: ${showTopic.data.attributes.views}`}
          </p>
          <p className="topic-description">
            {showTopic.data.attributes.description}
          </p>

          {/* Re-display or Close Point Form */}
          <button className="return-form" onClick={showForm}>
            Show Form
          </button>
          <button className="close-form" onClick={closeForm}>
            Close Form
          </button>
        </div>

        {/* Edit/Delete Topic & Add Point Options */}
        <div className="options-shell">
          {loginStatus === "true" && (
            <FontAwesomeIcon
              icon={faPlusSquare}
              onClick={showForm}
              className="add-point"
            />
          )}
          {showTopic.data.attributes.user.id == loginId && (
            <FontAwesomeIcon
              icon={faPenSquare}
              className="topic-edit"
              onClick={showEditForm}
            />
          )}
          {showTopic.data.attributes.user.id == loginId && (
            <FontAwesomeIcon
              icon={faTrashAlt}
              className="topic-delete"
              onClick={showWarning}
            />
          )}
        </div>

        {/* Pro & Con Points Section */}
        <div className="pro-shell">
          <p className="pro">{showTopic.data.attributes.pro}</p>
          <div className="pro-container">{pros}</div>
        </div>

        <div className="con-shell">
          <p className="con">{showTopic.data.attributes.con}</p>
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
              <option value={true}>{showTopic.data.attributes.pro}</option>
              <option value={false}>{showTopic.data.attributes.con}</option>
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

        {/* Markdown Preview Window */}
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

        {/* Edit Topic Form */}
        <form
          className="topic-form"
          onSubmit={handleEditSubmit}
          id="edit-content"
        >
          <textarea
            name="title"
            maxLength="200"
            placeholder="Topic Title: Max Char Length 200"
            onChange={handleEditChange}
            className="topic-form-title"
            defaultValue={showTopic.data.attributes.title}
            id="title"
          />

          <textarea
            name="description"
            maxLength="500"
            placeholder="Describe Topic: Max Char Length 500"
            onChange={handleEditChange}
            className="topic-form-description"
            defaultValue={showTopic.data.attributes.description}
            id="description"
          />

          <input
            type="text"
            name="pro"
            maxLength="30"
            placeholder="Pro Position Name"
            onChange={handleEditChange}
            className="topic-form-position-pro"
            defaultValue={showTopic.data.attributes.pro}
            id="pro"
          />

          <input
            type="text"
            name="con"
            maxLength="30"
            placeholder="Con Position Name"
            onChange={handleEditChange}
            className="topic-form-position-con"
            defaultValue={showTopic.data.attributes.con}
            id="con"
          />

          <button type="submit" className="topic-submit">
            Post
          </button>
          <button className="close-edit-form" onClick={closeEditForm}>
            Close
          </button>
        </form>

        {/* Delete Warning */}
        <div className="delete-warning">
          <p>Sure?</p>
          <button className="delete-topic" onClick={handleTopicDelete}>
            Delete
          </button>
          <button className="cancel-delete" onClick={closeWarning}>
            Cancel
          </button>
        </div>
      </div>
    )
  );
};

export default Topic;
