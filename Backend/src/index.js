import dotenv from "dotenv";
dotenv.config();
import { app } from "./app.js";
import connectDb from "./db/index.db.js";
import http from "http";
import { initSocket } from "./utils/socket.js";

const port = process.env.PORT || 8000;

connectDb()
	.then(() => {
		const server = http.createServer(app);
		initSocket(server, {
			cors: {
				origin: "http://localhost:5173",
				credentials: true,
			},
		});
		server.listen(port, () => {
			console.log(`🚀 App is running at http://localhost:${port}`);
		});
	})
	.catch((error) => {
		console.log("❌ DB connection failed {index.js} error:", error);
	});
