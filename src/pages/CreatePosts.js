import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { postData } from "../components/App/restAPI";
import { MdSend } from "react-icons/md";

const CreatePosts = ({ user, posts, setPosts }) => {
  const { id: UserId, username } = user;
  const initialValues = {
    title: "",
    postText: "",
  };

  //This simply passes the data to the database
  const onSubmit = async (data) => {
    const post = await postData("posts", { ...data, username, UserId });
    setPosts([...posts, post]); //{ ...data, UserId: id }
  };

  //This validates
  const validationSchema = Yup.object().shape({
    title: Yup.string().required(),
    postText: Yup.string().required(),
  });

  return (
    <div className="createPostPage">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <div className="createForm">
          <Form className="form--post-box">
            <div className="inputBox">
              <label>Title:</label>
              <ErrorMessage name="title" component="span" />
              <Field id="inputTitle" name="title" placeholder="Ex. Title..." />
            </div>
            <div className="inputBox">
              <label>Post:</label>
              <ErrorMessage name="postText" component="span" />
              <Field
                id="inputCreatePost"
                name="postText"
                placeholder="Ex. post..."
              />
            </div>

            <button type="submit" className="btn--post">
              <MdSend />
            </button>
          </Form>
        </div>
      </Formik>
    </div>
  );
};

export default CreatePosts;
