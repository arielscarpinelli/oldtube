import React from 'react';
import RemoteControlListener from './RemoteControlListener';

export default class VideoPlayer extends React.PureComponent {

	constructor(props) {
		super(props);

		this.state = {
			currentVideo: 0,
			currentTime: 0,
			duration: 0,
			progressBarVisible: true
		}
	}

	componentWillReceiveProps() {
		this.setState({
			currentVideo: 0,
			currentTime: 0,
			duration: 0,
			progressBarVisible: true
		})
	}

	onPlayerReady = (event) => {
		console.log("player ready");
		ga && ga('send', 'event', 'video', 'unstarted');
		this.showAndUpdateProgress();
	};

	showAndUpdateProgress(fadeOutAfter) {
		if (this.videoRef) {
			this.setState({
				currentTime: this.videoRef.currentTime,
				duration: this.videoRef.duration,
				progressBarVisible: true
			});
			if (fadeOutAfter) {
				setTimeout(() => {
					this.setState({
						progressBarVisible: false
					})
				}, 2000)
			}
		}
	}

	onTimeUpdate = () => {
		this.setState({
			currentTime: this.videoRef.currentTime,
			duration: this.videoRef.duration
		});
	};

	onPlayerEnded = (event) => {
		console.log("player state change: ended");
		this.toggleScreenSaver(true);
		if (this.hasMoreVideosInPlaylist()) {
			this.onKeyFastForward();
			this.onKeyPlay();
		} else {
			this.props.onReturn(null);
		}
	};

	onPlayerPlaying = (event) => {
		console.log("player state change: playing");
		this.toggleScreenSaver(false);
		this.showAndUpdateProgress(true);
	};

	onPlayerPaused = (event) => {
		console.log("player state change: paused");
		this.toggleScreenSaver(true);
		this.showAndUpdateProgress(false);
	};

	onError = (event) => {
		console.log(event.data)
	};

	componentDidUpdate() {
		this.remoteControlListener.focus();
	}

	onKeyPlay = () => {
		this.videoRef && this.videoRef.play();
	};

	onKeyPause = () => {
		if (this.videoRef) {
			if (!this.videoRef.paused) {
				this.videoRef.pause();
			} else {
				this.videoRef.play();
			}
		}
	};

	onKeyStop = () => {
		if (this.videoRef) {
			this.videoRef.pause();
			this.videoRef.currentTime = 0;
			this.showAndUpdateProgress(false);
		}
	};

	onKeyRw = () => {
		if (this.videoRef) {
			this.videoRef.currentTime = Math.max(0, this.videoRef.currentTime - 10);
			this.showAndUpdateProgress(!this.videoRef.paused);
		}
	};

	onKeyFF = () => {
		if (this.videoRef) {
			this.videoRef.currentTime = Math.min(this.videoRef.duration, this.videoRef.currentTime + 10);
			this.showAndUpdateProgress(!this.videoRef.paused);
		}
	};

	onKeyRewind = () => {
		if (this.state.currentVideo > 0) {
			this.setState({
				currentVideo: this.state.currentVideo - 1,
				currentTime: 0,
				duration: 0
			})
		}
	};

	onKeyFastForward = () => {
		if (this.hasMoreVideosInPlaylist()) {
			this.setState({
				currentVideo: this.state.currentVideo + 1,
				currentTime: 0,
				duration: 0
			})
		}
	};

	hasMoreVideosInPlaylist() {
		return this.state.currentVideo <= this.props.playlistVideoIds.length;
	}

	onKeyVolUp = () => {
		deviceapis.audiocontrol.setVolumeUp();
	};

	onKeyVolDown = () => {
		deviceapis.audiocontrol.setVolumeDown();
	};

	onKeyReturn = (event) => {
		this.toggleScreenSaver(true);
		this.props.onReturn(event);
	};

	getCurrentVideoObject() {
		return (this.state.currentVideo === 0) ?
			this.props.youtubeId :
			this.props.playlistVideoIds[this.state.currentVideo - 1];
	}

	getVideoUrl() {
		let videoId = this.getCurrentVideoObject().videoId;

		return `https://api.unblockvideos.com/youtube_downloader?id=${videoId}&selector=mp4&redirect=true`;
	};

	toggleScreenSaver(enabled) {
		webapis && webapis.appcommon && webapis.appcommon.setScreenSaver && webapis.appcommon.setScreenSaver(
			enabled ? webapis.appcommon.AppCommonScreenSaverState.SCREEN_SAVER_ON :
				webapis.appcommon.AppCommonScreenSaverState.SCREEN_SAVER_OFF,
			function (result) {
				console.log(result);
			}, function (error) {
				console.log(JSON.stringify(error));
			}
		);
	}

	render() {
		let videoUrl = this.getVideoUrl();
		return (<div className="section">
			<RemoteControlListener
				ref={ref => this.remoteControlListener = ref}
				onKeyPlay={this.onKeyPlay}
				onKeyPause={this.onKeyPause}
				onKeyStop={this.onKeyStop}
				onKeyRw={this.onKeyRw}
				onKeyFF={this.onKeyFF}
				onKeyRewind={this.onKeyRewind}
				onKeyFastForward={this.onKeyFastForward}
				onKeyVolUp={this.onKeyVolUp}
				onKeyVolDown={this.onKeyVolDown}
				onKeyReturn={this.onKeyReturn}
			/>
			<video ref={videoRef => this.videoRef = videoRef}
				   style={{position: "absolute", top: 0, left: 0, width: "1920px", height: "1080px"}}
				   src={videoUrl}
				   autoPlay={true}
				   onLoadedData={this.onPlayerReady}
				   onPlaying={this.onPlayerPlaying}
				   onPause={this.onPlayerPaused}
				   onEnded={this.onPlayerEnded}
				   onError={this.onError}
				   onTimeUpdate={this.onTimeUpdate}>
			</video>
			<h1 className={"video-title " + (!this.state.progressBarVisible ? "fade-out" : "")}>{this.getCurrentVideoObject().name}</h1>
			<div className={"progress-bar " + (!this.state.progressBarVisible ? "fade-out" : "")}>
				<progress max={this.state.duration} value={this.state.currentTime}/>
			</div>
		</div>)
	}

}