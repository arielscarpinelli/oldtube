import List from './List';
import React from 'react';

function VideoItemRenderer(props) {

    const item = props.item;
    const thumbs = item.snippet.thumbnails;
    const thumb = thumbs ? (thumbs.medium || thumbs.high || thumbs.default) : {};
    const playlist = !item.id.playlistId ? null : "Playlist";
    const channel = !item.id.channelId ? null : "Channel";

    return (<div>
        <div className="pull-left thumb">
            <img src={thumb.url}/>
        </div>
        <div>
            <small>{[playlist, channel, item.snippet.channelTitle].filter(x => x).join(" - ")}</small>
            <h2>{item.snippet.title}</h2>
            <p>{item.snippet.description}</p>
        </div>
    </div>);
}

export default function VideoList(props) {
    return <List
        ref={props.listRef}
        itemRenderer={VideoItemRenderer}
        onItemSelected={function (selected, following) {
            console.log(JSON.stringify(selected.id));
            props.onVideoSelected(selected.id, following
                .map(item => item.id.videoId)
                .filter(videoId => videoId));

        }}
        {...props}/>;
}