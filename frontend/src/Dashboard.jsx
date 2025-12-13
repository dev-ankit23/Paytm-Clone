import { useEffect, useState } from "react";
import axios from "axios";
import Appbar from "./components/Appbar";
import Balance from "./components/Balance";
import { Users } from "./components/Users";

export const Dashboard = () => {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/accounts/balance",
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        setBalance(response.data.balance);
      } catch (err) {
        console.error("Failed to fetch balance", err);
      }
    };

    fetchBalance();
  }, []);

  return (
    <div>
      <Appbar />
      <div className="m-8">
        {/* format here */}
        <Balance value={Number(balance).toFixed(2)} />
        <Users />
      </div>
    </div>
  );
};
