import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const history = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/", {
        email,
        password,
      }).then(res => {
        if (res.data == "exists") {
          history('/', {state: {id: email}});
        } else if (res.data == "not exists") {
          alert("Email does not exist");
        }
      })
    } catch (error) {
      alert("Wrong details");
      console.error(error);
    }
  }
  return (
    <main>
      <h1>Login</h1>
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
      <Link to="/sign-up">SignUp</Link>
    </main>
  );
};

export default Login;
