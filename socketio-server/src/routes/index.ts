import * as express from "express";
import chatData from "../api/services/roomService";
import socketLogger from "../api/services/socketLoggerService";
import roomService from "../api/services/roomService";

const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
    res.send("Hello Boy!!");
});

router.get("/api/rooms", function (req, res, next) {
    try {
        return res.send({'rooms': roomService.rooms}).end();
    } catch (e) {
        console.log(e)
    }
});

router.get("/api/adapter-rooms", function (req, res, next) {
    try {
        const result = Array.from(socketLogger.adapterRooms).map((dict, index) => {
            return {
                id: dict[0],
                sockets: Array.from(dict[1])
            }
        })

        return res.send({'adapterRooms': result}).end();
    } catch (e) {
        console.log(e)
    }
});

router.get("/api/joining-pool", function (req, res, next) {
    try {
        const result = Array.from(chatData.joiningPool);
        return res.send({'joiningPool': result}).end();
    } catch (e) {
        console.log(e)
    }
});

router.get("/api/sockets", function (req, res, next) {
    try {
        const result = Array.from(socketLogger.socketsData);
        return res.send({'connectedSockets': result}).end();
    } catch (e) {
        console.log(e)
    }
});

module.exports = router;
