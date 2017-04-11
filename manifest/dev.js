module.exports = {
  content_security_policy: "script-src 'self' http://localhost:3003 https://localhost:3003 'unsafe-eval'; object-src 'self'; style-src * 'unsafe-inline' 'self' blob:; img-src * 'self' http://localhost:8080 data:;"
};
