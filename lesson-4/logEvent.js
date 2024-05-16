const { format } = require("date-fns")
const {v4: uuid}  = require("uuid") 

const fs = require("fs")
const fsPromises = require("fs").promises;
const path = require("path");

const logEvent = async (message, logName) => {
    const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
    // const logItem = `${dateTime}\t${uuid}\t${message}`
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    console.log(logItem);

    try {
        if (!fs.existsSync(path.join(__dirname, "logs"))) {
            await fsPromises.mkdir(path.join(__dirname, "logs"));
        }

        await fsPromises.appendFile(
            path.join(__dirname, "logs", logName), 
            logItem, "utf8"
        );
    } catch (error) {
        console.log(error)
    }
}

module.exports = logEvent;