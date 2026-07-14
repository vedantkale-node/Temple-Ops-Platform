import "dotenv/config";
import app from "@/app";
import { env, connectDB } from "@/config";
import { logger } from "@/utils";
import { transporter } from "@/utils/nodemailer";

async function startServer() {
  await transporter.verify();
  logger.info("SMTP connection established");
  return new Promise((resolve, reject) => {
    const server = app.listen(env.PORT, resolve);
    server.on("error", reject);
  });
}

async function server() {
  try {
    await connectDB();
    await startServer();
    logger.info(`Server is on port ${env.PORT}`);
  } catch (error) {
    logger.error("Startup Failed: " + error);
    process.exit(1);
  }
}

server();
