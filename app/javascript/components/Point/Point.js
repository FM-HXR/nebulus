import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import gfm from "remark-gfm";

const Point = (props) => {
  const [pointShow, setPointShow] = useState({});
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState({});
  const [loaded, setLoaded] = useState(false);
  const userPresence = document.querySelector(".user-presence");
  let loginStatus = userPresence.getAttribute("data-user");
  // console.log("Props: ", props);

  useEffect(() => {
    const pointId = props.match.params.id;
    const pointUrl = `/api/v1/points/${pointId}`;
    axios
      .get(pointUrl)
      .then((resp) => {
        setPointShow(resp.data);
        setComments(resp.data.included);
        setLoaded(true);
        console.log("Then response: ", resp);
      })
      .catch((resp) => console.log(resp));
  }, []);

  const list = comments.map((item) => {
    return (
      <ul
        className={`comment-${comments.indexOf(item)}`}
        key={`comment-${item.id}`}
      >
        <li
          className={`comment-text-${comments.indexOf(item)}`}
          key={`comment-text-${item.id}`}
        >
          {item.attributes.text}
        </li>
        <li
          className={`comment-user-${comments.indexOf(item)}`}
          key={item.attributes.user.username}
        >
          {`User: ${item.attributes.user.username}`}
        </li>
        <li
          className={`comment-date-${comments.indexOf(item)}`}
          key={`comment-date-${item.id}`}
        >
          {`Posted On: ${new Date(item.attributes.created_at).toDateString()}`}
        </li>
      </ul>
    );
  });

  const handleChange = (e) => {
    e.preventDefault();
    setComment(Object.assign({}, comment, { [e.target.name]: e.target.value }));
    console.log("Comment: ", comment);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const csrfToken = document.querySelector("[name=csrf-token]").content;
    axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;
    const point_id = pointShow.data.id;

    axios
      .post("/api/v1/comments", { comment, point_id })
      .then((resp) => {
        console.log(resp);
        const textField = document.getElementById("text");

        setComments([...comments, resp.data.data]);
        setComment({ text: "" });

        textField.value = "";
      })
      .catch((resp) => console.log(resp));
  };

  return (
    loaded && (
      <div className="point-shell">
        <h1>{pointShow.data.attributes.title}</h1>
        {pointShow.data.attributes.markdown ? (
          <ReactMarkdown
            plugins={[gfm]}
            children={pointShow.data.attributes.argument}
            className="point-argument"
          />
        ) : (
          <p className="point-argument">{pointShow.data.attributes.argument}</p>
        )}
        <div className="comments-shell">
          <p className="comments-head">Comments</p>
          {list}
        </div>
        <div className="comment-form-shell">
          <form className="comment-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="text"
              maxLength="300"
              placeholder="Max Char Length 300"
              onChange={handleChange}
              id="text"
            ></input>
            <button type="submit" className="comment-submit">
              Post
            </button>
          </form>
        </div>
      </div>
    )
  );
};

export default Point;
