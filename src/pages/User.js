import React, { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { getData } from "../components/App/restAPI";
import CreatePosts from "./CreatePosts";

const User = ({ setUser, user, posts, setPosts, isShowCreatePost }) => {
  const [errMsg, setErrMsg] = useState(null);

  const handleUsers = useCallback(async () => {
    try {
      const options = {
        headers: {
          authorization: `Bearer ${Cookies.get("jwt")}`,
        },
      };

      const resp = await getData("getUser", options);
      console.log(resp);
      setUser(resp);
    } catch (err) {
      const message = `User handleUsers-Unauthorized! ${err.message}`;
      setErrMsg(message);
    }
  }, [setUser]);

  useEffect(() => {
    handleUsers();
  }, [handleUsers]);

  return (
    <main>
      {errMsg && <p>{errMsg}</p>}
      {isShowCreatePost && (
        <CreatePosts user={user} posts={posts} setPosts={setPosts} />
      )}
    </main>
  );
};

export default User;
