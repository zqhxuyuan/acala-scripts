import '@acala-network/types'
import '@acala-network/types/interfaces/types-lookup'

import { Wallet } from '@acala-network/sdk/wallet'

import { formatBalance, table } from '../log'
import runner from '../runner'

runner()
  .requiredNetwork(['acala'])
  .atBlock()
  .withApiPromise()
  .run(async ({ api }) => {
    const wallet = new Wallet(api)

    const queryData = async (block: number) => {
      const apiAt = await api.at(await api.rpc.chain.getBlockHash(block))

      const liquidityPools = (await apiAt.query.dex.liquidityPool.entries()).map(([key, info]) => ({
        pool: key.args[0],
        info,
      }))

      const data = []
      for (const pool of liquidityPools) {
        const token1 = await wallet.getToken(pool.pool[0])
        const token2 = await wallet.getToken(pool.pool[1])
        const amount1F = formatBalance(pool.info[0].toBigInt(), token1.decimals)
        const amount2F = formatBalance(pool.info[1].toBigInt(), token2.decimals)
        const diff = token1.decimals - token2.decimals
        const exp = 10 ** diff
        if (diff === 0) {
          data.push({
            block,
            token1: token1.name,
            decimal1: token1.decimals,
            token2: token2.name,
            decimal2: token2.decimals,
            amount1F,
            amount2F,
            amount1: pool.info[0].toBigInt(),
            amount2: pool.info[1].toBigInt(),
            rateRaw: Number((pool.info[0].toBigInt() * 1000n) / pool.info[1].toBigInt()) / 1000,
            rate: Number((pool.info[0].toBigInt() * 1000n) / pool.info[1].toBigInt()) / 1000,
          })
        } else {
          data.push({
            block,
            token1: token1.name,
            decimal1: token1.decimals,
            token2: token2.name,
            decimal2: token2.decimals,
            amount1F,
            amount2F,
            amount1: pool.info[0].toBigInt(),
            amount2: pool.info[1].toBigInt(),
            rateRaw: Number((pool.info[0].toBigInt() * 1000n) / pool.info[1].toBigInt()) / 1000,
            rate: Number((pool.info[0].toBigInt() * 1000n) / pool.info[1].toBigInt() / BigInt(exp)) / 1000,
          })
        }
      }

      return {
        data: data,
      }
    }

    const before = 1638215
    const after = 1639493
    const step = 10

    const list = await Promise.all(
      rangeByStep(before, after, step).map(async (block) => {
        const result = await queryData(block)
        return { data: result.data }
      })
    )
    for (const { data } of list) {
      table(data)
    }
    // console.log(JSON.stringify(list))
  })

export function rangeByStep(start: number, end: number, step: number): number[] {
  if (end === start || step === 0) {
    return [start]
  }
  if (step < 0) {
    step = -step
  }

  const stepNumOfDecimal = step.toString().split('.')[1]?.length || 0
  const endNumOfDecimal = end.toString().split('.')[1]?.length || 0
  const maxNumOfDecimal = Math.max(stepNumOfDecimal, endNumOfDecimal)
  const power = Math.pow(10, maxNumOfDecimal)
  const diff = Math.abs(end - start)
  const count = Math.trunc(diff / step + 1)
  step = end - start > 0 ? step : -step

  const intStart = Math.trunc(start * power)
  return Array.from(Array(count).keys()).map((x) => {
    const increment = Math.trunc(x * step * power)
    const value = intStart + increment
    return Math.trunc(value) / power
  })
}
