import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const history = useNavigate();

  async function submit(e) {
    e.preventDefault();
    
    try {
      await axios
        .post("http://localhost:3000/sign-up", {
          email,
          password,
        })
        .then((res) => {
          if (res.data == "exists") {
            alert("User already exists");
          } else if (res.data == "not exists") {
            history("/", { state: { id: email } });
          }
        });
    } catch (error) {
      alert("Wrong details");
      console.error(error);
    }
  }

  return (
    <main>
      <h1>SignUp</h1>
      <form action="POST">
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email..."
        />
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password..."
        />
        <input type="submit" onClick={submit} />
      </form>

      <br />
      <p>OR</p>
      <br />
      <Link to="/login">
        Login
      </Link>
    </main>
  );
};

export default SignUp;
