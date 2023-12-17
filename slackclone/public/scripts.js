// const userName = prompt("what is your username");
// const password = prompt("what is your password");

const userName = "Ankita";
const password = "x";

const clientOptions = {
  query: {
    userName,
    password,
  },
  auth: {
    userName,
    password,
  },
};

//always join the main ns, because that's where the client gets the other namespaces from
const socket = io("http://localhost:9000", clientOptions);
// const socket2 = io("http://localhost:9000/wiki");
// const socket3 = io("http://localhost:9000/mozilla");
// const socket4 = io("http://localhost:9000/linux");

//sockets will be put into this array, in the index of their ns.id
const nameSpaceSockets = [];
const listeners = {
  nsChange: [],
  messageToRoom: [],
};

//a global variable we can update when a user clicks on a namespace
//we will use it too braodcast across the app ()
let selectedNsId = 0;

//add a submit handler for our team
document.querySelector("#message-form").addEventListener("submit", (e) => {
  //keep the browser from submitting
  e.preventDefault();
  //grab the value from the input box
  const newMessage = document.querySelector("#user-message").value;
  console.log(newMessage, selectedNsId);
  nameSpaceSockets[selectedNsId].emit("newMessageToRoom", {
    newMessage,
    date: Date.now(),
    avatar: "https://via.placeholder.com/30",
    userName,
    selectedNsId,
  });
  document.querySelector("#user-message").value = "";
});

//addListerns job is to manage all listeners added to namespaces.
//this prevents listereners being added multiple times and makes life
//better for us as developers.
const addListener = (nsId) => {
  if (!listeners.nsChange[nsId]) {
    //listener
    nameSpaceSockets[nsId].on("nsChange", (data) => {
      console.log("Namespace changed!");
      console.log(data);
    });
    listeners.nsChange[nsId] = true;
  }
  if (!listeners.messageToRoom[nsId]) {
    //add the nsId listeners to this namespaces!
    nameSpaceSockets[nsId].on("messageToRoom", (messageObj) => {
      console.log(messageObj);
      document.querySelector("#messages").innerHTML +=
        buildMessageHtml(messageObj);
    });
    listeners.messageToRoom[nsId] = true;
  }
};

socket.on("connect", () => {
  console.log("Connected");
  socket.emit("clientConnect");
});

//Listen for the nsList event from the server which gives us the namesapces
socket.on("nsList", (nsData) => {
  const lastNs = localStorage.getItem("lastNs");

  console.log(nsData);
  const nameSpacesDiv = document.querySelector(".namespaces");
  nameSpacesDiv.innerHTML = "";

  nsData.forEach((ns) => {
    //update the HTML with each NS
    nameSpacesDiv.innerHTML += `<div class="namespace" ns="${ns.endpoint}"><img
    src="${ns.image}">
</div>`;

    //initialize thisNs as its index in nameSpaceSockets
    //if the connection is new, this will be null
    //if the connection has already been established, it will reconnect and remain in its spot

    // let thisNs = ;
    if (!nameSpaceSockets[ns.id]) {
      //there is no socket at this ns.id. So make a new connection
      //join this ns with io
      nameSpaceSockets[ns.id] = io(`http://localhost:9000${ns.endpoint}`); //dynamically fetching the ns with the endpoints mentioned in ns
    }

    addListener(ns.id);
  });

  Array.from(document.getElementsByClassName("namespace")).forEach((ele) => {
    ele.addEventListener("click", (e) => {
      console.log(ele);
      joinNs(ele, nsData);
    });
  });

  //is lastNs is set, grab that ele instead of 0
  joinNs(document.getElementsByClassName("namespace")[0], nsData);
});
