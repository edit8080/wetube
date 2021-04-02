const videoContainer = document.getElementById("js-videoPlayer");
const videoPlayer = document.querySelector("#js-videoPlayer video");
const playBtn = document.getElementById("js-playButton");
const volumeBtn = document.getElementById("js-volumeButton");
const fullScreenBtn = document.getElementById("js-fullScreenButton");
const currentTime = document.getElementById("js-currentTime");
const totalTime = document.getElementById("js-totalTime");

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
  if (videoPlayer.muted) {
    videoPlayer.muted = false;
    volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
  } else {
    videoPlayer.muted = true;
    volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
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
  const totalTimeStr = formatDate(videoPlayer.duration);
  totalTime.innerHTML = totalTimeStr;
}
function getCurrentTime() {
  const currentTimeStr = formatDate(videoPlayer.currentTime);
  currentTime.innerHTML = currentTimeStr;
}
function init() {
  playBtn.addEventListener("click", handlePlayClick);
  volumeBtn.addEventListener("click", handleVolumeClick);
  fullScreenBtn.addEventListener("click", goFullScreen);
  videoPlayer.addEventListener("loadedmetadata", setTotalTime);
  videoPlayer.addEventListener("timeupdate", getCurrentTime);
}
if (videoContainer) {
  init();
}
