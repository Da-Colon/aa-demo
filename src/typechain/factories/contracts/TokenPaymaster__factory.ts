/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  type PayableOverrides,
} from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  TokenPaymaster,
  TokenPaymasterInterface,
} from "../../contracts/TokenPaymaster";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IEntryPoint",
        name: "_entryPoint",
        type: "address",
      },
      {
        internalType: "contract IERC20",
        name: "_token",
        type: "address",
      },
    ],
    stateMutability: "payable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "ServicePaid",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint32",
        name: "unstakeDelaySec",
        type: "uint32",
      },
    ],
    name: "addStake",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "entryPoint",
    outputs: [
      {
        internalType: "contract IEntryPoint",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getDeposit",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum IPaymaster.PostOpMode",
        name: "mode",
        type: "uint8",
      },
      {
        internalType: "bytes",
        name: "context",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "actualGasCost",
        type: "uint256",
      },
    ],
    name: "postOp",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "serviceCost",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "token",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unlockStake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "sender",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "nonce",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "initCode",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "callData",
            type: "bytes",
          },
          {
            internalType: "uint256",
            name: "callGasLimit",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "verificationGasLimit",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "preVerificationGas",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxFeePerGas",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxPriorityFeePerGas",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "paymasterAndData",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "signature",
            type: "bytes",
          },
        ],
        internalType: "struct UserOperation",
        name: "userOp",
        type: "tuple",
      },
      {
        internalType: "bytes32",
        name: "userOpHash",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "maxCost",
        type: "uint256",
      },
    ],
    name: "validatePaymasterUserOp",
    outputs: [
      {
        internalType: "bytes",
        name: "context",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "validationData",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "withdrawAddress",
        type: "address",
      },
    ],
    name: "withdrawStake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "withdrawAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdrawTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60a0604052604051610e77380380610e7783398101604081905261002291610113565b8161002c336100ab565b6001600160a01b039081166080819052600180546001600160a01b0319169284169290921790915560405163b760faf960e01b815230600482015263b760faf99034906024016000604051808303818588803b15801561008b57600080fd5b505af115801561009f573d6000803e3d6000fd5b5050505050505061014d565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6001600160a01b038116811461011057600080fd5b50565b6000806040838503121561012657600080fd5b8251610131816100fb565b6020840151909250610142816100fb565b809150509250929050565b608051610cde610199600039600081816101bf015281816102c30152818161035a015281816103d60152818161046a015281816104e10152818161056e01526107110152610cde6000f3fe6080604052600436106100dd5760003560e01c8063bb9fe6bf1161007f578063d0e30db011610059578063d0e30db01461022b578063f2fde38b14610233578063f465c77e14610253578063fc0c546a1461028157600080fd5b8063bb9fe6bf146101e1578063c23a5cea146101f6578063c399ec881461021657600080fd5b8063715018a6116100bb578063715018a6146101465780638da5cb5b1461015b578063a9a234091461018d578063b0d691fe146101ad57600080fd5b80630396cb60146100e25780631c47b5c6146100f7578063205c287814610126575b600080fd5b6100f56100f0366004610a94565b6102a1565b005b34801561010357600080fd5b50610113670de0b6b3a764000081565b6040519081526020015b60405180910390f35b34801561013257600080fd5b506100f5610141366004610ad6565b61032c565b34801561015257600080fd5b506100f561039e565b34801561016757600080fd5b506000546001600160a01b03165b6040516001600160a01b03909116815260200161011d565b34801561019957600080fd5b506100f56101a8366004610b02565b6103b2565b3480156101b957600080fd5b506101757f000000000000000000000000000000000000000000000000000000000000000081565b3480156101ed57600080fd5b506100f56103cc565b34801561020257600080fd5b506100f5610211366004610b91565b610443565b34801561022257600080fd5b506101136104c9565b6100f5610559565b34801561023f57600080fd5b506100f561024e366004610b91565b6105bb565b34801561025f57600080fd5b5061027361026e366004610bae565b610639565b60405161011d929190610c02565b34801561028d57600080fd5b50600154610175906001600160a01b031681565b6102a961065c565b604051621cb65b60e51b815263ffffffff821660048201527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690630396cb609034906024016000604051808303818588803b15801561031057600080fd5b505af1158015610324573d6000803e3d6000fd5b505050505050565b61033461065c565b60405163040b850f60e31b81526001600160a01b038381166004830152602482018390527f0000000000000000000000000000000000000000000000000000000000000000169063205c287890604401600060405180830381600087803b15801561031057600080fd5b6103a661065c565b6103b060006106b6565b565b6103ba610706565b6103c684848484610776565b50505050565b6103d461065c565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663bb9fe6bf6040518163ffffffff1660e01b8152600401600060405180830381600087803b15801561042f57600080fd5b505af11580156103c6573d6000803e3d6000fd5b61044b61065c565b60405163611d2e7560e11b81526001600160a01b0382811660048301527f0000000000000000000000000000000000000000000000000000000000000000169063c23a5cea90602401600060405180830381600087803b1580156104ae57600080fd5b505af11580156104c2573d6000803e3d6000fd5b5050505050565b6040516370a0823160e01b81523060048201526000907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906370a0823190602401602060405180830381865afa158015610530573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105549190610c57565b905090565b60405163b760faf960e01b81523060048201527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063b760faf99034906024016000604051808303818588803b1580156104ae57600080fd5b6105c361065c565b6001600160a01b03811661062d5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084015b60405180910390fd5b610636816106b6565b50565b60606000610645610706565b6106508585856108cf565b91509150935093915050565b6000546001600160a01b031633146103b05760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610624565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146103b05760405162461bcd60e51b815260206004820152601560248201527414d95b99195c881b9bdd08115b9d1c9e541bda5b9d605a1b6044820152606401610624565b600061078483850185610b91565b6001546040516323b872dd60e01b81526001600160a01b038084166004830152306024830152670de0b6b3a764000060448301529293509116906323b872dd906064016020604051808303816000875af11580156107e6573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061080a9190610c70565b61084e5760405162461bcd60e51b8152602060048201526015602482015274151bdad95b881d1c985b9cd9995c8819985a5b1959605a1b6044820152606401610624565b806001600160a01b03167f8dfe705393653a2ea59081f717d7096d435eeaa5049f45e1cbdd32f34e513d56670de0b6b3a764000060405161089191815260200190565b60405180910390a260018560028111156108ad576108ad610c92565b146104c25760028560028111156108c6576108c6610c92565b50505050505050565b60606000806108e16020870187610b91565b6001546040516370a0823160e01b81526001600160a01b038084166004830152929350670de0b6b3a764000092909116906370a0823190602401602060405180830381865afa158015610938573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061095c9190610c57565b10156109a05760405162461bcd60e51b8152602060048201526013602482015272496e73756666696369656e7420746f6b656e7360681b6044820152606401610624565b600154604051636eb1769f60e11b81526001600160a01b038381166004830152306024830152670de0b6b3a764000092169063dd62ed3e90604401602060405180830381865afa1580156109f8573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a1c9190610c57565b1015610a635760405162461bcd60e51b8152602060048201526016602482015275496e73756666696369656e7420616c6c6f77616e636560501b6044820152606401610624565b604080516001600160a01b03831660208201520160408051601f198184030181529190529660009650945050505050565b600060208284031215610aa657600080fd5b813563ffffffff81168114610aba57600080fd5b9392505050565b6001600160a01b038116811461063657600080fd5b60008060408385031215610ae957600080fd5b8235610af481610ac1565b946020939093013593505050565b60008060008060608587031215610b1857600080fd5b843560038110610b2757600080fd5b9350602085013567ffffffffffffffff80821115610b4457600080fd5b818701915087601f830112610b5857600080fd5b813581811115610b6757600080fd5b886020828501011115610b7957600080fd5b95986020929092019750949560400135945092505050565b600060208284031215610ba357600080fd5b8135610aba81610ac1565b600080600060608486031215610bc357600080fd5b833567ffffffffffffffff811115610bda57600080fd5b84016101608187031215610bed57600080fd5b95602085013595506040909401359392505050565b604081526000835180604084015260005b81811015610c305760208187018101516060868401015201610c13565b506000606082850101526060601f19601f8301168401019150508260208301529392505050565b600060208284031215610c6957600080fd5b5051919050565b600060208284031215610c8257600080fd5b81518015158114610aba57600080fd5b634e487b7160e01b600052602160045260246000fdfea26469706673582212205ae24ea423c2e8f416e7f9828dfdf000df3c45e27a7558f092c9a228936472be64736f6c63430008120033";

type TokenPaymasterConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TokenPaymasterConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TokenPaymaster__factory extends ContractFactory {
  constructor(...args: TokenPaymasterConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _entryPoint: PromiseOrValue<string>,
    _token: PromiseOrValue<string>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<TokenPaymaster> {
    return super.deploy(
      _entryPoint,
      _token,
      overrides || {}
    ) as Promise<TokenPaymaster>;
  }
  override getDeployTransaction(
    _entryPoint: PromiseOrValue<string>,
    _token: PromiseOrValue<string>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_entryPoint, _token, overrides || {});
  }
  override attach(address: string): TokenPaymaster {
    return super.attach(address) as TokenPaymaster;
  }
  override connect(signer: Signer): TokenPaymaster__factory {
    return super.connect(signer) as TokenPaymaster__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TokenPaymasterInterface {
    return new utils.Interface(_abi) as TokenPaymasterInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TokenPaymaster {
    return new Contract(address, _abi, signerOrProvider) as TokenPaymaster;
  }
}
