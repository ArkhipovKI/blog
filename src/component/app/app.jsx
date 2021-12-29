import React, { useEffect } from "react";
import Header from "../header/header";
import { BrowserRouter as Router, Route } from "react-router-dom";
import ArticleList from "../article-list/article-list";
import ArticleFull from "../article-full/article-full";
import SignUp from "../sign-up/sign-up";
import SignIn from "../sign-in/sign-in";
import EditProfile from "../edit-profile/edit-profile";
import CreateArticle from "../create-article/create-article";
import { useHttpRequest } from "../../hooks/http.hook";
import { usIn } from "../../store/actions";
import { useDispatch } from "react-redux";
import classes from "./app.module.scss";

function App() {
  const { getUser } = useHttpRequest();
  const dispatch = useDispatch();
  useEffect(() => {
    getUser().then((res) => {
      if (!(res instanceof Error)) {
        dispatch(usIn(res));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  
  return (
    <div className={classes["app"]}>
      <Router>
        <Header />
        <Route path="/articles" exact component={ArticleList} />
        <Route
          path="/articles/:id"
          exact
          render={({ match }) => {
            const { id } = match.params;
            return <ArticleFull slug={id} />;
          }}
        />
        <Route
          path="/articles/:id/edit"
          render={({ match }) => {
            const { id } = match.params;
            return <CreateArticle slug={id} />;
          }}
        />
        <Route path="/sign-up" component={SignUp} />
        <Route path="/sign-in" component={SignIn} />
        <Route path="/profile" component={EditProfile} />
        <Route path="/new-article" component={CreateArticle} />
      </Router>
    </div>
  );
}

export default App;
