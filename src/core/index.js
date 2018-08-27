import { assert } from "@0xproject/assert";
import { BigNumber } from "@0xproject/utils";
import * as constants from "./constants";
import { schemas } from "../schemas/bZx_json_schemas";
import * as utils from "./utils";
import * as tokenRegistry from "../tokenRegistry";
import EIP20 from "../contracts/EIP20.json";
import * as allowance from "../allowance";
import * as oracles from "../oracles";
import * as fill from "../fill";
import * as Addresses from "../addresses";
import * as orderHistory from "../orderHistory";
import * as transfer from "../transfer";
import * as signature from "../signature";
import * as Errors from "./constants/errors";
import * as trade from "../trade";
import * as loanHealth from "../loanHealth";
import * as bounty from "../bounty";
import * as weth from "../weth";

const Web3 = require("web3"); // eslint-disable global-require

export default class BZxJS {
  static generatePseudoRandomSalt = utils.generatePseudoRandomSalt;
  static noop = utils.noop;
  static toChecksumAddress = utils.toChecksumAddress;

  /* On Metamask, provider.host is undefined
  Force users to provide host url */
  constructor(
    provider,
    { networkId, addresses = Addresses.getAddresses(networkId) } = {}
  ) {
    if (!networkId) throw new Error(Errors.NoNetworkId);

    assert.isWeb3Provider("provider", provider);
    this.web3 = new Web3(provider);
    this.addresses = addresses;
    this.networkId = networkId;
    switch (networkId) {
      case 1:
        this.networkName = "mainnet";
        this.etherscanURL = "https://etherscan.io/";
        break;
      case 3:
        this.networkName = "ropsten";
        this.etherscanURL = "https://ropsten.etherscan.io/";
        break;
      case 4:
        this.networkName = "rinkeby";
        this.etherscanURL = "https://rinkeby.etherscan.io/";
        break;
      case 42:
        this.networkName = "kovan";
        this.etherscanURL = "https://kovan.etherscan.io/";
        break;
      default:
        this.networkName = "local";
        this.etherscanURL = "";
        break;
    }
  }

  static getLoanOrderHashHex(order) {
    utils.doesConformToSchema("loanOrder", order, schemas.loanOrderSchema);
    const orderHashHex = utils.getLoanOrderHashHex(order);
    return orderHashHex;
  }
  getLoanOrderHashAsync = async props =>
    utils.getLoanOrderHashAsync(this, props);

  static isValidSignature = props => signature.isValidSignature(props);

  isValidSignatureAsync = async props =>
    signature.isValidSignatureAsync(this, props);

  signOrderHashAsync = async (...props) =>
    signature.signOrderHashAsync(this, ...props);

  setAllowance = (...props) => allowance.setAllowance(this, ...props);

  setAllowanceUnlimited = props =>
    this.setAllowance({
      ...props,
      amountInBaseUnits: constants.UNLIMITED_ALLOWANCE_IN_BASE_UNITS
    });

  resetAllowance = props =>
    this.setAllowance({
      ...props,
      amountInBaseUnits: new BigNumber(0)
    });

  getAllowance = async (...props) => allowance.getAllowance(this, ...props);

  getBalance = async ({ tokenAddress, ownerAddress }) => {
    assert.isETHAddressHex("ownerAddress", ownerAddress);
    assert.isETHAddressHex("tokenAddress", tokenAddress);

    const tokenContract = await utils.getContractInstance(
      this.web3,
      EIP20.abi,
      tokenAddress
    );
    const balance = await tokenContract.methods.balanceOf(ownerAddress).call();
    return new BigNumber(balance);
  };

  getTokenList = async () => tokenRegistry.getTokenList(this);

  getOracleList = async () => oracles.getOracleList(this);
  isTradeSupported = async (...props) =>
    oracles.isTradeSupported(this, ...props);
  getConversionData = async (...props) =>
    oracles.getConversionData(this, ...props);

  takeLoanOrderAsLender = (...props) =>
    fill.takeLoanOrderAsLender(this, ...props);

  takeLoanOrderAsTrader = (...props) =>
    fill.takeLoanOrderAsTrader(this, ...props);

  pushLoanOrderOnChain = (...props) =>
    fill.pushLoanOrderOnChain(this, ...props);

  takeLoanOrderOnChainAsTrader = (...props) =>
    fill.takeLoanOrderOnChainAsTrader(this, ...props);

  takeLoanOrderOnChainAsLender = (...props) =>
    fill.takeLoanOrderOnChainAsLender(this, ...props);

  cancelLoanOrder = (...props) =>
    fill.cancelLoanOrder(this, ...props);

  cancelLoanOrderWithHash = (...props) =>
    fill.cancelLoanOrderWithHash(this, ...props);

  getInitialCollateralRequired = async (...props) =>
    fill.getInitialCollateralRequired(this, ...props);

  getSingleOrder = async (...props) =>
    orderHistory.getSingleOrder(this, ...props);
  getOrdersFillable = async (...props) =>
    orderHistory.getOrdersFillable(this, ...props);
  getOrdersForUser = async (...props) =>
    orderHistory.getOrdersForUser(this, ...props);
  getSingleLoan = async (...props) =>
    orderHistory.getSingleLoan(this, ...props);
  getLoansForLender = async (...props) =>
    orderHistory.getLoansForLender(this, ...props);
  getLoansForTrader = async (...props) =>
    orderHistory.getLoansForTrader(this, ...props);

  transferToken = (...props) => transfer.transferToken(this, ...props);

  tradePositionWith0x = (...props) => trade.tradePositionWith0x(this, ...props);
  tradePositionWithOracle = (...props) =>
    trade.tradePositionWithOracle(this, ...props);

  changeCollateral = (...props) => loanHealth.changeCollateral(this, ...props);
  depositCollateral = (...props) =>
    loanHealth.depositCollateral(this, ...props);
  withdrawExcessCollateral = (...props) =>
    loanHealth.withdrawExcessCollateral(this, ...props);
  getProfitOrLoss = (...props) => loanHealth.getProfitOrLoss(this, ...props);
  withdrawProfit = (...props) => loanHealth.withdrawProfit(this, ...props);

  closeLoan = (...props) => loanHealth.closeLoan(this, ...props);
  payInterest = (...props) => loanHealth.payInterest(this, ...props);
  getInterest = (...props) => loanHealth.getInterest(this, ...props);

  requestFaucetToken = (...props) => utils.requestFaucetToken(this, ...props);

  getActiveLoans = (...props) => bounty.getActiveLoans(this, ...props);
  getMarginLevels = (...props) => bounty.getMarginLevels(this, ...props);
  liquidateLoan = (...props) => bounty.liquidateLoan(this, ...props);

  wrapEth = (...props) => weth.wrapEth(this, ...props);
  unwrapEth = (...props) => weth.unwrapEth(this, ...props);
}
