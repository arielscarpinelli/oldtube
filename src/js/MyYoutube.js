import config from './config';
import LoggedInSection from './LoggedInSection';
import Playlist from './Playlist';
import React from 'react';
import request from 'superagent';
import session from './YoutubeSession';
import Tabs from './Tabs';
import VideoList from './VideoList';

class MyPlaylists extends React.Component {

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
        this.playlists = request
            .get('https://www.googleapis.com/youtube/v3/playlists')
            .query({
                maxResults: 50,
                part: "snippet",
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
                this.setState({
                    error: err,
                    items: items && items.map(item => {
                        item.id = {
                            kind: "youtube#playlist",
                            playlistId: item.id
                        };
                        item.key = JSON.stringify(item.id);
                        return item;
                    }),
                    loading: false
                });
            });

    }

    render() {
        return <VideoList
            style={this.props.style}
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
            <MyPlaylists name="Playlists" onVideoSelected={this.props.onVideoSelected}/>
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