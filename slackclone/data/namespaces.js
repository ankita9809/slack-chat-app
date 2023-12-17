const Namespace = require("../classes/Namespace");
const Room = require("../classes/Room");

const wikiNS = new Namespace(
  0,
  "Wikipedia",
  "https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/103px-Wikipedia-logo-v2.svg.png",
  "/wiki"
);

const mozNS = new Namespace(
  1,
  "Mozilla",
  "https://www.mozilla.org/media/img/logos/firefox/logo-quantum.9c5e96634f92.png",
  "/mozilla"
);

const linuxNS = new Namespace(
  2,
  "Wikipedia",
  "https://upload.wikimedia.org/wikipedia/commons/a/af/Tux.png",
  "/linux"
);

wikiNS.addRoom(new Room(0, "New Articles", 0, true));
wikiNS.addRoom(new Room(1, "Editors", 0));
wikiNS.addRoom(new Room(2, "Other", 0));

mozNS.addRoom(new Room("0", "Firefox", "1"));
mozNS.addRoom(new Room("1", "SeaMonkey", "1"));
mozNS.addRoom(new Room("2", "SpiderMonkey", "1"));
mozNS.addRoom(new Room("3", "Rust", "1"));

linuxNS.addRoom(new Room("0", "Debian", "2"));
linuxNS.addRoom(new Room("1", "Red Hat", "2"));
linuxNS.addRoom(new Room("2", "Ubuntu", "2"));
linuxNS.addRoom(new Room("3", "Mac OS", "2"));

const namesapces = [wikiNS, mozNS, linuxNS];

module.exports = namesapces;
