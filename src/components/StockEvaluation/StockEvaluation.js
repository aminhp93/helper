import React from 'react';

class StockEvaluation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stock: props.stock,
        }
    }
    render() {
        return (
            <div>
                <div>{this.state.stock}</div>
                <div>P/E: 10.12 </div>
                <div>Thi gia von: 2216 ty</div>
                <div>EPS: 1334</div>
                <div>KL co phieu luu hang: 208.57 trieu</div>
                <div>ROE: 13.59</div>
                <div>Tai san ngan han: Q2/2019: 10,590,146</div>
                <div>No ngan han: Q2/2019: 8,629,923</div>
                <div>Doanh thu: Q2/2019: 417,522</div>
                <div>Loi nhuan: Q2/2019: 139,452</div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        )
    }
}

export default StockEvaluation