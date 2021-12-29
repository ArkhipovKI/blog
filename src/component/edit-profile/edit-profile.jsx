import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader } from "@consta/uikit/Loader";
import { usIn } from "../../store/actions";
import { useDispatch } from "react-redux";
import { useHttpRequest } from "../../hooks/http.hook";
import classNames from "classnames";
import classes from "./edit-profile.module.scss";

const EditProfile = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [responce, setResponce] = useState({ status: undefined, mess: null });
  const dispatch = useDispatch();
  const { editUser } = useHttpRequest();

  const errMess = {
    name: null,
    email: null,
    password: null,
  };

  let resElem = null;
  let resClass = null;

  const formSubmit = ({ avatar, email, name }) => {
    setResponce({ status: "load", mess: undefined });
    editUser({ avatar, email, name }).then((res) => {
      if (res instanceof Error) {
        setResponce({ status: "err", mess: res.message });
      } else {
        setResponce({
          status: "ok",
          mess: "Data has been changed successfully",
        });
        localStorage.setItem("token", res.user.token);
        dispatch(usIn(res));
      }
    });
  };

  if (Object.keys(errors).length > 0) {
    if (errors.name) {
      errMess.name = errors.name.message;
    }
    if (errors.email) {
      errMess.email = errors.email.message;
    }
    if (errors.password) {
      errMess.password = errors.password.message;
    }
  }

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
    <div className={classes["modal"]}>
      <div className={classes["title"]}>Edit Profile</div>
      <form onSubmit={handleSubmit(formSubmit)} className={classes["form"]}>
        <div className={classes["input-container"]}>
          <label htmlFor="name">
            {" "}
            Username
            <input
              type="text"
              placeholder="Username"
              className={classNames({ [classes["error-inp"]]: errMess.name })}
              {...register("name", {
                required: "It is necessary to fill",
                minLength: {
                  value: 3,
                  message: "Must contain from 3 to 20 characters",
                },
                maxLength: {
                  value: 20,
                  message: "Must contain from 3 to 20 characters",
                },
              })}
            />
            {errMess.name && (
              <span className={classes["error-mess"]}>{errMess.name}</span>
            )}
          </label>
          <label htmlFor="email">
            {" "}
            Email address
            <input
              type="email"
              placeholder="Email address"
              className={classNames({ [classes["error-inp"]]: errors.email })}
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
              className={classNames({
                [classes["error-inp"]]: errMess.password,
              })}
              {...register("password", {
                required: "It is necessary to fill",
                minLength: {
                  value: 6,
                  message: "Must contain from 6 to 40 characters",
                },
                maxLength: {
                  value: 40,
                  message: "Must contain from 6 to 40 characters",
                },
              })}
            />
            {errMess.password && (
              <span className={classes["error-mess"]}>{errMess.password}</span>
            )}
          </label>
          <label htmlFor="avatar">
            {" "}
            Avatar image (url)
            <input
              type="url"
              placeholder="Avatar image"
              {...register("avatar")}
            />
          </label>
        </div>
        <button type="submit" className={classes["btn-submit"]}>
          Save
        </button>
      </form>
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

export default EditProfile;
