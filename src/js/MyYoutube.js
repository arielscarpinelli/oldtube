import config from './config';
import LoggedInSection from './LoggedInSection';
import React from 'react';
import request from 'superagent';
import session from './YoutubeSession';
import VideoList from './VideoList';

class MyYoutube extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            items: []
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
                this.setState(state => {
                    return {
                        error: err,
                        items: [].concat(state.items, items && items.map(item => {
                            item.id = {
                                kind: "youtube#playlist",
                                playlistId: item.id
                            };
                            item.key = JSON.stringify(item.id);
                            return item;
                        })),
                        loading: false
                    }
                })
            });

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

                let relatedPlaylists = [];
                items && items.forEach(channel => {

                    const itemLists = channel.contentDetails.relatedPlaylists;

                    relatedPlaylists.push({
                        id: {
                            kind: "youtube#playlist",
                            playlistId: itemLists.watchLater
                        },
                        key: itemLists.watchLater,
                        snippet: {
                            title: "Watch Later"
                        }
                    });

                    relatedPlaylists.push({
                        id: {
                            kind: "youtube#playlist",
                            playlistId: itemLists.watchHistory
                        },
                        key: itemLists.watchHistory,
                        snippet: {
                            title: "Recently Watched"
                        }
                    });

                    relatedPlaylists.push({
                        id: {
                            kind: "youtube#playlist",
                            playlistId: itemLists.favorites
                        },
                        key: itemLists.favorites,
                        snippet: {
                            title: "Favorites"
                        }
                    });

                    relatedPlaylists.push({
                        id: {
                            kind: "youtube#playlist",
                            playlistId: itemLists.uploads
                        },
                        key: itemLists.uploads,
                        snippet: {
                            title: "Uploads"
                        }
                    });

                    relatedPlaylists.push({
                        id: {
                            kind: "youtube#playlist",
                            playlistId: itemLists.likes
                        },
                        key: itemLists.likes,
                        snippet: {
                            title: "Liked"
                        }
                    });

                });

                this.setState(state => {
                    return {
                        error: err,
                        items: [].concat(relatedPlaylists, state.items),
                        loading: false
                    }
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

export default class LoggedInMyYoutube extends React.Component {

    canFocus() {
        return this.playlistsRef && this.playlistsRef.canFocus();
    }

    focus() {
        return this.playlistsRef && this.playlistsRef.focus();
    }

    render() {
        return <LoggedInSection className="tab-section subscriptions" style={this.props.style}>
            <MyYoutube ref={ref => this.playlistsRef = ref} {...this.props}/>
        </LoggedInSection>
    }

}