import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLightbulb,
  faTrashAlt,
  faPenSquare,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import gfm from "remark-gfm";
import LoadingBar from "react-top-loading-bar";
import { cspNonce } from "@rails/ujs";

const Point = (props) => {
  // -------------------------- Use States --------------------------
  const [pointShow, setPointShow] = useState({});
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState({});
  const [point, setPoint] = useState({});
  const [rating, setRating] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [views, setViews] = useState(0);
  const [viewSetPermit, setViewSetPermit] = useState(false);
  const [submitPermit, setSubmitPermit] = useState(false);
  const [submitPermitView, setSubmitPermitView] = useState(false);
  const [userRating, setUserRating] = useState({});
  const [progress, setProgress] = useState(0);

  // -------------------------- User Detection --------------------------
  const userPresence = document.querySelector(".user-presence");
  const loginStatus = userPresence.getAttribute("data-user");
  const loginId = userPresence.getAttribute("data-id");

  // console.log("Logged In? ", loginStatus, " ID: ", loginId);
  // console.log("Props: ", props);

  // -------------------------- Use Effect --------------------------
  useEffect(() => {
    setProgress(30);
    const pointId = props.match.params.id;
    const pointUrl = `/api/v1/points/${pointId}`;

    axios
      .get(pointUrl)
      .then((resp) => {
        const commentsResp = resp.data.included.filter((c) =>
          c.type.includes("comment")
        );
        const ratingsResp = resp.data.included.filter((c) =>
          c.type.includes("rating")
        );

        setPointShow(resp.data);
        setComments(commentsResp);
        setLoaded(true);
        setViews(resp.data.data.attributes.views + 1);
        setViewSetPermit(true);

        // If logged in, find rating record belonging to user.
        if (loginStatus === "true") {
          var userRate = ratingsResp.find(
            (c) => c.attributes.user_id == loginId
          );
          // return userRating
        } else {
          console.log("Not Logged in");
          var userRate = undefined;
        }

        setUserRating(userRate);
        console.log("Then response: ", resp);
        console.log("Point Owner: ", resp.data.data.attributes.user.username);
        console.log("RatingResp: ", ratingsResp);
        console.log("userRate: ", userRate);
        console.log("View Count: ", resp.data.data.attributes.views);

        if (userRate !== undefined) {
          var bulbInit = document.getElementById(
            `rate-${userRate.attributes.rate_name}`
          );
          bulbInit.classList.add("selected");
        }

        setProgress(100);
      })
      .catch((resp) => console.log(resp));
  }, []);

  // -------------------------- Add View Count ---------------------------------------

  if (viewSetPermit === true) {
    setPoint(
      Object.assign({}, point, {
        views: views,
        user_id: pointShow.data.attributes.user.id,
      })
    );
    setViewSetPermit(false);
    setSubmitPermitView(true);
  } else {
    //
  }

  if (
    submitPermitView === true &&
    pointShow.data.attributes.user.id != loginId
  ) {
    const accessCounter = document.querySelector(".point-count");

    const csrfToken = document.querySelector("[name=csrf-token]").content;
    axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;

    const point_id = pointShow.data.id;
    axios
      .patch(`/api/v1/points/${point_id}/update_views`, { point })
      .then((resp) => {
        console.log("View +1");
        console.log(resp);
        accessCounter.innerHTML = `Access Count: ${point.views}`;
        setPoint({});
      })
      .catch((resp) => {
        console.log(resp);
      });

    setSubmitPermitView(false);
  } else {
    //
  }

  // -------------------------- Edit/Delete Comment handlers ---------------------------

  const handleCommentChange = (e) => {
    e.preventDefault();

    const commentId = e.target.getAttribute("data-id");
    const maxLength = e.target.getAttribute("maxlength");
    const counter = document.querySelector(".edit-comment-count");
    const field = document.getElementById(`edit-text-${commentId}`);

    setComment(Object.assign({}, comment, { [e.target.name]: e.target.value }));

    let remaining = maxLength - field.value.length;
    counter.innerHTML = `${remaining} Char Left`;
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();

    const csrfToken = document.querySelector("[name=csrf-token]").content;
    axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;

    const commentId = e.target.parentElement.getAttribute("data-id");
    const targetComment = document.getElementById(`comment-${commentId}`);
    const targetText = document.getElementById(`comment-text-${commentId}`);

    console.log(targetComment);

    axios
      .patch(`/api/v1/comments/${commentId}`, { comment })
      .then((resp) => {
        console.log(resp);

        targetText.innerHTML = resp.data.data.attributes.text;

        for (var i = 0; i <= 5; i++) {
          targetComment.children[i].style.display = null;
        }

        targetComment.children[6].style.display = "none";
        targetComment.children[6].classList.remove("being-edited");
      })
      .catch((resp) => {
        console.log(resp);
      });
  };

  const handleCommentDelete = (e) => {
    e.preventDefault();

    const csrfToken = document.querySelector("[name=csrf-token]").content;
    axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;

    const commentId = e.target.parentElement.getAttribute("data-id");
    const targetComment = document.getElementById(`comment-${commentId}`);
    console.log("Delete Click Ok");

    axios
      .delete(`/api/v1/comments/${commentId}`)
      .then((resp) => {
        console.log(resp);
        targetComment.style.display = "none";
      })
      .catch((resp) => {
        console.log(resp);
      });
  };

  // -------------------------- Comment form animation handlers ------------------------

  const showCommentEdit = (e) => {
    e.preventDefault();

    const commentId = e.target.getAttribute("data-id");
    const targetComment = document.getElementById(`comment-${commentId}`);

    for (var i = 0; i <= 5; i++) {
      targetComment.children[i].style.display = "none";
    }

    targetComment.children[6].style.display = "block";
    targetComment.children[6].classList.add("being-edited");
  };

  const hideCommentEdit = (e) => {
    e.preventDefault();

    const commentId = e.target.getAttribute("data-id");
    const targetComment = document.getElementById(`comment-${commentId}`);

    console.log(targetComment);

    for (var i = 0; i <= 5; i++) {
      targetComment.children[i].style.display = null;
    }

    targetComment.children[6].style.display = "none";
    targetComment.children[6].classList.remove("being-edited");
  };

  const showCommentWarning = (e) => {
    e.preventDefault();

    const commentId = e.target.getAttribute("data-id");
    const targetComment = document.getElementById(`comment-${commentId}`);
    // const warning = document.getElementById("delete-comment-warning");

    for (var i = 0; i <= 4; i++) {
      targetComment.children[i].style.display = "none";
    }

    targetComment.children[5].style.display = "block";
    targetComment.children[5].classList.add("showWarning");
    console.log("Show Warning OK");
  };

  const hideCommentWarning = (e) => {
    e.preventDefault();

    const commentId = e.target.getAttribute("data-id");
    const targetComment = document.getElementById(`comment-${commentId}`);
    // const warning = document.getElementById("delete-comment-warning");

    for (var i = 0; i <= 4; i++) {
      targetComment.children[i].style.display = null;
    }

    targetComment.children[5].style.display = "none";
    targetComment.children[5].classList.remove("showWarning");
    console.log("Hide Warning OK");
  };

  // -------------------------- Content (comments) Processors --------------------------

  const list = comments.map((item) => {
    return (
      <ul
        className={`comment ${comments.indexOf(item)}`}
        key={`comment-${item.id}`}
        id={`comment-${item.id}`}
      >
        {/* Comment Content */}
        <li
          className={`comment-user ${comments.indexOf(item)}`}
          key={item.attributes.user.username}
        >
          {`By ${item.attributes.user.username}`}
        </li>
        <li
          className={`comment-date ${comments.indexOf(item)}`}
          key={`comment-date-${item.id}`}
        >
          {`Posted ${new Date(item.attributes.created_at).toDateString()}`}
        </li>
        <li
          className={`comment-text ${comments.indexOf(item)}`}
          key={`comment-text-${item.id}`}
          id={`comment-text-${item.id}`}
        >
          {item.attributes.text}
        </li>

        {/* Edit & Delete Buttons */}
        {item.attributes.user.id == loginId && (
          <li
            className="comment-edit"
            onClick={showCommentEdit}
            data-id={item.id}
          >
            Edit
          </li>
        )}
        {item.attributes.user.id == loginId && (
          <li
            className="comment-delete"
            onClick={showCommentWarning}
            data-id={item.id}
          >
            Delete
          </li>
        )}

        {/* Delete Warning */}
        <div
          className="delete-warning"
          id="delete-comment-warning"
          data-id={item.id}
        >
          <p>Sure?</p>
          <button
            className="confirm"
            data-id={item.id}
            onClick={handleCommentDelete}
          >
            Delete
          </button>
          <button
            className="cancel"
            data-id={item.id}
            onClick={hideCommentWarning}
          >
            Cancel
          </button>
        </div>

        {/* Edit Comment Form */}
        <div className="comment-form-shell-edit" data-id={item.id}>
          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <textarea
              name="text"
              maxLength="300"
              placeholder="Max Char Length 300"
              onChange={handleCommentChange}
              className="comment-field"
              defaultValue={item.attributes.text}
              id={`edit-text-${item.id}`}
              data-id={item.id}
            />
            <div className="comment-edit-buttons">
              <button
                type="submit"
                className="comment-edit-submit"
                data-id={item.id}
              >
                Post
              </button>
              <button
                className="cancel-edit"
                onClick={hideCommentEdit}
                data-id={item.id}
              >
                Cancel
              </button>
              <p className="edit-comment-count"></p>
            </div>
          </form>
        </div>
      </ul>
    );
  });

  // -------------------------- New Comment handlers --------------------------
  const handleChange = (e) => {
    e.preventDefault();

    const counter = document.querySelector(".new-comment-count");
    const field = document.querySelector(".comment-field");
    const maxLength = field.getAttribute("maxlength");

    setComment(Object.assign({}, comment, { [e.target.name]: e.target.value }));
    // console.log("Comment: ", comment);

    let remaining = maxLength - field.value.length;
    counter.innerHTML = `${remaining} Char Left`;
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

  // -------------------------- Edit/Delete Point handlers --------------------------
  const handleEditChange = (e) => {
    e.preventDefault();
    setPoint(Object.assign({}, point, { [e.target.name]: e.target.value }));
    console.log("Point: ", point);
  };

  const handlePointSubmit = (e) => {
    e.preventDefault();

    const csrfToken = document.querySelector("[name=csrf-token]").content;
    axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;

    const point_id = pointShow.data.id;

    axios
      .patch(`/api/v1/points/${point_id}`, { point })
      .then((resp) => {
        console.log(resp);
        setPointShow(resp.data);
      })
      .catch((resp) => {
        console.log(resp);
      });
  };

  const handlePointDelete = (e) => {
    e.preventDefault();

    const csrfToken = document.querySelector("[name=csrf-token]").content;
    axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;

    const point_id = pointShow.data.id;
    const topic_id = pointShow.data.relationships.topic.data.id;

    axios
      .delete(`/api/v1/points/${point_id}`)
      .then((resp) => {
        console.log(resp);
        window.location = `/topics/${topic_id}`;
      })
      .catch((resp) => {
        console.log(resp);
      });
  };
  // -------------------------- Submit Rating Handler -----------------------------------------

  const setRatingOne = (e) => {
    e.preventDefault();

    const bulb1 = document.getElementById("rate-bright");
    const bulb2 = document.getElementById("rate-dim");
    const bulb3 = document.getElementById("rate-dark");

    setRating({ rate_name: "bright" });

    const pointBright = pointShow.data.attributes.bright;
    const pointDim = pointShow.data.attributes.dim;
    const pointDark = pointShow.data.attributes.dark;

    // New
    if (userRating === undefined) {
      setPoint(Object.assign({}, point, { bright: pointBright + 1 }));

      bulb1.classList.add("selected");
      bulb2.classList.remove("selected");
      bulb3.classList.remove("selected");

      setSubmitPermit(true);
    } else if (userRating.attributes.rate_name == "bright") {
      setPoint(Object.assign({}, point, { bright: pointBright - 1 }));

      bulb1.classList.remove("selected");

      setSubmitPermit(true);
    } else if (userRating.attributes.rate_name == "dim") {
      setPoint(
        Object.assign({}, point, { bright: pointBright + 1, dim: pointDim - 1 })
      );

      bulb1.classList.add("selected");
      bulb2.classList.remove("selected");
      bulb3.classList.remove("selected");

      setSubmitPermit(true);
    } else if (userRating.attributes.rate_name == "dark") {
      setPoint(
        Object.assign({}, point, {
          bright: pointBright + 1,
          dark: pointDark - 1,
        })
      );

      bulb1.classList.add("selected");
      bulb2.classList.remove("selected");
      bulb3.classList.remove("selected");

      setSubmitPermit(true);
    } else {
      //
    }
  };

  const setRatingTwo = (e) => {
    e.preventDefault();

    const bulb1 = document.getElementById("rate-dim");
    const bulb2 = document.getElementById("rate-bright");
    const bulb3 = document.getElementById("rate-dark");

    setRating({ rate_name: "dim" });

    const pointBright = pointShow.data.attributes.bright;
    const pointDim = pointShow.data.attributes.dim;
    const pointDark = pointShow.data.attributes.dark;

    // New
    if (userRating === undefined) {
      setPoint(Object.assign({}, point, { dim: pointDim + 1 }));

      bulb1.classList.add("selected");
      bulb2.classList.remove("selected");
      bulb3.classList.remove("selected");

      setSubmitPermit(true);
    } else if (userRating.attributes.rate_name == "dim") {
      setPoint(Object.assign({}, point, { dim: pointDim - 1 }));

      bulb1.classList.remove("selected");

      setSubmitPermit(true);
    } else if (userRating.attributes.rate_name == "bright") {
      setPoint(
        Object.assign({}, point, { bright: pointBright - 1, dim: pointDim + 1 })
      );

      bulb1.classList.add("selected");
      bulb2.classList.remove("selected");
      bulb3.classList.remove("selected");

      setSubmitPermit(true);
    } else if (userRating.attributes.rate_name == "dark") {
      setPoint(
        Object.assign({}, point, {
          dim: pointDim + 1,
          dark: pointDark - 1,
        })
      );

      bulb1.classList.add("selected");
      bulb2.classList.remove("selected");
      bulb3.classList.remove("selected");

      setSubmitPermit(true);
    } else {
      //
    }
  };

  const setRatingThree = (e) => {
    e.preventDefault();

    const bulb1 = document.getElementById("rate-dark");
    const bulb2 = document.getElementById("rate-dim");
    const bulb3 = document.getElementById("rate-bright");

    setRating({ rate_name: "dark" });

    const pointBright = pointShow.data.attributes.bright;
    const pointDim = pointShow.data.attributes.dim;
    const pointDark = pointShow.data.attributes.dark;

    // New
    if (userRating === undefined) {
      setPoint(Object.assign({}, point, { dark: pointDark + 1 }));

      bulb1.classList.add("selected");
      bulb2.classList.remove("selected");
      bulb3.classList.remove("selected");

      setSubmitPermit(true);
    } else if (userRating.attributes.rate_name == "dim") {
      setPoint(
        Object.assign({}, point, { dim: pointDim - 1, dark: pointDark + 1 })
      );

      bulb1.classList.add("selected");
      bulb2.classList.remove("selected");
      bulb3.classList.remove("selected");

      setSubmitPermit(true);
    } else if (userRating.attributes.rate_name == "bright") {
      setPoint(
        Object.assign({}, point, {
          bright: pointBright - 1,
          dark: pointDark + 1,
        })
      );

      bulb1.classList.add("selected");
      bulb2.classList.remove("selected");
      bulb3.classList.remove("selected");

      setSubmitPermit(true);
    } else if (userRating.attributes.rate_name == "dark") {
      setPoint(
        Object.assign({}, point, {
          dark: pointDark - 1,
        })
      );

      bulb1.classList.remove("selected");

      setSubmitPermit(true);
    } else {
      //
    }
  };

  // Rating & Point Submit Algorithm

  // If Submit is permitted and user has no rating:
  if (submitPermit === true && userRating == undefined) {
    console.log("New Rating");
    console.log(point, rating);

    setSubmitPermit(false);
    const point_id = pointShow.data.id;
    const csrfToken = document.querySelector("[name=csrf-token]").content;
    axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;
    console.log("User ratings Then: ", userRating, typeof userRating);

    // Add new Rating
    axios
      .post("/api/v1/ratings", { rating, point_id })
      .then((resp) => {
        console.log("Ratings New Resp: ", resp.data.data);
        setUserRating(resp.data.data);
      })
      .catch((resp) => {
        console.log(resp);
      });
    // Update Point Params Bright
    axios
      .patch(`/api/v1/points/${point_id}`, { point })
      .then((resp) => {
        console.log("Point Update Resp: ", resp);
        setPointShow(resp.data);
        console.log("Point Show: ", pointShow);
      })
      .catch((resp) => {
        console.log(resp);
      });
  } else if (submitPermit === true && userRating !== undefined) {
    if (userRating.attributes.rate_name == rating.rate_name) {
      console.log("Delete Rating");

      setSubmitPermit(false);
      const rating_id = userRating.id;
      const point_id = pointShow.data.id;
      const csrfToken = document.querySelector("[name=csrf-token]").content;
      axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;

      axios
        .delete(`/api/v1/ratings/${rating_id}`)
        .then((resp) => {
          console.log(resp);
          setUserRating(undefined);
        })
        .catch((resp) => {
          console.log(resp);
        });

      axios
        .patch(`/api/v1/points/${point_id}`, { point })
        .then((resp) => {
          console.log("Point Update Resp: ", resp);
          setPointShow(resp.data);
        })
        .catch((resp) => {
          console.log(resp);
        });
    } else if (userRating.attributes.rate_name !== rating.rate_name) {
      console.log("Change/Update Rating");

      setSubmitPermit(false);
      const rating_id = userRating.id;
      const point_id = pointShow.data.id;
      const csrfToken = document.querySelector("[name=csrf-token]").content;
      axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;

      axios
        .patch(`/api/v1/ratings/${rating_id}`, { rating })
        .then((resp) => {
          console.log("Ratings New Resp: ", resp);
          setUserRating(resp.data.data);
          console.log("User Rating: ", userRating);
        })
        .catch((resp) => {
          console.log(resp);
        });

      axios
        .patch(`/api/v1/points/${point_id}`, { point })
        .then((resp) => {
          console.log("Point Update Resp: ", resp);
          setPointShow(resp.data);
        })
        .catch((resp) => {
          console.log(resp);
        });
    } else {
      //
    }
  } else {
    //
  }

  // console.log("User rating name: ", userRating.data);
  console.log("Latest User rating: ", userRating);

  // -------------------------- Edit/Delete Point Animation Handlers --------------------------
  const openForm = (e) => {
    e.preventDefault();

    const formContent = document.getElementById("form-content");
    console.log(formContent);
    formContent.style.display = "grid";
    formContent.classList.add("formContent");
    setFormOpen(true);
    console.log("Show Ok");
  };

  const closeForm = (e) => {
    e.preventDefault();

    const formContent = document.getElementById("form-content");
    const titleField = document.getElementById("title");
    const argumentField = document.getElementById("argument");

    setFormOpen(false);
    titleField.value = pointShow.data.attributes.title;
    argumentField.value = pointShow.data.attributes.argument;
    formContent.classList.remove("formContent");
    formContent.style.display = "none";
    console.log("Close Ok");
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
    preview.style.display = "none";
  };

  const showWarning = (e) => {
    e.preventDefault();

    const trashCan = document.querySelector(".point-delete");
    const warning = document.querySelector(".delete-warning");

    trashCan.style.display = "none";
    warning.style.display = "block";
    warning.classList.add("showWarning");
    console.log("Show Warning OK");
  };

  const hideWarning = (e) => {
    e.preventDefault();

    const trashCan = document.querySelector(".point-delete");
    const warning = document.querySelector(".delete-warning");

    trashCan.style.display = "block";
    warning.style.display = "none";
    warning.classList.remove("showWarning");
    console.log("Hide Warning OK");
  };

  // -------------------------- Vars For Components --------------------------

  const charCountTit = document.getElementById("title");
  const charCountArg = document.getElementById("argument");

  // const charCountText = document.getElementById("text");
  // console.log("comment form: ", charCountText.value);

  // Array Math Test
  // const arrayOne = [5, 5, 5];
  // const arrayTwo = [5, 5, 5];
  // var sum = Array(arrayOne.length);
  // for (var i = 0; i < arrayOne.length; i++) {
  //   sum[i] = arrayOne[i] + arrayTwo[i];
  // }
  // console.log(sum);

  // -------------------------- Component --------------------------
  return (
    loaded && (
      <div className="point-shell">
        <LoadingBar
          color="#f11946"
          height={5}
          shadow={true}
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
        />

        {/* Point Info */}
        <h1 className="point-title">{pointShow.data.attributes.title}</h1>
        <div className="point-options">
          <p className="point-user">
            By {pointShow.data.attributes.user.username}
          </p>
          <p className="point-date">
            Posted{" "}
            {new Date(pointShow.data.attributes.created_at).toDateString()}
          </p>

          <p className="point-count">
            {pointShow.data.attributes.user.id == loginId &&
              `Access Count: ${pointShow.data.attributes.views}`}
          </p>

          {/* Edit/Delete Point Options */}
          {pointShow.data.attributes.user.id == loginId && (
            <FontAwesomeIcon
              icon={faPenSquare}
              className="point-edit"
              onClick={openForm}
            />
          )}
          {pointShow.data.attributes.user.id == loginId && (
            <FontAwesomeIcon
              icon={faTrashAlt}
              className="point-delete"
              onClick={showWarning}
            />
          )}

          {/* Delete Warning */}
          <div className="delete-warning">
            <p>Sure?</p>
            <button className="confirm" onClick={handlePointDelete}>
              Delete
            </button>
            <button className="cancel" onClick={hideWarning}>
              Cancel
            </button>
          </div>
        </div>

        {/* Point Content */}
        {pointShow.data.attributes.markdown ? (
          <ReactMarkdown
            plugins={[gfm]}
            children={pointShow.data.attributes.argument}
            className="point-argument markdown"
          />
        ) : (
          <p className="point-argument text">
            {pointShow.data.attributes.argument}
          </p>
        )}

        {/* Point Ratings */}
        {loginStatus === "true" ? (
          <div className="ratings">
            <FontAwesomeIcon
              icon={faLightbulb}
              className="rate bright"
              id="rate-bright"
              onClick={setRatingOne}
            />

            <FontAwesomeIcon
              icon={faLightbulb}
              className="rate dim"
              id="rate-dim"
              onClick={setRatingTwo}
            />
            <FontAwesomeIcon
              icon={faLightbulb}
              className="rate dark"
              id="rate-dark"
              onClick={setRatingThree}
            />
            <p className="count bright">{pointShow.data.attributes.bright}</p>
            <p className="count dim">{pointShow.data.attributes.dim}</p>
            <p className="count dark">{pointShow.data.attributes.dark}</p>
          </div>
        ) : (
          <div className="ratings">
            <FontAwesomeIcon
              icon={faLightbulb}
              className="rate bright"
              id="rate-bright"
            />

            <FontAwesomeIcon
              icon={faLightbulb}
              className="rate dim"
              id="rate-dim"
            />
            <FontAwesomeIcon
              icon={faLightbulb}
              className="rate dark"
              id="rate-dark"
            />
            <p className="count bright">{pointShow.data.attributes.bright}</p>
            <p className="count dim">{pointShow.data.attributes.dim}</p>
            <p className="count dark">{pointShow.data.attributes.dark}</p>
          </div>
        )}

        {/* Comment Form */}
        {loginStatus === "true" && (
          <div className="comment-form-shell">
            <form className="comment-form" onSubmit={handleSubmit}>
              <textarea
                name="text"
                maxLength="300"
                placeholder="Max Char Length 300"
                onChange={handleChange}
                className="comment-field"
                id="text"
              />
              <button type="submit" className="comment-submit">
                Post
              </button>
              <p className="new-comment-count"></p>
            </form>
          </div>
        )}

        {/* Comments */}
        <div className="comments-shell">
          <p className="comments-head">Comments</p>
          {list}
        </div>

        {/* Edit Point Form */}
        <form
          className="edit-point-form"
          onSubmit={handlePointSubmit}
          id="form-content"
        >
          <textarea
            name="title"
            maxLength="150"
            onChange={handleEditChange}
            className="point-form-title"
            defaultValue={pointShow.data.attributes.title}
            id="title"
          />

          <input
            name="position"
            type="hidden"
            value={pointShow.data.attributes.position}
          />

          <div className="point-form-format">
            <p>Format</p>
            <select
              name="markdown"
              onChange={handleEditChange}
              className="select-format"
              defaultValue={pointShow.data.attributes.markdown}
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
            onChange={handleEditChange}
            className="point-form-argument"
            defaultValue={pointShow.data.attributes.argument}
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
            <button onClick={closeForm}>Close Form</button>
          </ul>
          <button type="submit" className="point-submit">
            Post
          </button>
        </form>

        {/* Markdown Preview */}
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

export default Point;
