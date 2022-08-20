import { gql, request } from 'graphql-request'

const main = async () => {
  const pageSize = 10
  const query = gql`
    query q($start: Int) {
      events(
        first: ${pageSize}, offset: $start
        filter: {
          blockNumber: { lessThan: "1639493", greaterThan: "1638215" }
          section: { equalTo: "xTokens" }
          method: { equalTo: "TransferredMultiAssets" }
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

  // // method: { equalTo: "TransferredMultiAssets" }
  const filterData = (data: any[]) => {
    return (
      data
        // .filter(
        //   (x: { id: string; data: { value: string }[] }) =>
        //     x.data[0].value === '253pFTg22JqHbLeLZupexGMDUuXAJLfEriTYkFqvGWPuwcFi'
        // )
        .map(({ id, data: [who] }: any) => ({
          id,
          who: who.value,
          // dest: dest.value,
          // asset: asset.value,
          // recipient: recipient.value
        }))
    )
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
