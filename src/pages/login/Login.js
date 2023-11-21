import React, { useState, useEffect } from "react";

import { signInWithEmailAndPassword } from "firebase/auth";

import { auth, getUserIdByEmail } from "../../utils/constants/Firebase";

import { Col, Row, Typography, Input } from "antd";

import { Checkbox } from "antd";

import {

  QuestionCircleFilled, UserOutlined, KeyOutlined

} from "@ant-design/icons";

import Button from "@mui/material/Button";

import { useFormik } from "formik";

import { useNavigate } from "react-router-dom";

import "./Login.css";

import Line from "../../assets/images/Line 7.png";

import { LoginSchema } from "../../Schema/LoginSchema";

import { useUserContext } from '../../contexts/SearchContext';

function MouseOver(event) {

  event.target.style.color = "black";

}



function MouseOut(event) {

  event.target.style.color = "#4743E0";

}



const Login = () => {

  const navigate = useNavigate();

  const [errMsg, setErrMsg] = useState("");

  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);



  const onChange = () => {

    console.log("checked");

  }



  // Use the useUserContext hook to access the updateUser function

  const { updateUser } = useUserContext();



  const { values, errors, handleBlur, touched, handleChange, handleSubmit } =

    useFormik({

      initialValues: {

        email: '',

        password: "",

      },

      validationSchema: LoginSchema,

      onSubmit: async (values) => {



        if (!values.email || !values.password) {

          setErrMsg("Fill all fields");

        }



        setErrMsg("");

        setSubmitButtonDisabled(true);



        try {

          const res = await signInWithEmailAndPassword(auth, values.email, values.password);

          setSubmitButtonDisabled(false);



          const userId = await getUserIdByEmail(values.email);


          if (userId) {

            navigate(`/dashboard/project/${userId}`);

            // Update the user data in the context

            updateUser({

              displayName: res.user.displayName,

              email: res.user.email,

              photoURL: res.user.photoURL,

              // Add any other user-related data you need

            });



          } else {

            setErrMsg("User not found.");

          }



          console.log(res);

        } catch (err) {

          console.error("Firebase authentication error:", err);

          setSubmitButtonDisabled(false);

          setErrMsg(err.message);

        }

      },

    });

  useEffect(() => {

    // Check if the userLoggedIn flag is set in local storage

    const userLoggedIn = localStorage.getItem('userLoggedIn');



    if (userLoggedIn === 'true') {

      // User has logged in again, redirect to an error page

      navigate('/error'); // Update the route as needed.

    } else {

      // Proceed with the normal login flow

      // ... (your existing login logic)

    }

  }, [navigate]);
  useEffect(() => {
    const userLoggedIn = localStorage.getItem('userLoggedIn');

    if (userLoggedIn === 'true') {
      navigate('/'); // Redirect to the dashboard.
    } else {
      // Session has expired, show the error page.
      setSessionExpired(true);
    }
  }, [navigate]);


  return (
    <>

      <div className="login-boxStyle">

        <div className="column1">

          <div className="login-heading">

            <h1>Login</h1>

            <p>

              Please input your information in the fields below to enter your journey platform.

            </p>

          </div>


          <img src={Line} alt="line" className="line" />


          <form onSubmit={handleSubmit} className="form-area">

            <div className="inputs">

              <div className="account">

                <label>Account</label>

                <QuestionCircleFilled className="mark" />

              </div>

              {/* Email input */}

              <div className="formContainer">

                <Input

                  htmlFor="email"

                  type="email"

                  name="email"

                  value={values.email}

                  id="email"

                  onChange={handleChange}

                  onBlur={handleBlur}

                  placeholder="Email Address"

                  className={errors.email && touched.email ? "input-error login-input" : "login-input"}

                  size="large"

                  prefix={<UserOutlined />}

                />

                {errors.email && touched.email && (

                  <p className="error">{errors.email}</p>

                )}

              </div>

              {/* password */}

              <div className="formContainer">

                <Input

                  htmlFor="password"

                  type="password"

                  name="password"

                  id="password"

                  value={values.password}

                  onChange={handleChange}

                  onBlur={handleBlur}

                  placeholder="Password"

                  className={

                    errors.password && touched.password ? "input-error login-input" : "login-input"

                  }

                  size="large"

                  prefix={<KeyOutlined />}
                  autoComplete="current-password"
                />

                {errors.password && touched.password && (

                  <p className="error">{errors.password}</p>

                )}

              </div>



              {/* Forgot password */}



            </div>
            <div className="nav-area">

              <Typography

                level={4}

                onMouseOver={MouseOver}

                onMouseOut={MouseOut}

                onClick={() => {

                  navigate("/forget-password");

                }}

                className="forgot-pwd"

              >

                Forgot Your password?

              </Typography>

            </div>

            <img src={Line} alt="line" className="line" />




            <div className="login-flex">

              <p className="error">{errMsg}</p>

            </div>

            {/* signin button */}

            <div className="btn-area">

              {/* remember me */}

              <div className="checked">

                <Checkbox onChange={onChange}>Remember Me</Checkbox>

              </div>

              {/* signin button  */}

              <div className="button-log">

                <Button

                  type="submit"

                  disabled={submitButtonDisabled}

                  variant="contained"

                  className="log-btn"

                  sx={{ mt: 3, mb: 2 }}

                >

                  Login

                </Button>

              </div>

            </div>

          </form>



          <div className="footer-area">

            <Typography

              varient="body1"

              component="span"

              align="center"

              style={{ marginTop: "10px" }}

            >

              Don't have an account yet?

            </Typography>

            <Typography

              style={{

                color: "#4743E0",

                cursor: "pointer",

              }}

              align="center"

              onMouseOver={MouseOver}

              onMouseOut={MouseOut}

              onClick={() => {

                navigate("/register");

              }}

            >

              Register Here

            </Typography>

          </div>

        </div>

        {/* column2 */}
        {/* md={14} lg={16} xl={16} */}
        <div className="column2">

        </div>

      </div>
    </>
  );

};



export default Login;