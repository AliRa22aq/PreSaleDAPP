/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from "bn.js";
import { ContractOptions } from "web3-eth-contract";
import { EventLog } from "web3-core";
import { EventEmitter } from "events";
import {
  Callback,
  PayableTransactionObject,
  NonPayableTransactionObject,
  BlockType,
  ContractEventLog,
  BaseContract,
} from "./types";

interface EventOptions {
  filter?: object;
  fromBlock?: BlockType;
  topics?: string[];
}

export interface IPancakeRouter extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): IPancakeRouter;
  clone(): IPancakeRouter;
  methods: {
    addLiquidityETH(
      token: string,
      amountTokenDesired: number | string | BN,
      amountTokenMin: number | string | BN,
      amountETHMin: number | string | BN,
      to: string,
      deadline: number | string | BN
    ): PayableTransactionObject<{
      amountToken: string;
      amountETH: string;
      liquidity: string;
      0: string;
      1: string;
      2: string;
    }>;
  };
  events: {
    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };
}
