import passport from "passport";
import routes from "../routes";
import User from "../models/User";

// 회원가입
export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Join" });
};
export const postJoin = async (req, res, next) => {
  const {
    body: { name, email, password, password2 },
  } = req;

  if (password !== password2) {
    req.flash("error", `Passwords don't match`);
    res.status(400);
  } else {
    try {
      const user = await User.findOne({ email });

      if (user) {
        console.log("이미 등록된 사용자입니다.");
        res.redirect(routes.login);
      } else {
        const newUser = await User({
          name,
          email,
          avatarUrl:
            "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.png",
        });
        await User.register(newUser, password);
        next(); // 회원등록 후 로그인 진행
      }
    } catch (error) {
      console.log(error);
      res.redirect(routes.home);
    }
  }
};

// 로그인
export const getLogin = (req, res) => {
  res.render("login", { pageTitle: "Login" });
};
export const postLogin = passport.authenticate("local", {
  successRedirect: routes.home,
  failureRedirect: routes.login,
  successFlash: "Welcome",
  failureFlash: "Can't log in. Check Email and/or Password",
});

// 깃허브 로그인
export const githubLogin = passport.authenticate("github", {
  successFlash: "Welcome",
  failureFlash: "Can't log in at this time",
});
export const githubLoginCallback = async (
  accessToken,
  refreshToken,
  profile,
  cb
) => {
  const {
    _json: { id, avatar_url, name, email },
  } = profile;

  try {
    const user = await User.findOne({ email });

    if (user !== null) {
      user.name = name;
      user.email = email;
      user.avatarUrl = avatar_url;
      user.githubId = id;
      user.save();
      return cb(null, user);
    } else {
      const newUser = await User.create({
        email,
        name,
        githubId: id,
        avatarUrl: avatar_url,
      });

      return cb(null, newUser);
    }
  } catch (error) {
    return cb(error);
  }
};
export const postGithubLogin = (req, res) => {
  res.redirect(routes.home);
};

// 구글 로그인
export const googleLogin = passport.authenticate("google", {
  scope: ["profile", "email"],
  successFlash: "Welcome",
  failureFlash: "Can't log in at this time",
});

export const googleLoginCallback = async (
  accessToken,
  refreshToken,
  profile,
  cb
) => {
  console.log(profile);
  const {
    _json: { sub, name, picture, email },
  } = profile;

  try {
    const user = await User.findOne({ email });
    if (user) {
      user.name = name;
      user.email = email;
      user.avatarUrl = picture;
      user.googleId = sub;

      user.save();
      return cb(null, user);
    } else {
      const newUser = await User.create({
        name,
        email,
        avatarUrl: picture,
        googleId: sub,
      });
      return cb(null, newUser);
    }
  } catch (error) {
    return cb(error);
  }
};
export const postGoogleLogin = (req, res) => {
  res.redirect(routes.home);
};

export const logout = (req, res) => {
  req.flash("info", "Logged out, see you later");
  req.logout();
  res.redirect(routes.home);
};
export const getMe = async (req, res) => {
  // 현재 로그인한 사용자
  try {
    const user = await User.findById(req.user.id).populate("videos");
    res.render("userDetail", { pageTitle: "User Detail", user });
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const users = (req, res) => res.render("users", { pageTitle: "Users" });
export const userDetail = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const user = await User.findById(id).populate("videos");
    res.render("userDetail", { pageTitle: "User Detail", user });
  } catch (error) {
    req.flash("error", "User not found");
    res.redirect(routes.home);
  }
};
export const getEditProfile = (req, res) =>
  res.render("editProfile", { pageTitle: "Edit Profile" });

export const postEditProfile = async (req, res) => {
  const {
    body: { name, email },
    file,
  } = req;

  try {
    await User.findOneAndUpdate(req.user.id, {
      name,
      email,
      avatarUrl: file ? file.location : req.user.avatarUrl,
    });
    req.flash("success", "Profile updated");
    res.redirect(routes.me);
  } catch (error) {
    req.flash("error", "Can't update profile");
    res.redirect(routes.editProfile);
  }
};

export const getChangePassword = (req, res) =>
  res.render("changePassword", { pageTitle: "Change Password" });

export const postChangePassword = async (req, res) => {
  const {
    body: { oldPassword, newPassword, newPassword1 },
  } = req;

  try {
    if (newPassword !== newPassword1) {
      req.flash("error", "Password don't match");
      throw new Error("Mismatch New Password");
    }
    await req.user.changePassword(oldPassword, newPassword);
    res.redirect(routes.me);
  } catch (error) {
    res.status(400);
    res.redirect(`/users${routes.changePassword}`);
  }
};
