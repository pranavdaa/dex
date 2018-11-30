import complement from 'ramda/es/complement'
import axios from 'axios'
import * as actions from './actions'
import { assetDataUtils } from '@0x/order-utils'
import { wsSubscribe, wsUnsubscribe } from 'modules/subscriptions'
import { getSubscriptionsByListType } from '../subscriptions/selectors'

export const loadOrderbook = () => async (dispatch, getState) => {
  const { marketplaceToken, currentToken } = getState().global

  const baseAssetData = assetDataUtils.encodeERC20AssetData(currentToken.address)
  const quoteAssetData = assetDataUtils.encodeERC20AssetData(marketplaceToken.address)
  const { data } = await axios(
    '/api/relayer/v0/orderbook',
    {
      params: {
        baseAssetData,
        quoteAssetData
      }
    }
  )

  dispatch(actions.setOrderbookBids(data.bids.records))
  dispatch(actions.setOrderbookAsks(data.asks.records))

  const [ subscription ] = getSubscriptionsByListType(getState(), 'orders')
  if (subscription) {
    dispatch(wsUnsubscribe(subscription.requestId))
  }

  dispatch(wsSubscribe(
    'orders',
    'orders',
    {
      $or: [
        { makerAssetData: baseAssetData, takerAssetData: quoteAssetData },
        { makerAssetData: quoteAssetData, takerAssetData: baseAssetData }
      ]
    }
  ))
}

export const addOrders = orders => async (dispatch, getState) => {
  const { marketplaceToken, currentToken } = getState().global
  const baseAssetData = assetDataUtils.encodeERC20AssetData(marketplaceToken.address)
  const quoteAssetData = assetDataUtils.encodeERC20AssetData(currentToken.address)

  const isBid = ({ order }) => order.takerAssetData === quoteAssetData &&
    order.makerAssetData === baseAssetData

  const bidsToUpdate = orders.filter(isBid)
  const asksToUpdate = orders.filter(complement(isBid))

  if (bidsToUpdate.length > 0) {
    dispatch(actions.addOrderbookBids(bidsToUpdate))
  }

  if (asksToUpdate.length > 0) {
    dispatch(actions.addOrderbookAsks(asksToUpdate))
  }

  await new Promise(resolve => setTimeout(resolve, 2000))
  dispatch(actions.resetHighlighting())
}

export const loadActiveAccountOrders = address => async (dispatch, getState) => {
  const { data } = await axios.get(`/api/v1/accounts/${address}/orders`)
  const { account } = getState().global

  dispatch(actions.setAccountOrders(data))

  const [ subscription ] = getSubscriptionsByListType(getState(), 'accountOrders')
  if (subscription) {
    dispatch(wsUnsubscribe(subscription.requestId))
  }

  dispatch(wsSubscribe(
    'accountOrders',
    'orders',
    {
      $or: [
        { makerAddress: account },
        { takerAddress: account }
      ]
    }
  ))
}
