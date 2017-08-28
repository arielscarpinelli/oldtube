import cx from 'classnames';
import LoadingIndicator from './LoadingIndicator';
import React from 'react';
import RemoteControlListener from './RemoteControlListener';

const noop = () => {};

export default class List extends React.Component {

    static defaultProps = {
        autofocus: false,
        itemRenderer: function(props) {
            return <div>{props.item.name}</div>
        },
        onItemSelected: noop,
        onReturn: noop,
        onSearch: noop
    };

    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: -1,
            scrollPosition: 0,
        };

        this.listComponents = {};
    }

    focus() {
        if (this.hasItems()) {
            this.remoteControlListener.focus();
        }
    }

    hasItems() {
        return !this.props.loading && !this.props.error && this.props.items && this.props.items.length;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.items !== this.props.items) {
            this.setState({
                selectedIndex: this.props.autofocus ? 0 : -1,
                scrollPosition: 0,
            })
        }
    }

    componentDidUpdate() {
        let listItem = this.listComponents[this.state.selectedIndex];
        if (listItem) {

            let itemY = listItem.offsetTop;
            let itemHeight = listItem.offsetHeight;
            let maxY = itemY + itemHeight;

            let containerHeight = this.container.clientHeight;
            let position = (maxY >= (containerHeight - (itemHeight / 2))) ?
                -(itemY - (containerHeight / 2) + (itemHeight / 2)) : 0;

            if (this.state.scrollPosition !== position) {
                this.setState({
                    scrollPosition: position
                });
            }
        }
    }

    onKeyUp = () => {
        this.setState((state) => {
            let updated = state.selectedIndex - 1;
            if (updated === -1) {
                if (this.props.onSelectBeforeFirst) {
                    this.props.onSelectBeforeFirst()
                } else {
                    updated = this.props.items.length - 1;
                }
            }
            return {
                selectedIndex: updated
            }
        });
    };

    onKeyDown = () => {
        this.setState((state) => {
            let updated = state.selectedIndex + 1;
            if (updated === this.props.items.length) {
                updated = 0;
            }

            return {
                selectedIndex: updated
            }
        });
    };

    onKeyEnter = () => {
        let selectedItem = this.props.items[this.state.selectedIndex];
        if (selectedItem) {
            this.props.onItemSelected(selectedItem,
                this.props.items.slice(this.props.selectedIndex + 1));
        }
    };

    select(selectedIndex) {
        if (!this.hasItems()) {
            selectedIndex = -1;
        }
        this.setState({
            selectedIndex: selectedIndex
        });
    }

    isSelected() {
        return this.state.selectedIndex > -1;
    }

    renderItem = (item, index) => {
        let className = cx({
            'selected': index == this.state.selectedIndex,
            'clearfix': true
        });
        const ItemRenderer = this.props.itemRenderer;
        return <li className={className} key={item.key} ref={(ref) => this.listComponents[index] = ref}>
            <ItemRenderer item={item} />
        </li>;
    };

    renderList() {
        if (this.props.loading) {
            return <div style={{padding: "10px"}}><LoadingIndicator/></div>
        } else if (this.props.error) {
            return <div style={{padding: "10px"}}>Failed to search for videos. Please try again. (Error: {this.props.error})</div>
        }
        return <ul style={{position: "absolute", top: this.state.scrollPosition, width: "100%"}}>
            {this.props.items.map(this.renderItem)}
        </ul>
    }

    render() {

        let style = {
            position: "relative",
            overflow: "hidden",
            width: "100%",
            height: "100%",
            ...this.props.style
        };

        return (
            <div ref={ref => this.container = ref}
                 style={style}>
                <RemoteControlListener
                    ref={ref => this.remoteControlListener = ref}
                    autofocus={this.props.autofocus}
                    onKeyUp={this.onKeyUp}
                    onKeyDown={this.onKeyDown}
                    onKeyEnter={this.onKeyEnter}
                    onKeyReturn={this.props.onReturn}
                    onKeySearch={this.props.onSearch}
                />
                {this.renderList()}
            </div>
        );
    }

}