import routes from "../routes";
import Video from "../models/Video";

export const home = async (req, res) => {
  try {
    // 모든 Video Fetch
    const videoList = await Video.find({});
    res.render("home", { pageTitle: "Home", videoList });
  } catch (error) {
    console.log(error);
    // 에러 시 빈 Array 전달
    res.render("home", { pageTitle: "Home", videoList: [] });
  }
};
export const search = (req, res) => {
  const {
    query: { term: searchingBy },
  } = req;

  res.render("search", { pageTitle: "Search", searchingBy });
};

export const videos = (req, res) =>
  res.render("videos", { pageTitle: "Videos" });

// 비디오 업로드
export const getUpload = (req, res) =>
  res.render("upload", { pageTitle: "Upload" });
export const postUpload = async (req, res) => {
  const {
    body: { title, description },
    file: { path },
  } = req;

  const newVideo = await Video.create({
    fileUrl: path,
    title,
    description,
  });

  // To Do : Upload and Save Video
  res.redirect(routes.videoDetail(newVideo.id));
};

export const videoDetail = (req, res) =>
  res.render("videoDetail", { pageTitle: "Video Detail" });
export const editVideo = (req, res) =>
  res.render("editVideo", { pageTitle: "Edit Video" });
export const deleteVideo = (req, res) =>
  res.render("deleteVideo", { pageTitle: "Delete Video" });
