import config from './config';
import LoadingIndicator from './LoadingIndicator';
import React from 'react';
import request from 'superagent';
import session from './YoutubeSession';

export default class LoggedInSection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        this.recoverOrStartSession();
    }

    recoverOrStartSession = () => {
        this.setState({
            authResponse: null
        });
        if(!session.isValid()) {
            if (session.canRefresh()) {
                session.refresh()
                    .then(() => this.forceUpdate(), this.recoverOrStartSession);
            } else {
                this.initOAuthFlow();
            }
        }
    };

    initOAuthFlow() {

        this.clearCheckInterval();

        this.tokenRequest = request
            .post('https://accounts.google.com/o/oauth2/device/code')
            .send("client_id=" + config.oAuthClientId)
            .send("scope=" + config.oAuthScope);
        this.tokenRequest.end((err, res) => {
            if (err) {
                console.log(err);
                console.log(JSON.stringify(res.body));
                if (res.body && res.body.error) {
                    this.setState({
                        error: res.body.error,
                    });
                }
            } else {
                console.log(JSON.stringify(res.body));
                this.setState({
                    authResponse: res.body
                }, () => {
                    this.initTimeout = setTimeout(() => {
                        if(!session.isValid()) {
                            this.setState({
                                authResponse: null
                            });
                            this.initOAuthFlow();
                        }
                    }, this.state.authResponse.expires_in * 1000);

                    this.checkInterval = setInterval(() => {
                        this.pollAuthorization();
                    }, this.state.authResponse.interval * 1000)
                });
            }
        });
    }

    clearCheckInterval() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }

        if (this.initTimeout) {
            clearTimeout(this.initTimeout);
            this.initTimeout = null;
        }
    }

    pollAuthorization() {
        this.pollRequest = request
            .post('https://www.googleapis.com/oauth2/v4/token')
            .send("client_id=" + config.oAuthClientId)
            .send("client_secret=" + config.oAuthClientSecret)
            .send("code=" + this.state.authResponse.device_code)
            .send("grant_type=http://oauth.net/grant_type/device/1.0");
        this.pollRequest.end((err, res) => {
            if (err) {
                console.log(err);
                console.log(JSON.stringify(res.body));
                if (res.body && res.body.error) {
                    if (!res.body.error === "authorization_pending") {
                        this.setState({
                            error: res.body.error_description,
                        });
                        this.clearCheckInterval();
                    } else {
                        console.log("auth pending");
                    }
                }
            } else {
                console.log(JSON.stringify(res.body));
                session.save(res.body);
                this.forceUpdate();
                this.clearCheckInterval();
            }
        });

    }

    renderLoginScreen() {
        return this.state.error ? <div>{this.state.error}</div> : !this.state.authResponse ? <LoadingIndicator/> : <div>
            <h2>Login with your YouTube account</h2>
            <h3>Go to {this.state.authResponse.verification_url} and enter the code</h3>
            <h1>{this.state.authResponse.user_code}</h1>
        </div>
    }

    render() {

        const body = !session.isValid() ? this.renderLoginScreen() :
            React.Children.map(this.props.children, child => React.cloneElement(child, {
                onAuthError: this.recoverOrStartSession
            }));

        return <div className={this.props.className} style={this.props.style}>
            {body}
        </div>
    }

}