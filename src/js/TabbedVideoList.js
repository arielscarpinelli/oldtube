import React from 'react';
import session from './YoutubeSession';
import VideoList from './VideoList';

export default class TabbedVideoList extends React.Component {

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

    setupDataRequest() {
        throw new Error("implement this");
    }

    getItemId(item) {
        throw new Error("implement this");
    }

    loadData() {
        this.request = this.setupDataRequest()
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
                        const id = this.getItemId(item);
                        if (id) {
                            item.id = id;
                            item.key = JSON.stringify(item.id);
                            return item;
                        }
                        return null;
                    }).filter(x => x),
                    loading: false
                })
            });
    }

    componentDidMount() {
        this.loadData();
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