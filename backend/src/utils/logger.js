import fs from "fs";
import moment from "moment";
import path from "path";
import { fileURLToPath } from "url";
import * as winston from "winston";
import "winston-daily-rotate-file";
import { APP_CONFIG } from "../configs/index.js";

const format = winston.format.combine(
	winston.format.timestamp(),
	winston.format.ms(),
	winston.format.printf(({ level, timestamp, ms, message }) => {
		const timestampString = moment(timestamp).toLocaleString();
		return `[${timestampString}] : [${level}] : ${message} ${ms}`;
	}),
);

const logTransports = [];

if (APP_CONFIG.logDriver === "file") {
	const logDirectory = path.join(fileURLToPath(new URL(".", import.meta.url)), "../../logs");
	fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

	const FileTransport = new winston.transports.DailyRotateFile({
		filename: "log-%DATE%",
		extension: ".log",
		dirname: logDirectory,
		datePattern: "YYYY-MM-DD",
		maxSize: "20m",
		maxFiles: "30d",
	});
	logTransports.push(FileTransport);
}

if (APP_CONFIG.logDriver === "console") {
	const ConsoleTransport = new winston.transports.Console();
	logTransports.push(ConsoleTransport);
}

export const Logger = winston.createLogger({
	transports: logTransports,
	format,
	level: APP_CONFIG.logLevel,
});


// create a rotating write stream
export class AccessLogStream {
	write(message) {
		Logger.info(message);
	}
}
