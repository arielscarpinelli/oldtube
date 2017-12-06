import React from 'react';
import Playlist from './Playlist';

export default class PlaylistSection extends React.Component {

	focus() {
		this.listRef.focus();
	}

	render() {
		return (<div className="section" style={this.props.style}>
            <h1>{this.props.playlistName} Videos</h1>
            <Playlist
                ref={ref => this.listRef = ref}
                playlistId={this.props.playlistId}
				public={true}
				autofocus={true}
                onVideoSelected={this.props.onVideoSelected}
                onTabsFocus={this.props.onReturn}
            />
        </div>);
	}

}