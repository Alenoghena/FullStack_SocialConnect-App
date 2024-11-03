import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { postData } from "../components/App/restAPI";
import { useNavigate } from "react-router-dom";
import { MdSend } from "react-icons/md";

const CreateComment = ({ user, post, comments, setComments }) => {
  const { id: PostId } = post;
  const { username } = user;

  const initialValues = {
    commentBody: "",
  };

  const navigate = useNavigate();

  //This simply passes the data to the database
  const onSubmit = async (data) => {
    const comment = await postData("postComment", {
      ...data,
      username,
      PostId,
    });
    setComments([...comments, comment]); //{ ...data, PostId: id }
    navigate(`/Post/${PostId}`); //use this to go Home
    // navigate(-1);//use this to go back
  };

  //This validates
  const validationSchema = Yup.object().shape({
    commentBody: Yup.string().required(),
  });

  return (
    <div className="createCommentPage">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <div className="form--comment">
          <Form className="form--comment-box">
            <label>Comment:</label>
            <ErrorMessage name="commentBody" component="span" />
            <Field
              id="inputCreateComment"
              name="commentBody"
              placeholder="Ex. comment..."
            />

            <button type="submit" className=" btn--comment">
              <MdSend />
            </button>
          </Form>
        </div>
      </Formik>
    </div>
  );
};

export default CreateComment;
