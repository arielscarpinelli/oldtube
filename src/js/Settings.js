import List from './List';
import React from 'react';
import session from './YoutubeSession';

const LOGOUT_OPTION = 'logout';


export default class Settings extends React.Component {

    constructor(props) {
        super(props);
    }

    canFocus() {
        return session.isValid() && this.listRef;
    }

    focus() {
        this.listRef.select(0);
        this.listRef.focus();
    }

    onReturn = () => {
        this.listRef && this.listRef.select(-1);
        this.props.onTabsFocus();
    };

    _renderUserInfo() {
        let userInfo = session.getUserInfo();
        return <div>
            <small>Logged in as</small>
            <div className="pull-left thumb">
                <img src={userInfo.picture}/>
            </div>
            <div>
                <h2>{userInfo.name}</h2>
            </div>
        </div>
    }

    onItemSelected = (item) => {
        if (item.key === LOGOUT_OPTION) {
            session.clear();
            this.props.onTabsFocus();
            this.forceUpdate();
        }
    };

    render() {
        return <div className="tab-section settings" style={this.props.style}>
            {session.isValid() ? this._renderUserInfo() : "Go to Subscriptions or Playlists for logging in"}
            {!session.isValid() ? null :
                <List ref={ref => this.listRef = ref}
                      items={[
                          {key: LOGOUT_OPTION, name: 'Logout'}
                      ]}
                      onReturn={this.onReturn}
                      onSelectBeforeFirst={this.props.onTabsFocus}
                      onItemSelected={this.onItemSelected}
                />}
        </div>
    }

}