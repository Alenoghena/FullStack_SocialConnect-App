import React, { useCallback, useEffect, useState } from "react";
import { FaRegThumbsUp } from "react-icons/fa";
import { MdPersonOutline } from "react-icons/md";
import CreateComment from "./CreateComment";
import { useParams } from "react-router-dom";
import { getData, postData, putData } from "../components/App/restAPI";
import Cookies from "js-cookie";
const API_PHOTO_URL = "http://localhost:3004/images/";
const Post = ({
  user,
  isShowCreateComment,
  setDeletePath,
  isShowDelete,
  setIsShowDelete,
  deleteMsg,
  userPhotoLink,
}) => {
  const [post, setPost] = useState({});
  const [errMsg, setErrMsg] = useState(null);
  const [comments, setComments] = useState([]);
  const [postComments, setPostComments] = useState([]);
  const [likePost, setLikePost] = useState([]);
  const [likeResp, setLikeResp] = useState({});
  const [isthumbUp, setIsThumbUp] = useState(false);
  const { username, title, postText } = post;

  const { id } = useParams();

  const foundColor = (post, user) =>
    likePost.find(
      (like) =>
        like.PostId === post && like.UserId === user && like.likeStatus === true
    );

  const count = (data) => {
    const count = data.reduce(
      (count, item) => (item.likeStatus ? ++count : count),
      0
    );
    return count;
  };

  const foundLike = (postId, userId) =>
    likePost.reduce(
      (count, like) =>
        like.PostId === postId && like.UserId === userId ? ++count : count,
      0
    );

  console.log(id, user.id, foundLike(id, user.id));
  console.log(likePost);

  const handlePost = useCallback(async () => {
    try {
      const options = {
        headers: {
          authorization: `Bearer ${Cookies.get("jwt")}`,
        },
      };
      const resp = await getData(`getPost/${+id}`, options);

      setPost(resp);
    } catch (err) {
      const message = `Post handlePost-Unauthorized! ${err.message}`;
      setErrMsg(message);
    }
  }, [setPost, setErrMsg, id]);

  const handleLikes = async (id) => {
    const options = {
      headers: {
        authorization: `Bearer ${Cookies.get("jwt")}`,
      },
      PostId: id,
      likeStatus: !likeResp.likeStatus,
    };

    if (
      likeResp.likeStatus &&
      // post.UserId !== user.id &&
      foundLike(id, user.id) > 0
    ) {
      console.log(foundLike(id, user.id));
      const resp = await putData("putLike", options);

      setLikeResp(resp);
      localStorage.setItem("resp", JSON.stringify(resp));
      localStorage.setItem("thumbup", JSON.stringify(!isthumbUp));
      setIsThumbUp(!isthumbUp);
    } else if (
      !likeResp.likeStatus &&
      // post.UserId !== user.id &&
      foundLike(id, user.id) > 0
    ) {
      const resp = await putData("putLike", options);

      setLikeResp(resp);

      setIsThumbUp(!isthumbUp);
    } else if (foundLike(id, user.id) === 0) {
      console.log(foundLike(id, user.id));
      const resp = await postData("createNewLike", options);
      setLikeResp(resp);

      setIsThumbUp(!isthumbUp);
    }
  };

  const handleComments = async (ID) => {
    try {
      const resps = await getData(`getPostComments/${+ID}`);

      setPostComments([...resps]);
    } catch (err) {
      const message = `Post handleComments-Unauthorized! ${err.message}`;
      setErrMsg(message);
    }
  };

  const handleGetLikes = async (ID) => {
    try {
      const resps = await getData(`getPostLikes/${+ID}`);

      setLikePost(resps);
    } catch (err) {
      const message = `Post handleLikes-Unauthorized! ${err.message}`;
      setErrMsg(message);
    }
  };

  useEffect(() => {
    handlePost();
  }, [handlePost]);

  useEffect(() => {
    if (comments) {
      handleComments(post.id);
    }
    if (likeResp) {
      handleGetLikes(post.id);
    }
  }, [post, comments, deleteMsg, likeResp]);

  return (
    <div className="mainContainer">
      {errMsg && <p>{errMsg}</p>}
      <main className="mainPost">
        <section
          className="post post--comment"
          data-id={id}
          onClick={() => setIsShowDelete(!isShowDelete)}
        >
          <div className="titleBox">
            <div className="userIconBox">
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
              <span className="user">{username}</span>
            </div>
            <span className="titleBox--title">{title}</span>
          </div>
          <div
            className="body"
            onClick={() =>
              setDeletePath({
                path: `deletePost/${+id}`,
                UserId: user.id,
              })
            }
          >
            {postText}
          </div>
          <div className="userBox">
            <div className="likeBox">
              <FaRegThumbsUp
                onClick={() => handleLikes(+id)}
                role="button"
                className={
                  foundColor(parseInt(id), user.id) ? "thumbColor" : "white"
                }
              />

              <span className="likeCount"> {count(likePost)}</span>
            </div>
          </div>
        </section>

        <section className="comments">
          <h1>Comment Section</h1>
          {postComments.map((comment) => {
            const commentId = comment.id;
            const name = comment.username;
            return (
              <div
                key={comment.id}
                data-id={comment.id}
                className="commentContainer"
                onClick={() => setIsShowDelete(!isShowDelete)}
              >
                <div
                  className=" commentBody"
                  onClick={() =>
                    setDeletePath({
                      path: `deleteComment/${commentId}`,
                      name,
                      id,
                    })
                  }
                >
                  {comment.commentBody}
                </div>
                <div className="commentUser">{comment.username}</div>
              </div>
            );
          })}
        </section>
        {isShowCreateComment && (
          <CreateComment
            user={user}
            post={post}
            comments={comments}
            setComments={setComments}
          />
        )}
      </main>
    </div>
  );
};

export default Post;
