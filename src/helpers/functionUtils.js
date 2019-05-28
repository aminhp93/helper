import businessSummaryTypes from '../constants/businessSummaryTypes'
import analysisTypes from '../constants/analysisTypes'

export function calculateClose(data, timeValue, percentValue = 0) {
  if (!data) return;
  let smallerCount = 0;
  let largerCount = 0;
  for (let i = 0; i < data.length - timeValue; i++) {
    if (data[i].Close < data[i + timeValue].Close * (1 + percentValue / 100)) {
      smallerCount += 1;
    } else {
      largerCount += 1;
    }
  }
  const returnedData = [
    {
      name: "smallerCount",
      value: smallerCount
    },
    {
      name: "largerCount",
      value: largerCount
    }
  ];
  return returnedData;
}

export function findMaxPercent(data, percentValue = 0) {
  let timeValue = 0;
  let smallerCount = 0;
  let largerCount = 0;
  let returnedSmallerCount = 0;
  let returnedLargerCount = 0;
  let currentPercent = 0;
  for (let j = 1; j < 251; j++) {
    for (let i = 0; i < data.length - j; i++) {
      if (data[i].Close < data[i + j].Close * (1 + percentValue / 100)) {
        smallerCount += 1;
      } else {
        largerCount += 1;
      }
    }
    if (largerCount / (data.length - j) > currentPercent) {
      currentPercent = largerCount / (data.length - j);
      timeValue = j;
      returnedSmallerCount = smallerCount;
      returnedLargerCount = largerCount;
    }
    smallerCount = 0;
    largerCount = 0;
  }
  const returnedData = {
    timeValue: timeValue,
    customedData: [
      {
        name: "smallerCount",
        value: returnedSmallerCount
      },
      {
        name: "largerCount",
        value: returnedLargerCount
      }
    ]
  };
  return returnedData;
}

export function calculateRSI(data) {
  let sumGain = 0;
  let sumLoss = 0;
  for (let j = 1; j < data.length; j++) {
    let change = data[j].Close - data[j - 1].Close;
    if (change > 0) {
      data[j].Gain = change;
      data[j].Loss = 0;
    }
    if (change < 0) {
      data[j].Loss = -change;
      data[j].Gain = 0;
    }
    if (change === 0) {
      data[j].Loss = 0;
      data[j].Gain = 0;
    }
    sumGain += data[j].Gain || 0;
    sumLoss += data[j].Loss || 0;
    if (j < 14) {
      data[j].AverageGain = sumGain / 14;
      data[j].AverageLoss = sumLoss / 14;
    } else {
      data[j].AverageGain = (data[j - 1].AverageGain * 13 + data[j].Gain) / 14;
      data[j].AverageLoss = (data[j - 1].AverageLoss * 13 + data[j].Loss) / 14;
      data[j].RSI = 100 - 100 / (1 + data[j].AverageGain / data[j].AverageLoss);
    }
  }

  if (
    data[data.length - 1] &&
    data[data.length - 2] &&
    data[data.length - 1].RSI &&
    data[data.length - 2].RSI
  ) {
    return {
      RSI_14_previous: Number(data[data.length - 2].RSI.toFixed(0)) || 0,
      RSI_14: Number(data[data.length - 1].RSI.toFixed(0)) || 0
    };
  }
  return {};
}

export function mapData(data, key) {
  let returnedData = [];
  let decreasedStockNumbers = 0;
  let increasedStockNumbers = 0;
  let unchangedStockNumbers = 0;
  for (let i = 0; i < data.length; i++) {
    let price_data_item = JSON.parse(data[i].price_data);
    let lastDay = price_data_item[price_data_item.length - 1];
    let lastTwoDays = price_data_item[price_data_item.length - 2];

    let financial_data_item = JSON.parse(data[i].financial_data);
    // console.log(lastDay)
    let returnItem = {};
    returnItem["Symbol"] = data[i]["Symbol"];
    if (lastDay) {
      returnItem["Close"] = lastDay.Close / 1000;
      returnItem["Volume"] = lastDay.Volume;
      const calculateRSI_result = calculateRSI(price_data_item);
      returnItem["RSI_14"] = calculateRSI_result.RSI_14;
      returnItem["RSI_14_diff"] =
        calculateRSI_result.RSI_14 - calculateRSI_result.RSI_14_previous;
    }
    if (financial_data_item) {
      returnItem["ROE"] = financial_data_item && financial_data_item.ROE * 100;
      returnItem["EPS"] = financial_data_item.EPS;
      returnItem["MarketCapitalization"] =
        financial_data_item.MarketCapitalization / Math.pow(10, 9);
    }
    returnItem[key] = key;
    returnedData.push(returnItem);

    if (lastDay && lastDay.Close && lastTwoDays && lastTwoDays.Close) {
      if (lastDay.Close > lastTwoDays.Close) {
        increasedStockNumbers += 1;
      } else if (lastDay.Close < lastTwoDays.Close) {
        decreasedStockNumbers += 1;
      } else {
        unchangedStockNumbers += 1;
      }
    }
  }
  return {
    returnedData,
    barChartData: [
      {
        name: "Name 1",
        increasedStockNumbers,
        decreasedStockNumbers,
        unchangedStockNumbers
      }
    ]
  };
}

export function formatNumber(input, decimal, fill, nonFixToZero) {
  try {
    if (input === null || isNaN(input) || input === undefined) {
      return "--";
    }
    if (input === "" && !nonFixToZero) {
      return "0";
    }
    if (decimal == null) {
      if (parseFloat(input) >= 2) {
        input = roundFloat(input, 2);
      } else {
        input = roundFloat(input, 3);
      }
    } else {
      input = roundFloat(input, decimal);
    }
    input = input.toString().split(".");
    input[0] = input[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    if (decimal && fill) {
      if (!input[1]) input[1] = "0".repeat(decimal);
      else input[1] += "0".repeat(decimal - input[1].length);
    }
    return input.join(".");
  } catch (ex) {
    console.error(ex);
  }
}
export function roundFloat(numberFloat, length) {
  try {
    if (numberFloat == null || length == null) {
      return 0;
    }
    // let itenDivison = '1';
    // for (let i = 0; i < length; i++) {
    //     itenDivison += '0';
    // }
    // const division = Number(itenDivison);
    let numberString = numberFloat + "";
    let arrNumber = numberString.split(".");
    if (!arrNumber[1]) return numberFloat;
    for (let i = 0; i < length; i++) {
      if (arrNumber[1][0]) {
        arrNumber[0] += arrNumber[1][0];
        arrNumber[1] = arrNumber[1].substr(1);
      } else {
        arrNumber[0] += "0";
      }
    }
    numberString = arrNumber.join(".");
    arrNumber = Math.round(numberString).toString();
    arrNumber = arrNumber.replace(/^(-?)/, "$1" + "0".repeat(length));
    let result = Number(
      arrNumber.substring(0, arrNumber.length - length) +
      "." +
      arrNumber.substr(-length)
    );
    return result;
  } catch (e) {
    console.error(e);
  }
  return 0;
}

export function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

export function getCustomedPieChartData(data) {
  if (!data || !data.length) return [];
  const returnObj = {};
  let returnArray = [];
  for (let i = 0; i < data.length; i++) {
    let item = data[i];
    let key = item.locations && item.locations[0];
    if (key) {
      if (!returnObj.hasOwnProperty(key)) {
        returnObj[key] = 0;
      } else {
        returnObj[key] += 1;
      }
    }
  }
  for (let key in returnObj) {
    returnArray.push({
      name: key,
      value: returnObj[key]
    });
  }
  returnArray.sort((a, b) => b.value - a.value);
  console.log(returnArray);
  return returnArray;
}

export function getAverageSalary(data) {
  if (!data || !data.length) return [];
  const returnObj = {};
  let returnArray = [];
  for (let i = 0; i < data.length; i++) {
    let item = data[i];
    let key = item.locations && item.locations[0];
    if (key) {
      if (!returnObj.hasOwnProperty(key)) {
        returnObj[key] = [];
      } else {
        returnObj[key].push(item.jobSalary);
      }
    }
  }
  for (let key in returnObj) {
    returnArray.push({
      name: key,
      value: calculateAverage(returnObj[key])
    });
  }
  returnArray.sort((a, b) => b.value - a.value);
  console.log(returnArray);
  return returnArray.slice(0, 5);
}

export function calculateAverage(data) {
  if (!data || !data.length) return 0;
  let sum = 0;
  let count = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i];
    count += 1;
  }
  return sum / count;
}

export function mapStockData(data) {
  data.map(item => {
    if (item.Close && item.Volume) {
      item.DayTradingValue = Number(
        ((item.Close * item.Volume) / Math.pow(10, 9)).toFixed(1)
      );
    }
  });

  return data;
}

export function mapDataBusinessSummary(data, businessSummaryType, analysisType) {
  console.log(data, businessSummaryType, analysisType)
  if (businessSummaryType === businessSummaryTypes.KET_QUA_KINH_DOANH) {
    if (analysisType === analysisTypes.ANALYSIS_1) {
      const addItem = {};
      addItem.Expanded = true;
      addItem.Field = null;
      addItem.ID = 110;
      addItem.Level = 1;
      addItem.Name = "110. Loi nhuan hoat dong kinh doanh chinh (5) - (9) - (10)";
      addItem.ParentId = -1;
      addItem.Values = [];
      for (let i = 0; i < data[4].Values.length; i++) {
        let loi_nhuan_gop_5 = data[4].Values[i].Value;
        let chi_phi_ban_hang_9 = data[9].Values[i].Value;
        let chi_phi_quan_ly_10 = data[10].Values[i].Value;
        let loi_nhuan_hoat_dong_kinh_doanh_chinh_110 =
          loi_nhuan_gop_5 - chi_phi_ban_hang_9 - chi_phi_quan_ly_10;
        addItem.Values.push({
          Period: data[4].Values[i].Period,
          Year: data[4].Values[i].Period,
          Quarter: data[4].Values[i].Period,
          Value: loi_nhuan_hoat_dong_kinh_doanh_chinh_110
        });
      }
      data.splice(12, 0, addItem);
      console.log(data);
      return data;
    } else if (analysisType === analysisTypes.ANALYSIS_2) {
      data[3].ANALYSIS_2 = []
      data[4].ANALYSIS_2 = []
      data[5].ANALYSIS_2 = []
      data[6].ANALYSIS_2 = []
      data[7].ANALYSIS_2 = []
      data[8].ANALYSIS_2 = []
      data[9].ANALYSIS_2 = []
      data[10].ANALYSIS_2 = []
      data[11].ANALYSIS_2 = []
      data[12].ANALYSIS_2 = []
      data[13].ANALYSIS_2 = []
      data[14].ANALYSIS_2 = []
      data[15].ANALYSIS_2 = []
      data[16].ANALYSIS_2 = []
      data[17].ANALYSIS_2 = []
      data[18].ANALYSIS_2 = []
      data[19].ANALYSIS_2 = []
      data[20].ANALYSIS_2 = []
      data[21].ANALYSIS_2 = []
      data[22].ANALYSIS_2 = []
      for (let i = 0; i < data[4].Values.length; i++) {
        let doanh_thu_thuan_3 = data[2].Values[i].Value;
        let gia_von_ban_hang_4 = data[3].Values[i].Value;
        let loi_nhuan_gop_5 = data[4].Values[i].Value;
        let doanh_thu_hoat_dong_tai_chinh_6 = data[5].Values[i].Value;
        let chi_phi_tai_chinh_7 = data[6].Values[i].Value;
        let chi_phi_lai_vay_701 = data[7].Values[i].Value;
        let phan_loi_nhuan_lien_ket_kinh_doanh_8 = data[8].Values[i].Value;
        let chi_phi_ban_hang_9 = data[9].Values[i].Value;
        let chi_phi_quan_ly_10 = data[10].Values[i].Value;
        let loi_nhuan_thuan_tu_hoat_dong_kinh_doanh_11 = data[11].Values[i].Value;
        let loi_nhuan_hoat_dong_kinh_doanh_chinh_110 = data[12].Values[i].Value;
        let thu_nhap_khac_12 = data[13].Values[i].Value;
        let chi_phi_khac_13 = data[14].Values[i].Value;
        let loi_nhuan_khac_14 = data[15].Values[i].Value;
        let tong_loi_nhuan_ke_toan_truoc_thue_15 = data[16].Values[i].Value;
        let chi_phi_thue_TNDN_hien_hanh_16 = data[17].Values[i].Value;
        let chi_phi_thue_TNDN_hoan_lai_17 = data[18].Values[i].Value;
        let chi_phi_thue_TNDN_18 = data[19].Values[i].Value;
        let loi_nhuan_sau_thue_thu_nhap_doanh_nghiep_19 = data[20].Values[i].Value;
        let loi_nhuan_sau_thue_cua_co_dong_khong_kiem_soat_20 = data[21].Values[i].Value;
        let loi_nhuan_sau_thue_cua_co_dong_cong_ty_me_21 = data[22].Values[i].Value;

        data[3].ANALYSIS_2.push({
          Value: ((gia_von_ban_hang_4 / doanh_thu_thuan_3) * 100).toFixed(2)
        })
        data[4].ANALYSIS_2.push({
          Value: ((loi_nhuan_gop_5 / doanh_thu_thuan_3) * 100).toFixed(2)
        })
        data[5].ANALYSIS_2.push({
          Value: ((doanh_thu_hoat_dong_tai_chinh_6 / doanh_thu_thuan_3) * 100).toFixed(2)
        })
        data[6].ANALYSIS_2.push({
          Value: ((chi_phi_tai_chinh_7 / doanh_thu_thuan_3) * 100).toFixed(2)
        })
        data[7].ANALYSIS_2.push({
          Value: ((chi_phi_lai_vay_701 / doanh_thu_thuan_3) * 100).toFixed(2)
        })
        data[8].ANALYSIS_2.push({
          Value: ((phan_loi_nhuan_lien_ket_kinh_doanh_8 / doanh_thu_thuan_3) * 100).toFixed(2)
        })
        data[9].ANALYSIS_2.push({
          Value: ((chi_phi_ban_hang_9 / doanh_thu_thuan_3) * 100).toFixed(2)
        })
        data[10].ANALYSIS_2.push({
          Value: ((chi_phi_quan_ly_10 / doanh_thu_thuan_3) * 100).toFixed(2)
        })
        data[11].ANALYSIS_2.push({
          Value: ((loi_nhuan_thuan_tu_hoat_dong_kinh_doanh_11 / doanh_thu_thuan_3) * 100).toFixed(2)
        })
        data[12].ANALYSIS_2.push({
          Value: ((loi_nhuan_hoat_dong_kinh_doanh_chinh_110 / doanh_thu_thuan_3) * 100).toFixed(2)
        })
        data[13].ANALYSIS_2.push({
          Value: ((thu_nhap_khac_12 / doanh_thu_thuan_3) * 100).toFixed(2)
        })
        data[14].ANALYSIS_2.push({
          Value: ((chi_phi_khac_13 / doanh_thu_thuan_3) * 100).toFixed(2)
        })
        data[15].ANALYSIS_2.push({
          Value: ((loi_nhuan_khac_14 / doanh_thu_thuan_3) * 100).toFixed(2)
        })
        data[16].ANALYSIS_2.push({
          Value: ((tong_loi_nhuan_ke_toan_truoc_thue_15 / doanh_thu_thuan_3) * 100).toFixed(2)
        })
        data[17].ANALYSIS_2.push({
          Value: ((chi_phi_thue_TNDN_hien_hanh_16 / doanh_thu_thuan_3) * 100).toFixed(2)
        })
        data[18].ANALYSIS_2.push({
          Value: ((chi_phi_thue_TNDN_hoan_lai_17 / doanh_thu_thuan_3) * 100).toFixed(2)
        })
        data[19].ANALYSIS_2.push({
          Value: ((chi_phi_thue_TNDN_18 / doanh_thu_thuan_3) * 100).toFixed(2)
        })
        data[20].ANALYSIS_2.push({
          Value: ((loi_nhuan_sau_thue_thu_nhap_doanh_nghiep_19 / doanh_thu_thuan_3) * 100).toFixed(2)
        })
        data[21].ANALYSIS_2.push({
          Value: ((loi_nhuan_sau_thue_cua_co_dong_khong_kiem_soat_20 / doanh_thu_thuan_3) * 100).toFixed(2)
        })
        data[22].ANALYSIS_2.push({
          Value: ((loi_nhuan_sau_thue_cua_co_dong_cong_ty_me_21 / doanh_thu_thuan_3) * 100).toFixed(2)
        })
      }
      console.log(data);
      return data
    } else {
      return data
    }
  } else if (businessSummaryType === businessSummaryTypes.CAN_DOI_KE_TOAN) {
    if (analysisType === analysisTypes.ANALYSIS_3) {
      data[3].ANALYSIS_3 = []
      data[4].ANALYSIS_3 = []
      data[5].ANALYSIS_3 = []
      data[6].ANALYSIS_3 = []
      data[7].ANALYSIS_3 = []
      data[8].ANALYSIS_3 = []
      data[9].ANALYSIS_3 = []
      data[10].ANALYSIS_3 = []
      data[11].ANALYSIS_3 = []
      data[12].ANALYSIS_3 = []
      data[13].ANALYSIS_3 = []
      data[14].ANALYSIS_3 = []
      data[15].ANALYSIS_3 = []
      data[16].ANALYSIS_3 = []
      data[17].ANALYSIS_3 = []
      data[18].ANALYSIS_3 = []
      data[19].ANALYSIS_3 = []
      data[20].ANALYSIS_3 = []
      data[21].ANALYSIS_3 = []
      data[22].ANALYSIS_3 = []
      for (let i = 0; i < data[4].Values.length; i++) {
        let tai_san_luu_dong_va_dau_tu_ngan_han_101 = data[1].Values[i].Value;
        let tien_va_cac_khoan_tuong_duong_tien_10101 = data[2].Values[i].Value;
        let tien_1010101 = data[3].Values[i].Value;
        let cac_khoan_tuong_duong_tien_1010102 = data[4].Values[i].Value;
        let cac_khoan_dau_tu_tai_chinh_ngan_han_10102 = data[5].Values[i].Value;
        let chung_khoan_kinh_doanh_1010201 = data[6].Values[i].Value;
        let du_phong_giam_gia_chung_khoan_kinh_doanh_1010202 = data[7].Values[i].Value;
        let dau_tu_nam_giu_den_ngay_dao_han_1010203 = data[8].Values[i].Value;
        let cac_khoan_phai_thu_ngan_han_10103 = data[9].Values[i].Value;
        let phai_thu_ngan_han_cua_khach_hang_1010301 = data[10].Values[i].Value;
        let tra_truoc_cho_nguoi_ban_1010302 = data[11].Values[i].Value;
        let phai_thu_noi_bo_ngan_han_1010303 = data[12].Values[i].Value;
        let phai_thu_theo_tien_do_hop_dong_xay_dung_1010304 = data[13].Values[i].Value;
        let phai_thu_ve_cho_vay_ngan_han_1010305 = data[14].Values[i].Value;
        let phai_thu_ngan_han_khac_1010306 = data[15].Values[i].Value;
        let du_phong_phai_thu_ngan_han_kho_doi_1010307 = data[16].Values[i].Value;
        let tong_hang_ton_kho_10104 = data[17].Values[i].Value;
        let hang_ton_kho_1010401 = data[18].Values[i].Value;
        let du_phong_giam_gia_hang_ton_kho_1010402 = data[18].Values[i].Value;
        let tai_san_ngan_han_khac_10105 = data[20].Values[i].Value;
        let chi_phi_tra_truoc_ngan_han_1010501 = data[21].Values[i].Value;
        let thu_gia_tri_gia_tang_duoc_khac_tru_1010502 = data[22].Values[i].Value;
        let thue_va_cac_khoan_phai_thu_nha_nuoc_1010503 = data[23].Values[i].Value;
        let giao_dich_mua_ban_lai_trai_phieu_chinh_phu_1010504 = data[24].Values[i].Value;
        let tai_san_ngan_han_khac_1010505 = data[25].Values[i].Value;
        let tai_san_co_dinh_va_dau_tu_dai_han_102 = data[26].Values[i].Value;
        let cac_khoan_phai_thu_dai_han_10201 = data[27].Values[i].Value;
        let phai_thu_dai_han_cua_khach_hang_1020101 = data[28].Values[i].Value;
        let von_kinh_doanh_tai_cac_don_vi_truc_thuoc_1020102 = data[29].Values[i].Value;
        let phai_thu_dai_han_noi_bo_1020103 = data[30].Values[i].Value;
        let phai_thu_ve_cho_vay_dai_han_1020104 = data[31].Values[i].Value;
        let phai_thu_dai_han_khac_1020105 = data[32].Values[i].Value;
        let du_phong_phai_thu_dai_han_kho_doi_1020106 = data[33].Values[i].Value;
        let tai_san_co_dinh_10202 = data[34].Values[i].Value;
        let tai_san_co_dinh_huu_hinh_1020201 = data[35].Values[i].Value;
        let nguyen_gia_102020101 = data[36].Values[i].Value;
        let gia_tri_hao_mon_luy_ke_102020102 = data[37].Values[i].Value;
        let tai_san_co_dinh_thue_tai_chinh_1020202 = data[38].Values[i].Value;
        let nguyen_gia_102020201 = data[39].Values[i].Value;
        let gia_tri_hao_mon_luy_ke_102020202 = data[40].Values[i].Value;
        let tai_san_co_dinh_vo_hinh_1020203 = data[41].Values[i].Value;
        let nguyen_gia_102020301 = data[42].Values[i].Value;
        let gia_tri_hao_mon_luy_ke_102020302 = data[43].Values[i].Value;
        let bat_dong_san_dau_tu_10203 = data[44].Values[i].Value;
        let nguyen_gia_1020301 = data[45].Values[i].Value;
        let gia_tri_hao_mon_luy_ke_1020302 = data[46].Values[i].Value;
        let tai_san_do_dang_dai_han_10204 = data[47].Values[i].Value;
        let chi_phi_san_xuat_kinh_doanh_do_dang_dai_han_1020401 = data[48].Values[i].Value;
        let chi_phi_xay_dung_co_ban_do_dang_1020402 = data[49].Values[i].Value;
        let cac_khoan_dau_tu_tai_chinh_dai_han_10205 = data[50].Values[i].Value;
        let dau_tu_vao_cong_ty_con_1020501 = data[51].Values[i].Value;
        let dau_tu_vao_cong_ty_lien_ket_lien_doanh_1020502 = data[52].Values[i].Value;
        let dau_tu_khac_vao_cong_cu_von_1020503 = data[53].Values[i].Value;
        let du_phong_giam_gia_dau_tu_tai_chinh_dai_han_1020504 = data[54].Values[i].Value;
        let dau_tu_nam_giu_den_ngay_dau_han_1020505 = data[55].Values[i].Value;
        let tong_tai_san_dai_han_khac_10206 = data[56].Values[i].Value;
        let chi_phi_tra_truoc_dai_han_1020601 = data[57].Values[i].Value;
        let tai_san_thue_thu_nhap_hoan_lai_1020602 = data[58].Values[i].Value;
        let tai_san_dai_han_khac_1020603 = data[59].Values[i].Value;
        let loi_the_thuong_mai_10207 = data[60].Values[i].Value;
        let tong_cong_tai_san_2 = data[61].Values[i].Value;
        for (let j = 1; j < 116; j++) {
          if (!data[j].ANALYSIS_3) data[j].ANALYSIS_3 = []
          data[j].ANALYSIS_3.push({
            Value: ((((data[j].Values[i] || {}).Value) / tong_cong_tai_san_2) * 100).toFixed(2)
          })
        }
      }
      console.log(data)
      return data
    }
    return data
  }
  return data;
}

export function strcmp(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}