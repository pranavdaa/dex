import OrderRepository from '../repositories/OrderRepository'
import OrderBlockchainService from './OrderBlockchainService'
import { convertDexOrderToSRA2Format } from '../utils/helpers'
import { OrderInfo } from '@0x/contract-wrappers'
import OrderEntity from '../entities/Order'
import WsRelayerServer from '../wsRelayerServer/WsRelayerServer'
import WsRelayerServerFacade from '../wsRelayerServer/WsRelayerServerFacade'

export default class OrderService {
  orderRepository: OrderRepository
  orderBlockchainService: OrderBlockchainService
  wsRelayerServer: WsRelayerServer

  constructor ({ connection, orderBlockchainService, wsRelayerServer }) {
    this.orderRepository = connection.getCustomRepository(OrderRepository)
    this.orderBlockchainService = orderBlockchainService
    this.wsRelayerServer = wsRelayerServer
  }

  async updateOrderInfoAndPush (orderHash: string) {
    await this.updateOrderInfo(orderHash)

    const order = await this.getOrderByHashOrThrow(orderHash)
    const sra2Order = convertDexOrderToSRA2Format(order)
    WsRelayerServerFacade.pushOrders(this.wsRelayerServer, [sra2Order])
  }

  async updateOrderInfo (orderHash: string) {
    const orderInfo = await this.getOrderInfo(orderHash)
    if (orderInfo) {
      await this.saveOrderInfo(orderInfo)
    }
  }

  async getOrderInfo (orderHash: string): Promise<OrderInfo> {
    const order = await this.getOrderByHashOrThrow(orderHash)
    const { order: signedOrder } = convertDexOrderToSRA2Format(order)

    return this.orderBlockchainService.getOrderInfoAsync(signedOrder)
  }

  async getOrderByHashOrThrow (orderHash: string): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({
      where: { orderHash }
    })

    if (!order) {
      throw new Error('no order')
    }

    return order
  }

  async saveOrderInfo (orderInfo: OrderInfo) {
    await this.orderRepository.save({
      ...orderInfo,
      orderTakerAssetFilledAmount: orderInfo.orderTakerAssetFilledAmount.toString(10)
    } as any)
  }

  // async updateOrdersInfo () {
  //   const orders = await this.orderRepository.find()
  //   log.info(`Updating info for ${orders.length} orders`)
  //
  //   for (let order of orders) {
  //     await this.updateOrderInfoAndPush(order.orderHash)
  //   }
  // }
}
