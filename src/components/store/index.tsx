import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PICNIC as PICNICType } from '../../../types/web3-v1-contracts/PICNIC'
import web3 from 'web3';



interface DataType {
    networkID: number,
    userAddress: string,
    PICNICContract: PICNICType | null,
    loading: boolean,
    loadingNFTS: boolean,
    transectionProgress: boolean,
    contractAddress: string | null,
    isWaletConnect: boolean,
    isSignedIn: boolean,

  }

const initialState: DataType = {
    networkID: 0,
    userAddress: "",
    PICNICContract: null,
    loading: false,
    loadingNFTS: false,
    transectionProgress: false,
    contractAddress: "",
    isWaletConnect: false,
    isSignedIn: false,

}

// First, define the reducer and action creators via `createSlice`
const dataSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearState(state) {
      return initialState;
    },

    setLoading(state, { payload }: PayloadAction<boolean>){
      state.loading = payload
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
    
    setContractFn(state, {payload}: PayloadAction<PICNICType>){
      state.PICNICContract = payload;

    }


  }
    

});
  


  
// Extract the action creators object and the reducer
const { actions, reducer } = dataSlice
// Extract and export each action creator by name
export const  {setContractFn, setLoading, clearState, setNetworkID, setActiveUser, userWalletconnected } = actions
// Export the reducer, either as a default or named export
export default reducer
