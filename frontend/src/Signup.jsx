import { BottomWarning } from "./components/buttonwrapping";
import SubHeading from "./components/subheading";
import InputBox from "./components/inputBox";
import Button from "./components/Button";
import Heading from "./components/heading";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const Signup = () => {
  const [username, SetUsername] = useState("");
  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");
  const navigate = useNavigate();

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign up"} />
          <SubHeading label={"Enter your infromation to create an account"} />
          <InputBox
            onChange={(e) => {
              SetUsername(e.target.value);
            }}
            placeholder="John"
            label={"Username"}
          />

          <InputBox
            onChange={(e) => {
              SetEmail(e.target.value);
            }}
            place
            placeholder="harkirat@gmail.com"
            label={"Email"}
          />
          <InputBox
            onChange={(e) => {
              SetPassword(e.target.value);
            }}
            placeholder="123456"
            label={"Password"}
          />
          <div className="pt-4">
            <Button
              onClick={async () => {
                const response = await axios.post(
                  "http://localhost:3000/api/v1/user/signup",
                  {
                    username,
                    email,
                    password,
                  },
                  {
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }
                );
                localStorage.setItem("token", response.data.token);
                navigate("/dashboard");
              }}
              label={"Sign up"}
            />
          </div>
          <BottomWarning
            label={"Already have an account?"}
            buttonText={"Sign in"}
            to={"/signin"}
          />
        </div>
      </div>
    </div>
  );
};
export default Signup;
