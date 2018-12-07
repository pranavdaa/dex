import * as rp from 'request-promise-native'
import { IRelayer } from '../types'

interface IRelayersByKeys {
  [key: string]: IRelayer
}

class RelayerRegistryService {
  async loadRelayers (): Promise<IRelayersByKeys> {
    return rp({
      uri: 'https://api.github.com/repos/0xProject/0x-relayer-registry/contents/relayers.json',
      headers: {
        'User-Agent': 'node:request',
        Accept: 'application/vnd.github-blob.raw'
      },
      json: true
    })
  }
}

export default RelayerRegistryService
