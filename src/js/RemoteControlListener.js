import React from 'react';

const tvKey = new Common.API.TVKeyValue();

const noop = () => {};

export default class RemoteControlListener extends React.Component {

    static defaultProps = {
        onKeyUp: noop,
        onKeyDown: noop,
        onKeyLeft: noop,
        onKeyRight: noop,
        onKeyEnter: noop,
        onKeySearch: noop,
        onKeyPlay: noop,
        onKeyPause: noop,
        onKeyStop: noop,
        onKeyRw: noop,
        onKeyFF: noop,
        onKeyRewind: noop,
        onKeyFastForward: noop,
        onKeyMute: noop,
        onKeyDefault: noop,
        autofocus: true
    };

    componentDidMount() {
        if (this.props.autofocus) {
            this.focus();
        }
    }

    focus() {
        this.keyboardAnchor.focus();
    }

    onKeyDown = (event) => {
        switch(event.keyCode) {
            case tvKey.KEY_UP:
                console.log("key up");
                this.props.onKeyUp(event);
                break;

            case tvKey.KEY_DOWN:
                console.log("key down");
                this.props.onKeyDown(event);
                break;

            case tvKey.KEY_LEFT:
                console.log("key left");
                this.props.onKeyLeft(event);
                break;

            case tvKey.KEY_RIGHT:
                console.log("key right");
                this.props.onKeyRight(event);
                break;

            case tvKey.KEY_ENTER:
            case tvKey.KEY_PANEL_ENTER:
                console.log("key enter");
                this.props.onKeyEnter(event);
                break;

            case tvKey.KEY_RETURN:
                console.log("key return");
                if (this.props.onKeyReturn) {
                    event.preventDefault();
                    this.props.onKeyReturn(event);
                }
                break;

            case 1252:
                console.log("key search");
                this.props.onKeySearch(event);
                break;

            case tvKey.KEY_PLAY:
                console.log("key play");
                this.props.onKeyPlay(event);
                break;

            case tvKey.KEY_PAUSE:
                console.log("key pause");
                this.props.onKeyPause(event);
                break;

            case tvKey.KEY_STOP:
                console.log("key stop");
                this.props.onKeyStop(event);
                break;

            case tvKey.KEY_RW:
                console.log("key rw");
                this.props.onKeyRw(event);
                break;

            case tvKey.KEY_FF:
                console.log("key ff");
                this.props.onKeyFF(event);
                break;

            case tvKey.KEY_REWIND_:
                console.log("key rewind_");
                this.props.onKeyRewind(event);
                break;

            case tvKey.KEY_FF_:
                console.log("key ff_");
                this.props.onKeyFastForward(event);
                break;

            case tvKey.KEY_VOL_UP:
                console.log("key vol up");
                this.props.onKeyVolUp();
                break;

            case tvKey.KEY_VOL_DOWN:
                console.log("key vol down");
                this.props.onKeyVolDown();
                break;

            case tvKey.KEY_MUTE:
                console.log("key mute");
                this.props.onKeyMute(event);
                break;

            default:
                console.log("key " + event.keyCode);
                this.props.onKeyDefault(event);
                break;
        }

    };

    render() {
        return (<a href="javascript:void(0);"
           ref={anchor => this.keyboardAnchor = anchor}
           onKeyDown={this.onKeyDown}></a>)
    }

}