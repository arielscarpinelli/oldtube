import css from '../css/main.css';
import Channel from './Channel';
import MyYoutube from './MyYoutube';
import PlaylistSection from './PlaylistSection';
import React from 'react';
import Search from './Search';
import Settings from './Settings';
import Tabs from './Tabs';
import VideoPlayer from './VideoPlayer';
import Popup from "./Popup";

const widgetAPI = new Common.API.Widget();

export default class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			displayUpdatePopup: props.legacyDomain
		};

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

	focusAfterState = () => {
		if (this.state.playlistId && this.playlist) {
			this.playlist.focus();
		} else if (this.state.channelId && this.channel) {
			this.channel.focus();
		} else {
			this.tabs.focusOnSelectedTab();
		}
	};

	onVideoSelected = (youtubeId, playlistVideoIds) => {
		if (youtubeId.kind === "youtube#channel") {
			this.setState({
				channelId: youtubeId
			})
		} else if (youtubeId.kind === "youtube#playlist") {
			this.setState({
				playlistId: youtubeId
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
		}, this.focusAfterState);
	};

	channelReturn = (event) => {
		widgetAPI.blockNavigation(event);
		this.setState({
			channelId: null
		}, this.focusAfterState);
	};

	playlistReturn = (event) => {
		widgetAPI.blockNavigation(event);
		this.setState({
			playlistId: null
		}, this.focusAfterState);
	};

	exit = () => {
		widgetAPI.sendReturnEvent();
	};

	render() {

		let player = !this.state.youtubeId ? null :
			<VideoPlayer youtubeId={this.state.youtubeId} playlistVideoIds={this.state.playlistVideoIds} onReturn={this.videoReturn}/>;

		let playlist = !this.state.playlistId ? null :
			<PlaylistSection ref={ref => this.playlist = ref} style={{display: player ? "none" : null}} playlistId={this.state.playlistId.playlistId}
							 playlistName={this.state.playlistId.name} onVideoSelected={this.onVideoSelected} onReturn={this.playlistReturn}/>;

		let channel = !this.state.channelId ? null :
			<Channel ref={ref => this.channel = ref} style={{display: (player || playlist) ? "none" : null}} channelId={this.state.channelId.channelId}
					 channelName={this.state.channelId.name} onVideoSelected={this.onVideoSelected} onReturn={this.channelReturn}/>;

		return (<div>
			{player}
			{channel}
			{playlist}
			{!this.state.displayUpdatePopup ? <Tabs ref={ref => this.tabs = ref} className="section" style={{display: (player || channel || playlist) ? "none" : null}} onKeyReturn={this.exit}>
				<Search name="Search" onVideoSelected={this.onVideoSelected} language={this.preferences.lang}/>
				<MyYoutube name="My YouTube" onVideoSelected={this.onVideoSelected}/>
				<Settings name="Settings"/>
			</Tabs> : <Popup onClose={() => this.setState({displayUpdatePopup: false})}>
				<p>OldTube is moving!</p>
				<p>Please visit http://oldtube.is-local.org and follow instructions to reinstall the app before Jul 18, 2024 to keep it working.</p>
			</Popup>}
		</div>);

	}

}