import config from './config';
import React from 'react';
import request from 'superagent';
import VideoList from './VideoList';

export default class Channel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true
        }
    }

    focus() {
        this.listRef.focus();
    }

    componentDidMount() {
        this.searching = request
            .get('https://www.googleapis.com/youtube/v3/search')
            .query({
                maxResults: 50,
                part: "snippet",
                key: config.youTubeApiKey,
                channelId: this.props.channelId,
                order: "date"
            });
        this.searching.end((err, res) => {
            let items = res.body.items;
            if (err) {
                console.log(err);
                console.log(JSON.stringify(res.body));
                if (res.body && res.body.error && res.body.error.message) {
                    err = res.body.error.message
                }
                if (res.status === 401) {
                    this.props.onAuthError();
                }
            }
            this.setState({
                error: err,
                items: items && items.map(item => {
                    item.key = JSON.stringify(item.id);
                    return item;
                }),
                loading: false
            })
        });
    }

    render() {
        return (<div className="section" style={this.props.style}>
            <h1>{this.props.channelName} Videos</h1>
            <VideoList
                autofocus={true}
                listRef={ref => this.listRef = ref}
                loading={this.state.loading}
                error={this.state.error}
                items={this.state.items}
                onVideoSelected={this.props.onVideoSelected}
                onReturn={this.props.onReturn}
            />
        </div>);
    }

}