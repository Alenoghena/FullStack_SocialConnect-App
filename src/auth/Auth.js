import React, { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { postData } from "../components/App/restAPI";
import "./Auth.css";

function Auth({ setAuth }) {
  const [isNewUser, setIsNewUser] = useState(false);
  const [authButtonText, setAuthButtonText] = useState("Sign In");
  const [createStatus, setCreateStatus] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();
  let initialValues = isNewUser
    ? {
        username: "",
        email: "",
        password: "",
      }
    : {
        email: "",
        password: "",
      };

  //This simply passes the data to the database, Register or login User
  const onSubmit = async (data) => {
    try {
      if (isNewUser) {
        const { success } = await postData("createUser", data);

        if (success) {
          setCreateStatus(success);
        }
      } else {
        const user = await postData("auth", data);

        setAuth(user.accessToken);
        // sessionStorage.setItem("jwt", user.accessToken);
        Cookies.set("jwt", user.accessToken, {
          expires: 7,
          secure: true,
        });
        navigate("/");
      }
    } catch (err) {
      setErrMsg(err.message);
    }
  };
  //This validates
  let validationSchema = isNewUser
    ? Yup.object().shape({
        username: Yup.string().min(3).max(15).required(),
        email: Yup.string().required(),
        password: Yup.string().required(),
      })
    : Yup.object().shape({
        email: Yup.string().required(),
        password: Yup.string().required(),
      });

  const toggleForm = () => {
    if (authButtonText === "Sign In") {
      setIsNewUser(true);
      setAuthButtonText("Sign Up");
    } else {
      setIsNewUser(false);
      setAuthButtonText("Sign In");
    }
  };
  return (
    <div className="boxAuth">
      {createStatus && <p>{createStatus}</p>}
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="boxAuthContainer">
          <p className="boxlabel">Wconnect</p>

          <div className="inputAuthContainer">
            {isNewUser && (
              <>
                <label>Username:</label>
                <ErrorMessage name="username" component="span" />
                <Field
                  id="username"
                  name="username"
                  placeholder="Ex. Username..."
                />
              </>
            )}

            <label>Email:</label>
            <ErrorMessage name="email" component="span" />
            <Field id="email" name="email" placeholder="Ex. Ex@gmail.com..." />
            <label>Password:</label>
            <ErrorMessage name="password" component="span" />
            <Field
              id="password"
              type="password"
              name="password"
              placeholder="Ex. John123..."
            />

            <button type="submit" className="btnAuth">
              {authButtonText}
            </button>
          </div>

          {!isNewUser && (
            <div className="messageAuth">
              New to Wconnect App?
              <span className="linkAuth" onClick={toggleForm}>
                Click to Sign Up
              </span>
            </div>
          )}
          {isNewUser && (
            <div className="messageAuth">
              Already on Wconnect App?
              <span className="linkAuth" onClick={toggleForm}>
                Click to Sign In
              </span>
            </div>
          )}
        </Form>
      </Formik>
      {errMsg && <p className="error">{errMsg}</p>}
    </div>
  );
}
export default Auth;
