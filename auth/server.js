const http = require("http");

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

//analyse the cookie
http
  .createServer((req, res) => {
    // cookie is located inside of req.headers.cookie
    const cookies = parseCookies(req.headers.cookie);
    console.log(req.url, cookies);
    // send cookie to response header (status code, header information: browser saves info)
    res.writeHead(200, { "Set-Cookie": "mycookie=test" });
    res.end("Hello Cookie");
  })
  .listen(8000, () => {
    console.log("listening on port 8000");
  });
