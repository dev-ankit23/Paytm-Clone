import { useEffect, useState } from "react";
import Button from "./Button";
import axios from "axios";
import { useNavigate } from "react-router";

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/user/bulk?filter=" + filter,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        setUsers(response.data.user);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    fetchUsers();
  }, [filter]);

  return (
    <>
      <div className="font-bold mt-6 text-lg">Users</div>

      <div className="my-2">
        <input
          onChange={(e) => setFilter(e.target.value)}
          type="text"
          placeholder="Search users..."
          className="w-full px-2 py-1 border rounded border-slate-200"
        />
      </div>

      <div className="space-y-3">
        {users.map((user) => (
          <User key={user._id} user={user} navigate={navigate} />
        ))}
      </div>
    </>
  );
};

function User({ user, navigate }) {
  const token = localStorage.getItem("token");
  const loggedInUserId = token
    ? JSON.parse(atob(token.split(".")[1])).userId
    : null;

  // 🚫 Hide logged-in user
  if (user._id === loggedInUserId) return null;

  return (
    <div className="flex justify-between items-center p-3 border rounded-lg">
      <div className="flex items-center">
        <div className="rounded-full h-10 w-10 bg-slate-200 flex justify-center items-center mr-3">
          <span className="text-lg font-semibold">
            {user.username[0].toUpperCase()}
          </span>
        </div>
        <div className="text-md font-medium">{user.username}</div>
      </div>

      <Button
        onClick={() => {
          navigate("/send?id=" + user._id + "&name=" + user.username);
        }}
        label="Send Money"
      />
    </div>
  );
}
