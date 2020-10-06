const EventEmitter = require("events");
const emitter = new EventEmitter();

class Log extends EventEmitter {
    log(message) {
        console.log(message);
        this.emit('logMessage', {name: 'achin', place:'delhi'});
    }
}
module.exports = Log; 