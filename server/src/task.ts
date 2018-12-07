import 'dotenv/config'
import { createConnection } from 'typeorm'
import ormconfig from '../ormconfig'
import RelayerService from './services/RelayerService'
import BlockchainService from './services/BlockchainService'
import OrderBlockchainService from './services/OrderBlockchainService'
import RelayerRegistryService from './services/RelayerRegistryService'
const argv = require('yargs').argv
const { createContainer, asValue, asClass } = require('awilix')

;(async () => {
  const connection = await createConnection(ormconfig as any)

  const taskName = argv._[0]
  const fullTaskName = taskName[0].toUpperCase() + taskName.slice(1) + 'Task'
  const Task = require(`./tasks/${fullTaskName}`).default

  const container = createContainer()
  container.register({
    connection: asValue(connection),
    relayerService: asClass(RelayerService).singleton(),
    relayerRegistryService: asClass(RelayerRegistryService).singleton(),
    blockchainService: asClass(BlockchainService).singleton(),
    orderBlockchainService: asClass(OrderBlockchainService).singleton(),
    [taskName]: asClass(Task).singleton()
  })

  await container.resolve(taskName).run()
})().then(() => {
  process.exit()
}).catch(e => {
  console.error(e)
  process.exit(1)
})
