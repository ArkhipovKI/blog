import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useHttpRequest } from "../../hooks/http.hook";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import classNames from "classnames";
import classes from "./create-article.module.scss";
import { Loader } from "@consta/uikit/Loader";

const CreateArticle = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [tagState, setTagState] = useState([""]);
  const [responce, setResponce] = useState({ status: undefined, mess: null });
  let history = useHistory();
  const art = useSelector((state) => state.article);
  const { createArticle, editArticle } = useHttpRequest();

  let article = null;

  if (art && art.state) {
    article = art.state;
  }

  let defaultValues = {
    title: "",
    descr: "",
    text: "",
  };

  let tagsValues = tagState;

  if (article) {
    defaultValues = {
      title: article.title,
      descr: article.description,
      text: article.body,
    };
    tagsValues = article.tagList;
  }

  const errMess = {
    title: null,
    descr: null,
    text: null,
  };

  const formSubmit = (elem) => {
    setResponce({ status: "load", mess: null });
    if (article) {
      editArticle({
        article: {
          ...art.state,
          title: elem.title,
          description: elem.descr,
          body: elem.text,
          tagList: tagsValues,
        },
      }).then((res) => {
        if (res instanceof Error) {
          setResponce({ status: "err", mess: res.message });
        } else {
          history.push(`/articles/${res.article.slug}`);
        }
      });
    } else {
      createArticle(elem, tagsValues).then((res) => {
        if (res instanceof Error) {
          setResponce({ status: "err", mess: res.message });
        } else {
          history.push(`/articles/${res.article.slug}`);
        }
      });
    }
  };

  const delTag = (index) => {
    setTagState([
      ...tagsValues.slice(0, index),
      ...tagsValues.slice(index + 1),
    ]);
  };

  const addTag = () => {
    setTagState([...tagsValues, ""]);
  };

  const changeTag = (elem, index) => {
    tagsValues[index] = elem;
  };

  if (Object.keys(errors).length > 0) {
    if (errors.title) {
      errMess.title = errors.title.message;
    }
    if (errors.descr) {
      errMess.descr = errors.descr.message;
    }
    if (errors.text) {
      errMess.text = errors.text.message;
    }
  }

  const createTagList = (tags) => {
    return tags.map((elem, index) => (
      <div className={classes["tag"]} key={index + elem}>
        <input
          defaultValue={elem}
          type="text"
          className={classes["input-tag"]}
          placeholder="Tag"
          onChange={(e) => changeTag(e.target.value, index)}
        />
        <button
          className={classes["btn-tag-del"]}
          onClick={() => delTag(index)}
        >
          Delete
        </button>
      </div>
    ));
  };

  return (
    <div className={classes["modal"]}>
      <div className={classes["title"]}>
        {article ? "Edit article" : "Create new article"}
      </div>
      <form onSubmit={handleSubmit(formSubmit)} className={classes["form"]}>
        <label htmlFor="title">
          {" "}
          Title
          <input
            defaultValue={defaultValues.title}
            className={classNames({ [classes["error-inp"]]: errors.title })}
            type="text"
            placeholder="Title"
            {...register("title", { required: "It is necessary to fill" })}
          />
          {errMess.title && (
            <span className={classes["error-mess"]}>{errMess.title}</span>
          )}
        </label>
        <label htmlFor="descr">
          {" "}
          Short description
          <input
            defaultValue={defaultValues.descr}
            type="text"
            placeholder="Title"
            {...register("descr", { required: "It is necessary to fill" })}
          />
          {errMess.descr && (
            <span className={classes["error-mess"]}>{errMess.descr}</span>
          )}
        </label>
        <label htmlFor="text">
          {" "}
          Text
          <textarea
            defaultValue={defaultValues.text}
            className={classes["text"]}
            placeholder="Text"
            {...register("text", { required: "It is necessary to fill" })}
          />
          {errMess.text && (
            <span className={classes["error-mess"]}>{errMess.text}</span>
          )}
        </label>
        <label htmlFor="tags">
          {" "}
          Tags
          <div className={classes["tags-wrapper"]}>
            <div className={classes["tag-container"]}>
              {createTagList(tagsValues)}
            </div>
            <button className={classes["btn-tag-add"]} onClick={addTag}>
              Add tag
            </button>
          </div>
        </label>
        <button type="submit" className={classes["btn-submit"]}>
          Send
        </button>
        {responce.status === "load" && (
          <div className={classNames(classes["info"], classes["load"])}>
            <Loader />
          </div>
        )}
        {responce.status === "err" && (
          <div className={classNames(classes["info"], classes["error"])}>
            {responce.mess}
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateArticle;
