import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { postData } from "../components/App/restAPI";

const CreateUsers = () => {
  const initialValues = {
    title: "",
    postText: "",
    username: "",
  };

  //This simply passes the data to the database
  const onSubmit = async (data) => {
    await postData("postUser", { ...data, role: "user" });
  };

  //This validates
  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).max(15).required(),
    email: Yup.string().required(),
    password: Yup.string().required(),
  });

  return (
    <div className="createUserPage">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="createForm">
          <label>Username:</label>
          <ErrorMessage name="username" component="span" />
          <Field id="inputname" name="username" placeholder="Ex. Title..." />
          <label>Email:</label>
          <ErrorMessage name="email" component="span" />
          <Field
            id="inputEmail"
            name="email"
            placeholder="Ex. Ex@gmail.com..."
          />
          <label>Password:</label>
          <ErrorMessage name="password" component="span" />
          <Field id="inputPwd" name="password" placeholder="Ex. John123..." />

          <button type="submit">Create Post</button>
        </Form>
      </Formik>
    </div>
  );
};

export default CreateUsers;
