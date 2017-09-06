import config from './config';
import LoggedInSection from './LoggedInSection';
import Playlist from './Playlist';
import React from 'react';
import request from 'superagent';
import session from './YoutubeSession';
import Tabs from './Tabs';
import TabbedVideoList from './TabbedVideoList';

class MyHome extends TabbedVideoList {

    setupDataRequest() {
        return request
            .get('https://www.googleapis.com/youtube/v3/activities')
            .query({
                maxResults: 50,
                part: "snippet,contentDetails",
                key: config.youTubeApiKey,
                home: true
            })
    }

    getItemId(item) {
        const contentDetails = item.contentDetails;
        // contentDetails is actually single valued, but don't want to hardcode the options.
        for (const attr in contentDetails) {
            const contentDetail = contentDetails[attr];
            if (contentDetail.resourceId) {
                return contentDetail.resourceId
            }
            if (contentDetail.seedResourceId) {
                return contentDetail.seedResourceId
            }
            if (contentDetail.videoId) {
                return {
                    kind: "youtube#video",
                    videoId: contentDetail.videoId
                };
            }
        }
        return null;
    }

}


class MyPlaylists extends TabbedVideoList {

    setupDataRequest() {
        return request
            .get('https://www.googleapis.com/youtube/v3/playlists')
            .query({
                maxResults: 50,
                part: "snippet",
                key: config.youTubeApiKey,
                mine: true
            })
    }

    getItemId(item) {
        return {
            kind: "youtube#playlist",
            playlistId: item.id
        };
    }

}

class MySubscribedChannels extends TabbedVideoList {

    setupDataRequest() {
        return request
            .get('https://www.googleapis.com/youtube/v3/subscriptions')
            .query({
                maxResults: 50,
                part: "snippet",
                key: config.youTubeApiKey,
                mine: true,
                order: "unread"
            })
    }

    getItemId(item) {
        return {
            kind: "youtube#channel",
            channelId: item.snippet.resourceId.channelId,
            name: item.snippet.title
        };
    }

}

class MyYoutube extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            relatedPlaylists: {}
        }
    }

    canFocus() {
        return true;
    }

    focus() {
        this.tabsRef.focusOnSelectedTab();
    }

    componentDidMount() {
        this.mine = request
            .get('https://www.googleapis.com/youtube/v3/channels')
            .query({
                maxResults: 50,
                part: "contentDetails",
                key: config.youTubeApiKey,
                mine: true
            })
            .set({'Authorization': 'Bearer ' + session.getToken()})
            .end((err, res) => {
                let items = res.body.items;
                if (err) {
                    console.log(err);
                    console.log(JSON.stringify(res.body));
                    if (res.body && res.body.error && res.body.error.message) {
                        err = res.body.error.message;
                    }
                    if (err.status === 401) {
                        this.props.onAuthError();
                    }
                }

                console.log(JSON.stringify(res.body));

                this.setState({
                    error: err,
                    relatedPlaylists: (items && items[0] && items[0].contentDetails.relatedPlaylists) || {},
                    loading: false
                });
            })
    }

    render() {
        const relatedPlaylists = this.state.relatedPlaylists;
        return <Tabs className="tab-section" ref={ref => this.tabsRef = ref} onKeyUp={this.props.onTabsFocus} onKeyReturn={this.props.onTabsFocus}>
            <MyHome name="Home" onVideoSelected={this.props.onVideoSelected}/>
            <MyPlaylists name="Playlists" onVideoSelected={this.props.onVideoSelected}/>
            <MySubscribedChannels name="Channels" onVideoSelected={this.props.onVideoSelected}/>
            {!relatedPlaylists.uploads ? null :
                <Playlist name="Uploads" playlistId={relatedPlaylists.uploads} onVideoSelected={this.props.onVideoSelected}/>}
            {!relatedPlaylists.likes ? null :
                <Playlist name="Liked" playlistId={relatedPlaylists.likes} onVideoSelected={this.props.onVideoSelected}/>}
            {!relatedPlaylists.favorites ? null :
                <Playlist name="Favorites" playlistId={relatedPlaylists.favorites} onVideoSelected={this.props.onVideoSelected}/>}
        </Tabs>

    }

}

export default class LoggedInMyYoutube extends React.Component {

    canFocus() {
        return true;
    }

    focus() {
        return this.myYoutubeRef && this.myYoutubeRef.focus();
    }

    render() {
        return <LoggedInSection className="tab-section my-youtube" style={this.props.style}>
            <MyYoutube ref={ref => this.myYoutubeRef = ref} {...this.props}/>
        </LoggedInSection>
    }

}