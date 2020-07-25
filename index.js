const express = require("express");
const app = express();
const port = 5000;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { User } = require("./models/Users");
const { auth } = require("./middleware/auth");
const cookieParser = require("cookie=parser");
const config = require("./config/key");

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// application/json
app.use(bodyParser.json());
app.use(cookieParser());

mongoose
  .connect(config.mongURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected...???"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello World!???"));

app.post("/register", (req, res) => {
  const user = new User(req.body);

  // save is mongoDB's function
  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

app.post("/login", (req, res) => {
  // 요청한 이메일이 데이터베이스에 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, userInfo) => {
    if (!userInfo) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }
  });

  // 요청된 이메일이 데이터베이스에 있을시 비밀번호가 맞는지 확인
  user.comparePassword(req.body.password, (err, isMatch) => {
    if (!isMatch)
      return res.json({
        loginSuccess: false,
        message: "비밀번호가 틀렸습니다.",
      });

    // 비밀번호가 확인되면 토큰을 생성
    user.generateToken((err, user) => {
      if (err) return res.status(400).send(err);

      // 토큰을 저장한다. 어디에?? -> 쿠키에 토큰 저장
      res
        .cookie("x_auth", user.token)
        .status(200)
        .json({ loginSuccess: true, userId: user._id });
    });
  });
});

// check authentication
/**
 * path, middleware, function()
 */
app.get("api/users/auth", auth, (req, res) => {
  // 여기까지 미들웨어를 통과해 왔다는 애기는 authentication이 True라는 말.
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
