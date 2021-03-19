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
  res.redirect(routes.videoDetail(newVideo.id));
};

// 업로드한 비디오 세부 정보
export const videoDetail = async (req, res) => {
  const {
    params: { id },
  } = req;

  try {
    const video = await Video.findById(id);
    res.render("videoDetail", { pageTitle: "Video Detail", video });
  } catch (error) {
    console.log(error);
    res.redirect(routes.home);
  }
};

// 업로드한 비디오 편집
export const getEditVideo = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id);
    res.render("editVideo", { pageTitle: `Edit ${video.title}`, video });
  } catch (error) {
    console.log(error);
    res.redirect(routes.home);
  }
};
export const postEditVideo = async (req, res) => {
  const {
    params: { id },
    body: { title, description },
  } = req;
  try {
    const query = {};
    await Video.findOneAndUpdate({ _id: id }, { title, description });
    res.redirect(routes.videoDetail(id));
  } catch {
    res.redirect(routes.home);
  }
};

// 업로드한 비디오 삭제
export const deleteVideo = async (req, res) => {
  const {
    params: { id },
  } = req;

  try {
    await Video.findByIdAndDelete(id);
  } catch (error) {
    console.log(error);
  }
  res.redirect(routes.home);
};
