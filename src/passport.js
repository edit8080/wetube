import passport from "passport";
import GithubStrategy from "passport-github";
import GoogleStrategy from "passport-google-oauth20";
import {
  githubLoginCallback,
  googleLoginCallback,
} from "./controllers/userController";
import User from "./models/User";
import routes from "./routes";

passport.use(User.createStrategy());
passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.PRODUCTION
        ? `https://mysterious-badlands-91537.herokuapp.com${routes.githubCallback}`
        : `http://localhost:4000${routes.githubCallback}`,
    },
    githubLoginCallback
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.PRODUCTION
        ? `https://mysterious-badlands-91537.herokuapp.com${routes.googleCallback}`
        : `http://localhost:4000${routes.googleCallback}`,
    },
    googleLoginCallback
  )
);

passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => cb(err, user));
});
