import config from "./config";
import React from "react";
import request from "superagent";
import TabbedVideoList from "./TabbedVideoList";

export default class Playlist extends TabbedVideoList {

    setupDataRequest() {
        return request
            .get('https://www.googleapis.com/youtube/v3/playlistItems')
            .query({
                maxResults: 50,
                part: "snippet",
                key: config.youTubeApiKey,
                playlistId: this.props.playlistId
            })

    }

    getItemId(item) {
        return item.snippet.resourceId;
    }

}
