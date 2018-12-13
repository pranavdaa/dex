import React from 'react'
import { connect } from 'react-redux'
import jss from 'react-jss'
import { wsUnsubscribe } from 'modules/subscriptions'
import ReactTable from 'react-table'
import { formatAssetAmount } from 'helpers/general'
import EtherscanLink from 'components/EtherscanLink'
import { getTokens, findTokenByAssetData } from 'modules/global/selectors'

const cellStyle = {
  fontSize: '0.7em',
  display: 'flex',
  alignItems: 'center'
}

const decorate = jss({
  link: {
    fontSize: '0.8em',
    minHeight: 0,
    padding: 5
  }
})

const connector = connect(
  state => ({
    tokens: getTokens(state)
  }),
  { wsUnsubscribe }
)

class TradeHistory extends React.Component<any> {
  render () {
    const { tradeHistory, tokens, classes } = this.props

    if (tradeHistory.length === 0) {
      return null
    }

    return (
      <ReactTable
        data={tradeHistory}
        showPagination={false}
        defaultPageSize={tradeHistory.length}
        pageSize={tradeHistory.length}
        resizable={false}
        columns={[
          {
            Header: 'Sold',
            id: 'sold',
            minWidth: 80,
            accessor: one => {
              const makerToken = findTokenByAssetData(one.makerAssetData, tokens)
              return `
                ${formatAssetAmount(one.makerAssetFilledAmount, makerToken.decimals)}
                ${makerToken.symbol}
              `
            },
            style: cellStyle
          },
          {
            Header: 'Bought',
            id: 'Bought',
            minWidth: 80,
            accessor: one => {
              const takerToken = findTokenByAssetData(one.takerAssetData, tokens)
              return `
                ${formatAssetAmount(one.takerAssetFilledAmount, takerToken.decimals)}
                ${takerToken.symbol}
              `
            },
            style: cellStyle
          },
          {
            Header: 'Etherscan',
            id: 'Etherscan',
            minWidth: 80,
            accessor: one => (
              <EtherscanLink
                className={classes.link}
                address={one.transactionHash}
                type='tx'
              />
            ),
            style: {
              ...cellStyle,
              justifyContent: 'center'
            }
          }
        ]}
      />
    )
  }
}

export default connector(decorate(TradeHistory))
