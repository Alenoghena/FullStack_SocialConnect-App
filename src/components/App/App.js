import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "../../pages/Home.js";
import CreateUsers from "../../pages/CreateUsers.js";
import Post from "../../pages/Post.js";
import Auth from "../../auth/Auth.js";
import CreateComment from "../../pages/CreateComment.js";
import { MdPersonOutline } from "react-icons/md";
import "./App.css";
import { client } from "../../api/index.js";
import {
  logOutUser,
  getData,
  postFormData,
  putFormData,
} from "./restAPI/index.js";
import Cookies from "js-cookie";
import ProfilePicture from "../../pages/ProfilePicture.js";

const API_BASE_URL = "https://jieavs-socialconnect.netlify.app";
const API_PHOTO_URL = "https://jieavs-socialconnect.netlify.app/images/";
// const API_BASE_URL = "http://localhost:3004";
// const API_PHOTO_URL = "http://localhost:3004/images/";

export const deleteData = async (path, options) => {
  const response = await client.delete(`${API_BASE_URL}/${path}`, options);
  return response.data;
};

function App() {
  const [user, setUser] = useState({});
  const [postUserId, setpostUserId] = useState(0);
  const [auth, setAuth] = useState("");
  const [isShowCreatePost, setIsshowCreatePost] = useState(false);
  const [isShowCreateComment, setIsshowCreateComment] = useState(false);
  const [isShowHome, setIsShowHome] = useState(false);
  const [isShowComment, setIsShowComment] = useState(false);
  const [isShowDelete, setIsShowDelete] = useState(false);
  const [deletepath, setDeletePath] = useState({});
  const [deleteMsg, setDeleteMsg] = useState(null);
  const [userPhoto, setUserPhoto] = useState({});
  const [userPhotos, setUserPhotos] = useState([]);

  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({});
  const [showFile, setShowFile] = useState(false);
  const [image, setImage] = useState("img__header");

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files) {
      setStatus("initial");
      setFile(e.target.files?.[0]);
    }
  };
  const handleShowFile = () => {
    const imageSize =
      image === "img__header-size" ? "img__header" : "img__header-size";
    if (showFile === false && image === "img__header") {
      setShowFile(!showFile);
      setImage(imageSize);
    } else {
      setShowFile(!showFile);
      setImage(imageSize);
    }
  };

  const handleUpload = async (file) => {
    if (file) {
      setStatus("uploading");
      const formData = new FormData();
      formData.append("file", file);

      try {
        const options = {
          headers: {
            authorization: `Bearer ${Cookies.get("jwt")}`,
          },
          id: user.id,
        };
        if (!userPhoto) {
          const result = await postFormData("postPhoto", formData, options);
          setStatus(result);
        } else {
          const result = await putFormData("putPhoto", formData, options);
          console.log(result);
          setStatus(result);
        }
      } catch (error) {
        console.error(error);
        setStatus(error);
      }
    }
  };

  const userPhotoLink = (id) =>
    userPhotos
      .map((val) => {
        let photo;
        if (val.UserId === id) {
          photo = val.profilePhoto;
        }
        return photo;
      })
      .join("");

  const handleCreatePost = () => {
    setIsshowCreateComment(false);
    setIsshowCreatePost(!isShowCreatePost);
  };

  const handleCreateComment = () => {
    setIsshowCreateComment(!isShowCreateComment);
    setIsshowCreatePost(false);
  };

  const handleCommentsNav = (id, postUserId) => {
    setpostUserId(postUserId);
    navigate(`/post/${id}`);
    setIsShowHome(false);
    setIsShowComment(true);
  };

  const handleHomeNav = () => {
    setIsShowHome(true);
    setIsShowComment(false);
    navigate("/");
  };

  const handleShowTrash = () => {
    if (isShowDelete === true) {
      setIsShowDelete(false);
    }
  };

  const handleDelete = async (path) => {
    const options = {
      headers: {
        authorization: `Bearer ${Cookies.get("jwt")}`,
      },
    };
    if (path.path.includes("deleteComment")) {
      const deleteResp = await deleteData(path.path, options);

      setDeleteMsg(deleteResp);
    } else {
      const deleteResp = deleteData(path.path, options);
      setDeleteMsg(deleteResp);
      navigate("/");
    }
  };

  const handleLogout = async () => {
    const options = {
      headers: {
        authorization: `Bearer ${Cookies.get("jwt")}`,
      },
    };

    const resp = await logOutUser(options);

    if (resp.status === 204) {
      Cookies.remove("jwt");
      setAuth("");
    }
  };

  const handleGetPhoto = async (id) => {
    try {
      const resp = await getData(`getPhoto/${+id}`);

      localStorage.setItem("photo", resp);
      setUserPhoto(resp);
    } catch (err) {
      const message = `Post profile picture-Unauthorized! ${err.message}`;
      console.log(message);
    }
  };

  const handleGetPhotos = async () => {
    try {
      const options = {
        headers: {
          authorization: `Bearer ${Cookies.get("jwt")}`,
        },
      };
      const resp = await getData("getPhotos", options);

      localStorage.setItem("photos", resp);
      setUserPhotos(resp);
    } catch (err) {
      const message = `Post profile picture-Unauthorized! ${err.message}`;
      console.log(message);
    }
  };
  console.log(user);
  useEffect(() => {
    handleGetPhoto(user.id);

    handleGetPhotos();
  }, [user, status]);

  useEffect(() => {
    setIsShowHome(true);
  }, []);

  return (
    <div
      className={auth ? "App" : "App-auth"}
      onClick={() => handleShowTrash()}
    >
      {!auth && <Auth setAuth={setAuth} />}
      {auth && (
        <>
          <header className="header">
            <button className="header__btn" onClick={handleHomeNav}>
              Home
            </button>
            {isShowHome && (
              <button
                type="button"
                onClick={handleCreatePost}
                className="header__btn"
              >
                Create A Post
              </button>
            )}
            {isShowComment && (
              <button
                type="button"
                onClick={handleCreateComment}
                className="header__btn-comment"
              >
                Create A Comment
              </button>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="header__btn"
            >
              Logout
            </button>
            <button type="button" className="header__btn">
              NewsFeed
            </button>
            <button type="button" className="header__btn">
              Politics
            </button>
            <button type="button" className="header__btn">
              Chat
            </button>
            {((isShowDelete && user.username === deletepath.name) ||
              (isShowDelete && postUserId === deletepath.UserId)) && (
              <button
                type="button"
                onClick={() => handleDelete(deletepath)}
                className="header__btn overlay"
              >
                Delete Item
              </button>
            )}
            {userPhoto && (
              <img
                src={`${API_PHOTO_URL}${userPhoto.profilePhoto}`}
                alt="UserPix"
                className={image}
                onClick={() => handleShowFile()}
              />
            )}
            {!userPhoto && (
              <div className="img-user--box" onClick={() => handleShowFile()}>
                <MdPersonOutline />
              </div>
            )}
          </header>

          <div className="main">
            <ProfilePicture
              // user={user}
              userPhoto={userPhoto}
              file={file}
              status={status}
              handleFileChange={handleFileChange}
              handleUpload={handleUpload}
              showFile={showFile}
              // setShowFile={setShowFile}
              className="profile"
            />
            <div className="routes">
              <Routes>
                {/* dashboard  */}
                <Route
                  path="/"
                  element={
                    <Home
                      user={user}
                      setUser={setUser}
                      isShowCreatePost={isShowCreatePost}
                      handleCommentsNav={handleCommentsNav}
                      userPhotoLink={userPhotoLink}
                    />
                  }
                />
                {/* <Route path="/createPost" element={<CreatePosts />} /> */}
                <Route path="/createComment" element={<CreateComment />} />
                <Route path="/createAccount" element={<CreateUsers />} />
                <Route
                  path="/Post/:id"
                  element={
                    <Post
                      user={user}
                      isShowCreateComment={isShowCreateComment}
                      setDeletePath={setDeletePath}
                      setIsShowDelete={setIsShowDelete}
                      isShowDelete={isShowDelete}
                      deleteMsg={deleteMsg}
                      userPhoto={userPhoto}
                      userPhotoLink={userPhotoLink}
                    />
                  }
                />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
