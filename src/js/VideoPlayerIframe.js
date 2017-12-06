import React from 'react';
import RemoteControlListener from './RemoteControlListener';

export default class VideoPlayerIframe extends React.Component {

    componentDidMount() {
        if (!YT) {
            console.log("we are doomed, no YT API!")
        } else {
            this.yt = new YT.Player('player', {
                events: {
                    'onReady': this.onPlayerReady,
                    'onStateChange': this.onPlayerStateChange,
                    'onError': this.onError,
                }
            });
        }
    }

    onPlayerReady = (event) => {
        ga && ga('send', 'event', 'video', 'unstarted');
    };

    onPlayerStateChange = (event) => {
        switch (event.data) {
            case YT.PlayerState.UNSTARTED:
                console.log("player state change: unstarted");
                ga && ga('send', 'event', 'video', 'unstarted');
                break;

            case YT.PlayerState.ENDED:
                console.log("player state change: ended");
                this.toggleScreenSaver(true);
                this.props.onReturn(null);

            case YT.PlayerState.PLAYING:
                console.log("player state change: playing");
                this.toggleScreenSaver(false);
                break;

            case YT.PlayerState.PAUSED:
                console.log("player state change: paused");
                this.toggleScreenSaver(true);
                break;

            case YT.PlayerState.CUED:
                console.log("player state change: cued");
                break;

            default:
                console.log("player state change: " + event.data);
                break;
        }
    };

    onError = (event) => {
        console.log(event.data)
    };

    componentDidUpdate() {
        this.remoteControlListener.focus();
    }

    onKeyPlay = () => {
        this.yt && this.yt.playVideo();
    };

    onKeyPause = () => {
        this.yt && this.yt.pauseVideo()
    };

    onKeyStop = () => {
        this.yt && this.yt.stopVideo();
    };

    onKeyRw = () => {
        this.yt && this.yt.seekTo(this.yt.getCurrentTime() - 10);
    };

    onKeyFF = () => {
        this.yt && this.yt.seekTo(this.yt.getCurrentTime() + 10);
    };

    onKeyRewind = () => {
        this.yt && this.yt.previousVideo();
    };

    onKeyFastForward = () => {
        this.yt && this.yt.nextVideo();
    };

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

    getVideoUrl() {
        let youtubeId = this.props.youtubeId;
        let videoId = "";
        let listParams = "";

        console.log(youtubeId.kind);

        switch(youtubeId.kind) {
            case "youtube#video":
                videoId = youtubeId.videoId;
                listParams = "&playlist=" + (this.props.playlistVideoIds || []).join(',');
                break;
            case "youtube#playlist":
                listParams = "&listType=playlist&list=" + youtubeId.playlistId;
                break;
        }

        return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1${listParams}`;
    };

    toggleScreenSaver(enabled) {
        webapis && webapis.appcommon && webapis.appcommon.setScreenSaver && webapis.appcommon.setScreenSaver(
            enabled ? webapis.appcommon.AppCommonScreenSaverState.SCREEN_SAVER_ON : 
                webapis.appcommon.AppCommonScreenSaverState.SCREEN_SAVER_OFF,
            function(result) {
                console.log(result);
            }, function(error) {
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
            <iframe id="player" style={{width: "100%", height: "100%"}}
                    src={videoUrl}
                    frameBorder="0"
                    allowFullScreen>
            </iframe>
        </div>)
    }

}