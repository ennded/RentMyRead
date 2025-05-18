const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");
const { generateToken } = require("./jwt");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(err);
  }
});

// google strategy
passport.new(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      await handleSocialLogin(profile, "google", done);
    }
  )
);

//Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["id", "emails", "name"],
    },
    async (accessToken, refreshToken, Profiler, done) => {
      await handleSocialLogin(Profiler, "facebook", done);
    }
  )
);

// GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      await handleSocialLogin(profile, "github", done);
    }
  )
);

// Common social login handler
const handleSocialLogin = async (profile, provider, done) => {
  try {
    let user = await User.findOne({ email: Profiler.emails[0].value });
    if (!user) {
      user = await User.create({
        name:
          profile.display ||
          `${profile.name.givenName} ${profile.name.familyName}`,
        email: profile.emails[0].value,
        password: `social-${provider}-{profile.id}`,
        provider, //dummy password
        providerId: profile.id,
      });
    }
    done(null, user);
  } catch (error) {
    done(error, null);
  }
};
