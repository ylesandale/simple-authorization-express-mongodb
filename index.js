import express from "express";
import mongoose from "mongoose";
import authRouter from "./routes/auth.routes.js";

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use("/auth", authRouter);

const start = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://qwerty:qwerty123@cluster0.4dyxv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    );
    app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
