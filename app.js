// selector
const postInputUI = document.querySelector("#tweet-text");
const itemGroup = document.querySelector(".collection");
const submitBtn = document.querySelector(".btn-submit");
const searchInput = document.querySelector("#search");
const errorMsg = document.querySelector(".error-msg");

let char = document.querySelector(".char-counter");

postInputUI.addEventListener("keyup", charCounter);
// if i use keypress then backspace won't work.
function charCounter(e) {
  let len = postInputUI.value.length;
  char.textContent = len;
  if (len < 250) {
    char.textContent = len;
  }
  if (len >= 250) {
    e.preventDefault();
  }
}

// get data from local storage
function getDataFromLS() {
  let items = "";
  if (localStorage.getItem("tweetDataLS") === null) {
    items = [];
  } else {
    items = JSON.parse(localStorage.getItem("tweetDataLS"));
  }
  return items;
}

let tweetData = getDataFromLS();

// save data to local storage
function saveDataToLocalStorage(item) {
  let items = "";
  if (localStorage.getItem("tweetDataLS") === null) {
    items = [];
    items.push(item);
    localStorage.setItem("tweetDataLS", JSON.stringify(items));
  } else {
    items = JSON.parse(localStorage.getItem("tweetDataLS"));
    items.push(item);
    localStorage.setItem("tweetDataLS", JSON.stringify(items));
  }
}

// add tweet
submitBtn.addEventListener("click", addTweet);
function addTweet() {
  let data = {};
  let id;
  if (tweetData.length === 0) {
    id = 0;
  } else {
    id = tweetData[tweetData.length - 1].id + 1;
  }

  data.id = id;
  data.text = postInputUI.value;
  data.unFomatTime = dayjs().format();
  data.time = dayjs().format("DD-MMM-YYYY hh.mm a");

  if (data.text.length > 0 && data.text.length < 250) {
    tweetData.push(data);
    saveDataToLocalStorage(data);
  }

  if (postInputUI.value.length <= 0 || postInputUI.value.length > 250) {
    showErrorMsg("Enter Text Between 1-250");
    postInputUI.value = "";
    setTimeout(function () {
      location.reload();
    }, 3000);
  } else {
    itemGroup.innerHTML = "";
    displayData();
    char.textContent = 0;
  }
}

// display data
displayData();
function displayData() {
  tweetData.forEach((tweet) => {
    const { id, text, time, unFomatTime } = tweet;

    let li = document.createElement("li");
    li.className = "list-group-item list-group-item-info collection-item";
    li.id = `tweet-${id}`;
    let p = document.createElement("p");
    p.textContent = text;
    li.append(p);

    let dltButton = document.createElement("button");
    dltButton.className = "btn btn-outline-danger dlt-tweet float-right";
    dltButton.textContent = "Delete";

    let h6 = document.createElement("h6");
    // let update time
    let updatedTime = dayjs(unFomatTime).fromNow();
    h6.textContent = updatedTime;
    li.append(h6);

    let p1 = document.createElement("p1");
    p1.className = "our-time";
    p1.textContent = time;
    li.append(p1);

    let editButton = document.createElement("button");
    editButton.className = "btn btn-outline-success edit-tweet float-right";
    editButton.textContent = "Edit";

    li.append(editButton);
    li.append(dltButton);
    itemGroup.append(li);
    postInputUI.value = "";
  });
}

//modify or dlt tweet
itemGroup.addEventListener("click", modifyOrDltTweet);
function modifyOrDltTweet(e) {
  if (e.target.classList.contains("dlt-tweet")) {
    let target = e.target.parentElement;
    // console.log(parseInt(target.id.split('-')[1]))
    target.remove();
    let id = parseInt(target.id.split("-")[1]);
    deleteDataFromLS(id);
    location.reload();
  } else if (e.target.classList.contains("edit-tweet")) {
    let idStr = e.target.parentElement.id;
    let id = parseInt(idStr.split("-")[1]);
    let foundData = tweetData.find((elem) => elem.id === id);
    console.log(foundData.text);
    let { text } = foundData;
    // console.log(text)
    let liTxt = e.target.parentElement.firstElementChild.textContent;
    postInputUI.value = liTxt;
    submitBtn.style.display = "none";
    let updateBtn = `<button type="button" class="btn btn-outline-danger btn-block btn-update">Update</button>`;
    document
      .querySelector(".submit-tweet")
      .insertAdjacentHTML("beforeend", updateBtn);

    document.querySelector(".btn-update").addEventListener("click", (e) => {
      e.preventDefault();
      foundData.text = postInputUI.value;
      localStorage.setItem("tweetDataLS", JSON.stringify(tweetData));
      location.reload();
      displayData();
    });
  }
}

// search tweet
searchInput.addEventListener("keyup", searchTweet);
function searchTweet(e) {
  let items = Array.from(itemGroup.children);
  items.forEach((item) => {
    console.log(item.firstElementChild.textContent);
    console.log(e.target.value);
    if (item.firstElementChild.textContent.indexOf(e.target.value) !== -1) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
}

// x.forEach(y => console.log(y.firstElementChild.textContent

//  delete data from local storage
function deleteDataFromLS(id) {
  let items = JSON.parse(localStorage.getItem("tweetDataLS"));
  let result = items.filter((product) => {
    return product.id !== id;
  });
  localStorage.setItem("tweetDataLS", JSON.stringify(result));
}

function showErrorMsg(text) {
  // <div class="alert alert-danger error-msg" role="alert">enter text between 1-250 characters!
  //   </div>
  let div = document.createElement("div");
  div.className = "alert alert-danger error-msg";
  div.setAttribute("role", "alert");
  div.textContent = text;

  document.querySelector(".search-tweet").appendChild(div);
}
