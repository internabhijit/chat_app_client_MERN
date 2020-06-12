import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import "whatwg-fetch";

import "./Users.css";
import User from "../User/User";
import { getFromStorage } from "../../utils/storage";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [logInUser, setlogInUser] = useState("");

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: getFromStorage("the_main_app"),
      },
    };

    fetch("http://localhost:3001/users", requestOptions)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setlogInUser(json.logInUser);

          setUsers(json.data);
          setIsLoading(false);
        } else if (!json.success && !json.loggedIn) {
          alert(json.message);
        } else {
          alert(json.message);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>All register users</h1>
      {isLoading && <p>Please wait...</p>}
      <ScrollToBottom>
        <h1>Welcome user {logInUser.userId}</h1>
        <div className="wrapper">
          {users.map((user, i) => (
            <div key={i}>
              <User
                logInUserId={logInUser.userId}
                logInUserName={logInUser.name}
                userId={user.userId}
                name={user.name}
              />
            </div>
          ))}
        </div>
      </ScrollToBottom>
    </div>
  );
};

export default Users;
