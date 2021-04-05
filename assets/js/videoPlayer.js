const videoContainer = document.getElementById("js-videoPlayer");
const videoPlayer = document.querySelector("#js-videoPlayer video");
const playBtn = document.getElementById("js-playButton");
const volumeBtn = document.getElementById("js-volumeButton");
const fullScreenBtn = document.getElementById("js-fullScreenButton");
const currentTime = document.getElementById("js-currentTime");
const totalTime = document.getElementById("js-totalTime");
const volumeRange = document.getElementById("js-volume");

function handlePlayClick() {
  if (videoPlayer.paused) {
    videoPlayer.play();
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
  } else {
    videoPlayer.pause();
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
  }
}
function handleVolumeClick() {
  const volumeBtnIcon = volumeBtn.querySelector("i");

  if (videoPlayer.muted) {
    volumeRange.value = videoPlayer.volume;
    videoPlayer.muted = false;
    volumeBtnIcon.classList.remove("fa-volume-mute");
    volumeBtnIcon.classList.add("fa-volume-up");
  } else {
    volumeRange.value = 0;
    videoPlayer.muted = true;
    volumeBtnIcon.classList.remove("fa-volume-up");
    volumeBtnIcon.classList.add("fa-volume-mute");
  }
}
function exitFullScreen() {
  document.exitFullscreen();
  fullScreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
  fullScreenBtn.removeEventListener("click", exitFullScreen);
  fullScreenBtn.addEventListener("click", goFullScreen);
}
function goFullScreen() {
  videoContainer.webkitRequestFullscreen();
  fullScreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
  fullScreenBtn.removeEventListener("click", goFullScreen);
  fullScreenBtn.addEventListener("click", exitFullScreen);
}
const formatDate = (seconds) => {
  const secondsNumber = parseInt(seconds, 10);
  let hours = Math.floor(secondsNumber / 3600);
  let minutes = Math.floor((secondsNumber - hours * 3600) / 60);
  let totalSeconds = secondsNumber - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (totalSeconds < 10) {
    totalSeconds = `0${totalSeconds}`;
  }
  return `${hours}:${minutes}:${totalSeconds} `;
};
function setTotalTime() {
  const totalTimeStr = formatDate(Math.floor(videoPlayer.duration));
  totalTime.innerHTML = totalTimeStr;
}
function getCurrentTime() {
  const currentTimeStr = formatDate(Math.floor(videoPlayer.currentTime));
  currentTime.innerHTML = currentTimeStr;
}
function handleEnded() {
  videoPlayer.currentTime = 0;
  playBtn.innerHTML = '<i class="fas fa-play"></i>';
}
function handleDrag(e) {
  e.stopPropagation();

  const volumeBtnIcon = volumeBtn.querySelector("i");
  const {
    target: { value },
  } = e;

  videoPlayer.volume = value;
  if (value > 0.6) {
    volumeBtnIcon.classList.remove("fa-volume-mute", "fa-volume-down");
    volumeBtnIcon.classList.add("fa-volume-up");
  } else if (value > 0) {
    volumeBtnIcon.classList.remove("fa-volume-up", "fa-volume-mute");
    volumeBtnIcon.classList.add("fa-volume-down");
  } else {
    volumeBtnIcon.classList.remove("fa-volume-up", "fa-volume-down");
    volumeBtnIcon.classList.add("fa-volume-mute");
  }
}
function init() {
  videoPlayer.volume = 0.5;
  playBtn.addEventListener("click", handlePlayClick);
  volumeBtn.addEventListener("click", handleVolumeClick);
  fullScreenBtn.addEventListener("click", goFullScreen);
  videoPlayer.addEventListener("loadedmetadata", setTotalTime);
  videoPlayer.addEventListener("timeupdate", getCurrentTime);
  videoPlayer.addEventListener("ended", handleEnded);
  volumeRange.addEventListener("click", (e) => e.stopPropagation());
  volumeRange.addEventListener("input", handleDrag);
}
if (videoContainer) {
  init();
}
