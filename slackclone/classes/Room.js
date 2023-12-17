class Room {
  constructor(roomId, roomTitle, namespaceId, privateRoom = false) {
    this.roomId = roomId;
    this.roomTitle = roomTitle;
    this.namespaceId = namespaceId;
    this.privateRoom = privateRoom;
    this.history = [];
  }

  addMsg(msg) {
    this.history.push(msg);
  }

  clearHistory() {
    this.history = [];
  }
}

module.exports = Room;
