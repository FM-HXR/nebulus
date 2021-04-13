import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import FontAwesome from "react-fontawesome";
import axios from "axios";
import LoadingBar from "react-top-loading-bar";

const Topic = (props) => {
  const [topic, setTopic] = useState({});
  const [points, setPoints] = useState([]);
  const [point, setPoint] = useState({});
  const [loaded, setLoaded] = useState(false);
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
      })
      .catch((resp) => console.log(resp));
  };

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
        </div>

        <FontAwesome
          name="plus-square"
          // onClick={handleClickOne}
          className="add-point"
        />

        <div className="pro-shell">
          <p className="pro">{topic.data.attributes.pro}</p>
          <div className="pro-container">{pros}</div>
        </div>

        <div className="con-shell">
          <p className="con">{topic.data.attributes.con}</p>
          <div className="con-container">{cons}</div>
        </div>

        <div className="point-form-shell">
          <form className="point-form" onSubmit={handleSubmit}>
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

            <button className="see-desc">See Topic Description</button>

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
              maxLength="2000"
              placeholder="Max Char Length 2000"
              onChange={handleChange}
              className="point-form-argument"
              id="argument"
            />
            <button type="submit" className="point-submit">
              Post
            </button>
          </form>
        </div>
      </div>
    )
  );
};

export default Topic;
