const videoRecordContainer = document.getElementById("js-recordContainer");
const videoPreview = document.getElementById("js-videoPreview");
const videoRecordBtn = document.getElementById("js-recordBtn");

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: { width: 1280, height: 720 },
    });
    videoPreview.srcObject = stream;
    videoPreview.muted = true;
    videoPreview.play();
  } catch (error) {
    videoRecordBtn.innerHTML = "Can't Record (Allow Permission)";
    videoRecordBtn.addEventListener("click", startRecording);
  }
}

function init() {
  videoRecordBtn.addEventListener("click", startRecording);
}
if (videoRecordContainer) {
  init();
}
