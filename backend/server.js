const express = require("express");
const mongoose = require("mongoose");

const app = express();
mongoose.Promise = global.Promise;
const dbConfig = require("./config/secret");

const cookieParser = require("cookie-parser");
const cors = require("cors");
// const logger = require("morgan");

const server = require("http").createServer(app);
const io = require("socket.io").listen(server);

app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET", "POST", "DELETE", "PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
//app.use(logger("dev"));

mongoose
  .connect(dbConfig.url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log(err));

require("./socket/streams")(io);

app.use("/api/chatapp", require("./routes/authRoutes"));
app.use("/api/chatapp", require("./routes/postRoutes"));
app.use("/api/chatapp", require("./routes/userRoutes"));
app.use("/api/chatapp", require("./routes/friendsRoutes"));

server.listen(3000, () => {
  console.log("hello port no-3000");
});
