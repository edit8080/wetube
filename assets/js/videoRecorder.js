const videoRecordContainer = document.getElementById("js-recordContainer");
const videoPreview = document.getElementById("js-videoPreview");
const videoRecordBtn = document.getElementById("js-recordBtn");

let streamObject;
let videoRecorder;

function downloadVideoData(e) {
  const { data: videoFile } = e;
  const link = document.createElement("a");
  link.href = URL.createObjectURL(videoFile);
  link.download = "recorded.webm";
  document.body.appendChild(link);
  link.click();
}
function stopRecording() {
  videoRecorder.stop();
  videoPreview.srcObject = null;

  videoRecordBtn.removeEventListener("click", stopRecording);
  videoRecordBtn.addEventListener("click", getVideo);
  videoRecordBtn.innerHTML = "Start Recording";
}
function startRecording() {
  videoRecorder = new MediaRecorder(streamObject);
  videoRecorder.ondataavailable = downloadVideoData;
  videoRecorder.start();
  videoRecordBtn.addEventListener("click", stopRecording);
}

async function getVideo() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: { width: 1280, height: 720 },
    });
    videoPreview.srcObject = stream;
    videoPreview.muted = true;
    videoPreview.play();
    videoRecordBtn.innerHTML = "Stop recording";
    streamObject = stream;
    startRecording();
  } catch (error) {
    videoRecordBtn.innerHTML = "Can't Record (Allow Permission)";
  } finally {
    videoRecordBtn.removeEventListener("click", getVideo);
  }
}

function init() {
  videoRecordBtn.addEventListener("click", getVideo);
}
if (videoRecordContainer) {
  init();
}
