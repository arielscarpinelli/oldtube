import config from './config';
import React from 'react';
import request from 'superagent';
import VideoList from './VideoList';

const tvKey = new Common.API.TVKeyValue();

export default class Search extends React.Component {

    constructor(props) {
        super(props);
        this.searching = null;
        this.state = {
            items: [],
            loading: false,
            error: null
        };
    }

    onChange = () => {
        let value = this.ime.getInputObj().value;

        if (!value || !value.trim().length) {
            return
        }

        if (this.searching) {
            if (this.searching.q == value) {
                // keep searching
                return;
            } else {
                this.searching.abort();
            }
        }

        this.setState({
            loading: true,
            searchText: value
        });

        this.searching = request
            .get('https://www.googleapis.com/youtube/v3/search')
            .query({
                maxResults: 50,
                part: "snippet",
                key: config.youTubeApiKey,
                safeSearch: "moderate",
                //videoEmbeddable: "true" // this requires to filter only by videos,
                relevanceLanguage: this.props.language,
                q: value
            })
            .end((err, res) => {
                let items = res.body.items;
                if (err) {
                    console.log(err);
                    console.log(JSON.stringify(res.body));
                    if (res.body && res.body.error && res.body.error.message) {
                        err = res.body.error.message;
                    }
                }
                this.setState({
                    error: err,
                    items: items && items.map(item => {
                        item.id.name = item.snippet.title;
                        item.key = JSON.stringify(item.id);
                        return item;
                    }),
                    loading: false
                })
            });

        this.searching.q = value;
    };

    componentDidMount() {
        this.focus();
    }

    canFocus() {
        return true;
    }

    focus() {
        console.log("search focus");
        if (!this.listRef.isSelected()) {
            this.setupKeyboard();
        } else {
            this.listRef.focus();
        }
    }

    setupKeyboard() {
        let imeShell = new IMEShell("searchText", this.onIMEInit.bind(this), this);
        if (!imeShell) {
            console.log("object for IMEShell create failed");
        }
    }

    onIMEInit(ime) {
        this.ime = ime;
        ime.setOnCompleteFunc(this.onChange);
        ime.getInputObj().focus();
        ime.setEnterFunc(this.onImeEnter);
        ime.setKeyFunc(tvKey.KEY_UP, this.onImeKeyUp);
        ime.setKeyFunc(tvKey.KEY_DOWN, this.onImeKeyDown);
        ime.setKeyFunc(tvKey.KEY_RETURN, this.onImeKeyReturn);
    }

    onImeEnter = () => {
        console.log("enter");
        this.onChange();
        this.listRef.focus();
        this.listRef.select(0);
    };

    onImeKeyUp = () => {
        console.log("key up");
        this.props.onTabsFocus();
    };

    onImeKeyDown = () => {
        console.log("key down");
        this.listRef.focus();
        this.listRef.select(0);
    };

    onImeKeyReturn = () => {
        console.log("key return");
        this.props.onTabsFocus();
    };

    focusSearch = () => {
        this.setupKeyboard();
        this.listRef.select(-1);
    };

    render() {
        return (
            <div className="tab-section search" style={this.props.style}>
                <div className="search-bar">
                    Search: <input id="searchText" type="text" placeholder="Search" value={this.state.searchText}
                               onChange={() => {/* ignored, just to avoid a react warning, goes thru ime */}}/>
                </div>
                <VideoList
                    listRef={ref => this.listRef = ref}
                    loading={this.state.loading}
                    error={this.state.error}
                    items={this.state.items}
                    onVideoSelected={this.props.onVideoSelected}
                    onReturn={this.focusSearch}
                    onSearch={this.focusSearch}
                    onSelectBeforeFirst={this.focusSearch}
                />
            </div>
        );
    }

}