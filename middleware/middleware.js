const checkHeaderFromRequest = (req, header, value) => {
  console.log(`\nHeader:${header}\nValue:${value}`)
  const v = req.headers[header];

  return v === value;
};

const checkAccessCookie = (req, name, value) => {
  const v = req.cookie[name];
  return v === value;
}

export function authCheck() {
  return (req, res, next) => {
    if (checkHeaderFromRequest(req, process.env.GATEWAY_INIT_HEADER_NAME, process.env.GATEWAY_INIT_HEADER_VALUE)) {
      next();
      return;
    }

    if (checkHeaderFromRequest(req, "authorization", `Bearer ${process.env.SIGNED_ACCESS_TOKEN}`)
      && checkHeaderFromRequest(req, "cookie", `${process.env.SIGNED_COOKIE_NAME}=${process.env.SIGNED_COOKIE_TOKEN}`)) {
      next();
      return;
    }

    res.status(401);
    res.json({});
    return;
  }
}