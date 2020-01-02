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
                <h1>1. DINH GIA CO PHIEU THEO P/E</h1>
                <div>
                    1. Chi so PE - P/E la gi?
                    2. Cach tinh
                    3. Y nghia
                    4. Dinh gia theo phuong phap P/EPS
                    5. Cong thuc dinh gia va yeu to tac dong
                    6. Vi du
                    7. Luu y khac
                </div>
                <div>
                    1. Chi so PE - P/E la gi?
                    - Price Earning Ratio 
                    - So nam hoa von neu loi nhuan khong doi
                </div>
                <div>
                    2. Cach tinh
                    - P/E = gia thi truong / EPS
                    - Tai san (10000)                           = Doanh thu (10000)
                    - Tong no (4000) + Von chu so huu (6000)    = Chi phi (9000) + Loi nhuan (1000)
                    Gia co phieu = 11000
                    -->  ROE = 1000/6000
                         P/B = 11000/6000
                         P/E = 11000/1000

                    EPS = (loi nhuan sau thue - co tuc co phieu uu dai) / Tong so co phieu thuong dang phat hanh
                    - P/E chi phat huy y nghia khi thoa man EPS
                </div>
                <div>
                    3. Y nghia
                    - Nha dau tu san sang tra bao nhieu tien cho 1 dong loi nhuan
                    - P/E thap: 
                        + Co phieu bi dinh gia thap
                        + Cong ty dang gap van de
                        + Cong ty xuat hien loi nhuan doi bien, do ban tai san
                        + Cong ty o vung dinh chu ky kinh doanh - co phieu theo chu ky
                    - P/E cao:
                        + Co phieu bi dinh gia cao
                        + Trien vong cong ty trong tuong lai tot
                        + Loi nhuan it mang tinh tam thoi
                        + Cong ty o vung day chu ky kinh doanh - co phieu theo chu ky
                </div>
                <div>
                    4. Dinh gia theo phuong phap P/E
                    - Khi cac dieu kien kinh doanh, tai chinh, vi mo nhu nhau thi P/E cang thap cang tot
                    - VD:
                        + Cong ty phat trien nhanh hay khong (neu chi tang truong 5-7% ma P/E van cao ngat nguong, chung to gia co phieu qua cao)
                        + Chi so P/E cua nganh ra sao (so sanh P/E cua 1 cong ty dien luc va 1 cong ty ky thuat cao la vo nghia)
                        + Muc do lam phat, lai suat trai phieu nhu nao? Chi so P/E se nguoc vs 2 dieu nay
                        + Yeu to rui ro cua doanh nghiep: rui ro tai chinh (No), rui ro ve kinh doanh (kha nang xam nhap nganh, ...), rui ro ve quan tri(su trung thuc)
                        + Day co phai cong ty theo chu ky?
                    - {`P/E < 1 / Lai suat ngan hang`}
                    - {`VD: lai suat ngan hang = 6.5% --> P/E < 15.4 Tuy nhien de an toan nen ha lai suat thap hon, vi du P/E < 10`}
                    - Thong thuong P/E tu 5-12 
                </div>
                <div>
                    5. Cong thuc
                    - P1 / EPS = (1 + g)(1 - b) / (r - g)
                        + g: ty le tang truong co tuc
                        + b: ty le chi tra co tuc
                        + r: ty suat sinh loi doi hoi
                </div>
                
            </div>
        )
    }
}

export default StockEvaluation