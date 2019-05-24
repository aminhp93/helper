import Input from '@material-ui/core/Input';

import React from 'react';

class CustomedInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value || ''
        }
    }

    handleOnChange(e) {
        const text = e.target.value
        // console.log(text)
        // if (this.props.type === 'float') {
        //     if (!/^\d+$/.test(text) || parseFloat(text) > 100000) return
        // }

        // this.setState({
        //     value: text
        // }, () => {
        //     console.log(23, this, this.input)
        //     this.input.focus()
        // })

        if (this.timeout) clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
            this.props.cb(text)
        }, 300)
    }

    render() {
        return <Input inputRef={dom => this.input = dom} type={this.props.type === 'float' ? 'number' : ''} defaultValue={this.state.value} onChange={this.handleOnChange.bind(this)} />
    }
}

export default CustomedInput