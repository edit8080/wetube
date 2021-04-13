import axios from "axios";

const addCommentForm = document.getElementById("js-addComment");
const commentList = document.getElementById("js-commentList");
const commentNumber = document.getElementById("js-commentNumber");

function increaseNumber() {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
}
function addComment(comment) {
  const li = document.createElement("li");
  const span = document.createElement("span");
  span.innerHTML = comment;
  li.appendChild(span);
  commentList.prepend(li);
  increaseNumber();
}
async function sendComment(comment) {
  const videoId = window.location.href.split("/videos/")[1];
  const response = await axios({
    url: `/api/${videoId}/comment`,
    method: "POST",
    data: {
      comment,
    },
  });
  console.log(response);
  if (response.status === 200) addComment(comment);
}
function handleSubmit(e) {
  e.preventDefault();
  const commentInput = addCommentForm.querySelector("input");
  const comment = commentInput.value;
  sendComment(comment);
  commentInput.value = "";
}

function init() {
  addCommentForm.addEventListener("submit", handleSubmit);
}
if (addCommentForm) {
  init();
}
