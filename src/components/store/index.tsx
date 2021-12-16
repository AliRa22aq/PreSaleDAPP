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
  userPincicInfo: { balance: string }

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
  userPincicInfo: { balance: "0" }

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
    }


  }


});




// Extract the action creators object and the reducer
const { actions, reducer } = dataSlice
// Extract and export each action creator by name
export const { setStatus, setSaleProgress, setuserPicnicBalance, setPICNICContractFn, setLoading, clearState, setNetworkID, setActiveUser, userWalletconnected } = actions
// Export the reducer, either as a default or named export
export default reducer
