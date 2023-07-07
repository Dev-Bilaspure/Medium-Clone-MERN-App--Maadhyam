import express, { Express, Request, Response } from "express";
import cors from "cors";
import { connectMongoDB } from "./config/db";
import authRouter from "./routes/authRoutes";
import userRouter from "./routes/usersRoutes";
import postRouter from "./routes/postsRoutes";
import commentRouter from "./routes/commentsRoutes";
import { Server } from "socket.io";
import http from "http";
import { createPost, getPostById, updatePost } from "./utils/socketTaskMethods";
import { configDotenv } from "dotenv";

const PORT = process.env.PORT || 8000;
const app: Express = express();
const server = http.createServer(app);
configDotenv();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectMongoDB();

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

io.on("connection", (socket) => {
  console.log("A client connected" + socket.id);
  socket.on('test', (data) => {
    console.log(data);
  })

  socket.on("createPost", async (data) => {
    const response = await createPost(data);
    socket.emit("createPostResponse", response);
  });

  socket.on("getPostById", async (data) => {
    const response = await getPostById(data);
    socket.emit("getPostByIdResponse", response);
  });

  socket.on("updatePost", async (data) => {
    const response = await updatePost(data);
    socket.emit("updatePostResponse", response);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});


app.get("/", (req: Request, res: Response) => {
  const message = `
    <div style="text-align: center;">
      <h1>Welcome to maadhyam-server-app!</h1>
      <p style="font-size: 18px;">Check out the API documentation <a href="https://github.com/Dev-Bilaspure/Blogging-App-Express-Typescript-Server">here</a>.</p>
    </div>
  `;
  res.send(message);
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})