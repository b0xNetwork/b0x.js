import { BigNumber } from "@0xproject/utils";
import { Provider, TransactionObject, Tx } from "./node_modules/web3/types";

export declare interface IOrder {
  makerAddress: string;
  loanTokenAddress: string;
  interestTokenAddress: string;
  collateralTokenAddress: string;
  feeRecipientAddress: string;
  oracleAddress: string;
  loanTokenAmount: BigNumber;
  interestAmount: BigNumber;
  initialMarginAmount: BigNumber;
  maintenanceMarginAmount: BigNumber;
  lenderRelayFee: BigNumber;
  traderRelayFee: BigNumber;
  expirationUnixTimestampSec: number;
  makerRole: number;
  salt?: string;
  signature?: string;
}

export declare interface BZxJS {
  constructor(
    provider: Provider,
    params: { networkId: number; addresses?: string[] }
  );

  getLoanOrderHashAsync(order): Promise<string>;

  isValidSignatureAsync({ account, orderHash, signature }): Promise<boolean>;
  signOrderHashAsync(
    orderHash: string,
    signerAddress: string,
    shouldAddPersonalMessagePrefix
  ): Promise<string>;

  setAllowance(params: {
    tokenAddress: string;
    ownerAddress: string;
    spenderAddress: string;
    amountInBaseUnits: BigNumber;
    getObject: boolean;
    txOpts: Tx;
  }): Promise<boolean> | TransactionObject<boolean>;
  setAllowanceUnlimited(params: {
    tokenAddress: string;
    ownerAddress: string;
    spenderAddress: string;
    getObject: boolean;
    txOpts: Tx;
  }): Promise<boolean> | TransactionObject<boolean>;
  resetAllowance(params: {
    tokenAddress: string;
    ownerAddress: string;
    spenderAddress: string;
    getObject: boolean;
    txOpts: Tx;
  }): Promise<boolean> | TransactionObject<boolean>;
  getAllowance(params: {
    tokenAddress: string;
    ownerAddress: string;
    spenderAddress: string;
  }): BigNumber;

  getBalance(params: { tokenAddress: string; ownerAddress: string }): BigNumber;

  getTokenList(): string[];

  getOracleList(): { address: string; name: string }[];
  isTradeSupported(params: {
    sourceTokenAddress: string;
    destTokenAddress: string;
    oracleAddress: string;
  }): boolean;

  takeLoanOrderAsLender(params: {
    order: IOrder;
    getObject: boolean;
    txOpts: Tx;
  }): Promise<BigNumber> | TransactionObject<BigNumber>;
  takeLoanOrderAsTrader(params: {
    order: IOrder;
    collateralTokenAddress: string;
    loanTokenAmountFilled: BigNumber;
    getObject: boolean;
    txOpts: Tx;
  }): Promise<BigNumber> | TransactionObject<BigNumber>;

  pushLoanOrderOnChain(params: {
    order: IOrder;
    getObject: boolean;
    txOpts: Tx;
  }): Promise<any> | TransactionObject<any>;
  takeLoanOrderOnChainAsTrader(params: {
    loanOrderHash: string;
    collateralTokenAddress: string;
    loanTokenAmountFilled: BigNumber;
    getObject: boolean;
    txOpts: Tx;
  }): Promise<any> | TransactionObject<any>;

  takeLoanOrderOnChainAsLender(params: {
    loanOrderHash: string;
    getObject: boolean;
    txOpts: Tx;
  }): Promise<any> | TransactionObject<any>;
  cancelLoanOrder(params: {
    order: IOrder;
    cancelLoanTokenAmount: BigNumber;
    getObject: boolean;
    txOpts: Tx;
  }): Promise<BigNumber> | TransactionObject<BigNumber>;
  cancelLoanOrderWithHash(params: {
    loanOrderHash: string;
    cancelLoanTokenAmount: BigNumber;
    getObject: boolean;
    txOpts: Tx;
  }): Promise<BigNumber> | TransactionObject<BigNumber>;

  getInitialCollateralRequired(
    loanTokenAddress: string,
    collateralTokenAddress: string,
    oracleAddress: string,
    loanTokenAmountFilled: BigNumber,
    initialMarginAmount: BigNumber
  ): Promise<BigNumber>;

  getSingleOrder(params: { loanOrderHash: string }): Promise<string>;
  // TODO: Return data type (?)
  getOrdersFillable(params: { start: BigNumber; count: BigNumber }): any;
  // TODO: Return data type (?)
  getOrdersForUser(params: {
    loanPartyAddress: string;
    start: BigNumber;
    count: BigNumber;
  }): Promise<any>;

  // TODO: Maybe rename trader -> traderAddress
  getSingleLoan(params: {
    loanOrderHash: BigNumber;
    trader: BigNumber;
  }): Promise<string>;
  // TODO: Maybe rename address -> loanPartyAddress
  getLoansForLender(params: {
    address: string;
    count: BigNumber;
    activeOnly: boolean;
  }): Promise<string>;
  // TODO: Maybe rename address -> loanPartyAddress
  getLoansForTrader(params: {
    address: string;
    count: BigNumber;
    activeOnly: boolean;
  }): Promise<string>;

  // TODO: Check if it's ERC20.transfer (return boolean)
  transferToken(params: {
    tokenAddress: string;
    to: string;
    amount: BigNumber;
    getObject: boolean;
    txOpts: Tx;
  }): Promise<boolean> | TransactionObject<boolean>;

  tradePositionWith0x(params: {
    order0x: any;
    orderHashBZx: string;
    getObject: boolean;
    txOpts: Tx;
  }): Promise<string> | TransactionObject<string>;
  tradePositionWithOracle(params?: {
    orderHash: string;
    tradeTokenAddress: string;
    getObject: boolean;
    txOpts: Tx;
  }): Promise<string> | TransactionObject<string>;

  changeCollateral(params: {
    loanOrderHash: string;
    collateralTokenFilled: string;
    getObject: boolean;
    txOpts: Tx;
  }): Promise<boolean> | TransactionObject<boolean>;
  depositCollateral(params: {
    loanOrderHash: string;
    collateralTokenFilled: string;
    depositAmount: BigNumber;
    getObject: boolean;
    txOpts: Tx;
  }): Promise<boolean> | TransactionObject<boolean>;
  withdrawExcessCollateral(params: {
    loanOrderHash: string;
    collateralTokenFilled: string;
    withdrawAmount: BigNumber;
    getObject: boolean;
    txOpts: Tx;
  }): Promise<BigNumber> | TransactionObject<BigNumber>;
  // TODO: Maybe rename trader -> traderAddress
  getProfitOrLoss(params: {
    loanOrderHash: string;
    trader: string;
  }): {
    isProfit: boolean;
    profitOrLoss: BigNumber;
    positionTokenAddress: string;
  };
  withdrawProfit(params: {
    loanOrderHash: string;
    getObject: boolean;
    txOpts: Tx;
  }): Promise<BigNumber> | TransactionObject<BigNumber>;

  closeLoan(params: {
    loanOrderHash: string;
    getObject: boolean;
    txOpts: Tx;
  }): Promise<boolean> | TransactionObject<boolean>;
  // TODO: Maybe rename trader -> traderAddress
  payInterest(params: {
    loanOrderHash: string;
    trader: string;
    getObject: boolean;
    txOpts: Tx;
  }): Promise<BigNumber> | TransactionObject<BigNumber>;

  // TODO: No method (?)
  requestFaucetToken(params: {
    tokenAddress: string;
    receiverAddress: string;
    getObject: boolean;
    txOpts: Tx;
  }): Promise<any> | TransactionObject<any>;

  // TODO: Return data type (?)
  getActiveLoans(params: { start: BigNumber; count: BigNumber }): any;
  getMarginLevels(params: {
    loanOrderHash;
    trader;
  }): {
    initialMarginAmount: BigNumber;
    maintenanceMarginAmount: BigNumber;
    currentMarginAmount: BigNumber;
  };
  liquidateLoan(params: {
    loanOrderHash: string;
    trader: string;
    getObject: boolean;
    txOpts: Tx;
  }): Promise<boolean> | TransactionObject<boolean>;

  // TODO: Return data type (?)
  wrapEth(params: {
    amount: BigNumber;
    getObject: boolean;
    txOpts: Tx;
  }): Promise<any> | TransactionObject<any>;
  // TODO: Return data type (?)
  unwrapEth(params: {
    amount: BigNumber;
    getObject: boolean;
    txOpts: Tx;
  }): Promise<any> | TransactionObject<any>;

  // At this time typescript does not support static methods on interfaces
  // https://github.com/Microsoft/TypeScript/issues/13462
  // Looking for workarounds
  /*
  generatePseudoRandomSalt(): BigNumber;
  noop(): void;
  toChecksumAddress(address: string): string;
  getLoanOrderHashHex(order): string;
  isValidSignature({ account, orderHash, signature }): boolean;
 */
}
