import config from './config';
import request from 'superagent';

const SESSION_USER_INFO = 'youtubeSessionUserInfo';
const SESSION_TOKEN_KEY = 'youtubeSessionToken';
const SESSION_TOKEN_EXPIRE_KEY = 'youtubeSessionTokenExpire';
const REFRESH_TOKEN_KEY = 'youtubeRefreshToken';

class YoutubeSession {

    getToken() {
        return localStorage.getItem(SESSION_TOKEN_KEY);
    }

    isValid() {
        let expire = localStorage.getItem(SESSION_TOKEN_EXPIRE_KEY);
        return expire && (new Date().getTime() < expire);
    }

    canRefresh() {
        return this.getRefreshToken();
    }

    getRefreshToken() {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    }

    refresh() {
        console.log("session refresh requested");
        return request
            .post('https://www.googleapis.com/oauth2/v4/token')
            .send("client_id=" + config.oAuthClientId)
            .send("client_secret=" + config.oAuthClientSecret)
            .send("refresh_token=" + this.getRefreshToken())
            .send("grant_type=refresh_token")
            .then(res => {
                console.log(JSON.stringify(res.body));
                this._saveSessionToken(res.body)
            }, err => {
                console.log(err);
                console.log(JSON.stringify(err));
                let res = err.response;
                if (res && res.body && res.body.error && res.body.error === 'invalid_grant') {
                    // our token is screwed
                    this.clear();
                }
            });
    }

    clear() {
        ga && ga('send', 'event', 'session', 'logout');
        localStorage.removeItem(SESSION_USER_INFO);
        localStorage.removeItem(SESSION_TOKEN_KEY);
        localStorage.removeItem(SESSION_TOKEN_EXPIRE_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    }

    save(authResponse) {
        ga && ga('send', 'event', 'session', 'login');
        this._saveSessionToken(authResponse);
        localStorage.setItem(REFRESH_TOKEN_KEY, authResponse.refresh_token);
        this._retrieveUserInfo();
    }

    _saveSessionToken(refreshResponse) {
        localStorage.setItem(SESSION_TOKEN_KEY, refreshResponse.access_token);
        localStorage.setItem(SESSION_TOKEN_EXPIRE_KEY, (refreshResponse.expires_in * 1000) + new Date().getTime());
    }

    _retrieveUserInfo() {
        return request
            .get('https://www.googleapis.com/oauth2/v3/userinfo?access_token=' + this.getToken())
            .end((err, res) => {
                localStorage.setItem(SESSION_USER_INFO, JSON.stringify(res.body));
            });
    }

    getUserInfo() {
        const userInfo = localStorage.getItem(SESSION_USER_INFO);
        return (userInfo && JSON.parse(userInfo)) || ({});
    }

}

export default new YoutubeSession();