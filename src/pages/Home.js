import React, { useState, useEffect, useCallback } from "react";
import { getData } from "../components/App/restAPI/index";
import User from "./User";
import Cookies from "js-cookie";
import { MdPersonOutline } from "react-icons/md";

const API_PHOTO_URL = "https://jieavs-socialconnect.netlify.app/images/";
// const API_PHOTO_URL = "http://localhost:3004/images/";

const Home = ({
  user,
  setUser,
  isShowCreatePost,
  handleCommentsNav,
  userPhotoLink,
  // setShowFile,
}) => {
  const [posts, setPosts] = useState([]);
  const [errMsg, setErrMsg] = useState(null);

  const handlePosts = useCallback(async () => {
    try {
      const options = {
        headers: {
          authorization: `Bearer ${Cookies.get("jwt")}`,
        },
      };
      const resp = await getData("getPosts", options);

      setPosts([...resp]);
    } catch (err) {
      const message = `Home handlePost-Unauthorized! ${err.message}`;
      setErrMsg(message);
    }
  }, [setPosts, setErrMsg]);

  useEffect(() => {
    if (handlePosts) {
      handlePosts();
    }
  }, [handlePosts]);

  return (
    <div className="homeContainer">
      <h1>Welcome to Wconnect App, {user.username}</h1>
      {/* <a href="#createPost" className="home__link">
        Create A Post
      </a> */}

      {posts.map((post) => {
        return (
          <div
            key={post.id}
            data-id={post.id}
            onClick={() => handleCommentsNav(post.id, post.UserId)}
            className="homeContainer--link"
          >
            {errMsg && <p>{errMsg}</p>}
            <div className="post">
              <div className="title">
                {!userPhotoLink(post.UserId) && (
                  <span className="userIcon">
                    <MdPersonOutline />
                  </span>
                )}

                {userPhotoLink(post.UserId) && (
                  <img
                    src={`${API_PHOTO_URL}${userPhotoLink(post.UserId)}`}
                    alt="UserPix"
                    style={{ width: 60, height: 60, borderRadius: 50 }}
                    className="img-user"
                  />
                )}
                {post.title}
              </div>
              <div className="body">{post.postText}</div>
              <div className="user">{post.username}</div>
            </div>
          </div>
        );
      })}
      <User
        isShowCreatePost={isShowCreatePost}
        posts={posts}
        setPosts={setPosts}
        user={user}
        setUser={setUser}
      />
    </div>
  );
};

export default Home;
