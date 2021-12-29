import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useHttpRequest } from "../../hooks/http.hook";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Loader } from "@consta/uikit/Loader";
import { Avatar } from "@consta/uikit/Avatar";
import avatar from "../../img/avatar.png";
import classNames from "classnames";
import classes from "./article-summary.module.scss";

const ArticleSummary = ({
  author,
  description,
  createdAt,
  slug,
  tagList,
  title,
  status,
  favorited,
  favoritesCount,
}) => {
  const [likes, setILikes] = useState({
    iLike: favorited,
    count: favoritesCount,
  });
  const user = useSelector((state) => state.user);
  const { likeOn, likeOff } = useHttpRequest();
  const { like, ilike } = classes;
  let tags = null;
  let item = null;

  const clickLike = () => {
    if (user && user.state) {
      !likes.iLike
        ? likeOn(slug).then((res) => {
            if (res) {
              setILikes((likes) => {
                return { iLike: !likes.iLike, count: likes.count + 1 };
              });
            }
          })
        : likeOff(slug).then((res) => {
            if (res) {
              setILikes((likes) => {
                return { iLike: !likes.iLike, count: likes.count - 1 };
              });
            }
          });
    }
  };

  switch (status) {
    case "loading":
      item = (
        <div className={`${classes["article"]} ${classes["loading"]}`}>
          <Loader />
        </div>
      );
      break;
    case "ok":
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
          <div className={classes["wrapper"]}>
            <div className={classes["descr-container"]}>
              <div className={classes["title-link"]}>
                <Link to={`/articles/${slug}`}>{title}</Link>
                <button
                  className={classNames(like, { [ilike]: likes.iLike })}
                  onClick={clickLike}
                >
                  {likes.count}
                </button>
              </div>
              <div className={classes["tags-container"]}>{tags}</div>
              <div className={classes["summary"]}>{description}</div>
            </div>
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
                <img src={avatar} alt="avatar" className={classes["avatar"]} />
              )}
            </div>
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

export default ArticleSummary;
