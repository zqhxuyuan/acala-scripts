/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Wallet } from '@acala-network/sdk/wallet'
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
  .run(async ({ api }) => {
    new Wallet(api)

    // moonbeam start block
    const beforeBlock = 1646592
    // const afterBlock = 1639493

    // moonbeam assets map
    const tokenMap = new Map([
      ['120637696315203257380661607956669368914', 'xcIBTC'],
      ['110021739665376159354538090254163045594', 'xcaUSD'],
      ['42259045809535163221576417993425387648', 'xcDOT'],
      ['101170542313601871197860408087030232491', 'INTR'],
      ['224821240862170613278369189818311486111', 'xcACA'],
      ['32615670524745285411807346420584982855', 'PARA'],
      ['132685552157663328694213725410064821485', 'xcPHA'],
    ])

    // ERC20 address on moombeam
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
      ['0xf4de3f93ebca01015486be5979d9c01aeeddd367', '5000000000000'],
      ['0xee7c4aca7d64075550f1b119b4bb4a0aa889c340', '1000000000000'],
    ])

    const query = gql`
      query q($acc: JSON, $evt: String) {
        events(
          where: {
            name_eq: $evt,
            block: {height_gte: ${beforeBlock}},
            args_jsonContains: $acc,
          }
        ) {
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

    const processResult = (result: any, kind: string, from = 'from', to = 'to') => {
      return (result.events as any[]).map((x: any) => ({
        height: x.block.height,
        extrinsicIndex: ''.concat(x.block.height).concat('-').concat(x.extrinsic.indexInBlock),
        extrinsicHash: x.extrinsic.hash,
        from: from ? x.args[from] : '',
        to: to ? x.args[to] : '',
        asset: tokenMap.get(x.args.assetId) || 'GLMR',
        amount: x.args.amount,
        kind,
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
        return '0'
      } else {
        const assets: [{ symbol: string; decimals: number; balance: bigint; assert_id: string }] = data.assets

        const ausd_filter = assets.filter((asset1) => asset1.symbol === 'xcaUSD')
        if (typeof ausd_filter === 'undefined' || ausd_filter.length === 0) {
          return '0'
        } else {
          return '${ausd_filter[0].balance}'
        }
      }
    }

    const result = []
    let print_single = false
    for (const [addr, ausd_total] of addresses) {
      if (typeof process.argv[2] !== 'undefined') {
        const address_input = process.argv[2]
        if (addr !== address_input) {
          continue
        } else {
          print_single = true
        }
      }

      const [result1, result2, result3, result4] = await Promise.all([
        request('https://moonbeam.explorer.subsquid.io/graphql', query, {
          acc: { to: addr },
          evt: 'Assets.Transferred',
        }),
        request('https://moonbeam.explorer.subsquid.io/graphql', query, {
          acc: { from: addr },
          evt: 'Assets.Transferred',
        }),
        request('https://moonbeam.explorer.subsquid.io/graphql', query, {
          acc: { to: addr },
          evt: 'Balances.Transfer',
        }),
        request('https://moonbeam.explorer.subsquid.io/graphql', query, {
          acc: { from: addr },
          evt: 'Balances.Transfer',
        }),
      ])

      const [events1, events2, events3, events4] = await Promise.all([
        processResult(result1, 'in'),
        processResult(result2, 'out'),
        processResult(result3, 'in'),
        processResult(result4, 'out'),
      ])

      const allEvents = events1.concat(events2).concat(events3).concat(events4)
      allEvents.sort((a, b) => a.height - b.height)

      const data1 = []
      const total = {} as Record<string, { token: string; value: bigint }>
      for (const e of allEvents) {
        total[e.asset] = total[e.asset] || { token: e.asset, value: 0n }
        total[e.asset].value += e.kind === 'in' ? BigInt(e.amount) : -BigInt(e.amount)

        // raw data
        data1.push({
          extrinsic: e.extrinsicIndex,
          from: e.from,
          to: e.to,
          asset: e.asset,
          amount: e.amount,
        })
      }

      if (print_single) {
        console.log('address: >>', addr)
        table(data1)
        break
      }

      let ausd_spent = BigInt(0)
      if (typeof total['xcaUSD'] !== 'undefined') {
        ausd_spent = total['xcaUSD'].value
      }
      const ausd_balance = await fetch_ausd_balance(addr)
      const uncover_amount = BigInt(ausd_total) + BigInt(ausd_spent) - BigInt(ausd_balance)
      result.push({
        address: addr,
        crossed: formatBalance(ausd_total, 12),
        spended: formatBalance(ausd_spent, 12),
        current: formatBalance(ausd_balance, 12),
        uncover: formatBalance(uncover_amount, 12),
      })
    }

    // print summary
    if (!print_single) {
      table(result)
    }
  })
