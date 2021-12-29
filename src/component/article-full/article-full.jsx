import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Loader } from "@consta/uikit/Loader";
import { useHttpRequest } from "../../hooks/http.hook";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar } from "@consta/uikit/Avatar";
import avatar from "../../img/avatar.png";
import { editArt } from "../../store/actions";
import { useDispatch } from "react-redux";
import ReactMarkdown from "react-markdown";
import classNames from "classnames";
import classes from "./article-full.module.scss";

const ArticleFull = ({ slug }) => {
  const [pageState, setPageState] = useState({
    status: "loading",
    article: null,
  });
  const [doubleDel, setDoubleDel] = useState(false);
  const user = useSelector((state) => state.user);
  const { requestArticle, delArticle, likeOn, likeOff } = useHttpRequest();
  const dispatch = useDispatch();
  let item = null;
  const { like, ilike } = classes;

  useEffect(() => {
    requestArticle(slug).then((res) => {
      if (res instanceof Error) {
        setPageState({ status: "error", article: null });
      } else {
        setPageState({ status: "ok", article: res.article });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const edit = () => {
    dispatch(editArt(pageState.article));
  };

  const clickLike = () => {
    if (user && user.state) {
      !pageState.article.favorited
        ? likeOn(slug).then((res) => {
            if (res) {
              setPageState({ status: "ok", article: res.article });
            }
          })
        : likeOff(slug).then((res) => {
            if (res) {
              setPageState({ status: "ok", article: res.article });
            }
          });
    }
  };

  switch (pageState.status) {
    case "loading":
      item = (
        <div className={classNames(classes["article"], classes["loading"])}>
          <Loader />
        </div>
      );
      break;
    case "ok":
      const {
        author,
        tagList,
        title,
        description,
        body,
        createdAt,
        favorited,
        favoritesCount,
      } = pageState.article;
      let tags = null;

      if (tagList.length !== 0) {
        let key = 0;
        tags = tagList.map((elem) => (
          <div className={classes["tag"]} key={++key}>
            {elem}
          </div>
        ));
      }

      item = (
        <div className={classes["article"]}>
          <div className={classes["title-wrapper"]}>
            <div className={classes["descr-container"]}>
              <div className={classes["title"]}>
                <div>{title}</div>
                <button
                  className={classNames(like, { [ilike]: favorited })}
                  onClick={clickLike}
                >
                  {favoritesCount}
                </button>
              </div>
              <div className={classes["tags-container"]}>{tags}</div>
              <div className={classes["descr"]}>{description}</div>
            </div>
            <div className={classes["container"]}>
              <div className={classes["author"]}>
                <div>
                  <div className={classes["name"]}>{author.username}</div>
                  <div className={classes["date"]}>
                    {format(new Date(createdAt), "MMM d, yyyy")}
                  </div>
                </div>
                {author.image ? (
                  <Avatar
                    className={classes["avatar"]}
                    url={author.image}
                    size="l"
                  />
                ) : (
                  <img
                    src={avatar}
                    alt="avatar"
                    className={classes["avatar"]}
                  />
                )}
              </div>
              {user && user.state && (
                <div className={classes["btn-container"]}>
                  <button
                    className={classes["btn-del"]}
                    onClick={() => setDoubleDel((state) => !state)}
                  >
                    Delete
                  </button>
                  {doubleDel && (
                    <div className={classNames(classes["double-del"])}>
                      <span className={classes["title-del"]}>
                        Are you sure to delete this article?
                      </span>
                      <div className={classes["no-yes"]}>
                        <button
                          className={classes["no"]}
                          onClick={() => setDoubleDel((state) => !state)}
                        >
                          No
                        </button>
                        <Link
                          className={classes["yes"]}
                          onClick={() => delArticle(slug)}
                          to={"/articles"}
                        >
                          Yes
                        </Link>
                      </div>
                    </div>
                  )}
                  <Link
                    className={classes["btn-edit"]}
                    to={`/articles/${slug}/edit`}
                  >
                    <button onClick={edit}>Edit</button>
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className={classes["body"]} markdown="1">
            <ReactMarkdown>{body}</ReactMarkdown>
          </div>
        </div>
      );
      break;
    case "error":
      item = (
        <div className={classNames(classes["article"], classes["error"])}>
          Something went wrong. Please try again later.
        </div>
      );
      break;
    default:
      item = null;
  }

  return item;
};

export default ArticleFull;
