import { Box, Button, Card, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { loginThunk, selectUser } from "../features/userSlice";
import { useLocation } from "react-router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { isError, error } = useSelector(selectUser);
  const location = useLocation();
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginThunk({ email, password }));
  };

  useEffect(() => {
    if (location.pathname !== "/") {
      window.location.pathname = "/";
    }
  }, []);

  return (
    <div className="container">
      <Header />
      <form className="login_container" onSubmit={handleSubmit}>
        <Typography variant="h4">התחברות</Typography>
        <TextField
          id="email"
          label="אימייל"
          variant="outlined"
          sx={{ width: "250px" }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          id="password"
          label="סיסמה"
          type={"password"}
          variant="outlined"
          sx={{ width: "250px" }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{
            width: "250px",
            marginBottom: "20px",
            borderRadius: "20px",
            padding: "10px 0",
          }}
        >
          כניסה
        </Button>
      </form>
      {isError && (
        <p>
          <strong>ERORR: </strong> {error}
        </p>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          gap: "20px",
        }}
      >
        <button
          onClick={() => {
            setEmail("mariasegal@gmail.com");
            setPassword("mariasegal");
          }}
        >
          Maria
        </button>
        <button
          onClick={() => {
            setEmail("amitshinar@gmail.com");
            setPassword("amitshinar");
          }}
        >
          Amit
        </button>
        <button
          onClick={() => {
            setEmail("Shmulikshmuel@gmail.com");
            setPassword("shmulikshmuel");
          }}
        >
          Shmulik
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
