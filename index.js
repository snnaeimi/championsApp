import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import * as db from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://champion-4dfaf-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = db.getDatabase(app);
const championAddressInDB = db.ref(database, "champion-list");

const endorsmentEl = document.getElementById("userFullText");
const publishBtnEl = document.getElementById("publishBtn");
const listOfEndorsmentEl = document.getElementById("listOfEndorsment");
const fromEl = document.getElementById("fromElement");
const toEl = document.getElementById("toElement");

publishBtnEl.addEventListener("click", function () {
  let allTextEl = endorsmentEl.value;
  let toElValue = toEl.value;
  let fromElValue = fromEl.value;

  db.push(championAddressInDB, {
    text: allTextEl,
    to: toElValue,
    from: fromElValue,
  });

  clearDataInInputs();
});

function removeCard(event) {
  const cardId = event.currentTarget.dataset.id;
  db.remove(db.ref(database, `champion-list/${cardId}`));
}

db.onValue(championAddressInDB, function (snapshot) {
  if (!snapshot.exists()) {
    listOfEndorsmentEl.innerHTML = "No list Item...";
    return;
  }

  listOfEndorsmentEl.innerHTML = ""; // Clear the existing list

  Object.entries(snapshot.val()).forEach(([id, value]) => {
    const cardWrapper = document.createElement("div");
    cardWrapper.dataset.id = id;
    cardWrapper.classList.add("messagePartElements");
    cardWrapper.addEventListener("click", removeCard);

    cardWrapper.innerHTML = `
        <h4>to: ${value.to}</h4>
        <p>${value.text}</p>
        <h4>from: ${value.from}</h4>
      `;

    listOfEndorsmentEl.append(cardWrapper);
  });
});

function clearDataInInputs() {
  endorsmentEl.value = "";
  toEl.value = "";
  fromEl.value = "";
}
