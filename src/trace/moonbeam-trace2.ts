/* eslint-disable @typescript-eslint/no-unsafe-return */
import { gql, request } from 'graphql-request'

import { formatBalance, table } from '../log'
import axios from 'axios'
import runner from '../runner'

const parachain = 'Moonbeam'

const ausd_decimal = 12
const mb_usd_token = 'xcaUSD'

// Parachain info setup
const parachain_info = new Map([
  [
    'Moonbeam',
    {
      defaultToken: 'GLMR',
      subscanUrl: 'https://moonbeam.webapi.subscan.io',
      subsquidUrl: 'https://moonbeam.explorer.subsquid.io/graphql',
      beforeBlock: 1646592,
      ausdToken: mb_usd_token
    },
  ],
])

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
  ['0xdfb7e426fbbbc83ccac49012f49e2a355d9353e8', '???'],
])

// ERC20 address on Moonbeam that xtokens transfer out from Acala.
// the amount is calculat on Acala, we can also get by Assets.Issued events.
const addresses: string[] = 
  [
    '0x80e639e6a2c90b05cdce2701a66ef096852093c8',
  '0x029dc993d0053b717a69cac26157f4ea466a907a',
  '0xb82ed2d0dfcd3ad43b3cbfab1f5e9c316f283f9c',
  '0x57f73c4bff8ebe0fdd91c666fd304804d50fc218',
  '0xa22868cfd826d0fcf543bdf1814e556e69903f11',
  '0x30c4abab7ec022c27022aa39f687984e5acba13d',
  '0x07d6e8987a17b95eee44fbd2b7bb65c34442a5c7',
  '0xb600e3b53dc0b8a941b92301f4411ac2e31ae4a2',
  '0x8ff448ed0c027dbe9f5add62e6faee439eac0259',
  '0x1cb3c6b77fde279cf7403a5c0ae2d5fc9d356a55',
  '0xebaee4e53e5c286c4b5f0027777eb72bc8b94bf7',
  '0x356eb354aea711854e1d69a36643e181a1da8ba5',
  '0x6b99b14cbed12e1f2b8c70681cce0874e24661ee',
  '0xd11b9d446a20b74d9fefb185d847692d84c4b95e',
  '0x4ac4ff89b9d4b3daf54942e3df63751a4a54c735',
  '0xbd03a214ebc891b3a9e3fe4cba793c5f9f0b38b0',
  '0x627683779b1fe41a2b350f67a9e8876def078cbb',
  '0x6ab079df6d9f2e6cad08736bba0fb8f35cc0ca40',
  '0x08c3e7b6e273d4434fa466ff23dba7c602a961a7',
  '0xcf43e9a2f9ed4810de89ae08d88445d8ccf63ab1',
  '0x66721389fd8f9403b1d161fc52b35f906d5421cc',
  '0x355b8f6059f5414ab1f69fca34088c4adc554b7f',
  '0x08abb2e7b586d80543b61daa91a9d134234d26d5',
  '0x5f9febf1f2a99fe11edad119462db23f28a6ddbb',
  '0x2b8221f97766b0498f4ac578871d088100176749',
  '0xf4de3f93ebca01015486be5979d9c01aeeddd367',
  '0xee7c4aca7d64075550f1b119b4bb4a0aa889c340',
]

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

// limit: 100
const query = gql`
  query q($acc1: JSON, $acc2: JSON) {
    events(
      where: {
        OR: [
          {
            name_in: ["Assets.Transferred", "Balances.Transfer"],
            block: {height_gte: ${parachain_info.get(parachain)!.beforeBlock}},
            args_jsonContains: $acc1,
          }
          {
            name_in: ["Assets.Transferred", "Balances.Transfer"],
            block: {height_gte: ${parachain_info.get(parachain)!.beforeBlock}},
            args_jsonContains: $acc2,
          }
        ]
      }
      limit: 200
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

const asset_issued = gql`
  query q($query1: JSON, $query2: JSON) {
    events(
      where: {
        AND: [
          {
            name_eq: "Assets.Issued",
            block: {height_gte: ${parachain_info.get(parachain)!.beforeBlock}},
            args_jsonContains: $query1,
          }
          {
            name_eq: "Assets.Issued",
            block: {height_gte: ${parachain_info.get(parachain)!.beforeBlock}},
            args_jsonContains: $query2,            
          }
        ]
      }
      limit: 200
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

const processResult = (response: any, addr: string, from = 'from', to = 'to') => {
  return (response.events as any[]).map((x: any) => ({
    id: extract_event_index(x.id),
    height: x.block.height,
    extrinsicIndex: ''.concat(x.block.height).concat('-').concat(x.extrinsic.indexInBlock),
    extrinsicHash: x.extrinsic.hash,
    from: x.args[from],
    to: x.args[to],
    asset: tokenMap.get(x.args.assetId) || parachain_info.get(parachain)!.defaultToken,
    amount: x.args.amount,
    kind: x.args['from'] === addr ? 'out' : 'in',
  }))
}

const processIssuedResult = (response: any, addr: string) => {
  return (response.events as any[]).map((x: any) => ({
    id: extract_event_index(x.id),
    height: x.block.height,
    extrinsicIndex: ''.concat(x.block.height).concat('-').concat(x.extrinsic.indexInBlock),
    extrinsicHash: x.extrinsic.hash,
    from: "Acala XTokens",
    to: addr,
    // asset: tokenMap.get(x.args.assetId)!,
    asset: mb_usd_token,
    amount: x.args.totalSupply,
    kind: 'in',
  }))
}

const axios_api = axios.create({
  baseURL: parachain_info.get(parachain)!.subscanUrl,
  headers: {
    'Content-Type': 'application/json',
    'X-API-KEY': '02dfd68d52654337a82519c4e17422a0',
    timeout: '10000',
    'User-Agent': 'curl/7.64.1',
  },
})

// const fetch_asset_balance = async (address: string, asset = mb_usd_token) => {
//   const {
//     data: { data },
//   } = await axios_api.post('/api/scan/account/tokens', {
//     address: address,
//   })
//   let balance = 0n
//   // GLMR in native
//   if (asset === parachain_info.get(parachain)?.defaultToken) {
//     const assets: [{ symbol: string; decimals: number; balance: bigint; assert_id: string }] = data.native
//     const filter = assets.filter((asset1) => asset1.symbol === asset)
//     if (typeof filter === 'undefined' || filter.length === 0) {
//       balance = 0n
//     } else {
//       balance = filter[0].balance
//     }
//   } else {
//     // assets: [xcaUSD, xcDOT, xcINTR, xcACA, xcIBTC]
//     if (typeof data.assets === 'undefined') {
//       balance = 0n
//     } else {
//       const assets: [{ symbol: string; decimals: number; balance: bigint; assert_id: string }] = data.assets
//       const filter = assets.filter((asset1) => asset1.symbol === asset)
//       if (typeof filter === 'undefined' || filter.length === 0) {
//         balance = 0n
//       } else {
//         balance = filter[0].balance
//       }
//     }
//   }
//   return balance
// }

const fetch_asset_balances = async (address: string, assets: string[]) => {
  const {
    data: { data },
  } = await axios_api.post('/api/scan/account/tokens', {
    address: address,
  })
  const balances = []
  for (let i = 0; i < assets.length; i++) {
    const asset = assets[i]
    let balance = 0n
    // GLMR in native
    if (asset === parachain_info.get(parachain)?.defaultToken) {
      const assets: [{ symbol: string; decimals: number; balance: bigint; assert_id: string }] = data.native
      const filter = assets.filter((asset1) => asset1.symbol === asset)
      if (typeof filter === 'undefined' || filter.length === 0) {
        balance = 0n
      } else {
        balance = filter[0].balance
      }
    } else {
      // assets: [xcaUSD, xcDOT, xcINTR, xcACA, xcIBTC]
      // ERC20: [xcDOT]
      if (asset === 'xcDOT') {
        const assets: [{ symbol: string; decimals: number; balance: bigint; contract: string }] = data.ERC20
        const filter = assets.filter((asset1) => asset1.symbol === asset)
        if (typeof filter === 'undefined' || filter.length === 0) {
          balance = 0n
        } else {
          balance = filter[0].balance
        }
      } else {
        if (typeof data.assets === 'undefined') {
          balance = 0n
        } else {
          const assets: [{ symbol: string; decimals: number; balance: bigint; assert_id: string }] = data.assets
          const filter = assets.filter((asset1) => asset1.symbol === asset)
          if (typeof filter === 'undefined' || filter.length === 0) {
            balance = 0n
          } else {
            balance = filter[0].balance
          }
        }
      }
    }
    balances[i] = balance
  }
  return balances
}

// Gloabl share variable
let asset_info = [{}] as [
  {
    address: string
    asset: string
    in: bigint
    out: bigint
    diff: bigint
  }
]
// let outasset_info = [{}] as [
//   {
//     address: string
//     dest_addr: string
//     asset: string
//     amount: string
//   }
// ]

const direct_addresses = {} as Record<string, { dest: Set<string> }>

const get_events = async (addr: string, print_record = false) => {
  const records = []

  // Query Subsquid events and deal with responses.
  const response = await request(parachain_info.get(parachain)!.subsquidUrl, query, {
    acc1: { to: addr },
    acc2: { from: addr },
  })
  const events = processResult(response, addr)

  const response2 = await request(parachain_info.get(parachain)!.subsquidUrl, asset_issued, {
    query1: {
      owner: addr
    },
    query2: {
      assetId: "110021739665376159354538090254163045594"
    }
  })
  const events2 = processIssuedResult(response2, addr)

  const all_events = events.concat(events2)
  all_events.sort((a, b) => {
    if (a.height === b.height) {
      return a.id - b.id
    } else {
      return a.height - b.height
    }
  })

  // raw event data
  for (const e of all_events) {
    records.push({
      evt: e.id,
      extrinsic: e.extrinsicIndex,
      from: e.from,
      to: e.to,
      asset: e.asset,
      amount: e.amount,
      kind: e.kind,
    })
  }

  if (print_record) {
    const format_records = []
    for (const e of records) {
      format_records.push({
        evt: e.evt,
        extrinsic: e.extrinsic,
        from: format_address(e.from, addr),
        to: format_address(e.to, addr),
        asset: e.asset,
        amount: formatBalance(e.amount, decimalsMap.get(e.asset)),
        kind: e.kind,
      })
    }
    table(format_records)
  }
  return records
}

function reset() {
  // DO NOT RESET, AS IT'S USED AS NEXT LEVEL DIG.
  // direct_addresses = {} as Record<string, { dest: Set<string> }>
  asset_info = [{}] as [
    {
      address: string
      asset: string
      in: bigint
      out: bigint
      diff: bigint
    }
  ]
  // outasset_info = [{}] as [
  //   {
  //     address: string
  //     dest_addr: string
  //     asset: string
  //     amount: string
  //   }
  // ]
}

// Processing one address
const process_one = (
  addr: string,
  work_result: {
    evt: number
    extrinsic: string
    from: string
    to: string
    asset: string
    amount: string
    kind: string
  }[]
) => {
  const direct_asset_amounts = {} as Record<string, { balance: bigint }>

  // Calculate total AUSD spented.
  const total = {} as Record<string, { in: bigint; out: bigint; value: bigint }>
  for (const e of work_result) {
    total[e.asset] = total[e.asset] || { in: 0n, out: 0n, value: 0n }
    // Normally out is less than in, for convenient calculate uncover, +out, -in
    if (e.kind === 'in') {
      total[e.asset].in += BigInt(e.amount)
    } else {
      total[e.asset].out += BigInt(e.amount)
    }
    total[e.asset].value += e.kind === 'out' ? BigInt(e.amount) : -BigInt(e.amount)

    // Get all addresses that's not LP/Contract for further dig.
    if (addr === e.from && typeof lpMap.get(e.to) === 'undefined') {
      direct_addresses[addr] = direct_addresses[addr] || { dest: new Set<string>([]) }
      direct_addresses[addr].dest.add(e.to)

      // Calculate the transfered asset to destination address
      const key = e.to.concat('-').concat(e.asset).concat('-').concat(addr)
      direct_asset_amounts[key] = direct_asset_amounts[key] || { balance: BigInt(0) }
      direct_asset_amounts[key].balance += BigInt(e.amount)
    }
  }
  // we could calcuate other asset
  // let ausd_spent = BigInt(0)
  // if (typeof total[mb_usd_token] !== 'undefined') {
    // may not have xcaUSD output.
    // ausd_spent = total[mb_usd_token].value
  // }

  // print all kind of asset diff in and out.
  for (const [asset, info] of Object.entries(total)) {
    asset_info.push({
      address: addr,
      asset,
      in: info.in,
      out: info.out,
      diff: info.value,
    })
  }

  // print outgoing transfers to non contract evm account.
  // for (const [key, info] of Object.entries(direct_asset_amounts)) {
  //   const key3 = key.split('-')
  //   const dest = key3[0]
  //   const asset = key3[1]
  //   outasset_info.push({
  //     address: addr,
  //     dest_addr: dest,
  //     asset: asset,
  //     amount: formatBalance(info.balance, decimalsMap.get(asset)),
  //   })
  // }
}

const format_asset_info = async () => {
  console.error('Summary report of asset in/out:')
  const format_asset_info = []
  const address_asset_map: Map<string, Array<string>> = new Map()
  // Query Address's Assets
  for (let i = 0; i < asset_info.length; i++) {
    const info = asset_info[i]
    if (typeof info.address === 'undefined') {
      continue
    }
    let current = address_asset_map.get(info.address)
    if (typeof current === 'undefined') {
      current = new Array<string>()
    }
    current.push(info.asset)
    address_asset_map.set(info.address, current)
  }
  // Query balance of Address's all assets
  const address_asset_balances: Map<string, bigint> = new Map()
  for (const [address, assets] of address_asset_map) {
    const balances = await fetch_asset_balances(address, assets)
    for (let i = 0; i < assets.length; i++) {
      address_asset_balances.set(address.concat('-').concat(assets[i]), balances[i])
    }
  }
  const total_of_ausd = {
    in: BigInt(0),
    out: BigInt(0),
    diff: BigInt(0),
    current: BigInt(0),
  }
  for (let i = 0; i < asset_info.length; i++) {
    const info = asset_info[i]
    if (typeof info.address === 'undefined') {
      continue
    }
    const balance = address_asset_balances.get(info.address.concat('-').concat(info.asset))!
    const decimal = decimalsMap.get(info.asset)!
    format_asset_info.push({
      address: info.address,
      asset: info.asset,
      in: formatBalance(info.in, decimal),
      out: formatBalance(info.out, decimal),
      diff: formatBalance(info.diff, decimal),
      current: formatBalance(balance, decimal),
    })
    if (info.asset === mb_usd_token) {
      total_of_ausd.in += info.in
      total_of_ausd.out += info.out
      total_of_ausd.diff += info.diff
      total_of_ausd.current += balance
    }
  }
  format_asset_info.push({
    address: "Total",
    asset: mb_usd_token,
    in: formatBalance(total_of_ausd.in, ausd_decimal),
    out: formatBalance(total_of_ausd.out, ausd_decimal),
    diff: formatBalance(total_of_ausd.diff, ausd_decimal),
    current: "-"
  })
  table(format_asset_info)

  // console.log("\nSummary report of asset transfer out:", )
  // table(outasset_info)
}

runner()
  .requiredNetwork(['acala'])
  .withApiPromise()
  .run(async ({ api: _api }) => {
    const input_address = process.argv[2].toLowerCase()
    const command = process.argv[3]
    let work_result: {
      evt: number
      extrinsic: string
      from: string
      to: string
      asset: string
      amount: string
      kind: string
    }[] = []

    // If specified one address, ignore other address.
    if (typeof input_address !== 'undefined' && input_address !== 'all') {
        work_result = await get_events(input_address, true)
        process_one(input_address, work_result)
        await format_asset_info()
    } else {
      // Work for one address.
      const work = async (addr: string) => {
        // Get Events
        const result = await get_events(addr)
        // Processing Events
        process_one(addr, result)
      }

      // Work for all addresses.
      const asyncFunc = async () => {
        const workPromises = Array.from(addresses).map(async (address) => {
          await work(address)
        })
        await Promise.all(workPromises)

        await format_asset_info()
      }
      await asyncFunc()
    }

    if (typeof command === 'undefined') {
      return;
    }

    if (command.startsWith('trace')) {
      const commands = command.split("-")
      // trace, trace-
      if (commands.length == 1 || (commands.length == 2 && commands[1] === '')) {
        const incoming: Set<string> = new Set()
        const outgoing: Set<string> = new Set()
        for (const e of work_result) {
          if (typeof lpMap.get(e.from) === 'undefined' && e.from !== input_address) {
            incoming.add(e.from)
          }
          if (typeof lpMap.get(e.to) === 'undefined' && e.to !== input_address) {
            outgoing.add(e.to)
          }
        }
        console.log("incoming:", incoming)
        console.log("outgoing:", outgoing)
      } else {
        // trace-2-b: trace two level before
        // trace-2-a: trace two level after
        // let cnt = commands[1]
        // let dir = commands[2]
        // const incoming: Set<string> = new Set()
        // const outgoing: Set<string> = new Set()
        // for (const e of work_result) {
        //   if (typeof lpMap.get(e.from) === 'undefined' && e.from !== input_address) {
        //     incoming.add(e.from)
        //   }
        //   if (typeof lpMap.get(e.to) === 'undefined' && e.to !== input_address) {
        //     outgoing.add(e.to)
        //   }
        // }
        // console.log("incoming:", incoming)
        // console.log("outgoing:", outgoing)
        // if (dir === 'b') {
        //   for (const income of incoming) {
        //     const incoming_before: Set<string> = new Set()
        //     work_result = await get_events(income, false)
        //     await process_one(income, work_result)
        //     for (const e of work_result) {
        //       if (typeof lpMap.get(e.from) === 'undefined' && e.from !== income) {
        //         incoming_before.add(e.from)
        //       }
        //     }
        //     console.log("  incoming before:", incoming_before)
        //   }
        // } else if (dir === 'a') {
        // }
      }

      return;
    }

    // direct transfer to individual addresss
    if (command === 'dig') {
      reset()
      
      console.log('🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀')
      const direct_transfers = []
      for (const [key, dests] of Object.entries(direct_addresses)) {
        for (const dest of dests.dest) {
          console.log('\nQuery Transfers: ', key, ' -> ', dest, '.')
          direct_transfers.push({
            origin_address: key,
            dest_address: dest,
          })

          const work_result = await get_events(dest, false)
          process_one(dest, work_result)
          await format_asset_info()

          reset()
        }
        console.log('🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥')
      }
      return;
    }

    console.log(new Date())
  })
