import { EntitySchema } from 'typeorm'

const Order = new EntitySchema({
  name: 'Order',
  tableName: 'orders',
  columns: {
    id: {
      type: 'bigint',
      primary: true,
      generated: true
    },
    signature: {
      type: 'varchar'
    },
    orderHash: {
      type: 'varchar'
    },
    exchangeAddress: {
      type: 'varchar'
    },
    makerAddress: {
      type: 'varchar'
    },
    takerAddress: {
      type: 'varchar'
    },
    senderAddress: {
      type: 'varchar'
    },
    feeRecipientAddress: {
      type: 'varchar'
    },
    makerAssetAmount: {
      type: 'varchar'
    },
    takerAssetAmount: {
      type: 'varchar'
    },
    amountFilled: {
      type: 'varchar'
    },
    makerAssetAddress: {
      type: 'varchar'
    },
    takerAssetAddress: {
      type: 'varchar'
    },
    makerAssetProxyId: {
      type: 'varchar'
    },
    takerAssetProxyId: {
      type: 'varchar'
    },
    makerFee: {
      type: 'varchar'
    },
    takerFee: {
      type: 'varchar'
    },
    expirationTimeSeconds: {
      type: 'varchar'
    },
    makerAssetData: {
      type: 'varchar'
    },
    takerAssetData: {
      type: 'varchar'
    },
    salt: {
      type: 'varchar'
    }
  }
})

export default Order
