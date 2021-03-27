import React from "react";

export default class Popup extends React.Component {

    componentDidMount() {
        if(this.buttonRef) {
            this.buttonRef.focus();
        }
    }

    render() {
        return (
            <div className="popup">
                {this.props.children}
                <div className="buttons">
                    <a ref={ref => this.buttonRef = ref} className="button" href="javascript:void(0);" onClick={this.props.onClose}>OK</a>
                </div>
            </div>)
    }
}