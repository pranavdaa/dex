import axios from 'axios'

class ApiService {
  async loadTokenBySymbol (symbol) {
    const { data } = await axios(`/api/v1/tokens/${symbol}`)
    return data
  }

  async loadTokens () {
    const { data } = await axios.get('/api/v1/tokens')
    return data
  }

  async createOrder (signedOrder) {
    await axios.post('/api/0x/v2/order', signedOrder)
  }

  async loadOrderbook (params) {
    const { data } = await axios('/api/0x/v2/orderbook', { params })
    return data
  }

  async loadAccountOrders (account) {
    const { data } = await axios.get(`/api/v1/accounts/${account}/orders`)
    return data
  }

  async loadAccountTradeHistory (account) {
    const { data } = await axios.get(`/api/v1/accounts/${account}/history`)
    return data
  }

  async loadTradeHistory (params) {
    const { data } = await axios.get(
      `/api/v1/tradeHistory`,
      {
        params
      }
    )

    return data
  }
}

export default ApiService
