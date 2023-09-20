const test = () => {
    return(
        <form onSubmit={formik.handleSubmit} className="form-area">
              {/* Email input */}
                <div className="account">
                  <label>Account</label>
                  <HelpIcon className="mark" />
                </div>
                <div className="formContainer">
                  <TextField
                    htmlfor="email"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon />
                        </InputAdornment>
                      ),
                    }}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    label="Username"
                    id="input-with-icon-textfield"
                    name="email"
                    className={
                      formik.errors.email && formik.touched.email
                        ? "input-error"
                        : ""
                    }
                  />
                  {formik.errors.email && formik.touched.email && (
                    <p className="error">{formik.errors.email}</p>
                  )}
                </div>
                <div className="formContainer">
                  <TextField
                    htmlfor="password"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <KeyIcon />
                        </InputAdornment>
                      ),
                    }}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="password"
                    type="password"
                    label="Password"
                    id="password"
                    className={
                      formik.errors.password && formik.touched.password
                        ? "input-error"
                        : ""
                    }
                  />
                  {formik.errors.password && formik.touched.password && (
                    <p className="error">{formik.errors.password}</p>
                  )}
                </div>
              {/* Forgot password */}
              <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
                <Stack direction="row" spacing={1}>
                  <Typography
                    varient="body1"
                    Component="span"
                    onMouseOver={MouseOver}
                    onMouseOut={MouseOut}
                    onClick={() => {
                      navigate("/reset-password");
                    }}
                   className="forgot-pwd"
                  >
                    Forgot Your Password?
                  </Typography>
                </Stack>
              </Grid>
              <Box mt={3}>
                <img src={Line} className="line" />
              </Box>
              {/* button section */}
              <Grid item xs={12} sx={{ mt: "3em", mb: "5em" }}>
                <Stack direction="row" spacing={1}>
                  {/* Remember me */}
                  <FormControlLabel
                    sx={{ width: "68%", color: "black", paddingLeft: "2rem" }}
                    onClick={() => setRemember(!remember)}
                    control={<Checkbox checked={remember} />}
                    label="Remember Me"
                  />
                  {/* SignIn button */}
                  <Button
                    type="submit"
                    varient=" contained"
                   className="btn" >
                    SignIn
                  </Button>
                </Stack>
              </Grid>
            </form>
  
    );
}