import {
  LoginSocialGoogle,
  LoginSocialFacebook,
  LoginSocialGithub,
} from "reactjs-social-login";
import {
  GoogleLoginButton,
  FacebookLoginButton,
  GithubLoginButton,
} from "react-social-login-buttons";
import axios from "axios";

const SocialAuth = ({ onSuccess }) => {
  // Common handler
  const handleSocialAuth = async (provider, data) => {
    try {
      const { access_token } = data;
      const res = await axios.post(`/api/auth/${provider}/callback`, {
        access_token,
      });
      onSuccess(res.data.token);
    } catch (err) {
      console.error(`${provider} login failed:`, err);
    }
  };

  return (
    <div className="social-auth-container">
      <LoginSocialGoogle
        client_id={process.env.REACT_APP_GOOGLE_CLIENT_ID}
        onResolve={({ provider, data }) => handleSocialAuth("google", data)}
        onReject={(err) => console.error("Google login error:", err)}
      >
        <GoogleLoginButton />
      </LoginSocialGoogle>

      <LoginSocialFacebook
        appId={process.env.REACT_APP_FACEBOOK_APP_ID}
        onResolve={({ provider, data }) => handleSocialAuth("facebook", data)}
        onReject={(err) => console.error("Facebook login error:", err)}
      >
        <FacebookLoginButton />
      </LoginSocialFacebook>

      <LoginSocialGithub
        client_id={process.env.REACT_APP_GITHUB_CLIENT_ID}
        redirect_uri={window.location.href} // optional
        onResolve={({ provider, data }) => handleSocialAuth("github", data)}
        onReject={(err) => console.error("GitHub login error:", err)}
      >
        <GithubLoginButton />
      </LoginSocialGithub>
    </div>
  );
};

export default SocialAuth;
