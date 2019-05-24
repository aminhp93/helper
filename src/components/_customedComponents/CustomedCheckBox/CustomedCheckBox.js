import Checkbox from '@material-ui/core/Checkbox';
import React from 'react';

class CustomedCheckBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: props.checked
        }
    }

    handleChange() {
        this.setState({
            checked: !this.state.checked
        }, () => {
            this.props.cb(this.state.checked)
        })

    }

    render() {
        return <Checkbox checked={this.state.checked} onChange={this.handleChange.bind(this)} />
    }
}

export default CustomedCheckBox