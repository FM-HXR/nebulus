import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
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
import LoadingBar from "react-top-loading-bar";

const Search = () => {
  const [topics, setTopics] = useState([]);
  const [results, setResults] = useState([]);
  const [tags, setTags] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [searchTags, setSearchTags] = useState([]);
  const [filtering, setFiltering] = useState(false);
  const [filtered, setFiltered] = useState(false);
  const [tagFilter, setTagFilter] = useState(false);
  const [dateFilter, setDateFilter] = useState(false);
  const [statsFilter, setStatsFilter] = useState(false);
  const [catFilter, setCatFilter] = useState(false);
  const [dateMode, setDateMode] = useState(false);
  const [statsMode, setStatsMode] = useState(false);
  const [categoryId, setCategoryId] = useState(0);
  const [query, setQuery] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Get All Tags
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

  // ----------------------------- Search Bar Handlers --------------------------------------------

  const changeHandler = (e) => {
    e.preventDefault();
    setQuery(Object.assign({}, query, { [e.target.name]: e.target.value }));
    console.log(query);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setProgress(30);
    const csrfToken = document.querySelector("[name=csrf-token]").content;
    axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;

    axios
      .get(`/api/v1/topics/search`, { params: query })
      .then((resp) => {
        console.log(resp);
        setTopics(resp.data.data);
        console.log("Result Hits: ", resp.data.data.length);
        console.log("Search Resp: ", resp.data.data);
        setLoaded(true);
        setProgress(100);
      })
      .catch((resp) => {
        console.log(resp);
      });
  };

  // ----------------------------- Tag Filter Handlers --------------------------------------------

  const searchTagHandler = (e) => {
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
  };

  // Remove tag from filter
  const removeTagHandler = (indexToRemove) => {
    // Finding the tag that matches passed index No. and excluding it from searchTags list
    setSearchTags(searchTags.filter((c) => c !== searchTags[indexToRemove]));
    setTagFilter(true);
    setFiltering(true);
  };

  // Add tag from suggestions by click event
  const addTagByClick = (tagName, tagId) => {
    const tagInputField = document.querySelector(".tags-input");

    var filter = searchTags.filter((c) => c.name === tagName);
    console.log("matches: ", filter);

    if (filter.length === 0) {
      var tag = { id: tagId, name: tagName };
      setSearchTags([...searchTags, tag]);
      setTagFilter(true);
      setFiltering(true);
    }
    setSearchResult([]);
    tagInputField.value = "";
  };

  // ----------------------------- Category Handlers ----------------------------------------------

  const catFilterHandler = (e) => {
    e.preventDefault();

    console.log("Category Sort Mode: ", e.target.value);
    setCategoryId(e.target.value);
    setCatFilter(true);
    setFiltering(true);
  };

  // ----------------------------- Date Handlers -----------------------------------------------

  const dateFilterHandler = (e) => {
    e.preventDefault();

    console.log("Date Sort Mode: ", e.target.value);
    setDateMode(e.target.value);
    setDateFilter(true);
    setFiltering(true);
  };

  // ----------------------------- Stats Handlers ----------------------------------------------

  const statsFilterHandler = (e) => {
    e.preventDefault();

    console.log("Stats Sort Mode: ", e.target.value);
    setStatsMode(e.target.value);
    setStatsFilter(true);
    setFiltering(true);
  };

  // ----------------------------- Filter Algorithm --------------------------------------------

  // filtering === true (filtering mode)
  // always set result variable to topics first
  // a linear chain of isolated if conditions (no else if)
  // if tagFilter === true, filter result through tags
  // if dateFilter === true, filter result through date modes
  // if statsFilter === true, filter result through stats modes
  // setResults(result) in the end.
  // Add an onClick handler that resets the filter and setFiltered(false) => Shows Topics instead

  if (filtering === true) {
    console.log("Filtering...");

    // Always set result variable to topics first
    var result = topics;
    setResults(result);

    // Create an array of tag ids from the tags added to filter list (searchTags)
    let tagIds = [];
    searchTags.forEach((tag) => {
      tagIds.push(tag.id);
    });
    console.log("tagIds: ", tagIds);

    // Tag filter turned on
    if (tagFilter === true) {
      // Get Every Tagged Topic Only as searchList
      const searchList = [];
      topics.forEach((item) => {
        if (item.relationships.tags.data.length !== 0) {
          searchList.push(item);
        }
      });

      if (tagIds.length > 0) {
        var result = searchList.filter((c) =>
          c.relationships.tags.data.find((tag) => tagIds.includes(tag.id))
        );
      } else {
        setTagFilter(false);
      }

      console.log("Tags filter result: ", result);
      setResults(result);
      setFiltered(true);
    }

    // Date filter turned on
    if (dateFilter === true) {
      if (dateMode == "true") {
        // Latest
        result = result.sort((a, b) => {
          return (
            new Date(b.attributes.created_at) -
            new Date(a.attributes.created_at)
          );
        });

        setResults(result);
        setFiltered(true);
      } else if (dateMode == "false") {
        // Oldest
        result = result.sort((a, b) => {
          return (
            new Date(a.attributes.created_at) -
            new Date(b.attributes.created_at)
          );
        });

        setResults(result);
        setFiltered(true);
      } else {
        setDateFilter(false);
        setFiltered(true);
      }
    }

    // Stats filter turned on
    if (statsFilter === true) {
      if (statsMode == "true") {
        // Most Viewed
        result = result.sort((a, b) => {
          return b.attributes.views - a.attributes.views;
        });

        setResults(result);
        setFiltered(true);
      } else if (statsMode == "false") {
        // Most No. of Points
        result = result.sort((a, b) => {
          return (
            b.relationships.points.data.length -
            a.relationships.points.data.length
          );
        });

        setResults(result);
        setFiltered(true);
      }
    } else {
      setStatsFilter(false);
      setFiltered(true);
    }

    // Category filter turned on
    if (catFilter === true) {
      if (categoryId != 0) {
        console.log("Category filtering OK");
        result = result.filter((c) => c.attributes.category == categoryId);
      }
      setResults(result);
      setFiltered(true);
    } else {
      setCatFilter(false);
      setFiltered(true);
    }

    setFiltering(false);
  }

  const closeSearchHandler = (e) => {
    e.preventDefault();
    setLoaded(false);
  };

  // ----------------------------- Existing Tags List Generator --------------------------------------------

  const tagSelection = searchResult.map((item) => {
    return (
      <li
        className={`selection-search-result ${item.id}`}
        key={`result-${item.id}`}
        onClick={() => addTagByClick(item.attributes.name, item.id)}
      >
        <span>{item.attributes.name}</span>
      </li>
    );
  });

  // ----------------------------- Added Tags List Generator --------------------------------------------

  const tagList = searchTags.map((item) => {
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
          onClick={() => removeTagHandler(searchTags.indexOf(item))}
        />
      </li>
    );
  });

  // ----------------------------- Category Icons and Options --------------------------------------------

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
    "-Pick a Category-",
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

  // ----------------------------- Search Result Generator --------------------------------------------

  const topicsList = topics.map((item) => {
    return (
      <div className="search-result" key={`result-${item.id}`}>
        <FontAwesomeIcon
          icon={icons[item.attributes.category - 1]}
          className="result-icon"
        />
        {/* <p className="result title">{item.attributes.title} </p> */}
        <p className="result title">
          <Link to={`/topics/${item.id}`}>{item.attributes.title}</Link>
        </p>
        <p className="result description">{item.attributes.description}</p>
        <p className="result user">{item.attributes.user.username}</p>
        <p className="result date">
          {`Posted On: ${new Date(item.attributes.created_at).toDateString()}`}
        </p>
        <div className="associated-tags">
          <span>Tags:</span>
          {item.attributes.tags.map((tag) => {
            return <p className="topic-tag">{tag.name}</p>;
          })}
        </div>
      </div>
    );
  });

  // ----------------------------- Filter Result Generator --------------------------------------------

  const filteredList = results.map((item) => {
    return (
      <div className="search-result" key={`result-${item.id}`}>
        <FontAwesomeIcon
          icon={icons[item.attributes.category - 1]}
          className="result-icon"
        />
        {/* <p className="result title">{item.attributes.title} </p> */}
        <p className="result title">
          <Link to={`/topics/${item.id}`}>{item.attributes.title}</Link>
        </p>
        <p className="result description">{item.attributes.description}</p>
        <p className="result user">{item.attributes.user.username}</p>
        <p className="result date">
          {`Posted On: ${new Date(item.attributes.created_at).toDateString()}`}
        </p>
        <div className="associated-tags">
          <span>Tags:</span>
          {item.attributes.tags.map((tag) => {
            return <p className="topic-tag">{tag.name}</p>;
          })}
        </div>
        <div>
          <p>Views: {item.attributes.views}</p>
          <p>Points: {item.relationships.points.data.length}</p>
        </div>
      </div>
    );
  });

  // --------------------------------- Component -------------------------------------------------

  return (
    <div className="search-shell">
      <LoadingBar
        color="#f11946"
        height={5}
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
        className="load-bar"
      />

      {/* Search Bar */}
      <div className="search-section">
        <h1 className="search-title one">Clear Your Mind.</h1>
        <h1 className="search-title two">Search Succintly.</h1>
        <form className="search-form" onSubmit={submitHandler}>
          <input
            type="text"
            name="query"
            placeholder="Search Here"
            className="search-form-field"
            onChange={changeHandler}
          />
          <button type="submit" className="search-form-submit">
            Search
          </button>
        </form>
        {loaded && topics.length === 0 && (
          <h2 className="no-results">No Results</h2>
        )}
      </div>

      {/* Search Result Window */}
      {loaded && topics.length > 0 && (
        <div className="search-result-shell">
          <FontAwesomeIcon
            icon={faTimes}
            className="close-search"
            onClick={closeSearchHandler}
          />
          <div className="search-filters">
            <select onChange={catFilterHandler} className="filters category">
              {optionsList}
            </select>

            <select onChange={dateFilterHandler} className="filters date">
              <option value={null}>-Sort by Date-</option>
              <option value={true}>Latest</option>
              <option value={false}>Oldest</option>
            </select>

            <select onChange={statsFilterHandler} className="filters stats">
              <option value={null}>-Sort by Stats-</option>
              <option value={true}>Most Viewed</option>
              <option value={false}>Most Argued Over</option>
            </select>

            <div className="filters-tag-shell">
              <ul className="tagSpace">{tagList}</ul>
              <input
                type="text"
                placeholder="Search For Tags"
                className="tags-input"
                onChange={searchTagHandler}
              />
              <ul className="tag-search-result">{tagSelection}</ul>
            </div>
          </div>

          {/* Results */}
          <div className="search-results">
            {filtered ? filteredList : topicsList}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
