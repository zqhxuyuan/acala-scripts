import { gql, request } from 'graphql-request'

const main = async () => {
  const pageSize = 100
  const query = gql`
    query q($start: Int) {
      events(
        first: ${pageSize}, offset: $start
        filter: {
          blockNumber: { lessThan: "1639493", greaterThan: "1638215" }
          section: { equalTo: "dex" }
          method: { equalTo: "Swap" }
        }
      ) {
        nodes {
          id
          data
        }
        pageInfo {
          hasNextPage
        }
      }
    }
  `

  const filterData = (data: any[]) => {
    return data
      .filter(
        (x: { id: string; data: { value: string }[] }) =>
          // incentives::ClaimRewards reward AUSD from AUSD/IBTC pool
          // x.data[1].value === '{"dex":{"dexShare":[{"token":"AUSD"},{"foreignAsset":3}]}}' &&
          // x.data[2].value === '{"token":"AUSD"}'

          // dex::Swap, filter only [IBTC, AUSD] swap event
          x.data[1].value === '[{"foreignAsset":3}, {"token":"AUSD"}]'

        // x.data[0].value === '246CS7mbRGx9AxmNCxk8TXPvdTncW1EBStBX1JpuZcETz8ey' &&
        // // [AUSD,LiquidCrowdloan(1),DOT] + Taiga(0,0,1) + [LODT,AUSD]
        // x.data[1].value != '[{\"token\":\"LDOT\"}, {\"token\":\"AUSD\"}]' &&
        // x.data[1].value != '[{\"token\":\"AUSD\"}, {\"liquidCrowdloan\":13}, {\"token\":\"DOT\"}]' &&
        // // [AUSD,LDOT] + Tiaga(0,1,0) + [DOT,LiquidCrowdloan(1),AUSD]
        // x.data[1].value != '[{\"token\":\"AUSD\"}, {\"token\":\"LDOT\"}]' &&
        // x.data[1].value != '[{\"token\":\"DOT\"}, {\"liquidCrowdloan\":13}, {\"token\":\"AUSD\"}]'
      )
      .map(({ id, data: [who, path, amount] }: any) => ({
        id,
        who: who.value,
        path,
        amount,
      }))
  }

  const data = [] as any[]
  const processNext = async (start: number) => {
    const result = await request('https://api.subquery.network/sq/AcalaNetwork/acala', query, { start })
    data.push(...filterData(result.events.nodes))
    if (result.events.pageInfo.hasNextPage) {
      process.stderr.write('.')
      await processNext(start + pageSize)
    }
  }

  await processNext(0)

  console.log(JSON.stringify(data))
}

main().catch(console.error)
