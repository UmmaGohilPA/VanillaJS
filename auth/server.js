const http = require("http");
const fs = require("fs");
const url = require("url");
const qs = require("querystring");

//convert cookie string to object
const parseCookies = (cookie = "") =>
  cookie
    .split(";")
    .map((v) => v.split("="))
    .map(([k, ...vs]) => [k, vs.join("=")])
    .reduce((acc, [k, v]) => {
      acc[k.trim()] = decodeURIComponent(v);
      return acc;
    }, {});

const session = {};

//analyse the cookie
http
  .createServer((req, res) => {
    // cookie is located inside of req.headers.cookie
    const cookies = parseCookies(req.headers.cookie);
    if (req.url.startsWith("/login")) {
      const { query } = url.parse(req.url);
      const { name } = qs.parse(query);
      const expires = new Date();
      expires.setMinutes(expires.getMinutes() + 1);
      // instead of sending user info (user name), semd random int
      // set name and expire time within session object
      // if cookie.session doesn't exceed expiration date, get user info from ession variable
      const randomInt = +new Date();
      session[randomInt] = {
        name,
        expires,
      };
      res.writeHead(302, {
        Location: "/",
        "Set-Cookie": `session=${randomInt};Expires=${expires.toUTCString()};HttpOnly;Path=/`,
      });
      res.end();
    } else if (
      cookies.session &&
      session[cookies.session].expires > new Date()
    ) {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(`Welcome ${session[cookies.session].name}`);
    } else {
      fs.readFile("./login.html", (err, data) => {
        if (err) {
          throw err;
        }
        res.end(data);
      });
    }
  })
  .listen(8000, () => {
    console.log("listening on port 8000");
  });

/*console.log(req.url, cookies);
    // send cookie to response header (status code, header information: browser saves info)
    res.writeHead(200, { "Set-Cookie": "mycookie=test" });
    res.end("Hello Cookie");
  })
  .listen(8000, () => {
    console.log("listening on port 8000");
  });*/
