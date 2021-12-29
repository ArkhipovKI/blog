import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Loader } from "@consta/uikit/Loader";
import { useHttpRequest } from "../../hooks/http.hook";
import { usIn } from "../../store/actions";
import { useDispatch } from "react-redux";
import classNames from "classnames";
import classes from "./sign-in.module.scss";

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [responce, setResponce] = useState({ status: undefined, mess: null });
  const { logInUser } = useHttpRequest();
  const dispatch = useDispatch();

  const errMess = {
    email: null,
    password: null,
  };

  const formSubmit = (elem) => {
    setResponce({ status: "load", mess: undefined });
    logInUser(elem).then((res) => {
      if (res instanceof Error) {
        setResponce({ status: "err", mess: res.message });
      } else {
        setResponce({ status: "ok", mess: "login successful" });
        localStorage.setItem("token", res.user.token);
        dispatch(usIn(res));
      }
    });
  };

  if (Object.keys(errors).length > 0) {
    if (errors.email) {
      errMess.email = errors.email.message;
    }
    if (errors.password) {
      errMess.password = errors.password.message;
    }
  }

  let resElem = null;
  let resClass = null;

  switch (responce.status) {
    case "load":
      resElem = <Loader />;
      resClass = "load";
      break;
    case "err":
      resElem = <div>{responce.mess}</div>;
      resClass = "error";
      break;
    case "ok":
      resElem = <div>{responce.mess}</div>;
      resClass = "ok";
      break;
    default:
      break;
  }

  return (
    <div className={classes["container"]}>
      <div className={classes["title"]}>Sign in</div>
      <form onSubmit={handleSubmit(formSubmit)} className={classes["form"]}>
        <div className={classes["input-container"]}>
          <label htmlFor="email">
            {" "}
            Email address
            <input
              className={classNames({ [classes["error-inp"]]: errors.email })}
              type="email"
              placeholder="Email address"
              {...register("email", {
                required: "It is necessary to fill",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Entered value does not match email format",
                },
              })}
            />
            {errMess.email && (
              <span className={classes["error-mess"]}>{errMess.email}</span>
            )}
          </label>
          <label htmlFor="password">
            {" "}
            Password
            <input
              type="password"
              placeholder="Password"
              {...register("password", { required: "It is necessary to fill" })}
            />
            {errMess.password && (
              <span className={classes["error-mess"]}>{errMess.password}</span>
            )}
          </label>
        </div>
        <button type="submit" className={classes["btn-submit"]}>
          Login
        </button>
      </form>
      <div className={classes["footer"]}>
        Don’t have an account?
        <Link className={classes["link-up"]} to={"/sign-up"}>
          {" "}
          Sign Up
        </Link>
      </div>
      {responce.status && (
        <div
          className={classNames(classes["responce"], classes[`${resClass}`])}
        >
          {resElem}
        </div>
      )}
    </div>
  );
};

export default SignIn;
