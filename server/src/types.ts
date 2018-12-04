import { EventLog } from 'web3/types'
import { SignedOrder, OrderInfo } from '@0x/contract-wrappers'

export interface ISRA2Order {
  order: SignedOrder
  metaData: OrderInfo
}

export interface ISignedOrderWithStrings {
  senderAddress: string
  makerAddress: string
  takerAddress: string
  makerFee: string
  takerFee: string
  makerAssetAmount: string
  takerAssetAmount: string
  makerAssetData: string
  takerAssetData: string
  salt: string
  exchangeAddress: string
  feeRecipientAddress: string
  expirationTimeSeconds: string
  signature: string
}

export interface IFillEventLog extends EventLog {
  id: string
  transactionHash: string
  blockNumber: number
  logIndex: number
  returnValues: {
    orderHash: string
    senderAddress: string
    feeRecipientAddress: string
    makerAddress: string
    takerAddress: string
    makerAssetData: string
    takerAssetData: string
    makerAssetFilledAmount: string
    takerAssetFilledAmount: string
    makerFeePaid: string
    takerFeePaid: string
  }
}

export interface IEventFilters {
  fromBlock?: number
  toBlock?: number | string
  filter?: Object
}
