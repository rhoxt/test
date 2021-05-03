/**
 * Handles each websocket connection and allows to attach data to it
 */
class _UserManager {
    constructor () {
        this.user = new Map();
        this.lastId = Date.now();
    }

    addUser () {
        this.lastId += 1;
        const data = {
            id: this.lastId,
        };
        this.user.set(data.id, data);
        return data.id;
    }

    getProperty (id, key) {
        const data = this.user.get(id);
        return data[key];
    }

    setProperty (id, key, value) {
        const data = this.user.get(id);
        data[key] = value;
    }

    removeProperty (id, key) {
        const data = this.user.get(id);
        if (data) {
            delete data[key];
        }
    }

    removeUser (id) {
        this.user.delete(id);
    }
}

const UserManager = new _UserManager();
module.exports = {
    UserManager
};
