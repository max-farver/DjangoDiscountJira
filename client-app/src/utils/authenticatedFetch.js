const authenticatedFetch = async (url, method, user, setUser, body = null) => {
  if (!user) {
    return null;
  }

  const res = await getStuff(url, method, user, setUser, body);
  if (res?.code === "token_not_valid") {
    console.log("went into second fetch");
    return await getStuff(url, method, user, setUser, body);
  }

  return res;
};

const getStuff = async (url, method, user, setUser, body) => {
  const headers = new Headers();
  if (method === "POST" || method === "PUT") {
    headers.append("Content-Type", "application/json");
  }
  if (user) {
    headers.append("Authorization", `Bearer ${user.access}`);
  }

  const fetchOptions = { method: method, headers: headers };

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  const result = fetch(url, fetchOptions)
    .then(async (res) => {
      if (res.status === 403) {
        refreshToken(user).then((data) => {
          if (data && data.access) {
            setUser((prev) => ({ ...prev, access: data.access }));
          }
          return null;
        });
      }

      if (method === "DELETE") {
        return null;
      }
      return res.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => console.log(error));

  return await result;
};

const refreshToken = (user) => {
  return fetch("https://discount-jira.herokuapp.com//auth/jwt/refresh/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refresh: user.refresh,
    }), // body data type must match "Content-Type" header
  })
    .then((res) => {
      if (res.status === 401) {
        return null;
      }

      return res.json();
    })
    .catch((error) => console.log(error));
};

export default authenticatedFetch;
