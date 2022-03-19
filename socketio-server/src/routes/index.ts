import * as express from "express";
import chatData from "../api/data/chatDataHandler";
import {log} from "../lib/logger";

const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
    res.send("Hello Boy!!");
});

router.get("/api/adapter-rooms", function (req, res, next) {
    try {
        const result = Array.from(chatData.joiningAdapterRooms).map((dict, index) => {
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

        log('Joining pool:')
        console.log(result);

        return res.send({'joiningPool': result}).end();
    } catch (e) {
        console.log(e)
    }
});

module.exports = router;
