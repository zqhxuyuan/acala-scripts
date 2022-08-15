import '@acala-network/types'
import '@acala-network/types/interfaces/types-lookup'

import runner from '../runner'

runner()
  .requiredNetwork(['acala', 'karura'])
  .withApiPromise()
  .run(async ({ api }) => {
    const bytecode =
      '0x608060405234801561001057600080fd5b50611012806100206000396000f3fe608060405234801561001057600080fd5b50600436106100c95760003560e01c80633950935111610081578063a457c2d71161005b578063a457c2d714610180578063a9059cbb14610193578063dd62ed3e146101a657600080fd5b8063395093511461015257806370a082311461016557806395d89b411461017857600080fd5b806318160ddd116100b257806318160ddd1461010f57806323b872dd14610125578063313ce5671461013857600080fd5b806306fdde03146100ce578063095ea7b3146100ec575b600080fd5b6100d66101ea565b6040516100e39190610ef3565b60405180910390f35b6100ff6100fa366004610dae565b6101f9565b60405190151581526020016100e3565b610117610211565b6040519081526020016100e3565b6100ff610133366004610d73565b61021b565b61014061023f565b60405160ff90911681526020016100e3565b6100ff610160366004610dae565b610249565b610117610173366004610d20565b610293565b6100d66102a4565b6100ff61018e366004610dae565b6102ae565b6100ff6101a1366004610dae565b610382565b6101176101b4366004610d41565b73ffffffffffffffffffffffffffffffffffffffff91821660009081526020818152604080832093909416825291909152205490565b60606101f4610390565b905090565b60003361020781858561046e565b5060019392505050565b60006101f4610620565b6000336102298582856106f6565b6102348585856107cb565b506001949350505050565b60006101f461097b565b3360008181526020818152604080832073ffffffffffffffffffffffffffffffffffffffff87168452909152812054909190610207908290869061028e908790610f44565b61046e565b600061029e82610a51565b92915050565b60606101f4610b70565b3360008181526020818152604080832073ffffffffffffffffffffffffffffffffffffffff8716845290915281205490919083811015610375576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760448201527f207a65726f00000000000000000000000000000000000000000000000000000060648201526084015b60405180910390fd5b610234828686840361046e565b6000336102078185856107cb565b60408051600481526024810182526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167f06fdde030000000000000000000000000000000000000000000000000000000017905290516060916000918291610400916103fe9190610ed7565b600060405180830381855afa9150503d8060008114610439576040519150601f19603f3d011682016040523d82523d6000602084013e61043e565b606091505b50915091506000821415610453573d60208201fd5b808060200190518101906104679190610dd7565b9250505090565b73ffffffffffffffffffffffffffffffffffffffff8316610510576040517f08c379a0000000000000000000000000000000000000000000000000000000008152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460448201527f7265737300000000000000000000000000000000000000000000000000000000606482015260840161036c565b73ffffffffffffffffffffffffffffffffffffffff82166105b3576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f20616464726560448201527f7373000000000000000000000000000000000000000000000000000000000000606482015260840161036c565b73ffffffffffffffffffffffffffffffffffffffff8381166000818152602081815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591015b60405180910390a3505050565b60408051600481526024810182526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167f18160ddd000000000000000000000000000000000000000000000000000000001790529051600091829182916104009161068d9190610ed7565b600060405180830381855afa9150503d80600081146106c8576040519150601f19603f3d011682016040523d82523d6000602084013e6106cd565b606091505b509150915060008214156106e2573d60208201fd5b808060200190518101906104679190610e9e565b73ffffffffffffffffffffffffffffffffffffffff838116600090815260208181526040808320938616835292905220547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff81146107c557818110156107b8576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e6365000000604482015260640161036c565b6107c5848484840361046e565b50505050565b73ffffffffffffffffffffffffffffffffffffffff831661086e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f20616460448201527f6472657373000000000000000000000000000000000000000000000000000000606482015260840161036c565b73ffffffffffffffffffffffffffffffffffffffff8216610911576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201527f6573730000000000000000000000000000000000000000000000000000000000606482015260840161036c565b61091c838383610bde565b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8360405161061391815260200190565b60408051600481526024810182526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167f313ce56700000000000000000000000000000000000000000000000000000000179052905160009182918291610400916109e89190610ed7565b600060405180830381855afa9150503d8060008114610a23576040519150601f19603f3d011682016040523d82523d6000602084013e610a28565b606091505b50915091506000821415610a3d573d60208201fd5b808060200190518101906104679190610eb6565b60405173ffffffffffffffffffffffffffffffffffffffff821660248201526000908190819061040090604401604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181529181526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167f70a082310000000000000000000000000000000000000000000000000000000017905251610aff9190610ed7565b600060405180830381855afa9150503d8060008114610b3a576040519150601f19603f3d011682016040523d82523d6000602084013e610b3f565b606091505b50915091506000821415610b54573d60208201fd5b80806020019051810190610b689190610e9e565b949350505050565b60408051600481526024810182526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167f95d89b410000000000000000000000000000000000000000000000000000000017905290516060916000918291610400916103fe9190610ed7565b60405173ffffffffffffffffffffffffffffffffffffffff84811660248301528316604482015260648101829052600090819061040090608401604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181529181526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fbeabacc80000000000000000000000000000000000000000000000000000000017905251610c999190610ed7565b6000604051808303816000865af19150503d8060008114610cd6576040519150601f19603f3d011682016040523d82523d6000602084013e610cdb565b606091505b50915091506000821415610cf0573d60208201fd5b5050505050565b803573ffffffffffffffffffffffffffffffffffffffff81168114610d1b57600080fd5b919050565b600060208284031215610d31578081fd5b610d3a82610cf7565b9392505050565b60008060408385031215610d53578081fd5b610d5c83610cf7565b9150610d6a60208401610cf7565b90509250929050565b600080600060608486031215610d87578081fd5b610d9084610cf7565b9250610d9e60208501610cf7565b9150604084013590509250925092565b60008060408385031215610dc0578182fd5b610dc983610cf7565b946020939093013593505050565b600060208284031215610de8578081fd5b815167ffffffffffffffff80821115610dff578283fd5b818401915084601f830112610e12578283fd5b815181811115610e2457610e24610fad565b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0908116603f01168101908382118183101715610e6a57610e6a610fad565b81604052828152876020848701011115610e82578586fd5b610e93836020830160208801610f81565b979650505050505050565b600060208284031215610eaf578081fd5b5051919050565b600060208284031215610ec7578081fd5b815160ff81168114610d3a578182fd5b60008251610ee9818460208701610f81565b9190910192915050565b6020815260008251806020840152610f12816040850160208701610f81565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169190910160400192915050565b60008219821115610f7c577f4e487b710000000000000000000000000000000000000000000000000000000081526011600452602481fd5b500190565b60005b83811015610f9c578181015183820152602001610f84565b838111156107c55750506000910152565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fdfea26469706673582212208236983f6f338ac73b28bf134dc18b7f9b89ef022dfd0616bb593700044627b364736f6c63430008040033'

    const tokens = [
      '0x0000000000000000000200000000000000000001',
      '0x0000000000000000000200000000010000000003',
      '0x000000000000000000020000000001020000000d',
      '0x000000000000000000020000000002020000000d',
      '0x0000000000000000000300000000000000000000',
      '0x0000000000000000000300000000000000000001',
      '0x0000000000000000000500000000000000000000',
      '0x0000000000000000000500000000000000000001',
      '0x0000000000000000000500000000000000000002',
      '0x0000000000000000000500000000000000000003',
      '0x0000000000000000000500000000000000000004',
      '0x0000000000000000000500000000000000000005',
      '0x0000000000000000000500000000000000000006',
      '0x0000000000000000000500000000000000000007',
      '0x0000000000000000000500000000000000000008',
    ]

    let idx = (await api.query.technicalCommittee.proposalCount()).toNumber()

    const proposals = tokens.map((addr) => {
      const proposal = api.tx.evm.createPredeployContract(addr, bytecode, 0, 2000000, 16800, [])
      const hash = proposal.method.hash
      return {
        propose: api.tx.technicalCommittee.propose(2, proposal, proposal.encodedLength),
        hash,
        index: idx++,
      }
    })

    const proposeTx = api.tx.utility.batchAll(proposals.map((x) => x.propose))

    console.log('Propose', proposeTx.toHex())

    const votes = proposals.map(({ hash, index }) => {
      return api.tx.technicalCommittee.vote(hash, index, true)
    })

    const voteTx = api.tx.utility.batchAll(votes)

    console.log('Vote', voteTx.toHex())

    for (const { hash, index, propose } of proposals) {
      const weight = await api.rpc.payment.queryInfo(propose.toHex())
      const close = api.tx.technicalCommittee.close(hash, index, weight.weight, propose.encodedLength)
      console.log('Close', index, close.toHex())
    }
  })
