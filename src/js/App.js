import css from '../css/main.css';
import Channel from './Channel';
import MyYoutube from './MyYoutube';
import React from 'react';
import Search from './Search';
import Settings from './Settings';
import Subscriptions from './Subscriptions';
import Tabs from './Tabs';
import VideoPlayer from './VideoPlayer';

const widgetAPI = new Common.API.Widget();

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};

        this.preferences = {};
        let qstr = window.location.search;
        let a = (qstr[0] === '?' ? qstr.substr(1) : qstr).split('&');
        for (let i = 0; i < a.length; i++) {
            let b = a[i].split('=');
            this.preferences[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
        }

        if (this.preferences.lang && this.preferences.lang.indexOf('-') !== -1) {
            this.preferences.lang = this.preferences.lang.split('-').shift();
        }
    }

    componentDidMount() {
        widgetAPI.sendReadyEvent();
    }

    onVideoSelected = (youtubeId, playlistVideoIds) => {
        if (youtubeId.kind === "youtube#channel") {
            this.setState({
                channelId: youtubeId
            })
        } else {
            this.setState({
                youtubeId: youtubeId,
                playlistVideoIds: playlistVideoIds
            })
        }
    };

    videoReturn = (event) => {
        widgetAPI.blockNavigation(event);
        this.setState({
            youtubeId: null
        }, () => {
            if (!this.state.channelId) {
                this.tabs.focusOnSelectedTab();
            } else {
                this.channel && this.channel.focus();
            }
        });
    };

    channelReturn = (event) => {
        widgetAPI.blockNavigation(event);
        this.setState({
            channelId: null
        }, () => {
            this.tabs.focusOnSelectedTab();
        });
    };

    exit = () => {
        widgetAPI.sendReturnEvent();
    };

    render() {

        let player = !this.state.youtubeId ? null :
            <VideoPlayer youtubeId={this.state.youtubeId} playlistVideoIds={this.state.playlistVideoIds} onReturn={this.videoReturn}/>;

        let channel = !this.state.channelId ? null :
            <Channel ref={ref => this.channel = ref} style={{display: player ? "none" : null}} channelId={this.state.channelId.channelId} channelName={this.state.channelId.name} onVideoSelected={this.onVideoSelected} onReturn={this.channelReturn}/>;

        return (<div>
            {player}
            {channel}
            <Tabs ref={ref => this.tabs = ref} className="section" style={{display: (player || channel) ? "none" : null}} onKeyReturn={this.exit}>
                <Search name="Search" onVideoSelected={this.onVideoSelected} language={this.preferences.lang} />
                <Subscriptions name="Subscriptions" onVideoSelected={this.onVideoSelected} />
                <MyYoutube name="My YouTube" onVideoSelected={this.onVideoSelected} />
                <Settings name="Settings"/>
            </Tabs>
        </div>);

    }

}