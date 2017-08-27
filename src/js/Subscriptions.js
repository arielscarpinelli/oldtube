import config from './config';
import LoggedInSection from './LoggedInSection';
import React from 'react';
import request from 'superagent';
import session from './YoutubeSession';
import VideoList from './VideoList';

class Subscriptions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true
        }
    }

    canFocus() {
        return this.listRef && this.listRef.hasItems();
    }

    focus() {
        this.listRef.focus();
        if (!this.listRef.isSelected()) {
            this.listRef.select(0);
        }
    }

    onReturn = () => {
        this.listRef && this.listRef.select(-1);
        this.props.onTabsFocus();
    };

    componentDidMount() {
        this.searching = request
            .get('https://www.googleapis.com/youtube/v3/subscriptions')
            .query({
                maxResults: 50,
                part: "snippet",
                key: config.youTubeApiKey,
                mine: true,
                order: "unread"
            })
            .set({'Authorization': 'Bearer ' + session.getToken()})
            .end((err, res) => {
                let items = res.body.items;
                if (err) {
                    console.log(err);
                    console.log(JSON.stringify(res.body));
                    if (res.body && res.body.error && res.body.error.message) {
                        err = res.body.error.message
                    }
                    if (res.status === 401) {
                        this.props.onAuthError();
                    }
                }
                this.setState({
                    error: err,
                    items: items && items.map(item => {
                        item.id = {
                            kind: "youtube#channel",
                            channelId: item.snippet.resourceId.channelId,
                            name: item.snippet.title
                        };
                        item.key = JSON.stringify(item.id);
                        return item;
                    }),
                    loading: false
                })
            });
    }

    render() {
        return <VideoList
            listRef={ref => this.listRef = ref}
            loading={this.state.loading}
            error={this.state.error}
            items={this.state.items}
            onVideoSelected={this.props.onVideoSelected}
            onReturn={this.onReturn}
            onSelectBeforeFirst={this.props.onTabsFocus}
        />

    }

}

export default class LoggedInSubscriptions extends React.Component {

    canFocus() {
        return this.playlistsRef && this.playlistsRef.canFocus();
    }

    focus() {
        return this.playlistsRef && this.playlistsRef.focus();
    }

    render() {
        return <LoggedInSection className="tab-section subscriptions" style={this.props.style}>
            <Subscriptions ref={ref => this.playlistsRef = ref} {...this.props}/>
        </LoggedInSection>
    }

}