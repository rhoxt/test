import { ping } from "./socket.js";
import { Timer } from "./Timer.js";

const LOGOFF_TIMEOUT = 60 * 300; // keep websockets atleast 300 mins alive
let shouldLogoff = false;
let logoffDone = false;

const timer = new Timer(LOGOFF_TIMEOUT, doTimeout);
const eventList = ["mousemove", "click", "keydown"];

eventList.forEach((event) => {
    document.body.addEventListener(event, (evt) => {
        if (logoffDone) {
            return;
        }
        if (shouldLogoff) {
            shouldLogoff = false;
            ping();
            timer.start();
        } else {
            timer.reset();
        }
    });
});
timer.start();

function doTimeout (wasReset) {
    if (wasReset) {
        return;
    }
    timer.clear();
    shouldLogoff = true;
}

export function logoff () {
    logoffDone = true;
    console.error("Websocket connection was closed");
}

export function shouldCloseConnection () {
    return shouldLogoff;
}
