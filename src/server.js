const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

// load env vars
dotenv.config({ path: "src/config/config.env" });

const connectDB = require("./config/db");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");

// connect to database
connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

const PORT = process.env.PORT || 8080;
const NODE_ENV = process.env.NODE_ENV || "development";
const server = app.listen(PORT, () => {
    console.log(
        "🚀----------- Server running in",
        NODE_ENV,
        "mode on port",
        PORT,
        "-----------🚀"
    );
});

process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});
