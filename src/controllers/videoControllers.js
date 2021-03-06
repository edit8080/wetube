import routes from "../routes";
import Video from "../models/Video";
import Comment from "../models/Comment";

export const home = async (req, res) => {
  try {
    // 모든 Video Fetch and Sort (새로운 비디오가 가장 위)
    const videoList = await Video.find({}).sort({ _id: -1 });
    res.render("home", { pageTitle: "Home", videoList });
  } catch (error) {
    console.log(error);
    res.render("home", { pageTitle: "Home", videoList: [] });
  }
};

// 비디오 검색
export const search = async (req, res) => {
  const {
    query: { term: searchingBy },
  } = req;
  let videoList = [];
  try {
    videoList = await Video.find({
      title: { $regex: searchingBy, $options: "i" },
    });
  } catch (error) {
    console.log(error);
  }
  res.render("search", { pageTitle: "Search", searchingBy, videoList });
};

export const videos = (req, res) =>
  res.render("videos", { pageTitle: "Videos" });

// 비디오 업로드
export const getUpload = (req, res) =>
  res.render("upload", { pageTitle: "Upload" });
export const postUpload = async (req, res) => {
  const {
    body: { title, description },
    file: { location },
  } = req;

  const newVideo = await Video.create({
    fileUrl: location,
    title,
    description,
    creator: req.user.id,
  });
  req.user.videos.push(newVideo);
  req.user.save();
  res.redirect(routes.videoDetail(newVideo.id));
};

// 업로드한 비디오 세부 정보
export const videoDetail = async (req, res) => {
  const {
    params: { id },
  } = req;

  try {
    const video = await await Video.findById(id)
      .populate("creator")
      .populate("comments");
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
    if (video.creator.toString() !== req.user.id) {
      throw Error("Mismatch Creator");
    }
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
    const video = await Video.findById(id);
    if (video.creator.toString() !== req.user.id) {
      throw Error("Mismatch Creator");
    }
    await Video.findByIdAndDelete(id);
  } catch (error) {
    console.log(error);
  }
  res.redirect(routes.home);
};

// 조회수 등록 (서버로만 통신)
export const postRegisterView = async (req, res) => {
  const {
    params: { id },
  } = req;

  try {
    const video = await Video.findById(id);
    video.views += 1;
    video.save();
    res.status(200);
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};
// 댓글 등록
export const postAddComment = async (req, res) => {
  const {
    params: { id },
    body: { comment },
    user,
  } = req;
  try {
    const video = await Video.findById(id);
    const newComment = await Comment.create({
      text: comment,
      creator: user.id,
    });
    video.comments.push(newComment.id);
    video.save();
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};
