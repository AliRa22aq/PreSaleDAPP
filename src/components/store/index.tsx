import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PICNIC as PICNICType } from '../../../types/web3-v1-contracts/PICNIC'
import { sales } from "./dummyData";
import web3 from 'web3';


// export interface Status { status: "pending"|"inProgress"|"ended"|"succeed"|"failed"}
// const statusType = "pending" | "inProgress" | "succeed" | "failed";

export interface Sale {
  id: number,
  saleProgress: number,
  status: "pending" | "inProgress" | "succeed" | "failed",
  tokenaddr: string,
  name: string,
  symbol: string,
  decimal: number,
  totalSupply: number,
  typeOfSale: "OpenForAll" | "OnlyWhiteListed" | "OnlyTokenHolders",
  criteriaToken: string,
  tokensForSale: number,
  liquidity: string,
  totalTokens: number,
  price: number,
  softCap: number,
  minimumTokens: string,
  minimumReq: number,
  maximumReq: number,
  startTime: string,
  endingTime: string,
  image: string,
  descriotion: string,
  webLink: string,
  telegramLink: string,
  twitterLink: string
}

export interface ContractInfo {
  address: string | null;
  methods : any;
    name: string | null;
    symbol: string | null;
    decimal: string | null;
    totalSupply: string | null;
    youhold: string | null;
  }
  
  export interface SaleInfo {
    tokensForLiquidity: number | null,
    tokensForSale: number | null
    criteriaAddress: string | null
    type: number | null
    approvedTokens: number,
    tokenRequired: number
}

export interface ParticipationCriteria {
  maxReqTokens: number | null,
  minReqTokens: number | null,
  minTokensForParticipation: number | null,
  priceOfToken: number | null,
  softCap: number | null,
  startingTime: number | null,
  endingTime: number | null
}

export interface GeneralInfo {
  logo: string | null,
  description: string | null,
  discordLink: string | null,
  telegramLink: string | null,
  twitterLink: string | null,
  websiteLink: string | null,

}

export interface FormData {
  contractInfo: ContractInfo,
  saleInfo: SaleInfo,
  participationCriteria: ParticipationCriteria,
  generalInfo: GeneralInfo
}

const formData: FormData = {
  contractInfo: {
    address: null,
    methods: null,
    name: null,
    symbol: null,
    decimal: null,
    totalSupply: null,
    youhold: null
  },
  saleInfo: {
    tokensForLiquidity: null,
    tokensForSale: null,
    criteriaAddress: null,
    type: null,
    approvedTokens: 0,
    tokenRequired: 0
  },
  participationCriteria: {
    maxReqTokens: null,
    minReqTokens: null,
    minTokensForParticipation: null,
    priceOfToken: null,
    softCap: null,
    startingTime: null,
    endingTime: null  
  },
  generalInfo: {
    logo: null,
    description: null,
    discordLink: null,
    telegramLink: null,
    twitterLink: null,
    websiteLink: null,
  }
}


export interface PresaleData {
  contractAddress: string | null,
  methods: any,  
  upforntFee : string | null,
  percentageFee: string | null
}

export const presaleData : PresaleData = {
  contractAddress: null,
  methods: null,
  upforntFee : null,
  percentageFee: null
}

interface DataType {
  networkID: number,
  userAddress: string,
  salesData: Sale[] | null,
  PICNICContract: PICNICType | null,
  loading: boolean,
  loadingNFTS: boolean,
  transectionProgress: boolean,
  contractAddress: string | null,
  isWaletConnect: boolean,
  isSignedIn: boolean,
  userPincicInfo: { balance: string },
  presaleData : PresaleData,
  formData: FormData

}

const initialState: DataType = {
  networkID: 0,
  userAddress: "",
  salesData: sales,
  PICNICContract: null,
  loading: false,
  loadingNFTS: false,
  transectionProgress: false,
  contractAddress: "",
  isWaletConnect: false,
  isSignedIn: false,
  userPincicInfo: { balance: "0" },
  presaleData : presaleData,
  formData : formData

}

// First, define the reducer and action creators via `createSlice`
const dataSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearState(state) {
      return initialState;
    },

    setSaleProgress(state, { payload }: PayloadAction<{ id: number, saleProgress: number }>) {
      state?.salesData?.map((sale: Sale) => {
        if (sale.id === payload.id) {
          sale.saleProgress += payload.saleProgress
        }
      })
      // state.loading = payload
    },

    setData(state, { payload }: PayloadAction<boolean>) {
      state.loading = payload
    },

    setStatus(state, { payload }: PayloadAction<{ id: number, status: "pending" | "inProgress" | "succeed" | "failed" }>) {
      state?.salesData?.map((sale: Sale) => {
        if (sale.id === payload.id) {
          sale.status = payload.status
        }
      })
    },

    setLoading(state, { payload }: PayloadAction<Sale[]>) {
      state.salesData = payload
    },

    setNetworkID(state, { payload }: PayloadAction<number>) {
      state.networkID = payload;
    },

    setActiveUser(state, { payload }: PayloadAction<string>) {
      state.userAddress = payload;
    },

    userWalletconnected(state, { payload }: PayloadAction<boolean>) {
      state.isWaletConnect = payload;
    },

    setPICNICContractFn(state, { payload }: PayloadAction<PICNICType>) {
      state.PICNICContract = payload;

    },

    setuserPicnicBalance(state, { payload }: PayloadAction<string>) {
      state.userPincicInfo.balance = payload
    },

    setPresaleData(state, { payload }: PayloadAction<PresaleData>) {
      state.presaleData = payload
    },


    
    
    setFormcontractInfo(state, { payload }: PayloadAction<ContractInfo>) {
      state.formData.contractInfo = payload
    },
    
    setSaleInfo(state, { payload }: PayloadAction<SaleInfo>) {
      state.formData.saleInfo = payload
    },
    
    setParticipationCriteria(state, { payload }: PayloadAction<ParticipationCriteria>) {
      state.formData.participationCriteria = payload
    },

    setGeneralInfo(state, { payload }: PayloadAction<GeneralInfo>) {
      state.formData.generalInfo = payload
    },
    
    setApprovedTokens(state, { payload }: PayloadAction<number>) {
      state.formData.saleInfo.approvedTokens = payload
    },

  }


});




// Extract the action creators object and the reducer
const { actions, reducer } = dataSlice
// Extract and export each action creator by name
export const {setApprovedTokens, setPresaleData, setGeneralInfo,  setParticipationCriteria, setSaleInfo, setFormcontractInfo, setStatus, setSaleProgress, setuserPicnicBalance, setPICNICContractFn, setLoading, clearState, setNetworkID, setActiveUser, userWalletconnected } = actions
// Export the reducer, either as a default or named export
export default reducer
