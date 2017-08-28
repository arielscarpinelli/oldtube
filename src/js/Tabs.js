import React from 'react';
import RemoteControlListener from './RemoteControlListener';

export default class Tabs extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: 0,
            focused: false,
            // We use this to only mount in the DOM the tabs that we ever tried to render
            everRendered: {
                0: true
            }
        };
        this.childRefs = {};
    }

    focus = () => {
        this.setState({
            focused: true
        }, () => {
            this.remoteControlListener.focus();
        });
    };

    focusOnSelectedTab() {
        if (this.state.focused) {
            this.remoteControlListener.focus();
        } else {
            let childRef = this.getSelectedTabRef();
            if (childRef && childRef.focus) {
                childRef.focus();
            } else {
                this.focus();
            }
        }

    }

    getSelectedTabRef() {
        return this.childRefs[this.state.selectedIndex];
    }

    shiftSelected(shift) {
        this.setState((state) => {
            let tabCount = React.Children.count(this.props.children);
            let shifted = state.selectedIndex + shift;
            let newSelectedIndex = shifted == -1 ? (tabCount - 1) : (shifted % tabCount);
            return {
                selectedIndex: newSelectedIndex,
                everRendered: {
                    ...state.everRendered,
                    [newSelectedIndex]: true
                }
            }
        })
    }

    onKeyLeft = () => {
        this.shiftSelected(-1);
    };

    onKeyRight = () => {
        this.shiftSelected(1);
    };

    onKeyDownOrEnter = () => {
        let selectedTabRef = this.getSelectedTabRef();
        if (selectedTabRef && selectedTabRef.canFocus && selectedTabRef.canFocus()) {
            this.setState({
                focused: false
            }, () => this.focusOnSelectedTab());
        }
    };

    onKeyReturn = () => {
        this.setState({
            focused: false
        });
        this.props.onKeyReturn();
    };

    onKeyUp = () => {
        if (this.props.onKeyUp) {
            this.setState({
                focused: false
            });
            this.props.onKeyUp();
        }
    };

    render() {
        let selectedTabClassName = this.state.focused ? "selected" : "active";
        let children = React.Children.toArray(this.props.children);
        return (<div className={this.props.className} style={this.props.style}>
            <RemoteControlListener
                ref={ref => this.remoteControlListener = ref}
                autofocus={false}
                onKeyLeft={this.onKeyLeft}
                onKeyRight={this.onKeyRight}
                onKeyDown={this.onKeyDownOrEnter}
                onKeyEnter={this.onKeyDownOrEnter}
                onKeyReturn={this.onKeyReturn}
                onKeyUp={this.onKeyUp}
            />
            <nav>
                {children.map((child, index) =>
                    <a key={child.props.name} className={index === this.state.selectedIndex ? selectedTabClassName : null}>
                        {child.props.name}
                    </a>)}
            </nav>
            {children.map((child, index) =>
                !this.state.everRendered[index] ? null :
                    React.cloneElement(child, {
                        onTabsFocus: this.focus,
                        ref: ref => this.childRefs[index] = ref,
                        style: {
                            display: (index !== this.state.selectedIndex) ? "none" : null
                        },
                        selected: (index !== this.state.selectedIndex)
                    }))}
        </div>);
    }

}