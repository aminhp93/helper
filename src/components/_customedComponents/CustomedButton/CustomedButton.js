import Button from "@material-ui/core/Button";
import React from 'react';

class CustomedButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: props.content || 'button',
            disabled: false
        }
    }
    render() {
        return <Button
            variant="contained"
            color="secondary"
            disabled={this.state.disabled}
            onClick={() => {
                this.setState({
                    disabled: true
                }, () => {
                    setTimeout(() => {
                        this.setState({
                            disabled: false
                        })
                    }, 3000)
                })
            }}>
            {this.state.content}
        </Button>
    }
}

export default CustomedButton