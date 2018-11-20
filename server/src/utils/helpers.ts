import { assetDataUtils } from '@0x/order-utils'
import * as R from 'ramda'

export const convertOrderToSRA2Format = order => ({
  order: R.pick([
    'makerAddress',
    'takerAddress',
    'feeRecipientAddress',
    'senderAddress',
    'makerAssetAmount',
    'takerAssetAmount',
    'makerFee',
    'takerFee',
    'expirationTimeSeconds',
    'salt',
    'makerAssetData',
    'takerAssetData',
    'exchangeAddress',
    'signature'
  ], order),
  metaData: R.pick([
    'orderHash',
    'remainingTakerAssetAmount'
  ], order)
})

export const convertOrderToDexFormat = order => {
  const decodedMakerAssetData = assetDataUtils.decodeAssetDataOrThrow(order.order.makerAssetData)
  const decodedTakerAssetData = assetDataUtils.decodeAssetDataOrThrow(order.order.takerAssetData)

  return {
    ...order.order,
    ...order.metaData,
    makerAssetAddress: decodedMakerAssetData.tokenAddress,
    takerAssetAddress: decodedTakerAssetData.tokenAddress,
    makerAssetProxyId: decodedMakerAssetData.assetProxyId,
    takerAssetProxyId: decodedTakerAssetData.assetProxyId
  }
}

export const convertFillEventToDexTradeHistory = fillEvent => {
  return {
    id: fillEvent.id,
    transactionHash: fillEvent.transactionHash,
    blockNumber: fillEvent.blockNumber,
    logIndex: fillEvent.logIndex,
    orderHash: fillEvent.returnValues.orderHash,
    senderAddress: fillEvent.returnValues.senderAddress.toLowerCase(),
    feeRecipientAddress: fillEvent.returnValues.feeRecipientAddress,
    makerAddress: fillEvent.returnValues.makerAddress.toLowerCase(),
    takerAddress: fillEvent.returnValues.takerAddress.toLowerCase(),
    makerAssetData: fillEvent.returnValues.makerAssetData,
    takerAssetData: fillEvent.returnValues.takerAssetData,
    makerAssetFilledAmount: fillEvent.returnValues.makerAssetFilledAmount,
    takerAssetFilledAmount: fillEvent.returnValues.takerAssetFilledAmount,
    makerFeePaid: fillEvent.returnValues.makerFeePaid,
    takerFeePaid: fillEvent.returnValues.takerFeePaid
  }
}
