/* eslint-disable @typescript-eslint/no-unsafe-return */
// import { Wallet } from '@acala-network/sdk/wallet'
// import { decodeAddress, encodeAddress } from '@polkadot/keyring'
import { gql, request } from 'graphql-request'
// import { u8aToHex } from '@polkadot/util'

// import { Token } from '@acala-network/sdk-core'
import { formatBalance, table } from '../log'
import axios from 'axios'
import runner from '../runner'

runner()
  .requiredNetwork(['acala'])
  .withApiPromise()
  .run(async ({ _api }) => {
    // moonbeam start block
    const beforeBlock = 1646592

    // Moonbeam assets map
    const tokenMap = new Map([
      ['120637696315203257380661607956669368914', 'xcIBTC'],
      ['110021739665376159354538090254163045594', 'xcaUSD'],
      ['42259045809535163221576417993425387648', 'xcDOT'],
      ['101170542313601871197860408087030232491', 'xcINTR'],
      ['224821240862170613278369189818311486111', 'xcACA'],
      ['32615670524745285411807346420584982855', 'PARA'],
      ['132685552157663328694213725410064821485', 'xcPHA'],
    ])
    const decimalsMap = new Map([
      ['xcIBTC', 8],
      ['xcaUSD', 12],
      ['xcDOT', 10],
      ['INTR', 10],
      ['xcACA', 12],
      ['PARA', 12],
      ['xcPHA', 12],
      ['GLMR', 18],
    ])

    // Moonbeam contracts map
    const lpMap = new Map([
      ['0xd95cab0ed89269390f2ad121798e6092ea395139', 'STELLA: xcaUSD/WGLMR'],
      ['0xa927e1e1e044ca1d9fe1854585003477331fe2af', 'STELLA: WGLMR/xcDOT'],
      ['0x4c5f99045af91d2b6d4fa0ea89fc47cf42711555', 'STELLA: WGLMR/xcIBTC'],
      ['0xd3dfb90f7996a97f9f394e130342485e37dd28f7', 'STELLA: WGLMR/xcINTR'],
      ['0x70085a09d30d6f8c4ecf6ee10120d1847383bb57', 'StellaSwap Router'],
      ['0xacc15dc74880c9944775448304b263d191c6077f', 'WGLMR'],
      ['0xfa36fe1da08c89ec72ea1f0143a35bfd5daea108', 'stDOT'],
      ['0x091608f4e4a15335145be0a279483c0f8e4c7955', 'mGLMR'],
      ['0xd22da948c0ab3a27f5570b604f3adef5f68211c3', 'mDOT'],
      ['0xb7b5d3659ad213478bc8bfb94d064d0efdda8f7c', 'xcACA'],
      ['0xf3a5454496e26ac57da879bf3285fa85debf0388', 'STELLA'],
      ['0xeb237cf62eda6a179561952840f17a7056d647f6', 'SwapRouter'],
      ['0x96b244391d98b62d19ae89b1a4dccf0fc56970c7', 'BeamSwap Router'],
      ['0x94f9eb420174b8d7396a87c27073f74137b40fe2', 'ZLK: xcDOT/WGLMR'],
      ['0x9de8171bebfa577d6663b594c60841fe096eff97', 'STELLA Rewarder'],
      ['0x7bc8b1b5aba4df3be9f9a32dae501214dc0e4f3f', 'NFT/ERC721'],
    ])

    // ERC20 address on moombeam
    // the amount is calculated on Acala side which xtokens transfer out to Moonbeam.
    const addresses = new Map([
      ['0x80e639e6a2c90b05cdce2701a66ef096852093c8', '841325000000000000'],
      ['0x029dc993d0053b717a69cac26157f4ea466a907a', '816336247612289280'],
      ['0xb82ed2d0dfcd3ad43b3cbfab1f5e9c316f283f9c', '696772724164928000'],
      ['0x57f73c4bff8ebe0fdd91c666fd304804d50fc218', '533926559077803008'],
      ['0xa22868cfd826d0fcf543bdf1814e556e69903f11', '334484705589422144'],
      ['0x30c4abab7ec022c27022aa39f687984e5acba13d', '308597168863638272'],
      ['0x07d6e8987a17b95eee44fbd2b7bb65c34442a5c7', '305375328803483584'],
      ['0xb600e3b53dc0b8a941b92301f4411ac2e31ae4a2', '211192000000000000'],
      ['0x8ff448ed0c027dbe9f5add62e6faee439eac0259', '197064140914770368'],
      ['0x1cb3c6b77fde279cf7403a5c0ae2d5fc9d356a55', '127873035149662560'],
      ['0xebaee4e53e5c286c4b5f0027777eb72bc8b94bf7', '100650000003096976'],
      ['0x356eb354aea711854e1d69a36643e181a1da8ba5', '50000000000000000'],
      ['0x6b99b14cbed12e1f2b8c70681cce0874e24661ee', '45413922485320456'],
      ['0xd11b9d446a20b74d9fefb185d847692d84c4b95e', '19281268359725808'],
      ['0x4ac4ff89b9d4b3daf54942e3df63751a4a54c735', '18557886746006812'],
      ['0xbd03a214ebc891b3a9e3fe4cba793c5f9f0b38b0', '12600000000000000'],
      ['0x627683779b1fe41a2b350f67a9e8876def078cbb', '8857000000000000'],
      ['0x6ab079df6d9f2e6cad08736bba0fb8f35cc0ca40', '4808000000000000'],
      ['0x08c3e7b6e273d4434fa466ff23dba7c602a961a7', '3195769935409315'],
      ['0xcf43e9a2f9ed4810de89ae08d88445d8ccf63ab1', '2600000000000000'],
      ['0x66721389fd8f9403b1d161fc52b35f906d5421cc', '1288288208600000'],
      ['0x355b8f6059f5414ab1f69fca34088c4adc554b7f', '1000000000000000'],
      ['0x08abb2e7b586d80543b61daa91a9d134234d26d5', '889742268083292'],
      ['0x5f9febf1f2a99fe11edad119462db23f28a6ddbb', '431000000000000'],
      ['0x2b8221f97766b0498f4ac578871d088100176749', '264603693438244'],
      // ['0xf4de3f93ebca01015486be5979d9c01aeeddd367', '5000000000000'],
      // ['0xee7c4aca7d64075550f1b119b4bb4a0aa889c340', '1000000000000'],
    ])

    // const truncate = (input: string) => input.length > 40 ? `${input.substring(0, 2)}...${input.substring(38)}` : input;

    function format_address(address: string, base_address: string): string {
      if (address === base_address) {
        return '👽'
      } else {
        const mapping = lpMap.get(address)
        if (typeof mapping === 'undefined') {
          return address
        } else {
          return mapping
        }
      }
    }

    function extract_event_index(id: string): number {
      const splits = id.split('-')
      return Number(splits[1])
    }

    const query = gql`
      query q($acc1: JSON, $acc2: JSON) {
        events(
          where: {
            OR: [
              {
                name_in: ["Assets.Transferred", "Balances.Transfer"],
                block: {height_gte: ${beforeBlock}},
                args_jsonContains: $acc1,
              }
              {
                name_in: ["Assets.Transferred", "Balances.Transfer"],
                block: {height_gte: ${beforeBlock}},
                args_jsonContains: $acc2,
              }
            ]
          }
        ) {
          id,
          block {
            height
          }
          extrinsic {
            indexInBlock
            hash
          }
          call {
            name
          }
          args
        }
      }
  `

    const processResult = (result: any, addr: string, from = 'from', to = 'to') => {
      return (result.events as any[]).map((x: any) => ({
        id: extract_event_index(x.id),
        height: x.block.height,
        extrinsicIndex: ''.concat(x.block.height).concat('-').concat(x.extrinsic.indexInBlock),
        extrinsicHash: x.extrinsic.hash,
        from: x.args[from],
        to: x.args[to],
        asset: tokenMap.get(x.args.assetId) || 'GLMR',
        amount: x.args.amount,
        kind: x.args['from'] === addr ? 'in' : 'out',
      }))
    }

    const axios_api = axios.create({
      baseURL: 'https://moonbeam.webapi.subscan.io',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': '02dfd68d52654337a82519c4e17422a0',
        timeout: '10000',
        'User-Agent': 'curl/7.64.1',
      },
    })
    const fetch_ausd_balance = async (address: string) => {
      const {
        data: { data },
      } = await axios_api.post('/api/scan/account/tokens', {
        address: address,
      })
      if (typeof data.assets === 'undefined') {
        return 0
      } else {
        const assets: [{ symbol: string; decimals: number; balance: bigint; assert_id: string }] = data.assets
        const ausd_filter = assets.filter((asset1) => asset1.symbol === 'xcaUSD')
        if (typeof ausd_filter === 'undefined' || ausd_filter.length === 0) {
          return 0
        } else {
          return ausd_filter[0].balance
        }
      }
    }
    const fetch_address_info = async (address: string) => {
      const {
        data: { data },
      } = await axios_api.post('/api/v2/scan/search', {
        key: address,
      })
      return {
        evm_contract: data.account.is_evm_contract,
        balance: data.account.balance,
      }
    }

    const result = []
    const summary = {
      total_crossed: BigInt(0),
      total_spended: BigInt(0),
      total_current: BigInt(0),
      total_uncover: BigInt(0),
    }
    const dest_individualstal = {} as Record<string, { dest: Set<string> }>
    let print_one = false
    let print_all = false
    const input_address = process.argv[2]
    for (const [addr, ausd_total] of addresses) {
      if (typeof input_address !== 'undefined') {
        if (input_address === addr) {
          print_one = true
        } else if (input_address === 'ALL') {
          print_all = true
        } else {
          continue
        }
      }

      const result1 = await request('https://moonbeam.explorer.subsquid.io/graphql', query, {
        acc1: { to: addr },
        acc2: { from: addr },
      })

      const events1 = processResult(result1, addr)

      const allEvents = events1
      allEvents.sort((a, b) => {
        if (a.height === b.height) {
          return a.id - b.id
        } else {
          return a.height - b.height
        }
      })

      const data1 = []
      const total = {} as Record<string, { token: string; value: bigint }>
      for (const e of allEvents) {
        total[e.asset] = total[e.asset] || { token: e.asset, value: 0n }
        total[e.asset].value += e.kind === 'in' ? BigInt(e.amount) : -BigInt(e.amount)

        // raw data
        data1.push({
          evt: e.id,
          extrinsic: e.extrinsicIndex,
          from: format_address(e.from, addr),
          to: format_address(e.to, addr),
          asset: e.asset,
          amount: formatBalance(e.amount, decimalsMap.get(e.asset)),
        })

        // if destination address is not LP, but individual, then we added it for later second level dig
        if (addr !== e.to && typeof lpMap.get(e.to) === 'undefined') {
          dest_individualstal[addr] = dest_individualstal[addr] || { dest: new Set<string>([]) }
          dest_individualstal[addr].dest.add(e.to)
        }
      }

      if (print_one || print_all) {
        console.log('address: >>', addr)
        table(data1)
      }

      let ausd_spent = BigInt(0)
      if (typeof total['xcaUSD'] !== 'undefined') {
        ausd_spent = total['xcaUSD'].value
      }
      const ausd_balance = await fetch_ausd_balance(addr)
      const uncover_amount = BigInt(ausd_total) - BigInt(ausd_spent) - BigInt(ausd_balance)
      result.push({
        address: addr,
        crossed: formatBalance(ausd_total, 12),
        spended: formatBalance(ausd_spent, 12),
        current: formatBalance(ausd_balance, 12),
        uncover: uncover_amount < 1_000_000_000_000 ? 0 : formatBalance(uncover_amount, 12),
      })
      summary.total_crossed += BigInt(ausd_total)
      summary.total_spended += BigInt(ausd_spent)
      summary.total_current += BigInt(ausd_balance)
      summary.total_uncover += uncover_amount
    }

    // direct transfer to individual addresss
    const direct_transfers = []
    for (const [key, dests] of Object.entries(dest_individualstal)) {
      for (const dest of dests.dest) {
        const account_info = await fetch_address_info(dest)
        direct_transfers.push({
          origin_address: key,
          dest_address: dest,
          evm_contract: account_info.evm_contract,
          dest_balance: account_info.balance,
        })
      }
    }
    table(direct_transfers)

    result.push({
      address: 'Total',
      crossed: formatBalance(summary.total_crossed, 12),
      spended: formatBalance(summary.total_spended, 12),
      current: formatBalance(summary.total_current, 12),
      uncover: formatBalance(summary.total_uncover, 12),
    })

    // print summary if not specified address.
    if (!print_one) {
      table(result)
    }
  })
