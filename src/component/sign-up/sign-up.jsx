import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Loader } from "@consta/uikit/Loader";
import { useHttpRequest } from "../../hooks/http.hook";
import { usIn } from "../../store/actions";
import { useDispatch } from "react-redux";
import classNames from "classnames";
import classes from "./sign-up.module.scss";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [password, setPass] = useState(null);
  const [repPass, setRepPass] = useState(true);
  const [checkbox, setCheck] = useState({ check: false, mess: null });
  const [responce, setResponce] = useState({ status: undefined, mess: null });
  const { registerUser } = useHttpRequest();
  const dispatch = useDispatch();

  const errMess = {
    name: null,
    email: null,
    password: null,
  };

  let resElem = null;
  let resClass = null;

  const checked = () => {
    setCheck((state) => {
      return { ...state, check: !state.check };
    });
  };

  const formSubmit = ({ email, name, password }) => {
    if (checkbox.check) {
      setResponce({ status: "load", mess: undefined });
      registerUser({ email, username: name, password }).then((res) => {
        if (res instanceof Error) {
          setResponce({ status: "err", mess: res.message });
        } else {
          setResponce({
            status: "ok",
            mess: "registration completed successfull",
          });
          localStorage.setItem("token", res.user.token);
          dispatch(usIn(res));
        }
      });
    } else {
      setCheck({
        check: checkbox.check,
        mess: <span className={classes["error-mess"]}>Please check it</span>,
      });
    }
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
      <div className={classes["title"]}>Create new account</div>
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
                onChange: (e) => setPass(e.target.value),
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
          <label htmlFor="rep-password">
            {" "}
            Repeat Password
            <input
              type="password"
              placeholder="Repeat Password"
              className={classNames({ [classes["error-inp"]]: !repPass })}
              {...register("repPassword", {
                validate: (v) => {
                  if (v !== password) {
                    setRepPass(false);
                  } else {
                    setRepPass(true);
                  }
                  return v === password;
                },
              })}
            />
            {!repPass && (
              <span className={classes["error-mess"]}>Password mismatch</span>
            )}
          </label>
        </div>
        <div className={classes["divider"]}></div>
        <label className={classes["custom-checkbox"]}>
          <input
            className={classes["checkbox__input"]}
            type="checkbox"
            onChange={checked}
            checked={checkbox.check}
          />
          <span className={classes["check__box"]}>
            I agree to the processing of my personal <br />
            information <br />
            {!checkbox.check && checkbox.mess}
          </span>
        </label>
        <button type="submit" className={classes["btn-submit"]}>
          Create
        </button>
      </form>
      <div className={classes["footer"]}>
        Already have an account?
        <Link className={classes["link-in"]} to={"/sign-in"}>
          Sign in
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

export default SignUp;
