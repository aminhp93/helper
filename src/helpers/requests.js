import moment from "moment";
import axios from "axios";
import { calculateRSI, msToTime } from "../helpers/functionUtils";
import config from "./../config";
import { func } from "prop-types";
import durationReportEnums from "../constants/durationReportEnums";

let domain = config.isProduction
  ? "https://project-2018-backend.herokuapp.com/"
  : "http://localhost:8000/";
const HOSE_stocks = "AAA,AAM,ABT,ACC,ACL,ADS,AGD,AGF,AGM,AGR,ALP,AMD,ANV,APC,APG,ASIAGF,ASM,ASP,AST,ATG,BAS,BBC,BCE,BCG,BCI,BFC,BGM,BHN,BHS,BIC,BID,BMC,BMI,BMP,BRC,BSI,BTP,BTT,BVH,BWE,C32,C47,CAV,CCI,CCL,CDC,CEE,CHP,CIG,CII,CLC,CLG,CLL,CLP,CLW,CMG,CMV,CMX,CNG,COM,CRC,CRE,CSG,CSM,CSV,CTD,CTF,CTG,CTI,CTS,CVT,D2D,DAG,DAH,DAT,DBD,DCC,DCL,DCM,DGW,DHA,DHC,DHG,DHM,DIC,DIG,DLG,DMC,DPG,DPM,DPR,DQC,DRC,DRH,DRL,DSN,DTA,DTL,DTT,DVD,DVP,DXG,DXV,E1VFVN30,EIB,ELC,EMC,EVE,EVG,FBT,FCM,FCN,FDC,FIR,FIT,FLC,FMC,FPC,FPT,FRT,FTM,FTS,FUCTVGF1,FUCTVGF2,FUCVREIT,FUESSV50,GAS,GDT,GEX,GIL,GMC,GMD,GSP,GTA,GTN,HAG,HAH,HAI,HAP,HAR,HAS,HAX,HBC,HCD,HCM,HDB,HDC,HDG,HHS,HID,HII,HLG,HMC,HNG,HOT,HPG,HPX,HQC,HRC,HSG,HSL,HT1,HT2,HTI,HTL,HTN,HTT,HTV,HU1,HU3,HUB,HVG,HVH,HVN,HVX,IBC,IDI,IJC,ILB,IMP,ITA,ITC,ITD,JVC,KAC,KBC,KDC,KDH,KHP,KMR,KPF,KSA,KSB,KSH,KSS,L10,LAF,LBM,LCG,LCM,LDG,LEC,LGC,LGL,LHG,LIX,LM8,LMH,LSS,MAFPF1,MBB,MCG,MCP,MCV,MDG,MHC,MSH,MSN,MWG,NAF,NAV,NBB,NCT,NHS,NHW,NKD,NKG,NLG,NNC,NSC,NT2,NTL,NVL,NVN,NVT,OGC,OPC,PAC,PAN,PC1,PDN,PDR,PET,PGC,PGD,PGI,PHC,PHR,PHT,PIT,PJT,PLP,PLX,PME,PMG,PNC,PNJ,POM,POW,PPC,PPI,PRUBF1,PTB,PTC,PTL,PVD,PVF,PVT,PXI,PXS,PXT,QBS,QCG,RAL,RDP,REE,RIC,ROS,S4A,SAB,SAM,SAV,SBA,SBC,SBT,SBV,SC5,SCD,SCR,SCS,SEC,SFC,SFG,SFI,SGN,SGR,SGT,SHA,SHI,SHP,SII,SJD,SJF,SJS,SKG,SMA,SMB,SMC,SPM,SRC,SRF,SSC,SSI,ST8,STB,STG,STK,SVC,SVI,SVT,SZC,SZL,TAC,TBC,TCB,TCD,TCH,TCL,TCM,TCO,TCR,TCT,TDC,TDG,TDH,TDM,TDW,TEG,TGG,THG,THI,TIE,TIP,TIX,TLD,TLG,TLH,TMP,TMS,TMT,TNA,TNC,TNI,TNT,TPB,TPC,TRA,TRC,TRI,TS4,TSC,TTB,TTE,TTF,TVB,TVS,TVT,TYA,UDC,UIC,VAF,VCB,VCF,VCI,VDP,VDS,VFG,VFMVF1,VFMVF4,VFMVFA,VHC,VHG,VHM,VIC,VID,VIP,VIS,VJC,VMD,VND,VNE,VNG,VNL,VNM,VNS,VOS,VPB,VPD,VPG,VPH,VPI,VPK,VPL,VPS,VRC,VRE,VSC,VSH,VSI,VTB,VTO,YBM,YEG"
  // .slice(0, 7)
  .split(",");
const HNX_stocks = "AAV,ACB,ACM,ADC,AGC,ALT,ALV,AMC,AME,AMV,API,APP,APS,ARM,ART,ASA,ATS,AVS,BAM,BAX,BBS,BCC,BDB,BED,BII,BKC,BLF,BPC,BSC,BST,BTS,BTW,BVS,BXH,C69,C92,CAG,CAN,CAP,CDN,CEO,CET,CIA,CIC,CJC,CKV,CLH,CLM,CMC,CMI,CMS,CPC,CSC,CT6,CTA,CTB,CTC,CTM,CTP,CTT,CTV,CTX,CVN,CX8,D11,DAD,DAE,DBC,DBT,DC2,DC4,DCS,DDG,DGC,DGL,DHI,DHL,DHP,DHT,DID,DIH,DL1,DLR,DNC,DNM,DNP,DNY,DP3,DPC,DPS,DS3,DST,DTD,DXP,DZM,E1SSHN30,EBS,ECI,EID,FDT,FID,GBS,GDW,GFC,GHA,GKM,GLT,GMX,HAD,HAT,HBB,HBE,HBS,HCC,HCT,HDA,HEV,HGM,HHC,HHG,HHL,HHP,HJS,HKB,HKT,HLC,HLD,HLY,HMH,HNM,HOM,HPM,HPR,HPS,HSC,HST,HTB,HTC,HTP,HUT,HVA,HVT,ICG,IDJ,IDV,INC,INN,ITQ,IVS,KBT,KDM,KHB,KHS,KKC,KLF,KLS,KMF,KMT,KSD,KSK,KSQ,KST,KTS,KTT,KVC,L14,L18,L35,L43,L61,L62,LAS,LBE,LCD,LCS,LDP,LHC,LIG,LM7,LO5,LTC,LUT,MAC,MAS,MAX,MBG,MBS,MCC,MCF,MCL,MCO,MDC,MEC,MED,MEL,MHL,MIH,MIM,MKV,MNC,MPT,MSC,MST,NAG,NAP,NBC,NBP,NBW,NDF,NDN,NDX,NET,NFC,NGC,NHA,NHC,NHP,NIS,NLC,NRC,NSH,NSN,NST,NTP,NVB,NVC,OCH,ONE,PBP,PCE,PCG,PCN,PCT,PDB,PDC,PEN,PGS,PGT,PHN,PHP,PHS,PIC,PJC,PLC,PMB,PMC,PMP,PMS,POT,PPE,PPP,PPS,PPY,PRC,PSC,PSD,PSE,PSI,PSW,PTD,PTI,PTS,PV2,PVB,PVC,PVE,PVG,PVI,PVL,PVS,PVV,PVX,QHD,QNC,QST,QTC,RCL,RHC,S55,S64,S74,S91,S99,SAF,SCI,SCJ,SCL,SD2,SD4,SD5,SD6,SD9,SDA,SDC,SDD,SDG,SDN,SDS,SDT,SDU,SEB,SED,SEL,SFN,SGC,SGD,SGH,SGO,SHB,SHE,SHN,SHS,SIC,SJ1,SJC,SJE,SKS,SLS,SME,SMN,SMT,SNG,SPI,SPP,SRA,SSM,SSS,STC,STP,SVN,SVS,TA9,TAR,TAS,TBX,TC6,TCS,TDN,TDT,TET,TFC,THB,THS,THT,THV,TIG,TJC,TKC,TKU,TLC,TMB,TMC,TMX,TNG,TPH,TPP,TSB,TSM,TST,TTC,TTH,TTL,TTT,TTZ,TV2,TV3,TV4,TVC,TVD,TXM,UNI,V12,V21,VAT,VBC,VC1,VC2,VC3,VC6,VC7,VC9,VCC,VCG,VCH,VCM,VCR,VCS,VCV,VDL,VE1,VE2,VE3,VE4,VE8,VE9,VGC,VGP,VGS,VHE,VHL,VIE,VIG,VIT,VIX,VKC,VLA,VMC,VMI,VMS,VNC,VNF,VNR,VNT,VSA,VSM,VTC,VTH,VTJ,VTL,VTS,VTV,VXB,WCS,WSS,X20,XMC,YSC".split(
  ","
);
const UPCOM_stocks = "A32,ABC,ABI,ABR,AC4,ACE,ACS,ACV,ADP,AFC,AFX,AG1,AGP,AGX,AMP,AMS,ANT,APF,APL,AQN,ASD,ATA,ATB,AUM,AVC,AVF,B82,BAB,BAL,BBM,BBT,BCB,BCM,BCP,BDC,BDF,BDG,BDP,BDT,BDW,BEL,BGW,BHA,BHC,BHG,BHK,BHP,BHT,BHV,BIO,BLI,BLN,BLT,BLU,BLW,BMD,BMF,BMG,BMJ,BMN,BMS,BMV,BNW,BOT,BPW,BQB,BRR,BRS,BSA,BSD,BSG,BSH,BSL,BSP,BSQ,BSR,BT1,BT6,BTB,BTC,BTD,BTG,BTH,BTN,BTR,BTU,BTV,BUD,BVG,BVN,BWA,BWS,BXD,C12,C21,C22,C36,C4G,C71,CAD,CAT,CBI,CBS,CC1,CC4,CCH,CCM,CCP,CCR,CCT,CCV,CDG,CDH,CDO,CDP,CDR,CE1,CEC,CEG,CEN,CER,CFC,CGP,CGV,CH5,CHC,CHS,CI5,CID,CIP,CKA,CKD,CKH,CLS,CLX,CMF,CMK,CMN,CMP,CMT,CMW,CNC,CNH,CNN,CNT,CPH,CPI,CQT,CSI,CT3,CTN,CTR,CTW,CVC,CVH,CXH,CYC,CZC,D26,DAC,DAP,DAR,DAS,DBF,DBH,DBM,DBW,DC1,DCD,DCF,DCG,DCH,DCI,DCR,DCT,DDH,DDM,DDN,DDV,DFC,DGT,DHB,DHD,DHN,DKP,DLC,DLD,DLT,DLV,DM7,DNA,DND,DNE,DNF,DNH,DNL,DNN,DNR,DNS,DNT,DNW,DOC,DOP,DP1,DP2,DPH,DPP,DRI,DSC,DSG,DSP,DSS,DSV,DT4,DTC,DTG,DTI,DTK,DTN,DTV,DVC,DVH,DVN,DVW,DWS,DX2,DXL,EAD,EFI,EIC,EIN,EME,EMG,EMS,EPC,EPH,EVF,EVS,FBA,FBC,FCC,FCS,FDG,FGL,FHN,FHS,FIC,FOC,FOX,FRC,FRM,FSO,FT1,FTI,G20,G36,GCB,GEG,GER,GGG,GGS,GHC,GLC,GLW,GND,GSM,GTC,GTD,GTH,GTS,GTT,GVR,GVT,H11,HAB,HAC,HAF,HAM,HAN,HAV,HBD,HBH,HBI,HBW,HC3,HCI,HCS,HD2,HD8,HDM,HDO,HDP,HDW,HEC,HEJ,HEM,HEP,HES,HFB,HFC,HFS,HFT,HFX,HGW,HHA,HHN,HHR,HHV,HIG,HIZ,HJC,HKP,HLA,HLB,HLE,HLR,HLS,HMG,HMS,HNA,HNB,HND,HNF,HNI,HNP,HNR,HNT,HPB,HPD,HPH,HPI,HPL,HPP,HPT,HPU,HPW,HRB,HRG,HRT,HSA,HSI,HSM,HTE,HTG,HTK,HTM,HTR,HTU,HTW,HU4,HU6,HUG,HVC,HWS,I10,I40,ICC,ICF,ICI,ICN,IDC,IDN,IFC,IFS,IHK,IKH,ILA,ILC,ILS,IME,IMT,IN4,IPA,IRC,ISG,ISH,IST,ITS,JOS,JSC,KBE,KCB,KCE,KDF,KGM,KGU,KHA,KHD,KHL,KHW,KIP,KLB,KOS,KSC,KSE,KSV,KTB,KTC,KTL,KTU,L12,L44,L45,L63,LAI,LAW,LBC,LCC,LCW,LDW,LG9,LIC,LKW,LLM,LM3,LMC,LMI,LPB,LQN,LTG,LWS,M10,MBN,MC3,MCH,MCI,MCT,MDA,MDF,MDN,MEF,MES,MFS,MGC,MGG,MH3,MIC,MIE,MIG,MJC,MKP,MLC,MLN,MLS,MMC,MNB,MND,MPC,MPY,MQB,MQN,MRF,MSR,MTA,MTC,MTG,MTH,MTL,MTM,MTP,MTS,MTV,MVB,MVC,MVN,MVY,NAC,NAS,NAU,NAW,NBE,NBR,NBT,NCP,NCS,ND2,NDC,NDP,NDT,NED,NHH,NHN,NHT,NHV,NLS,NMK,NNB,NNG,NNT,NOS,NPH,NPS,NQB,NQN,NQT,NS2,NS3,NSG,NSP,NSS,NTB,NTC,NTR,NTT,NTW,NUE,NVP,NWT,OIL,ONW,ORS,PAI,PBK,PBT,PCC,PCF,PCM,PDT,PDV,PEC,PEG,PEQ,PFL,PFV,PGV,PHH,PIA,PID,PIS,PIV,PJS,PKR,PLA,PMJ,PMT,PND,PNG,PNP,PNT,POB,POS,POV,PPG,PPH,PRO,PRT,PSB,PSG,PSL,PSN,PSP,PTE,PTG,PTH,PTK,PTM,PTO,PTP,PTT,PTX,PVA,PVH,PVM,PVO,PVP,PVR,PVY,PWS,PX1,PXA,PXC,PXL,PXM,PYU,QBR,QCC,QHW,QLD,QLT,QNS,QNU,QNW,QPH,QSP,QTP,RAT,RBC,RCC,RCD,REM,RGC,RHN,RLC,RTB,RTH,RTS,S12,S27,S33,S72,S96,SAC,SAL,SAP,SAS,SB1,SBD,SBH,SBL,SBM,SBS,SCC,SCH,SCO,SCY,SD1,SD3,SD7,SD8,SDB,SDE,SDF,SDH,SDI,SDJ,SDK,SDP,SDV,SDX,SDY,SEA,SEP,SFT,SGP,SGS,SHC,SHG,SHV,SHX,SID,SIV,SJG,SJM,SKH,SKN,SKV,SLC,SNC,SNZ,SON,SP2,SPA,SPB,SPC,SPD,SPH,SPV,SQC,SRB,SRT,SSF,SSG,SSN,SSU,STL,STS,STT,STU,STV,STW,SUM,SVG,SVH,SVL,SWC,SZE,T12,TA3,TA6,TAG,TAP,TAW,TB8,TBD,TBN,TBT,TCI,TCJ,TCK,TCW,TDB,TDP,TDS,TEC,TEL,TGP,TH1,THN,THR,THU,THW,TID,TIS,TL4,TLI,TLP,TLT,TMG,TMW,TNB,TND,TNM,TNP,TNS,TNW,TNY,TOP,TOT,TOW,TPS,TQN,TRS,TRT,TS3,TS5,TSD,TSG,TSJ,TTD,TTG,TTJ,TTN,TTP,TTR,TTS,TTV,TUG,TV1,TVA,TVG,TVH,TVM,TVN,TVP,TVU,TVW,TW3,UCT,UDJ,UEM,UMC,UPC,UPH,USC,USD,V11,V15,VAV,VBG,VBH,VC5,VCA,VCE,VCP,VCT,VCW,VCX,VDB,VDM,VDN,VDT,VEA,VEC,VEE,VEF,VES,VET,VFC,VFR,VGG,VGI,VGL,VGR,VGT,VGV,VHD,VHF,VHH,VIA,VIB,VIF,VIH,VIM,VIN,VIR,VIW,VKD,VKP,VLB,VLC,VLF,VLG,VLP,VLW,VMA,VMG,VNA,VNB,VNH,VNI,VNN,VNP,VNX,VNY,VOC,VPA,VPC,VPR,VPW,VQC,VRG,VSE,VSF,VSG,VSN,VSP,VST,VT1,VT8,VTA,VTE,VTG,VTI,VTK,VTM,VTP,VTX,VVN,VWS,WSB,WTC,WTN,X18,X26,X77,XDH,XHC,XLV,XMD,XPH,YBC,YRC,YTC".split(
  ","
);
let time = moment()
let subtract = 0
if (time.format('hh') < 16) {
  subtract = 1
}
const endDay = time
  .subtract(subtract, "days")
  .format("YYYY-MM-DD");
console.log(subtract, endDay)

export function getAllNotesUrl() {
  return domain + "posts/all";
}

export function getCreateNoteUrl() {
  return domain + "post/create";
}

export function getUpdateNoteUrl() {
  return domain + "post/update";
}

export function getDeleteNoteUrl() {
  return domain + "post/delete";
}

export function getDeleteAllStocksUrl() {
  return domain + "stock/delete/all";
}

export function getCreateStockUrl() {
  return domain + "stock/create";
}

export function getUpdateStockUrl() {
  return domain + 'stock/update'
}

export function getAllStocksUrl() {
  return domain + "stocks/all";
}

export function getQuickFilteredStocksUrl() {
  return domain + "stocks/quickFilteredStocks";
}

export function getFilteredStocksUrl() {
  return domain + "stocks/filter";
}

export function getAllJobsUrl() {
  return domain + "jobs/all";
}

export function getCreateJobUrl() {
  return domain + "job/create";
}

export function getLastJobUrl() {
  return domain + "job/lastjob";
}

export function getUpdateJobUrl() {
  return domain + "job/update";
}

export function getDataHistoryUrl(symbol, resolution, fromDate, toDate) {
  return (
    "https://dchart-api.vndirect.com.vn/dchart/history?symbol=" +
    symbol +
    "&resolution=" +
    resolution +
    "&from=" +
    fromDate +
    "&to=" +
    toDate
  );
}

export function getAllLayoutsUrl() {
  return "https://chart-api.vndirect.com.vn/1.1/charts?client=vnds_trading_view&user=vnds-0001813109";
}

export function getSaveLayoutChartUrl(id) {
  return `https://chart-api.vndirect.com.vn/1.1/charts?client=vnds_trading_view&user=vnds-0001813109&chart=${id}`;
}

export function getWatchingStocksUrl() {
  return "https://watchlist-api.vndirect.com.vn/api/watchlists?filter[where][creator]=vnds-0001813109";
}

export function getLastestFinancialReports(type, symbol, index) {
  return `https://www.fireant.vn/api/Data/Finance/LastestFinancialReports?symbol=${symbol}&type=${type}&year=2018&quarter=${
    index === durationReportEnums.YEAR ? "0" : "4"
    }&count=5`;
}

export async function updateAllStocksDatabase(floor, _this) {
  let startTime = new Date();
  let endTime;
  let stop = false;
  let floor_stocks;
  if (floor === "HOSE_stocks") {
    floor_stocks = HOSE_stocks;
  } else if (floor === "HNX_stocks") {
    floor_stocks = HNX_stocks;
  } else if (floor === "UPCOM_stocks") {
    floor_stocks = UPCOM_stocks;
  }
  const response2 = await updatedStockDatabase(floor_stocks);
  console.log(response2);
  response2.map(item => {
    if (item.message === "error") {
      stop = true;
      console.log(JSON.stringify(item.errorsList[0].data.Symbol));
      return;
    }
  });

  if (stop) {
    endTime = new Date();
    _this.setState({
      loading: false
    });
    console.log(`Updated failed somewhere in ${msToTime(endTime - startTime)}`);
    return "Updated all stocks failed" + floor;
  }
  endTime = new Date();
  console.log(
    `Updated all stocks successfully ${floor} in ${msToTime(
      endTime - startTime
    )}`
  );
  _this.setState({
    loading: false
  });
  return "Updated all stocks successfully";
}

export function deleteAllStocks() {
  return axios.post(getDeleteAllStocksUrl());
}

async function getLastestFinancialInfo(resolve, item) {
  let response1;
  let errorsList = [];
  await axios
    .get(
      `https://svr1.fireant.vn/api/Data/Markets/HistoricalQuotes?symbol=${item}&startDate=2012-1-1&endDate=${endDay}`
    )
    .then(response => {
      response1 = response;
    })
    .catch(error => {
      errorsList.push(error);
      console.log(error);
    });
  if (errorsList.length > 0) return resolve({ message: "error" });
  console.log(response1.data);
  const lastDay = response1.data[response1.data.length - 1];
  const calculateRSI_result = calculateRSI(response1.data);
  console.log(calculateRSI_result);
  let today_capitalization = 0;
  let percentage_change_in_volume =
    calculateRSI_result.percentage_change_in_volume;
  let percentage_change_in_price =
    calculateRSI_result.percentage_change_in_price;
  if (lastDay && lastDay.Close && lastDay.Volume) {
    today_capitalization = lastDay.Close * lastDay.Volume;
  }
  await axios
    .post(getCreateStockUrl(), {
      Symbol: item,
      price_data: JSON.stringify(response1.data),
      today_capitalization,
      percentage_change_in_volume,
      percentage_change_in_price,
      Close: lastDay && lastDay.Close,
      Volume: lastDay && lastDay.Volume,
      RSI_14: calculateRSI_result.RSI_14,
      RSI_14_diff:
        calculateRSI_result.RSI_14 - calculateRSI_result.RSI_14_previous
    })
    .then(response => { })
    .catch(error => {
      errorsList.push({
        error,
        data: {
          Symbol: item,
          price_data: JSON.stringify(response1.data),
          Close: lastDay && lastDay.Close,
          Volume: lastDay && lastDay.Volume,
          RSI_14: calculateRSI_result.RSI_14,
          RSI_14_diff:
            calculateRSI_result.RSI_14 - calculateRSI_result.RSI_14_previous
        }
      });
      console.log(error);
    });
  if (errorsList.length > 0) return resolve({ message: "error", errorsList });
  return resolve({ message: "success" });
}

function updatedStockDatabase(floor) {
  let listPromises = [];
  floor.map(item => {
    listPromises.push(
      new Promise(resolve => {
        getLastestFinancialInfo(resolve, item);
      })
    );
  });
  return Promise.all(listPromises);
}
