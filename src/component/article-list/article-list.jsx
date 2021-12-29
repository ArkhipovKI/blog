import React from "react";
import { useState, useEffect } from "react";
import { useHttpRequest } from "../../hooks/http.hook";
import { Pagination } from "@consta/uikit/Pagination";
import ArticleSummary from "../article-summary/article-summary";

import classes from "./article-list.module.scss";

const ArticleList = () => {
  const { requestArticles } = useHttpRequest();
  const [listState, setListState] = useState({
    articles: null,
    articlesCount: null,
    page: null,
    status: null,
  });
  let items = null;
  let pagination = null;
  let mess = null;

  useEffect(() => {
    setListState({ articles: null, articlesCount: null, status: "loading" });
    requestArticles(0).then((res) => {
      if (res instanceof Error) {
        setListState({
          status: "error",
          article: null,
          articlesCount: null,
          page: null,
        });
      } else {
        setListState({
          articles: res.articles,
          articlesCount: res.articlesCount,
          page: 0,
          status: "ok",
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goPage = (page) => {
    setListState({ articles: null, articlesCount: null, status: "loading" });
    requestArticles(page).then((res) => {
      if (res instanceof Error) {
        setListState({
          status: "error",
          article: null,
          articlesCount: null,
          page: null,
        });
      } else {
        setListState({
          articles: res.articles,
          articlesCount: res.articlesCount,
          page: page++,
          status: "ok",
        });
      }
    });
  };

  if (listState.articlesCount > 5) {
    pagination = (
      <Pagination
        className={classes["pag"]}
        onChange={goPage}
        size="l"
        minified
        totalPages={Math.ceil(listState.articlesCount / 6)}
        currentPage={listState.page}
      />
    );
  }

  if (listState.status !== "ok") {
    mess = <ArticleSummary status={listState.status} />;
  } else if (listState.articles) {
    items = listState.articles.map((elem) => (
      <ArticleSummary
        status={listState.status}
        {...elem}
        key={`${elem.author.username}${elem.createdAt}`}
      />
    ));
  }

  return (
    <main className={classes["main"]}>
      {items}
      {mess}
      {pagination}
    </main>
  );
};

export default ArticleList;
