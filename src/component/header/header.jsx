import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Avatar } from "@consta/uikit/Avatar";
import { usOut, clearArt } from "../../store/actions";
import { useDispatch } from "react-redux";
import avatar from "../../img/avatar.png";
import classes from "./header.module.scss";

const Header = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const logOut = () => {
    localStorage.removeItem("token");
    dispatch(usOut());
  };

  return (
    <header className={classes["header"]}>
      <Link className={classes["logo"]} to={"/articles"}>
        Realworld Blog
      </Link>
      <div className={classes["btn-container"]}>
        {user && user.state ? (
          <>
            <Link
              className={classes["btn-create"]}
              to={"/new-article"}
              onClick={() => dispatch(clearArt())}
            >
              Create article
            </Link>
            <Link className={classes["user"]} to={"/profile"}>
              <div className={classes["us-name"]}>{user.state.username}</div>
              {user.state.image ? (
                <Avatar url={user.state.image} size="l" />
              ) : (
                <img src={avatar} alt="avatar" />
              )}
            </Link>
            <button className={classes["btn-out"]} onClick={logOut}>
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link className={classes["btn-in"]} to={"/sign-in"}>
              Sign in
            </Link>
            <Link className={classes["btn-up"]} to={"/sign-up"}>
              Sign up
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
