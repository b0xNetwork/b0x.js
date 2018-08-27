(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["bZx.js"] = factory();
	else
		root["bZx.js"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 15);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requestFaucetToken = exports.toChecksumAddress = exports.doesConformToSchema = exports.getLoanOrderHashAsync = exports.getLoanOrderHashHex = exports.getContractInstance = exports.doesContractExistAtAddress = exports.generatePseudoRandomSalt = exports.bigNumberToBN = exports.noop = undefined;

var _utils = __webpack_require__(5);

var _assert = __webpack_require__(4);

var _bn = __webpack_require__(12);

var _bn2 = _interopRequireDefault(_bn);

var _web3Utils = __webpack_require__(13);

var _web3Utils2 = _interopRequireDefault(_web3Utils);

var _constants = __webpack_require__(6);

var constants = _interopRequireWildcard(_constants);

var _bZx_json_schemas = __webpack_require__(10);

var _contracts = __webpack_require__(1);

var _addresses = __webpack_require__(2);

var Addresses = _interopRequireWildcard(_addresses);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const noop = exports.noop = () => {};

const bigNumberToBN = exports.bigNumberToBN = value => new _bn2.default(value.toString(), 10);

const generatePseudoRandomSalt = exports.generatePseudoRandomSalt = () => {
  // BigNumber.random returns a pseudo-random number between 0 & 1
  // with a passed in number of decimal places.
  // Source: https://mikemcl.github.io/bignumber.js/#random
  const randomNumber = _utils.BigNumber.random(constants.MAX_DIGITS_IN_UNSIGNED_256_INT);
  const factor = new _utils.BigNumber(10).pow(constants.MAX_DIGITS_IN_UNSIGNED_256_INT - 1);
  const salt = randomNumber.times(factor).round();
  return salt;
};

const getOrderValues = (order, shouldFormatAsStrings) => {
  // Must be strings in production for Web3Utils.soliditySha3 for some reason
  if (shouldFormatAsStrings) {
    console.log(order);
    return [order.loanTokenAmount.toString(), order.interestAmount.toString(), order.initialMarginAmount.toString(), order.maintenanceMarginAmount.toString(), order.lenderRelayFee.toString(), order.traderRelayFee.toString(), order.maxDurationUnixTimestampSec.toString(), order.expirationUnixTimestampSec.toString(), order.makerRole.toString(), order.salt.toString()];
  }
  return [bigNumberToBN(order.loanTokenAmount), bigNumberToBN(order.interestAmount), bigNumberToBN(order.initialMarginAmount), bigNumberToBN(order.maintenanceMarginAmount), bigNumberToBN(order.lenderRelayFee), bigNumberToBN(order.traderRelayFee), bigNumberToBN(order.maxDurationUnixTimestampSec), bigNumberToBN(order.expirationUnixTimestampSec), bigNumberToBN(order.makerRole), bigNumberToBN(order.salt)];
};

const getLoanOrderHashArgs = (order, shouldFormatAsStrings) => {
  const orderAddresses = [order.makerAddress, order.loanTokenAddress, order.interestTokenAddress, order.collateralTokenAddress, order.feeRecipientAddress, order.oracleAddress];
  const orderValues = getOrderValues(order, shouldFormatAsStrings);

  return { orderAddresses, orderValues };
};

const doesContractExistAtAddress = exports.doesContractExistAtAddress = (() => {
  var _ref = _asyncToGenerator(function* (web3, address) {
    const code = yield web3.eth.getCode(address);
    // Regex matches 0x0, 0x00, 0x in order to accommodate poorly implemented clients
    const codeIsEmpty = /^0x0{0,40}$/i.test(code);
    return !codeIsEmpty;
  });

  return function doesContractExistAtAddress(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

const getContractInstance = exports.getContractInstance = (web3, abi, address) => {
  _assert.assert.isETHAddressHex("address", address);
  const contract = new web3.eth.Contract(abi, address);
  return contract;
};

const getLoanOrderHashHex = exports.getLoanOrderHashHex = order => {
  const { orderAddresses, orderValues } = getLoanOrderHashArgs(order, true);

  const orderHashHex = _web3Utils2.default.soliditySha3({ t: "address", v: order.bZxAddress }, { t: "address[6]", v: orderAddresses }, { t: "uint256[10]", v: orderValues });
  return orderHashHex;
};

const getLoanOrderHashAsync = exports.getLoanOrderHashAsync = (() => {
  var _ref2 = _asyncToGenerator(function* ({ web3, networkId }, order) {
    const { orderAddresses, orderValues } = getLoanOrderHashArgs(order, false);
    const bZxContract = yield getContractInstance(web3, (0, _contracts.getContracts)(networkId).BZx.abi, Addresses.getAddresses(networkId).BZx);
    return bZxContract.methods.getLoanOrderHash(orderAddresses, orderValues).call();
  });

  return function getLoanOrderHashAsync(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
})();

const doesConformToSchema = exports.doesConformToSchema = (variableName, value, schema) => {
  const schemaValidator = new _bZx_json_schemas.SchemaValidator();
  const validationResult = schemaValidator.validate(value, schema);
  const hasValidationErrors = validationResult.errors.length > 0;
  const msg = `Expected ${variableName} to conform to schema ${schema.id}\nEncountered: ${JSON.stringify(value, null, "\t")}\nValidation errors: ${validationResult.errors.join(", ")}`;
  _assert.assert.assert(!hasValidationErrors, msg);
};

const toChecksumAddress = exports.toChecksumAddress = addr => _web3Utils2.default.toChecksumAddress(addr);

const requestFaucetToken = exports.requestFaucetToken = ({ web3, networkId }, {
  tokenAddress,
  receiverAddress,
  getObject,
  txOpts
}) => {
  const faucetContract = getContractInstance(web3, (0, _contracts.getContracts)(networkId).TestNetFaucet.abi, Addresses.getAddresses(networkId).TestNetFaucet);

  const txObj = faucetContract.methods.faucet(toChecksumAddress(tokenAddress), toChecksumAddress(receiverAddress));
  console.log(`requestFaucetToken: ${txObj.encodeABI()}`);

  if (getObject) {
    return txObj;
  }
  return txObj.send(txOpts);
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getContracts = exports.rinkeby = exports.kovan = exports.ropsten = exports.mainnet = exports.local = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _ramda = __webpack_require__(3);

var _local2 = __webpack_require__(20);

var _local3 = _interopRequireDefault(_local2);

var _mainnet2 = __webpack_require__(43);

var _mainnet3 = _interopRequireDefault(_mainnet2);

var _ropsten2 = __webpack_require__(57);

var _ropsten3 = _interopRequireDefault(_ropsten2);

var _kovan2 = __webpack_require__(71);

var _kovan3 = _interopRequireDefault(_kovan2);

var _rinkeby2 = __webpack_require__(85);

var _rinkeby3 = _interopRequireDefault(_rinkeby2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const toLowerCase = (0, _ramda.map)((_ref) => {
  let { address } = _ref,
      rest = _objectWithoutProperties(_ref, ["address"]);

  return _extends({
    address: address.toLowerCase()
  }, rest);
});

const networksRaw = {
  local: _local3.default,
  mainnet: _mainnet3.default,
  ropsten: _ropsten3.default,
  kovan: _kovan3.default,
  rinkeby: _rinkeby3.default
};
const networks = (0, _ramda.map)(network => toLowerCase(network), networksRaw);

const { local, mainnet, ropsten, kovan, rinkeby } = networks;

exports.local = local;
exports.mainnet = mainnet;
exports.ropsten = ropsten;
exports.kovan = kovan;
exports.rinkeby = rinkeby;
const networksById = {
  1: mainnet,
  3: ropsten,
  4: rinkeby,
  42: kovan
};

const getContracts = exports.getContracts = (networkId = null) => networksById[networkId] ? networksById[networkId] : local;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAddresses = undefined;

var _ramda = __webpack_require__(3);

var _contracts = __webpack_require__(1);

const formatData = raw => (0, _ramda.pipe)((0, _ramda.map)(contract => contract.address), (0, _ramda.map)(address => address.toLowerCase()))(raw);

const getAddresses = exports.getAddresses = networkId => (0, _ramda.pipe)(_contracts.getContracts, formatData)(networkId);

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("ramda");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("@0xproject/assert");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("@0xproject/utils");

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MAX_DIGITS_IN_UNSIGNED_256_INT = exports.UNLIMITED_ALLOWANCE_IN_BASE_UNITS = exports.NULL_ADDRESS = exports.SOLIDITY_TYPE_MAX_CHARS = undefined;

var _utils = __webpack_require__(5);

const SOLIDITY_TYPE_MAX_CHARS = exports.SOLIDITY_TYPE_MAX_CHARS = 64;
const NULL_ADDRESS = exports.NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
const UNLIMITED_ALLOWANCE_IN_BASE_UNITS = exports.UNLIMITED_ALLOWANCE_IN_BASE_UNITS = new _utils.BigNumber(2).pow(256).minus(1);
const MAX_DIGITS_IN_UNSIGNED_256_INT = exports.MAX_DIGITS_IN_UNSIGNED_256_INT = 78;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidSignatureAsync = exports.isValidSignature = exports.signOrderHashAsync = undefined;

var _ethSigUtil = __webpack_require__(103);

var _ethSigUtil2 = _interopRequireDefault(_ethSigUtil);

var _ethereumjsUtil = __webpack_require__(8);

var ethUtil = _interopRequireWildcard(_ethereumjsUtil);

var _assert = __webpack_require__(4);

var _lodash = __webpack_require__(11);

var _lodash2 = _interopRequireDefault(_lodash);

var _utils = __webpack_require__(104);

var signatureUtils = _interopRequireWildcard(_utils);

var _utils2 = __webpack_require__(0);

var CoreUtils = _interopRequireWildcard(_utils2);

var _contracts = __webpack_require__(1);

var _addresses = __webpack_require__(2);

var Addresses = _interopRequireWildcard(_addresses);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const SignatureTypeStr = Object.freeze({
  "Illegal": "00",
  "Invalid": "01",
  "EIP712": "02",
  "EthSign": "03",
  "Caller": "04",
  "Wallet": "05",
  "Validator": "06",
  "PreSigned": "07",
  "Trezor": "08"
});

const signOrderHashAsync = exports.signOrderHashAsync = (() => {
  var _ref = _asyncToGenerator(function* ({ web3 }, orderHash, signerAddress,
  // Metamask provider needs shouldAddPersonalMessagePrefix to be true
  shouldAddPersonalMessagePrefix) {
    _assert.assert.isHexString("orderHash", orderHash);
    _assert.assert.isETHAddressHex("signerAddress", signerAddress);
    const nodeVersion = web3.version.node;
    const isParityNode = _lodash2.default.includes(nodeVersion, "Parity");
    const isTestRpc = _lodash2.default.includes(nodeVersion, "TestRPC");
    let signature = null;

    if (isParityNode || isTestRpc) {
      // Parity and TestRpc nodes add the personalMessage prefix itself
      signature = yield web3.eth.sign(orderHash, signerAddress);
    } else {
      let msgHashHex = orderHash;
      if (shouldAddPersonalMessagePrefix) {
        const orderHashBuff = ethUtil.toBuffer(orderHash);
        const msgHashBuff = ethUtil.hashPersonalMessage(orderHashBuff);
        msgHashHex = ethUtil.bufferToHex(msgHashBuff);
      }
      signature = yield web3.eth.sign(msgHashHex, signerAddress);
    }

    // HACK: There is no consensus on whether the signatureHex string should be formatted as
    // v + r + s OR r + s + v, and different clients (even different versions of the same client)
    // return the signature params in different orders. In order to support all client implementations,
    // we parse the signature in both ways, and evaluate if either one is a valid signature.
    const validVParamValues = [27, 28];
    const ecSignatureVRS = signatureUtils.parseSignatureHexAsVRS(signature);
    if (_lodash2.default.includes(validVParamValues, ecSignatureVRS.v)) {
      const isValidVRSSignature = signatureUtils.isValidSignature(orderHash, ecSignatureVRS, signerAddress);
      if (isValidVRSSignature) {
        return ethUtil.toRpcSig(ecSignatureVRS.v, ecSignatureVRS.r, ecSignatureVRS.s) + SignatureTypeStr.EthSign;
      }
    }

    const ecSignatureRSV = signatureUtils.parseSignatureHexAsRSV(signature);
    if (_lodash2.default.includes(validVParamValues, ecSignatureRSV.v)) {

      const isValidRSVSignature = signatureUtils.isValidSignature(orderHash, ecSignatureRSV, signerAddress);
      if (isValidRSVSignature) {
        return ethUtil.toRpcSig(ecSignatureRSV.v, ecSignatureRSV.r, ecSignatureRSV.s) + SignatureTypeStr.EthSign;
      }
    }

    throw new Error("InvalidSignature");
  });

  return function signOrderHashAsync(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
})();

const isValidSignature = exports.isValidSignature = ({ account, orderHash, signature }) => {

  // hack to support 0x v2 EthSign SignatureType format
  // recoverPersonalSignature assumes no SignatureType ending
  signature = signature.substr(0, 132); // eslint-disable-line no-param-reassign

  const recoveredAccount = _ethSigUtil2.default.recoverPersonalSignature({
    data: orderHash,
    sig: signature
  });
  return recoveredAccount === account;
};

const isValidSignatureAsync = exports.isValidSignatureAsync = (() => {
  var _ref2 = _asyncToGenerator(function* ({ web3, networkId }, { account, orderHash, signature }) {
    const bZxContract = yield CoreUtils.getContractInstance(web3, (0, _contracts.getContracts)(networkId).BZx.abi, Addresses.getAddresses(networkId).BZx);

    // hack to support 0x v2 EthSign SignatureType format
    // bZx requires SignatureType ending
    signature = signature.substr(0, 132) + SignatureTypeStr.EthSign; // eslint-disable-line no-param-reassign

    return bZxContract.methods.isValidSignature(account, orderHash, signature).call();
  });

  return function isValidSignatureAsync(_x5, _x6) {
    return _ref2.apply(this, arguments);
  };
})();

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("ethereumjs-util");

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseIntHex = exports.substr24 = exports.prepend0x = exports.getOrderParams = exports.makeGetOrderObjArray = exports.makeCheckProperObjCount = exports.remove0xPrefix = undefined;

var _constants = __webpack_require__(6);

const remove0xPrefix = exports.remove0xPrefix = data => data ? data.substr(2) : "";

const makeCheckProperObjCount = exports.makeCheckProperObjCount = numFields => data => {
  const objCount = data.length / _constants.SOLIDITY_TYPE_MAX_CHARS / numFields;
  if (objCount % 1 !== 0) throw new Error("Data length invalid, must be whole number of objects");
  return data;
};

const makeGetOrderObjArray = exports.makeGetOrderObjArray = numFields => data => data.match(new RegExp(`.{1,${numFields * _constants.SOLIDITY_TYPE_MAX_CHARS}}`, "g"));

const getOrderParams = exports.getOrderParams = data => data.match(new RegExp(`.{1,${_constants.SOLIDITY_TYPE_MAX_CHARS}}`, "g"));

const HEX_RADIX = 16;
const prepend0x = exports.prepend0x = arg => `0x${arg}`;
const substr24 = exports.substr24 = arg => arg.substr(24);
const parseIntHex = exports.parseIntHex = arg => parseInt(arg, HEX_RADIX);

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint-disable camelcase, no-underscore-dangle */
const jsonschema_1 = __webpack_require__(16);
const _ = __webpack_require__(11);

exports.ValidatorResult = jsonschema_1.ValidatorResult;

const basic_type_schemas_1 = __webpack_require__(17);
const ec_signature_schema_1 = __webpack_require__(18);
const order_schemas_1 = __webpack_require__(19);

exports.schemas = {
  numberSchema: basic_type_schemas_1.numberSchema,
  addressSchema: basic_type_schemas_1.addressSchema,
  ecSignatureSchema: ec_signature_schema_1.ecSignatureSchema,
  ecSignatureParameterSchema: ec_signature_schema_1.ecSignatureParameterSchema,
  loanOrderSchema: order_schemas_1.loanOrderSchema,
  signedLoanOrderSchema: order_schemas_1.signedLoanOrderSchema
};

const SchemaValidator = function () {
  // eslint-disable-next-line no-shadow
  function SchemaValidator() {
    this.validator = new jsonschema_1.Validator();
    // eslint-disable-next-line no-plusplus
    for (let _i = 0, _a = _.values(exports.schemas); _i < _a.length; _i++) {
      const schema = _a[_i];
      this.validator.addSchema(schema, schema.id);
    }
  }
  SchemaValidator.prototype.addSchema = function (schema) {
    this.validator.addSchema(schema, schema.id);
  };
  // In order to validate a complex JS object using jsonschema, we must replace any complex
  // sub-types (e.g BigNumber) with a simpler string representation. Since BigNumber and other
  // complex types implement the `toString` method, we can stringify the object and
  // then parse it. The resultant object can then be checked using jsonschema.
  SchemaValidator.prototype.validate = function (instance, schema) {
    const jsonSchemaCompatibleObject = JSON.parse(JSON.stringify(instance));
    return this.validator.validate(jsonSchemaCompatibleObject, schema);
  };
  SchemaValidator.prototype.isValid = function (instance, schema) {
    const isValid = this.validate(instance, schema).errors.length === 0;
    return isValid;
  };
  return SchemaValidator;
}();
exports.SchemaValidator = SchemaValidator;

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("bn.js");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("web3-utils");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = {"address":"","abi":[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]}

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _assert = __webpack_require__(4);

var _utils = __webpack_require__(5);

var _constants = __webpack_require__(6);

var constants = _interopRequireWildcard(_constants);

var _bZx_json_schemas = __webpack_require__(10);

var _utils2 = __webpack_require__(0);

var utils = _interopRequireWildcard(_utils2);

var _tokenRegistry = __webpack_require__(99);

var tokenRegistry = _interopRequireWildcard(_tokenRegistry);

var _EIP = __webpack_require__(14);

var _EIP2 = _interopRequireDefault(_EIP);

var _allowance = __webpack_require__(100);

var allowance = _interopRequireWildcard(_allowance);

var _oracles = __webpack_require__(101);

var oracles = _interopRequireWildcard(_oracles);

var _fill = __webpack_require__(102);

var fill = _interopRequireWildcard(_fill);

var _addresses = __webpack_require__(2);

var Addresses = _interopRequireWildcard(_addresses);

var _orderHistory = __webpack_require__(105);

var orderHistory = _interopRequireWildcard(_orderHistory);

var _transfer = __webpack_require__(109);

var transfer = _interopRequireWildcard(_transfer);

var _signature = __webpack_require__(7);

var signature = _interopRequireWildcard(_signature);

var _errors = __webpack_require__(110);

var Errors = _interopRequireWildcard(_errors);

var _trade = __webpack_require__(111);

var trade = _interopRequireWildcard(_trade);

var _loanHealth = __webpack_require__(115);

var loanHealth = _interopRequireWildcard(_loanHealth);

var _bounty = __webpack_require__(116);

var bounty = _interopRequireWildcard(_bounty);

var _weth = __webpack_require__(118);

var weth = _interopRequireWildcard(_weth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Web3 = __webpack_require__(119); // eslint-disable global-require

class BZxJS {

  /* On Metamask, provider.host is undefined
  Force users to provide host url */
  constructor(provider, { networkId, addresses = Addresses.getAddresses(networkId) } = {}) {
    var _this = this;

    this.getLoanOrderHashAsync = (() => {
      var _ref = _asyncToGenerator(function* (props) {
        return utils.getLoanOrderHashAsync(_this, props);
      });

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    })();

    this.isValidSignatureAsync = (() => {
      var _ref2 = _asyncToGenerator(function* (props) {
        return signature.isValidSignatureAsync(_this, props);
      });

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    })();

    this.signOrderHashAsync = (() => {
      var _ref3 = _asyncToGenerator(function* (...props) {
        return signature.signOrderHashAsync(_this, ...props);
      });

      return function () {
        return _ref3.apply(this, arguments);
      };
    })();

    this.setAllowance = (...props) => allowance.setAllowance(this, ...props);

    this.setAllowanceUnlimited = props => this.setAllowance(_extends({}, props, {
      amountInBaseUnits: constants.UNLIMITED_ALLOWANCE_IN_BASE_UNITS
    }));

    this.resetAllowance = props => this.setAllowance(_extends({}, props, {
      amountInBaseUnits: new _utils.BigNumber(0)
    }));

    this.getAllowance = (() => {
      var _ref4 = _asyncToGenerator(function* (...props) {
        return allowance.getAllowance(_this, ...props);
      });

      return function () {
        return _ref4.apply(this, arguments);
      };
    })();

    this.getBalance = (() => {
      var _ref5 = _asyncToGenerator(function* ({ tokenAddress, ownerAddress }) {
        _assert.assert.isETHAddressHex("ownerAddress", ownerAddress);
        _assert.assert.isETHAddressHex("tokenAddress", tokenAddress);

        const tokenContract = yield utils.getContractInstance(_this.web3, _EIP2.default.abi, tokenAddress);
        const balance = yield tokenContract.methods.balanceOf(ownerAddress).call();
        return new _utils.BigNumber(balance);
      });

      return function (_x3) {
        return _ref5.apply(this, arguments);
      };
    })();

    this.getTokenList = _asyncToGenerator(function* () {
      return tokenRegistry.getTokenList(_this);
    });
    this.getOracleList = _asyncToGenerator(function* () {
      return oracles.getOracleList(_this);
    });

    this.isTradeSupported = (() => {
      var _ref8 = _asyncToGenerator(function* (...props) {
        return oracles.isTradeSupported(_this, ...props);
      });

      return function () {
        return _ref8.apply(this, arguments);
      };
    })();

    this.getConversionData = (() => {
      var _ref9 = _asyncToGenerator(function* (...props) {
        return oracles.getConversionData(_this, ...props);
      });

      return function () {
        return _ref9.apply(this, arguments);
      };
    })();

    this.takeLoanOrderAsLender = (...props) => fill.takeLoanOrderAsLender(this, ...props);

    this.takeLoanOrderAsTrader = (...props) => fill.takeLoanOrderAsTrader(this, ...props);

    this.pushLoanOrderOnChain = (...props) => fill.pushLoanOrderOnChain(this, ...props);

    this.takeLoanOrderOnChainAsTrader = (...props) => fill.takeLoanOrderOnChainAsTrader(this, ...props);

    this.takeLoanOrderOnChainAsLender = (...props) => fill.takeLoanOrderOnChainAsLender(this, ...props);

    this.cancelLoanOrder = (...props) => fill.cancelLoanOrder(this, ...props);

    this.cancelLoanOrderWithHash = (...props) => fill.cancelLoanOrderWithHash(this, ...props);

    this.getInitialCollateralRequired = (() => {
      var _ref10 = _asyncToGenerator(function* (...props) {
        return fill.getInitialCollateralRequired(_this, ...props);
      });

      return function () {
        return _ref10.apply(this, arguments);
      };
    })();

    this.getSingleOrder = (() => {
      var _ref11 = _asyncToGenerator(function* (...props) {
        return orderHistory.getSingleOrder(_this, ...props);
      });

      return function () {
        return _ref11.apply(this, arguments);
      };
    })();

    this.getOrdersFillable = (() => {
      var _ref12 = _asyncToGenerator(function* (...props) {
        return orderHistory.getOrdersFillable(_this, ...props);
      });

      return function () {
        return _ref12.apply(this, arguments);
      };
    })();

    this.getOrdersForUser = (() => {
      var _ref13 = _asyncToGenerator(function* (...props) {
        return orderHistory.getOrdersForUser(_this, ...props);
      });

      return function () {
        return _ref13.apply(this, arguments);
      };
    })();

    this.getSingleLoan = (() => {
      var _ref14 = _asyncToGenerator(function* (...props) {
        return orderHistory.getSingleLoan(_this, ...props);
      });

      return function () {
        return _ref14.apply(this, arguments);
      };
    })();

    this.getLoansForLender = (() => {
      var _ref15 = _asyncToGenerator(function* (...props) {
        return orderHistory.getLoansForLender(_this, ...props);
      });

      return function () {
        return _ref15.apply(this, arguments);
      };
    })();

    this.getLoansForTrader = (() => {
      var _ref16 = _asyncToGenerator(function* (...props) {
        return orderHistory.getLoansForTrader(_this, ...props);
      });

      return function () {
        return _ref16.apply(this, arguments);
      };
    })();

    this.transferToken = (...props) => transfer.transferToken(this, ...props);

    this.tradePositionWith0x = (...props) => trade.tradePositionWith0x(this, ...props);

    this.tradePositionWithOracle = (...props) => trade.tradePositionWithOracle(this, ...props);

    this.changeCollateral = (...props) => loanHealth.changeCollateral(this, ...props);

    this.depositCollateral = (...props) => loanHealth.depositCollateral(this, ...props);

    this.withdrawExcessCollateral = (...props) => loanHealth.withdrawExcessCollateral(this, ...props);

    this.getProfitOrLoss = (...props) => loanHealth.getProfitOrLoss(this, ...props);

    this.withdrawProfit = (...props) => loanHealth.withdrawProfit(this, ...props);

    this.closeLoan = (...props) => loanHealth.closeLoan(this, ...props);

    this.payInterest = (...props) => loanHealth.payInterest(this, ...props);

    this.getInterest = (...props) => loanHealth.getInterest(this, ...props);

    this.requestFaucetToken = (...props) => utils.requestFaucetToken(this, ...props);

    this.getActiveLoans = (...props) => bounty.getActiveLoans(this, ...props);

    this.getMarginLevels = (...props) => bounty.getMarginLevels(this, ...props);

    this.liquidateLoan = (...props) => bounty.liquidateLoan(this, ...props);

    this.wrapEth = (...props) => weth.wrapEth(this, ...props);

    this.unwrapEth = (...props) => weth.unwrapEth(this, ...props);

    if (!networkId) throw new Error(Errors.NoNetworkId);

    _assert.assert.isWeb3Provider("provider", provider);
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
    utils.doesConformToSchema("loanOrder", order, _bZx_json_schemas.schemas.loanOrderSchema);
    const orderHashHex = utils.getLoanOrderHashHex(order);
    return orderHashHex;
  }
}
exports.default = BZxJS;
BZxJS.generatePseudoRandomSalt = utils.generatePseudoRandomSalt;
BZxJS.noop = utils.noop;
BZxJS.toChecksumAddress = utils.toChecksumAddress;

BZxJS.isValidSignature = props => signature.isValidSignature(props);

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("jsonschema");

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("@0xproject/json-schemas/lib/schemas/basic_type_schemas.js");

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = require("@0xproject/json-schemas/lib/schemas/ec_signature_schema.js");

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.loanOrderSchema = {
  id: "/loanOrder",
  properties: {
    bZxAddress: { $ref: "/Address" },
    makerAddress: { $ref: "/Address" },
    loanTokenAddress: { $ref: "/Address" },
    interestTokenAddress: { $ref: "/Address" },
    collateralTokenAddress: { $ref: "/Address" },
    feeRecipientAddress: { $ref: "/Address" },
    oracleAddress: { $ref: "/Address" },
    loanTokenAmount: { $ref: "/Number" },
    interestAmount: { $ref: "/Number" },
    initialMarginAmount: { $ref: "/Number" },
    maintenanceMarginAmount: { $ref: "/Number" },
    lenderRelayFee: { $ref: "/Number" },
    traderRelayFee: { $ref: "/Number" },
    maxDurationUnixTimestampSec: { $ref: "/Number" },
    expirationUnixTimestampSec: { $ref: "/Number" },
    makerRole: { $ref: "/Number" },
    salt: { $ref: "/Number" }
  },
  required: ["bZxAddress", "makerAddress", "loanTokenAddress", "interestTokenAddress", "collateralTokenAddress", "feeRecipientAddress", "oracleAddress", "loanTokenAmount", "interestAmount", "initialMarginAmount", "maintenanceMarginAmount", "lenderRelayFee", "traderRelayFee", "maxDurationUnixTimestampSec", "expirationUnixTimestampSec", "makerRole", "salt"],
  type: "object"
};
exports.signedLoanOrderSchema = {
  id: "/signedLoanOrder",
  allOf: [{ $ref: "/loanOrder" }, {
    properties: {
      ecSignature: { $ref: "/ECSignature" }
    },
    required: ["ecSignature"]
  }]
};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BZx = __webpack_require__(21);

var _BZx2 = _interopRequireDefault(_BZx);

var _BZxOracle = __webpack_require__(22);

var _BZxOracle2 = _interopRequireDefault(_BZxOracle);

var _BZxTo0x = __webpack_require__(23);

var _BZxTo0x2 = _interopRequireDefault(_BZxTo0x);

var _BZRxToken = __webpack_require__(24);

var _BZRxToken2 = _interopRequireDefault(_BZRxToken);

var _BZxVault = __webpack_require__(25);

var _BZxVault2 = _interopRequireDefault(_BZxVault);

var _EIP = __webpack_require__(26);

var _EIP2 = _interopRequireDefault(_EIP);

var _OracleRegistry = __webpack_require__(27);

var _OracleRegistry2 = _interopRequireDefault(_OracleRegistry);

var _TestToken = __webpack_require__(28);

var _TestToken2 = _interopRequireDefault(_TestToken);

var _TestToken3 = __webpack_require__(29);

var _TestToken4 = _interopRequireDefault(_TestToken3);

var _TestToken5 = __webpack_require__(30);

var _TestToken6 = _interopRequireDefault(_TestToken5);

var _TestToken7 = __webpack_require__(31);

var _TestToken8 = _interopRequireDefault(_TestToken7);

var _TestToken9 = __webpack_require__(32);

var _TestToken10 = _interopRequireDefault(_TestToken9);

var _TestToken11 = __webpack_require__(33);

var _TestToken12 = _interopRequireDefault(_TestToken11);

var _TestToken13 = __webpack_require__(34);

var _TestToken14 = _interopRequireDefault(_TestToken13);

var _TestToken15 = __webpack_require__(35);

var _TestToken16 = _interopRequireDefault(_TestToken15);

var _TestToken17 = __webpack_require__(36);

var _TestToken18 = _interopRequireDefault(_TestToken17);

var _TestToken19 = __webpack_require__(37);

var _TestToken20 = _interopRequireDefault(_TestToken19);

var _TokenRegistry = __webpack_require__(38);

var _TokenRegistry2 = _interopRequireDefault(_TokenRegistry);

var _OracleInterface = __webpack_require__(39);

var _OracleInterface2 = _interopRequireDefault(_OracleInterface);

var _TestNetFaucet = __webpack_require__(40);

var _TestNetFaucet2 = _interopRequireDefault(_TestNetFaucet);

var _ZRXToken = __webpack_require__(41);

var _ZRXToken2 = _interopRequireDefault(_ZRXToken);

var _WETH = __webpack_require__(42);

var _WETH2 = _interopRequireDefault(_WETH);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  BZx: _BZx2.default,
  BZxOracle: _BZxOracle2.default,
  BZxTo0x: _BZxTo0x2.default,
  BZxToken: _BZRxToken2.default,
  BZxVault: _BZxVault2.default,
  EIP20: _EIP2.default,
  OracleRegistry: _OracleRegistry2.default,
  TestToken0: _TestToken2.default,
  TestToken1: _TestToken4.default,
  TestToken2: _TestToken6.default,
  TestToken3: _TestToken8.default,
  TestToken4: _TestToken10.default,
  TestToken5: _TestToken12.default,
  TestToken6: _TestToken14.default,
  TestToken7: _TestToken16.default,
  TestToken8: _TestToken18.default,
  TestToken9: _TestToken20.default,
  TokenRegistry: _TokenRegistry2.default,
  ZRXToken: _ZRXToken2.default,
  WETH: _WETH2.default,
  OracleInterface: _OracleInterface2.default,
  TestNetFaucet: _TestNetFaucet2.default
};

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = {"name":"BZx","address":"0x33a89cA59bc3A9221456ffE461de17C8deF24684","abi":[{"constant":true,"inputs":[],"name":"DEBUG_MODE","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"loanOrderHash","type":"bytes32"},{"indexed":false,"name":"adder","type":"address"},{"indexed":false,"name":"maker","type":"address"},{"indexed":false,"name":"feeRecipientAddress","type":"address"},{"indexed":false,"name":"lenderRelayFee","type":"uint256"},{"indexed":false,"name":"traderRelayFee","type":"uint256"},{"indexed":false,"name":"maxDuration","type":"uint256"},{"indexed":false,"name":"makerRole","type":"uint256"}],"name":"LogLoanAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"maker","type":"address"},{"indexed":false,"name":"cancelLoanTokenAmount","type":"uint256"},{"indexed":false,"name":"remainingLoanTokenAmount","type":"uint256"},{"indexed":false,"name":"loanOrderHash","type":"bytes32"}],"name":"LogLoanCancelled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"lender","type":"address"},{"indexed":false,"name":"trader","type":"address"},{"indexed":false,"name":"isLiquidation","type":"bool"},{"indexed":false,"name":"loanOrderHash","type":"bytes32"}],"name":"LogLoanClosed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"lender","type":"address"},{"indexed":false,"name":"trader","type":"address"},{"indexed":false,"name":"collateralTokenAddressFilled","type":"address"},{"indexed":false,"name":"positionTokenAddressFilled","type":"address"},{"indexed":false,"name":"loanTokenAmountFilled","type":"uint256"},{"indexed":false,"name":"collateralTokenAmountFilled","type":"uint256"},{"indexed":false,"name":"positionTokenAmountFilled","type":"uint256"},{"indexed":false,"name":"loanStartUnixTimestampSec","type":"uint256"},{"indexed":false,"name":"active","type":"bool"},{"indexed":false,"name":"loanOrderHash","type":"bytes32"}],"name":"LogLoanTaken","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"loanOrderHash","type":"bytes32"},{"indexed":false,"name":"trader","type":"address"},{"indexed":false,"name":"initialMarginAmount","type":"uint256"},{"indexed":false,"name":"maintenanceMarginAmount","type":"uint256"},{"indexed":false,"name":"currentMarginAmount","type":"uint256"}],"name":"LogMarginLevels","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"loanOrderHash","type":"bytes32"},{"indexed":false,"name":"lender","type":"address"},{"indexed":false,"name":"trader","type":"address"},{"indexed":false,"name":"amountPaid","type":"uint256"},{"indexed":false,"name":"totalAccrued","type":"uint256"}],"name":"LogPayInterest","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"loanOrderHash","type":"bytes32"},{"indexed":false,"name":"trader","type":"address"},{"indexed":false,"name":"sourceTokenAddress","type":"address"},{"indexed":false,"name":"destTokenAddress","type":"address"},{"indexed":false,"name":"sourceTokenAmount","type":"uint256"},{"indexed":false,"name":"destTokenAmount","type":"uint256"}],"name":"LogPositionTraded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"loanOrderHash","type":"bytes32"},{"indexed":false,"name":"trader","type":"address"},{"indexed":false,"name":"profitWithdrawn","type":"uint256"},{"indexed":false,"name":"remainingPosition","type":"uint256"}],"name":"LogWithdrawProfit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":true,"inputs":[],"name":"bZRxTokenContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bZxTo0xContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bZxTo0xV2Contract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"cancelLoanTokenAmount","type":"uint256"}],"name":"cancelLoanOrder","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"orderAddresses","type":"address[6]"},{"name":"orderValues","type":"uint256[10]"},{"name":"cancelLoanTokenAmount","type":"uint256"}],"name":"cancelLoanOrder","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"collateralTokenFilled","type":"address"}],"name":"changeCollateral","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"}],"name":"closeLoan","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"collateralTokenFilled","type":"address"},{"name":"depositAmount","type":"uint256"}],"name":"depositCollateral","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"forceCloanLoan","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"start","type":"uint256"},{"name":"count","type":"uint256"}],"name":"getActiveLoans","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanTokenAddress","type":"address"},{"name":"collateralTokenAddress","type":"address"},{"name":"oracleAddress","type":"address"},{"name":"loanTokenAmountFilled","type":"uint256"},{"name":"initialMarginAmount","type":"uint256"}],"name":"getInitialCollateralRequired","outputs":[{"name":"collateralTokenAmount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"getInterest","outputs":[{"name":"lender","type":"address"},{"name":"interestTokenAddress","type":"address"},{"name":"interestTotalAccrued","type":"uint256"},{"name":"interestPaidSoFar","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"orderAddresses","type":"address[6]"},{"name":"orderValues","type":"uint256[10]"}],"name":"getLoanOrderHash","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanParty","type":"address"},{"name":"count","type":"uint256"},{"name":"activeOnly","type":"bool"}],"name":"getLoansForLender","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanParty","type":"address"},{"name":"count","type":"uint256"},{"name":"activeOnly","type":"bool"}],"name":"getLoansForTrader","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"getMarginLevels","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"start","type":"uint256"},{"name":"count","type":"uint256"}],"name":"getOrdersFillable","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanParty","type":"address"},{"name":"start","type":"uint256"},{"name":"count","type":"uint256"}],"name":"getOrdersForUser","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"getProfitOrLoss","outputs":[{"name":"isProfit","type":"bool"},{"name":"profitOrLoss","type":"uint256"},{"name":"positionTokenAddress","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"getSingleLoan","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"}],"name":"getSingleOrder","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"}],"name":"getUnavailableLoanTokenAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"}],"name":"interestPaid","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"signer","type":"address"},{"name":"hash","type":"bytes32"},{"name":"signature","type":"bytes"}],"name":"isValidSignature","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"liquidatePosition","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"loanList","outputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"}],"name":"loanPositions","outputs":[{"name":"lender","type":"address"},{"name":"trader","type":"address"},{"name":"collateralTokenAddressFilled","type":"address"},{"name":"positionTokenAddressFilled","type":"address"},{"name":"loanTokenAmountFilled","type":"uint256"},{"name":"collateralTokenAmountFilled","type":"uint256"},{"name":"positionTokenAmountFilled","type":"uint256"},{"name":"loanStartUnixTimestampSec","type":"uint256"},{"name":"loanEndUnixTimestampSec","type":"uint256"},{"name":"index","type":"uint256"},{"name":"active","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"oracleAddresses","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"oracleRegistryContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"orderAux","outputs":[{"name":"maker","type":"address"},{"name":"feeRecipientAddress","type":"address"},{"name":"lenderRelayFee","type":"uint256"},{"name":"traderRelayFee","type":"uint256"},{"name":"makerRole","type":"uint256"},{"name":"expirationUnixTimestampSec","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"orderCancelledAmounts","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"orderFilledAmounts","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"orderIndexes","outputs":[{"name":"index","type":"uint256"},{"name":"active","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"orderLender","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"orderList","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"uint256"}],"name":"orderTraders","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"orders","outputs":[{"name":"loanTokenAddress","type":"address"},{"name":"interestTokenAddress","type":"address"},{"name":"collateralTokenAddress","type":"address"},{"name":"oracleAddress","type":"address"},{"name":"loanTokenAmount","type":"uint256"},{"name":"interestAmount","type":"uint256"},{"name":"initialMarginAmount","type":"uint256"},{"name":"maintenanceMarginAmount","type":"uint256"},{"name":"maxDurationUnixTimestampSec","type":"uint256"},{"name":"loanOrderHash","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"payInterest","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"orderAddresses","type":"address[6]"},{"name":"orderValues","type":"uint256[10]"},{"name":"signature","type":"bytes"}],"name":"pushLoanOrderOnChain","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"shouldLiquidate","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"orderAddresses","type":"address[6]"},{"name":"orderValues","type":"uint256[10]"},{"name":"signature","type":"bytes"}],"name":"takeLoanOrderAsLender","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"orderAddresses","type":"address[6]"},{"name":"orderValues","type":"uint256[10]"},{"name":"collateralTokenFilled","type":"address"},{"name":"loanTokenAmountFilled","type":"uint256"},{"name":"signature","type":"bytes"}],"name":"takeLoanOrderAsTrader","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"}],"name":"takeLoanOrderOnChainAsLender","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"collateralTokenFilled","type":"address"},{"name":"loanTokenAmountFilled","type":"uint256"}],"name":"takeLoanOrderOnChainAsTrader","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"orderData0x","type":"bytes"},{"name":"signature0x","type":"bytes"}],"name":"tradePositionWith0x","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"components":[{"name":"makerAddress","type":"address"},{"name":"takerAddress","type":"address"},{"name":"feeRecipientAddress","type":"address"},{"name":"senderAddress","type":"address"},{"name":"makerAssetAmount","type":"uint256"},{"name":"takerAssetAmount","type":"uint256"},{"name":"makerFee","type":"uint256"},{"name":"takerFee","type":"uint256"},{"name":"expirationTimeSeconds","type":"uint256"},{"name":"salt","type":"uint256"},{"name":"makerAssetData","type":"bytes"},{"name":"takerAssetData","type":"bytes"}],"name":"orders0x","type":"tuple[]"},{"name":"signatures0x","type":"bytes[]"}],"name":"tradePositionWith0xV2","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"tradeTokenAddress","type":"address"}],"name":"tradePositionWithOracle","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"vaultContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"collateralTokenFilled","type":"address"},{"name":"withdrawAmount","type":"uint256"}],"name":"withdrawExcessCollateral","outputs":[{"name":"excessCollateral","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"}],"name":"withdrawProfit","outputs":[{"name":"profitAmount","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = {"name":"BZxOracle","address":"0x099fdC656aF972B606b6D849f5CE4a70A6b4D012","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"previousBZxContract","type":"address"},{"indexed":true,"name":"newBZxContract","type":"address"}],"name":"BZxOwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"payer","type":"address"},{"indexed":false,"name":"gasUsed","type":"uint256"},{"indexed":false,"name":"currentGasPrice","type":"uint256"},{"indexed":false,"name":"refundAmount","type":"uint256"},{"indexed":false,"name":"refundSuccess","type":"bool"}],"name":"GasRefund","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":true,"inputs":[],"name":"bZRxTokenContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bZxContractAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bountyRewardPercent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"didChangeCollateral","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"","type":"bytes32"},{"name":"loanCloser","type":"address"},{"name":"isLiquidation","type":"bool"},{"name":"gasUsed","type":"uint256"}],"name":"didCloseLoan","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"didDepositCollateral","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"},{"name":"lender","type":"address"},{"name":"interestTokenAddress","type":"address"},{"name":"amountOwed","type":"uint256"},{"name":"convert","type":"bool"},{"name":"","type":"uint256"}],"name":"didPayInterest","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"","type":"bytes32"},{"name":"orderAddresses","type":"address[4]"},{"name":"orderAmounts","type":"uint256[4]"}],"name":"didTakeOrder","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"name":"didTradePosition","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"didWithdrawCollateral","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"name":"didWithdrawProfit","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"sourceTokenAddress","type":"address"},{"name":"destTokenAddress","type":"address"},{"name":"sourceTokenAmount","type":"uint256"}],"name":"doManualTrade","outputs":[{"name":"destTokenAmount","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"sourceTokenAddress","type":"address"},{"name":"destTokenAddress","type":"address"},{"name":"sourceTokenAmount","type":"uint256"}],"name":"doTrade","outputs":[{"name":"destTokenAmount","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"emaPeriods","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"emaValue","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"faucetContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"gasUpperBound","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanTokenAddress","type":"address"},{"name":"positionTokenAddress","type":"address"},{"name":"collateralTokenAddress","type":"address"},{"name":"loanTokenAmount","type":"uint256"},{"name":"positionTokenAmount","type":"uint256"},{"name":"collateralTokenAmount","type":"uint256"}],"name":"getCurrentMarginAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"positionTokenAddress","type":"address"},{"name":"loanTokenAddress","type":"address"},{"name":"positionTokenAmount","type":"uint256"},{"name":"loanTokenAmount","type":"uint256"}],"name":"getProfitOrLoss","outputs":[{"name":"isProfit","type":"bool"},{"name":"profitOrLoss","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"sourceTokenAddress","type":"address"},{"name":"destTokenAddress","type":"address"},{"name":"sourceTokenAmount","type":"uint256"}],"name":"getTradeData","outputs":[{"name":"sourceToDestRate","type":"uint256"},{"name":"destTokenAmount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"interestFeePercent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isManualTradingAllowed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"sourceTokenAddress","type":"address"},{"name":"destTokenAddress","type":"address"},{"name":"sourceTokenAmount","type":"uint256"}],"name":"isTradeSupported","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"kyberContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"minInitialMarginAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"minMaintenanceMarginAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"minimumCollateralInEthAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"outlierAdder","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"outlierMultiplier","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"collateralTokenAddress","type":"address"},{"name":"loanTokenAddress","type":"address"},{"name":"collateralTokenAmountUsable","type":"uint256"},{"name":"loanTokenAmountNeeded","type":"uint256"},{"name":"initialMarginAmount","type":"uint256"},{"name":"maintenanceMarginAmount","type":"uint256"},{"name":"isLiquidation","type":"bool"}],"name":"processCollateral","outputs":[{"name":"loanTokenAmountCovered","type":"uint256"},{"name":"collateralTokenAmountUsed","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newAddress","type":"address"}],"name":"setBZRxTokenContractAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newValue","type":"uint256"}],"name":"setBountyRewardPercent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"}],"name":"setDecimals","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newEMAPeriods","type":"uint256"}],"name":"setEMAPeriods","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newEMAValue","type":"uint256"}],"name":"setEMAValue","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_vaultContract","type":"address"},{"name":"_kyberContract","type":"address"},{"name":"_wethContract","type":"address"},{"name":"_bZRxTokenContract","type":"address"}],"payable":true,"stateMutability":"payable","type":"constructor"},{"constant":false,"inputs":[{"name":"newAddress","type":"address"}],"name":"setFaucetContractAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"constant":false,"inputs":[{"name":"newValue","type":"uint256"}],"name":"setGasUpperBound","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newRate","type":"uint256"}],"name":"setInterestFeePercent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newAddress","type":"address"}],"name":"setKyberContractAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_isManualTradingAllowed","type":"bool"}],"name":"setManualTradingAllowed","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newInitialMargin","type":"uint256"},{"name":"newMaintenanceMargin","type":"uint256"}],"name":"setMarginThresholds","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newValue","type":"uint256"}],"name":"setMinimumCollateralInEthAmount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newAddress","type":"address"}],"name":"setVaultContractAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newAddress","type":"address"}],"name":"setWethContractAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"},{"name":"loanTokenAddress","type":"address"},{"name":"positionTokenAddress","type":"address"},{"name":"collateralTokenAddress","type":"address"},{"name":"loanTokenAmount","type":"uint256"},{"name":"positionTokenAmount","type":"uint256"},{"name":"collateralTokenAmount","type":"uint256"},{"name":"maintenanceMarginAmount","type":"uint256"}],"name":"shouldLiquidate","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"throwOnGasRefundFail","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newBZxContractAddress","type":"address"}],"name":"transferBZxOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferEther","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"tokenAddress","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"vaultContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"loanTokenAddress","type":"address"},{"name":"positionTokenAddress","type":"address"},{"name":"collateralTokenAddress","type":"address"},{"name":"loanTokenAmount","type":"uint256"},{"name":"positionTokenAmount","type":"uint256"},{"name":"collateralTokenAmount","type":"uint256"},{"name":"maintenanceMarginAmount","type":"uint256"}],"name":"verifyAndLiquidate","outputs":[{"name":"destTokenAmount","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"wethContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}]}

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = {"name":"BZxTo0x","address":"0xf26861e5Ad499e04744Cca24fE0e280aBDF2DeBC","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"previousBZxContract","type":"address"},{"indexed":true,"name":"newBZxContract","type":"address"}],"name":"BZxOwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"approveFor","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"payable":false,"stateMutability":"nonpayable","type":"fallback"},{"inputs":[{"name":"_exchange","type":"address"},{"name":"_zrxToken","type":"address"},{"name":"_proxy","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"constant":true,"inputs":[],"name":"bZxContractAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"exchangeContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"orderData0x","type":"bytes"}],"name":"getOrderValuesFromData","outputs":[{"name":"orderAddresses","type":"address[5][]"},{"name":"orderValues","type":"uint256[6][]"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"numerator","type":"uint256"},{"name":"denominator","type":"uint256"},{"name":"target","type":"uint256"}],"name":"getPartialAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"signatures","type":"bytes"}],"name":"getSignatureParts","outputs":[{"name":"vs","type":"uint8[]"},{"name":"rs","type":"bytes32[]"},{"name":"ss","type":"bytes32[]"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_exchange","type":"address"}],"name":"set0xExchange","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_proxy","type":"address"}],"name":"set0xTokenProxy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_zrxToken","type":"address"}],"name":"setZRXToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"trader","type":"address"},{"name":"vaultAddress","type":"address"},{"name":"sourceTokenAmountToUse","type":"uint256"},{"name":"orderData0x","type":"bytes"},{"name":"signature0x","type":"bytes"}],"name":"take0xTrade","outputs":[{"name":"destTokenAddress","type":"address"},{"name":"destTokenAmount","type":"uint256"},{"name":"sourceTokenUsedAmount","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"tokenTransferProxyContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newBZxContractAddress","type":"address"}],"name":"transferBZxOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"zrxTokenContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}]}

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = {"name":"BZRxToken","address":"0x0C5173a51e26b29d6126C686756FB9FBEf71f762","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"burner","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newName","type":"string"},{"name":"_newSymbol","type":"string"}],"name":"renameToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = {"name":"BZxVault","address":"0x2d1420F4ceE004C348d58E7B28869AF8C5372323","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"previousBZxContract","type":"address"},{"indexed":true,"name":"newBZxContract","type":"address"}],"name":"BZxOwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":true,"inputs":[],"name":"bZxContractAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"from","type":"address"},{"name":"tokenAmount","type":"uint256"}],"name":"depositToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"constant":false,"inputs":[{"name":"newBZxContractAddress","type":"address"}],"name":"transferBZxOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"tokenAmount","type":"uint256"}],"name":"transferTokenFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"withdrawEther","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"to","type":"address"},{"name":"tokenAmount","type":"uint256"}],"name":"withdrawToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = {"name":"EIP20","address":"","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_who","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = {"name":"OracleRegistry","address":"0xCD899EE2edcF279b27ABD73E843a90D789a4eb92","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"oracle","type":"address"},{"indexed":false,"name":"name","type":"string"}],"name":"LogAddOracle","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"oracle","type":"address"},{"indexed":false,"name":"oldName","type":"string"},{"indexed":false,"name":"newName","type":"string"}],"name":"LogOracleNameChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"oracle","type":"address"},{"indexed":false,"name":"name","type":"string"}],"name":"LogRemoveOracle","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":false,"inputs":[{"name":"_oracle","type":"address"},{"name":"_name","type":"string"}],"name":"addOracle","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"string"}],"name":"getOracleAddressByName","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOracleAddresses","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"string"}],"name":"getOracleByName","outputs":[{"name":"","type":"address"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOracleList","outputs":[{"name":"","type":"address[]"},{"name":"","type":"uint256[]"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_oracle","type":"address"}],"name":"getOracleMetaData","outputs":[{"name":"","type":"address"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_oracle","type":"address"}],"name":"hasOracle","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"oracleAddresses","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"oracles","outputs":[{"name":"oracle","type":"address"},{"name":"name","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_oracle","type":"address"},{"name":"_index","type":"uint256"}],"name":"removeOracle","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_oracle","type":"address"},{"name":"_name","type":"string"}],"name":"setOracleName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = {"name":"TestToken0","address":"0xa00F2d7540697a1f8429584327C1f4ecBD8662EF","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"burner","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = {"name":"TestToken1","address":"0x9EF3dACB3367d7741099b5607A7a93E99a119F7b","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"burner","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = {"name":"TestToken2","address":"0x0F3723fB2a7C147357868702164f9beEf54E1E85","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"burner","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = {"name":"TestToken3","address":"0x2d5A85fDAfA9ed605B9391Ba9C14825fa1a97262","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"burner","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 32 */
/***/ (function(module, exports) {

module.exports = {"name":"TestToken4","address":"0xfdcD48dbCBB7A5410Cf60ef5a73C687EE970c9CF","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"burner","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = {"name":"TestToken5","address":"0x4e34f5E442f77222aE937193127e5F241d56402a","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"burner","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 34 */
/***/ (function(module, exports) {

module.exports = {"name":"TestToken6","address":"0x3c920231d53A878403007eE8cBD4486725d2Fc83","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"burner","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = {"name":"TestToken7","address":"0x176097114008844bCb75Ea58998B7f8303b4C2d4","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"burner","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports = {"name":"TestToken8","address":"0x123d0530A2a37FA4d4efA3999e79203BAf5bE517","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"burner","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = {"name":"TestToken9","address":"0x6Cb6c3A662d2883F2F58a3a7bf4a4ebed204c007","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"burner","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = {"name":"TokenRegistry","address":"0x014BF60D286e575D457E948a1A2d644E5D0173A0","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"token","type":"address"},{"indexed":false,"name":"name","type":"string"},{"indexed":false,"name":"symbol","type":"string"},{"indexed":false,"name":"decimals","type":"uint8"},{"indexed":false,"name":"url","type":"string"}],"name":"LogAddToken","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"token","type":"address"},{"indexed":false,"name":"name","type":"string"},{"indexed":false,"name":"symbol","type":"string"},{"indexed":false,"name":"decimals","type":"uint8"},{"indexed":false,"name":"url","type":"string"}],"name":"LogRemoveToken","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"token","type":"address"},{"indexed":false,"name":"oldName","type":"string"},{"indexed":false,"name":"newName","type":"string"}],"name":"LogTokenNameChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"token","type":"address"},{"indexed":false,"name":"oldSymbol","type":"string"},{"indexed":false,"name":"newSymbol","type":"string"}],"name":"LogTokenSymbolChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"token","type":"address"},{"indexed":false,"name":"oldURL","type":"string"},{"indexed":false,"name":"newURL","type":"string"}],"name":"LogTokenURLChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_name","type":"string"},{"name":"_symbol","type":"string"},{"name":"_decimals","type":"uint8"},{"name":"_url","type":"string"}],"name":"addToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"string"}],"name":"getTokenAddressByName","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_symbol","type":"string"}],"name":"getTokenAddressBySymbol","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTokenAddresses","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"string"}],"name":"getTokenByName","outputs":[{"name":"","type":"address"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"uint8"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_symbol","type":"string"}],"name":"getTokenBySymbol","outputs":[{"name":"","type":"address"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"uint8"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_token","type":"address"}],"name":"getTokenMetaData","outputs":[{"name":"","type":"address"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"uint8"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_index","type":"uint256"}],"name":"removeToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_name","type":"string"}],"name":"setTokenName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_symbol","type":"string"}],"name":"setTokenSymbol","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_url","type":"string"}],"name":"setTokenURL","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"tokenAddresses","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"tokens","outputs":[{"name":"token","type":"address"},{"name":"name","type":"string"},{"name":"symbol","type":"string"},{"name":"decimals","type":"uint8"},{"name":"url","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = {"name":"OracleInterface","address":"","abi":[{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"borrower","type":"address"},{"name":"gasUsed","type":"uint256"}],"name":"didChangeCollateral","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"loanCloser","type":"address"},{"name":"isLiquidation","type":"bool"},{"name":"gasUsed","type":"uint256"}],"name":"didCloseLoan","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"borrower","type":"address"},{"name":"gasUsed","type":"uint256"}],"name":"didDepositCollateral","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"},{"name":"lender","type":"address"},{"name":"interestTokenAddress","type":"address"},{"name":"amountOwed","type":"uint256"},{"name":"convert","type":"bool"},{"name":"gasUsed","type":"uint256"}],"name":"didPayInterest","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"orderAddresses","type":"address[4]"},{"name":"orderAmounts","type":"uint256[4]"}],"name":"didTakeOrder","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"},{"name":"tradeTokenAddress","type":"address"},{"name":"tradeTokenAmount","type":"uint256"},{"name":"gasUsed","type":"uint256"}],"name":"didTradePosition","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"borrower","type":"address"},{"name":"gasUsed","type":"uint256"}],"name":"didWithdrawCollateral","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"borrower","type":"address"},{"name":"profitOrLoss","type":"uint256"},{"name":"gasUsed","type":"uint256"}],"name":"didWithdrawProfit","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"sourceTokenAddress","type":"address"},{"name":"destTokenAddress","type":"address"},{"name":"sourceTokenAmount","type":"uint256"}],"name":"doManualTrade","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"sourceTokenAddress","type":"address"},{"name":"destTokenAddress","type":"address"},{"name":"sourceTokenAmount","type":"uint256"}],"name":"doTrade","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"loanTokenAddress","type":"address"},{"name":"positionTokenAddress","type":"address"},{"name":"collateralTokenAddress","type":"address"},{"name":"loanTokenAmount","type":"uint256"},{"name":"positionTokenAmount","type":"uint256"},{"name":"collateralTokenAmount","type":"uint256"}],"name":"getCurrentMarginAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"positionTokenAddress","type":"address"},{"name":"loanTokenAddress","type":"address"},{"name":"positionTokenAmount","type":"uint256"},{"name":"loanTokenAmount","type":"uint256"}],"name":"getProfitOrLoss","outputs":[{"name":"isProfit","type":"bool"},{"name":"profitOrLoss","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"sourceTokenAddress","type":"address"},{"name":"destTokenAddress","type":"address"},{"name":"sourceTokenAmount","type":"uint256"}],"name":"getTradeData","outputs":[{"name":"sourceToDestRate","type":"uint256"},{"name":"destTokenAmount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"sourceTokenAddress","type":"address"},{"name":"destTokenAddress","type":"address"},{"name":"sourceTokenAmount","type":"uint256"}],"name":"isTradeSupported","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"collateralTokenAddress","type":"address"},{"name":"loanTokenAddress","type":"address"},{"name":"collateralTokenAmountUsable","type":"uint256"},{"name":"loanTokenAmountNeeded","type":"uint256"},{"name":"initialMarginAmount","type":"uint256"},{"name":"maintenanceMarginAmount","type":"uint256"},{"name":"isLiquidation","type":"bool"}],"name":"processCollateral","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"},{"name":"loanTokenAddress","type":"address"},{"name":"positionTokenAddress","type":"address"},{"name":"collateralTokenAddress","type":"address"},{"name":"loanTokenAmount","type":"uint256"},{"name":"positionTokenAmount","type":"uint256"},{"name":"collateralTokenAmount","type":"uint256"},{"name":"maintenanceMarginAmount","type":"uint256"}],"name":"shouldLiquidate","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"loanTokenAddress","type":"address"},{"name":"positionTokenAddress","type":"address"},{"name":"collateralTokenAddress","type":"address"},{"name":"loanTokenAmount","type":"uint256"},{"name":"positionTokenAmount","type":"uint256"},{"name":"collateralTokenAmount","type":"uint256"},{"name":"maintenanceMarginAmount","type":"uint256"}],"name":"verifyAndLiquidate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 40 */
/***/ (function(module, exports) {

module.exports = {"name":"TestNetFaucet","address":"0x8501835ac2B234147F766bB6e6423D6Ef50A9247","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"from","type":"address"},{"name":"tokenAmount","type":"uint256"}],"name":"depositToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"getToken","type":"address"},{"name":"receiver","type":"address"}],"name":"faucet","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"faucetThresholdSecs","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"faucetUsers","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"constant":true,"inputs":[],"name":"oracleContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"getToken","type":"address"},{"name":"receiver","type":"address"},{"name":"getTokenAmount","type":"uint256"}],"name":"oracleExchange","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newValue","type":"uint256"}],"name":"setFaucetThresholdSecs","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newAddress","type":"address"}],"name":"setOracleContractAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"tokenAmount","type":"uint256"}],"name":"transferTokenFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"withdrawEther","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"to","type":"address"},{"name":"tokenAmount","type":"uint256"}],"name":"withdrawToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 41 */
/***/ (function(module, exports) {

module.exports = {"name":"ZRXToken","address":"0x871DD7C2B4b25E1Aa18728e9D5f2Af4C4e431f5c","abi":[]}

/***/ }),
/* 42 */
/***/ (function(module, exports) {

module.exports = {"name":"WETH","address":"0x0B1ba0af832d7C05fD64161E0Db78E85978E8082","abi":[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"}]}

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BZx = __webpack_require__(44);

var _BZx2 = _interopRequireDefault(_BZx);

var _BZxOracle = __webpack_require__(45);

var _BZxOracle2 = _interopRequireDefault(_BZxOracle);

var _BZxTo0x = __webpack_require__(46);

var _BZxTo0x2 = _interopRequireDefault(_BZxTo0x);

var _BZRxToken = __webpack_require__(47);

var _BZRxToken2 = _interopRequireDefault(_BZRxToken);

var _BZxVault = __webpack_require__(48);

var _BZxVault2 = _interopRequireDefault(_BZxVault);

var _EIP = __webpack_require__(49);

var _EIP2 = _interopRequireDefault(_EIP);

var _OracleRegistry = __webpack_require__(50);

var _OracleRegistry2 = _interopRequireDefault(_OracleRegistry);

var _TokenRegistry = __webpack_require__(51);

var _TokenRegistry2 = _interopRequireDefault(_TokenRegistry);

var _OracleInterface = __webpack_require__(52);

var _OracleInterface2 = _interopRequireDefault(_OracleInterface);

var _BZRXFakeFaucet = __webpack_require__(53);

var _BZRXFakeFaucet2 = _interopRequireDefault(_BZRXFakeFaucet);

var _ZRXToken = __webpack_require__(54);

var _ZRXToken2 = _interopRequireDefault(_ZRXToken);

var _WETH = __webpack_require__(55);

var _WETH2 = _interopRequireDefault(_WETH);

var _TokenTransferProxy = __webpack_require__(56);

var _TokenTransferProxy2 = _interopRequireDefault(_TokenTransferProxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  BZx: _BZx2.default,
  BZxOracle: _BZxOracle2.default,
  BZxTo0x: _BZxTo0x2.default,
  BZxToken: _BZRxToken2.default,
  BZxVault: _BZxVault2.default,
  EIP20: _EIP2.default,
  OracleRegistry: _OracleRegistry2.default,
  TokenRegistry: _TokenRegistry2.default,
  ZRXToken: _ZRXToken2.default,
  WETH: _WETH2.default,
  TokenTransferProxy: _TokenTransferProxy2.default,
  OracleInterface: _OracleInterface2.default,
  TestNetFaucet: _BZRXFakeFaucet2.default
};

/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports = {"name":"BZx","address":"0x86343bE63c60cE182D8b5AC6A84f0722D8D61AE5","abi":[{"constant":true,"inputs":[],"name":"DEBUG_MODE","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"maker","type":"address"},{"indexed":false,"name":"cancelLoanTokenAmount","type":"uint256"},{"indexed":false,"name":"remainingLoanTokenAmount","type":"uint256"},{"indexed":false,"name":"loanOrderHash","type":"bytes32"}],"name":"LogLoanCancelled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"lender","type":"address"},{"indexed":false,"name":"trader","type":"address"},{"indexed":false,"name":"isLiquidation","type":"bool"},{"indexed":false,"name":"loanOrderHash","type":"bytes32"}],"name":"LogLoanClosed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"lender","type":"address"},{"indexed":false,"name":"trader","type":"address"},{"indexed":false,"name":"collateralTokenAddressFilled","type":"address"},{"indexed":false,"name":"positionTokenAddressFilled","type":"address"},{"indexed":false,"name":"loanTokenAmountFilled","type":"uint256"},{"indexed":false,"name":"collateralTokenAmountFilled","type":"uint256"},{"indexed":false,"name":"positionTokenAmountFilled","type":"uint256"},{"indexed":false,"name":"loanStartUnixTimestampSec","type":"uint256"},{"indexed":false,"name":"active","type":"bool"},{"indexed":false,"name":"loanOrderHash","type":"bytes32"}],"name":"LogLoanTaken","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"loanOrderHash","type":"bytes32"},{"indexed":false,"name":"trader","type":"address"},{"indexed":false,"name":"initialMarginAmount","type":"uint256"},{"indexed":false,"name":"maintenanceMarginAmount","type":"uint256"},{"indexed":false,"name":"currentMarginAmount","type":"uint256"}],"name":"LogMarginLevels","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"loanOrderHash","type":"bytes32"},{"indexed":false,"name":"lender","type":"address"},{"indexed":false,"name":"trader","type":"address"},{"indexed":false,"name":"amountPaid","type":"uint256"},{"indexed":false,"name":"totalAccrued","type":"uint256"}],"name":"LogPayInterest","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"loanOrderHash","type":"bytes32"},{"indexed":false,"name":"trader","type":"address"},{"indexed":false,"name":"sourceTokenAddress","type":"address"},{"indexed":false,"name":"destTokenAddress","type":"address"},{"indexed":false,"name":"sourceTokenAmount","type":"uint256"},{"indexed":false,"name":"destTokenAmount","type":"uint256"}],"name":"LogPositionTraded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"loanOrderHash","type":"bytes32"},{"indexed":false,"name":"trader","type":"address"},{"indexed":false,"name":"profitWithdrawn","type":"uint256"},{"indexed":false,"name":"remainingPosition","type":"uint256"}],"name":"LogWithdrawProfit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":true,"inputs":[],"name":"bZRxTokenContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bZxTo0xContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"cancelLoanTokenAmount","type":"uint256"}],"name":"cancelLoanOrder","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"orderAddresses","type":"address[6]"},{"name":"orderValues","type":"uint256[9]"},{"name":"cancelLoanTokenAmount","type":"uint256"}],"name":"cancelLoanOrder","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"collateralTokenFilled","type":"address"}],"name":"changeCollateral","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"}],"name":"closeLoan","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"collateralTokenFilled","type":"address"},{"name":"depositAmount","type":"uint256"}],"name":"depositCollateral","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"forceCloanLoan","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"start","type":"uint256"},{"name":"count","type":"uint256"}],"name":"getActiveLoans","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanTokenAddress","type":"address"},{"name":"collateralTokenAddress","type":"address"},{"name":"oracleAddress","type":"address"},{"name":"loanTokenAmountFilled","type":"uint256"},{"name":"initialMarginAmount","type":"uint256"}],"name":"getInitialCollateralRequired","outputs":[{"name":"collateralTokenAmount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"getInterest","outputs":[{"name":"lender","type":"address"},{"name":"interestTokenAddress","type":"address"},{"name":"interestTotalAccrued","type":"uint256"},{"name":"interestPaidSoFar","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"orderAddresses","type":"address[6]"},{"name":"orderValues","type":"uint256[9]"}],"name":"getLoanOrderHash","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanParty","type":"address"},{"name":"count","type":"uint256"},{"name":"activeOnly","type":"bool"}],"name":"getLoansForLender","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanParty","type":"address"},{"name":"count","type":"uint256"},{"name":"activeOnly","type":"bool"}],"name":"getLoansForTrader","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"getMarginLevels","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanParty","type":"address"},{"name":"start","type":"uint256"},{"name":"count","type":"uint256"}],"name":"getOrders","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"getProfitOrLoss","outputs":[{"name":"isProfit","type":"bool"},{"name":"profitOrLoss","type":"uint256"},{"name":"positionTokenAddress","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"getSingleLoan","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"}],"name":"getSingleOrder","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"}],"name":"getUnavailableLoanTokenAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"}],"name":"interestPaid","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"signer","type":"address"},{"name":"hash","type":"bytes32"},{"name":"signature","type":"bytes"}],"name":"isValidSignature","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"liquidatePosition","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"loanList","outputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"}],"name":"loanPositions","outputs":[{"name":"lender","type":"address"},{"name":"trader","type":"address"},{"name":"collateralTokenAddressFilled","type":"address"},{"name":"positionTokenAddressFilled","type":"address"},{"name":"loanTokenAmountFilled","type":"uint256"},{"name":"collateralTokenAmountFilled","type":"uint256"},{"name":"positionTokenAmountFilled","type":"uint256"},{"name":"loanStartUnixTimestampSec","type":"uint256"},{"name":"index","type":"uint256"},{"name":"active","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"oracleAddresses","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"oracleRegistryContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"orderCancelledAmounts","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"orderFilledAmounts","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"orderLender","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"orderList","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"uint256"}],"name":"orderTraders","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"orders","outputs":[{"name":"maker","type":"address"},{"name":"loanTokenAddress","type":"address"},{"name":"interestTokenAddress","type":"address"},{"name":"collateralTokenAddress","type":"address"},{"name":"feeRecipientAddress","type":"address"},{"name":"oracleAddress","type":"address"},{"name":"loanTokenAmount","type":"uint256"},{"name":"interestAmount","type":"uint256"},{"name":"initialMarginAmount","type":"uint256"},{"name":"maintenanceMarginAmount","type":"uint256"},{"name":"lenderRelayFee","type":"uint256"},{"name":"traderRelayFee","type":"uint256"},{"name":"expirationUnixTimestampSec","type":"uint256"},{"name":"loanOrderHash","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"payInterest","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"shouldLiquidate","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"orderAddresses","type":"address[6]"},{"name":"orderValues","type":"uint256[9]"},{"name":"signature","type":"bytes"}],"name":"takeLoanOrderAsLender","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"orderAddresses","type":"address[6]"},{"name":"orderValues","type":"uint256[9]"},{"name":"collateralTokenFilled","type":"address"},{"name":"loanTokenAmountFilled","type":"uint256"},{"name":"signature","type":"bytes"}],"name":"takeLoanOrderAsTrader","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"orderData0x","type":"bytes"},{"name":"signature0x","type":"bytes"}],"name":"tradePositionWith0x","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"tradeTokenAddress","type":"address"}],"name":"tradePositionWithOracle","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"vaultContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"collateralTokenFilled","type":"address"},{"name":"withdrawAmount","type":"uint256"}],"name":"withdrawExcessCollateral","outputs":[{"name":"excessCollateral","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"}],"name":"withdrawProfit","outputs":[{"name":"profitAmount","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 45 */
/***/ (function(module, exports) {

module.exports = {"name":"BZxOracle","address":"0x8593F6028b5B6c4F7899f9cf2e0bA2750b7f6Ee2","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"previousBZxContract","type":"address"},{"indexed":true,"name":"newBZxContract","type":"address"}],"name":"BZxOwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"payer","type":"address"},{"indexed":false,"name":"gasUsed","type":"uint256"},{"indexed":false,"name":"currentGasPrice","type":"uint256"},{"indexed":false,"name":"refundAmount","type":"uint256"},{"indexed":false,"name":"refundSuccess","type":"bool"}],"name":"GasRefund","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":true,"inputs":[],"name":"bZRxTokenContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bZxContractAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bountyRewardPercent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"didChangeCollateral","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"loanCloser","type":"address"},{"name":"isLiquidation","type":"bool"},{"name":"gasUsed","type":"uint256"}],"name":"didCloseLoan","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"didDepositCollateral","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"},{"name":"lender","type":"address"},{"name":"interestTokenAddress","type":"address"},{"name":"amountOwed","type":"uint256"},{"name":"convert","type":"bool"},{"name":"","type":"uint256"}],"name":"didPayInterest","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"taker","type":"address"},{"name":"gasUsed","type":"uint256"}],"name":"didTakeOrder","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"name":"didTradePosition","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"didWithdrawCollateral","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"name":"didWithdrawProfit","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"sourceTokenAddress","type":"address"},{"name":"destTokenAddress","type":"address"},{"name":"sourceTokenAmount","type":"uint256"}],"name":"doManualTrade","outputs":[{"name":"destTokenAmount","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"sourceTokenAddress","type":"address"},{"name":"destTokenAddress","type":"address"},{"name":"sourceTokenAmount","type":"uint256"}],"name":"doTrade","outputs":[{"name":"destTokenAmount","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"collateralTokenAddress","type":"address"},{"name":"loanTokenAddress","type":"address"},{"name":"collateralTokenAmountUsable","type":"uint256"},{"name":"loanTokenAmountNeeded","type":"uint256"},{"name":"initialMarginAmount","type":"uint256"},{"name":"maintenanceMarginAmount","type":"uint256"}],"name":"doTradeofCollateral","outputs":[{"name":"loanTokenAmountCovered","type":"uint256"},{"name":"collateralTokenAmountUsed","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"emaPeriods","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"emaValue","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"uint256"}],"name":"gasRefunds","outputs":[{"name":"payer","type":"address"},{"name":"gasUsed","type":"uint256"},{"name":"isPaid","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"gasRewardPercent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanTokenAddress","type":"address"},{"name":"positionTokenAddress","type":"address"},{"name":"collateralTokenAddress","type":"address"},{"name":"loanTokenAmount","type":"uint256"},{"name":"positionTokenAmount","type":"uint256"},{"name":"collateralTokenAmount","type":"uint256"}],"name":"getCurrentMarginAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"positionTokenAddress","type":"address"},{"name":"loanTokenAddress","type":"address"},{"name":"positionTokenAmount","type":"uint256"},{"name":"loanTokenAmount","type":"uint256"}],"name":"getProfitOrLoss","outputs":[{"name":"isProfit","type":"bool"},{"name":"profitOrLoss","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"sourceTokenAddress","type":"address"},{"name":"destTokenAddress","type":"address"}],"name":"getTradeRate","outputs":[{"name":"rate","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"interestFeePercent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isManualTradingAllowed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"sourceTokenAddress","type":"address"},{"name":"destTokenAddress","type":"address"},{"name":"sourceTokenAmount","type":"uint256"}],"name":"isTradeSupported","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"kyberContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"liquidationThresholdPercent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"minInitialMarginAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"minMaintenanceMarginAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newAddress","type":"address"}],"name":"setBZRxTokenContractAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newValue","type":"uint256"}],"name":"setBountyRewardPercent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newEMAPeriods","type":"uint256"}],"name":"setEMAPeriods","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newValue","type":"uint256"}],"name":"setGasRewardPercent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newRate","type":"uint256"}],"name":"setInterestFeePercent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newAddress","type":"address"}],"name":"setKyberContractAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newValue","type":"uint256"}],"name":"setLiquidationThresholdPercent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_isManualTradingAllowed","type":"bool"}],"name":"setManualTradingAllowed","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newInitialMargin","type":"uint256"},{"name":"newMaintenanceMargin","type":"uint256"}],"name":"setMarginThresholds","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newAddress","type":"address"}],"name":"setVaultContractAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newAddress","type":"address"}],"name":"setWethContractAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"},{"name":"loanTokenAddress","type":"address"},{"name":"positionTokenAddress","type":"address"},{"name":"collateralTokenAddress","type":"address"},{"name":"loanTokenAmount","type":"uint256"},{"name":"positionTokenAmount","type":"uint256"},{"name":"collateralTokenAmount","type":"uint256"},{"name":"maintenanceMarginAmount","type":"uint256"}],"name":"shouldLiquidate","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"throwOnGasRefundFail","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newBZxContractAddress","type":"address"}],"name":"transferBZxOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferEther","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_vaultContract","type":"address"},{"name":"_kyberContract","type":"address"},{"name":"_wethContract","type":"address"},{"name":"_bZRxTokenContract","type":"address"}],"payable":true,"stateMutability":"payable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"constant":false,"inputs":[{"name":"tokenAddress","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"vaultContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"loanTokenAddress","type":"address"},{"name":"positionTokenAddress","type":"address"},{"name":"collateralTokenAddress","type":"address"},{"name":"loanTokenAmount","type":"uint256"},{"name":"positionTokenAmount","type":"uint256"},{"name":"collateralTokenAmount","type":"uint256"},{"name":"maintenanceMarginAmount","type":"uint256"}],"name":"verifyAndLiquidate","outputs":[{"name":"destTokenAmount","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"wethContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}]}

/***/ }),
/* 46 */
/***/ (function(module, exports) {

module.exports = {"name":"BZxTo0x","address":"0xB42ffB71F3e479D712366921cBdCc47E067F1137","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"previousBZxContract","type":"address"},{"indexed":true,"name":"newBZxContract","type":"address"}],"name":"BZxOwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"approveFor","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"payable":false,"stateMutability":"nonpayable","type":"fallback"},{"inputs":[{"name":"_exchange","type":"address"},{"name":"_zrxToken","type":"address"},{"name":"_proxy","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"constant":true,"inputs":[],"name":"bZxContractAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"exchangeContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"orderData0x","type":"bytes"}],"name":"getOrderValuesFromData","outputs":[{"name":"orderAddresses","type":"address[5][]"},{"name":"orderValues","type":"uint256[6][]"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"numerator","type":"uint256"},{"name":"denominator","type":"uint256"},{"name":"target","type":"uint256"}],"name":"getPartialAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"signatures","type":"bytes"}],"name":"getSignatureParts","outputs":[{"name":"vs","type":"uint8[]"},{"name":"rs","type":"bytes32[]"},{"name":"ss","type":"bytes32[]"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_exchange","type":"address"}],"name":"set0xExchange","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_proxy","type":"address"}],"name":"set0xTokenProxy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_zrxToken","type":"address"}],"name":"setZRXToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"trader","type":"address"},{"name":"vaultAddress","type":"address"},{"name":"sourceTokenAmountToUse","type":"uint256"},{"name":"orderData0x","type":"bytes"},{"name":"signature0x","type":"bytes"}],"name":"take0xTrade","outputs":[{"name":"destTokenAddress","type":"address"},{"name":"destTokenAmount","type":"uint256"},{"name":"sourceTokenUsedAmount","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"tokenTransferProxyContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newBZxContractAddress","type":"address"}],"name":"transferBZxOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"zrxTokenContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}]}

/***/ }),
/* 47 */
/***/ (function(module, exports) {

module.exports = {"name":"BZRxToken","address":"0x13939ac9F1e0F99872fA873B6E00DE9248ac95A0","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"burner","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"decreaseApprovalAndCall","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"increaseApprovalAndCall","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newName","type":"string"},{"name":"_newSymbol","type":"string"}],"name":"renameToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"transferAndCall","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"transferFromAndCall","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 48 */
/***/ (function(module, exports) {

module.exports = {"name":"BZxVault","address":"0x9ecEA0eDC56f307cC343B2C8e3acB454D1faFFDa","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"previousBZxContract","type":"address"},{"indexed":true,"name":"newBZxContract","type":"address"}],"name":"BZxOwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":true,"inputs":[],"name":"bZxContractAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"from","type":"address"},{"name":"tokenAmount","type":"uint256"}],"name":"depositToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"constant":false,"inputs":[{"name":"newBZxContractAddress","type":"address"}],"name":"transferBZxOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"tokenAmount","type":"uint256"}],"name":"transferTokenFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"withdrawEther","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"to","type":"address"},{"name":"tokenAmount","type":"uint256"}],"name":"withdrawToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 49 */
/***/ (function(module, exports) {

module.exports = {"name":"EIP20","address":"","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 50 */
/***/ (function(module, exports) {

module.exports = {"name":"OracleRegistry","address":"0x426f5414CebC0FB1e9Ffbff70646F6561dE7656c","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"oracle","type":"address"},{"indexed":false,"name":"name","type":"string"}],"name":"LogAddOracle","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"oracle","type":"address"},{"indexed":false,"name":"oldName","type":"string"},{"indexed":false,"name":"newName","type":"string"}],"name":"LogOracleNameChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"oracle","type":"address"},{"indexed":false,"name":"name","type":"string"}],"name":"LogRemoveOracle","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":false,"inputs":[{"name":"_oracle","type":"address"},{"name":"_name","type":"string"}],"name":"addOracle","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"string"}],"name":"getOracleAddressByName","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOracleAddresses","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"string"}],"name":"getOracleByName","outputs":[{"name":"","type":"address"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOracleList","outputs":[{"name":"","type":"address[]"},{"name":"","type":"uint256[]"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_oracle","type":"address"}],"name":"getOracleMetaData","outputs":[{"name":"","type":"address"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_oracle","type":"address"}],"name":"hasOracle","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"oracleAddresses","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"oracles","outputs":[{"name":"oracle","type":"address"},{"name":"name","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_oracle","type":"address"},{"name":"_index","type":"uint256"}],"name":"removeOracle","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_oracle","type":"address"},{"name":"_name","type":"string"}],"name":"setOracleName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 51 */
/***/ (function(module, exports) {

module.exports = {"name":"TokenRegistry","address":"0x17eC0d79b60D415c09aF6a4a67dAC9F2FA31acEb","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"token","type":"address"},{"indexed":false,"name":"name","type":"string"},{"indexed":false,"name":"symbol","type":"string"},{"indexed":false,"name":"decimals","type":"uint8"},{"indexed":false,"name":"url","type":"string"}],"name":"LogAddToken","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"token","type":"address"},{"indexed":false,"name":"name","type":"string"},{"indexed":false,"name":"symbol","type":"string"},{"indexed":false,"name":"decimals","type":"uint8"},{"indexed":false,"name":"url","type":"string"}],"name":"LogRemoveToken","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"token","type":"address"},{"indexed":false,"name":"oldName","type":"string"},{"indexed":false,"name":"newName","type":"string"}],"name":"LogTokenNameChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"token","type":"address"},{"indexed":false,"name":"oldSymbol","type":"string"},{"indexed":false,"name":"newSymbol","type":"string"}],"name":"LogTokenSymbolChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"token","type":"address"},{"indexed":false,"name":"oldURL","type":"string"},{"indexed":false,"name":"newURL","type":"string"}],"name":"LogTokenURLChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_name","type":"string"},{"name":"_symbol","type":"string"},{"name":"_decimals","type":"uint8"},{"name":"_url","type":"string"}],"name":"addToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"string"}],"name":"getTokenAddressByName","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_symbol","type":"string"}],"name":"getTokenAddressBySymbol","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTokenAddresses","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"string"}],"name":"getTokenByName","outputs":[{"name":"","type":"address"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"uint8"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_symbol","type":"string"}],"name":"getTokenBySymbol","outputs":[{"name":"","type":"address"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"uint8"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_token","type":"address"}],"name":"getTokenMetaData","outputs":[{"name":"","type":"address"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"uint8"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_index","type":"uint256"}],"name":"removeToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_name","type":"string"}],"name":"setTokenName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_symbol","type":"string"}],"name":"setTokenSymbol","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_url","type":"string"}],"name":"setTokenURL","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"tokenAddresses","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"tokens","outputs":[{"name":"token","type":"address"},{"name":"name","type":"string"},{"name":"symbol","type":"string"},{"name":"decimals","type":"uint8"},{"name":"url","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 52 */
/***/ (function(module, exports) {

module.exports = {"name":"OracleInterface","address":"","abi":[{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"borrower","type":"address"},{"name":"gasUsed","type":"uint256"}],"name":"didChangeCollateral","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"loanCloser","type":"address"},{"name":"isLiquidation","type":"bool"},{"name":"gasUsed","type":"uint256"}],"name":"didCloseLoan","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"borrower","type":"address"},{"name":"gasUsed","type":"uint256"}],"name":"didDepositCollateral","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"},{"name":"lender","type":"address"},{"name":"interestTokenAddress","type":"address"},{"name":"amountOwed","type":"uint256"},{"name":"convert","type":"bool"},{"name":"gasUsed","type":"uint256"}],"name":"didPayInterest","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"taker","type":"address"},{"name":"gasUsed","type":"uint256"}],"name":"didTakeOrder","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"},{"name":"tradeTokenAddress","type":"address"},{"name":"tradeTokenAmount","type":"uint256"},{"name":"gasUsed","type":"uint256"}],"name":"didTradePosition","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"borrower","type":"address"},{"name":"gasUsed","type":"uint256"}],"name":"didWithdrawCollateral","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"borrower","type":"address"},{"name":"profitOrLoss","type":"uint256"},{"name":"gasUsed","type":"uint256"}],"name":"didWithdrawProfit","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"sourceTokenAddress","type":"address"},{"name":"destTokenAddress","type":"address"},{"name":"sourceTokenAmount","type":"uint256"}],"name":"doManualTrade","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"sourceTokenAddress","type":"address"},{"name":"destTokenAddress","type":"address"},{"name":"sourceTokenAmount","type":"uint256"}],"name":"doTrade","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"collateralTokenAddress","type":"address"},{"name":"loanTokenAddress","type":"address"},{"name":"collateralTokenAmountUsable","type":"uint256"},{"name":"loanTokenAmountNeeded","type":"uint256"},{"name":"initialMarginAmount","type":"uint256"},{"name":"maintenanceMarginAmount","type":"uint256"}],"name":"doTradeofCollateral","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"loanTokenAddress","type":"address"},{"name":"positionTokenAddress","type":"address"},{"name":"collateralTokenAddress","type":"address"},{"name":"loanTokenAmount","type":"uint256"},{"name":"positionTokenAmount","type":"uint256"},{"name":"collateralTokenAmount","type":"uint256"}],"name":"getCurrentMarginAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"positionTokenAddress","type":"address"},{"name":"loanTokenAddress","type":"address"},{"name":"positionTokenAmount","type":"uint256"},{"name":"loanTokenAmount","type":"uint256"}],"name":"getProfitOrLoss","outputs":[{"name":"isProfit","type":"bool"},{"name":"profitOrLoss","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"sourceTokenAddress","type":"address"},{"name":"destTokenAddress","type":"address"}],"name":"getTradeRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"sourceTokenAddress","type":"address"},{"name":"destTokenAddress","type":"address"},{"name":"sourceTokenAmount","type":"uint256"}],"name":"isTradeSupported","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"},{"name":"loanTokenAddress","type":"address"},{"name":"positionTokenAddress","type":"address"},{"name":"collateralTokenAddress","type":"address"},{"name":"loanTokenAmount","type":"uint256"},{"name":"positionTokenAmount","type":"uint256"},{"name":"collateralTokenAmount","type":"uint256"},{"name":"maintenanceMarginAmount","type":"uint256"}],"name":"shouldLiquidate","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"loanTokenAddress","type":"address"},{"name":"positionTokenAddress","type":"address"},{"name":"collateralTokenAddress","type":"address"},{"name":"loanTokenAmount","type":"uint256"},{"name":"positionTokenAmount","type":"uint256"},{"name":"collateralTokenAmount","type":"uint256"},{"name":"maintenanceMarginAmount","type":"uint256"}],"name":"verifyAndLiquidate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 53 */
/***/ (function(module, exports) {

module.exports = {"name":"BZRXFakeFaucet","address":"0x6CcA523f6fE11231eA3C6A29691Ade230B0ed78C","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"from","type":"address"},{"name":"tokenAmount","type":"uint256"}],"name":"depositToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"getToken","type":"address"},{"name":"receiver","type":"address"}],"name":"faucet","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"faucetThresholdSecs","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"faucetUsers","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newValue","type":"uint256"}],"name":"setFaucetThresholdSecs","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"tokenAmount","type":"uint256"}],"name":"transferTokenFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"withdrawEther","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"to","type":"address"},{"name":"tokenAmount","type":"uint256"}],"name":"withdrawToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 54 */
/***/ (function(module, exports) {

module.exports = {"name":"ZRXToken","address":"0xE41d2489571d322189246DaFA5ebDe1F4699F498","abi":[]}

/***/ }),
/* 55 */
/***/ (function(module, exports) {

module.exports = {"name":"WETH","address":"0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2","abi":[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"}]}

/***/ }),
/* 56 */
/***/ (function(module, exports) {

module.exports = {"address":"0x8da0d80f5007ef1e431dd2127178d224e32c2ef4","abi":[]}

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BZx = __webpack_require__(58);

var _BZx2 = _interopRequireDefault(_BZx);

var _BZxOracle = __webpack_require__(59);

var _BZxOracle2 = _interopRequireDefault(_BZxOracle);

var _BZxTo0x = __webpack_require__(60);

var _BZxTo0x2 = _interopRequireDefault(_BZxTo0x);

var _BZRxToken = __webpack_require__(61);

var _BZRxToken2 = _interopRequireDefault(_BZRxToken);

var _BZxVault = __webpack_require__(62);

var _BZxVault2 = _interopRequireDefault(_BZxVault);

var _EIP = __webpack_require__(63);

var _EIP2 = _interopRequireDefault(_EIP);

var _OracleRegistry = __webpack_require__(64);

var _OracleRegistry2 = _interopRequireDefault(_OracleRegistry);

var _TokenRegistry = __webpack_require__(65);

var _TokenRegistry2 = _interopRequireDefault(_TokenRegistry);

var _OracleInterface = __webpack_require__(66);

var _OracleInterface2 = _interopRequireDefault(_OracleInterface);

var _TestNetFaucet = __webpack_require__(67);

var _TestNetFaucet2 = _interopRequireDefault(_TestNetFaucet);

var _ZRXToken = __webpack_require__(68);

var _ZRXToken2 = _interopRequireDefault(_ZRXToken);

var _WETH = __webpack_require__(69);

var _WETH2 = _interopRequireDefault(_WETH);

var _TokenTransferProxy = __webpack_require__(70);

var _TokenTransferProxy2 = _interopRequireDefault(_TokenTransferProxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  BZx: _BZx2.default,
  BZxOracle: _BZxOracle2.default,
  BZxTo0x: _BZxTo0x2.default,
  BZxToken: _BZRxToken2.default,
  BZxVault: _BZxVault2.default,
  EIP20: _EIP2.default,
  OracleRegistry: _OracleRegistry2.default,
  TokenRegistry: _TokenRegistry2.default,
  ZRXToken: _ZRXToken2.default,
  WETH: _WETH2.default,
  TokenTransferProxy: _TokenTransferProxy2.default,
  OracleInterface: _OracleInterface2.default,
  TestNetFaucet: _TestNetFaucet2.default
};

/***/ }),
/* 58 */
/***/ (function(module, exports) {

module.exports = {"name":"BZx","address":"0x487F10A735680c4C9B4B5c7f46cf254357FF58a4","abi":[{"constant":true,"inputs":[],"name":"DEBUG_MODE","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"loanOrderHash","type":"bytes32"},{"indexed":false,"name":"adder","type":"address"},{"indexed":false,"name":"maker","type":"address"},{"indexed":false,"name":"feeRecipientAddress","type":"address"},{"indexed":false,"name":"lenderRelayFee","type":"uint256"},{"indexed":false,"name":"traderRelayFee","type":"uint256"},{"indexed":false,"name":"maxDuration","type":"uint256"},{"indexed":false,"name":"makerRole","type":"uint256"}],"name":"LogLoanAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"maker","type":"address"},{"indexed":false,"name":"cancelLoanTokenAmount","type":"uint256"},{"indexed":false,"name":"remainingLoanTokenAmount","type":"uint256"},{"indexed":false,"name":"loanOrderHash","type":"bytes32"}],"name":"LogLoanCancelled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"lender","type":"address"},{"indexed":false,"name":"trader","type":"address"},{"indexed":false,"name":"isLiquidation","type":"bool"},{"indexed":false,"name":"loanOrderHash","type":"bytes32"}],"name":"LogLoanClosed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"lender","type":"address"},{"indexed":false,"name":"trader","type":"address"},{"indexed":false,"name":"collateralTokenAddressFilled","type":"address"},{"indexed":false,"name":"positionTokenAddressFilled","type":"address"},{"indexed":false,"name":"loanTokenAmountFilled","type":"uint256"},{"indexed":false,"name":"collateralTokenAmountFilled","type":"uint256"},{"indexed":false,"name":"positionTokenAmountFilled","type":"uint256"},{"indexed":false,"name":"loanStartUnixTimestampSec","type":"uint256"},{"indexed":false,"name":"active","type":"bool"},{"indexed":false,"name":"loanOrderHash","type":"bytes32"}],"name":"LogLoanTaken","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"loanOrderHash","type":"bytes32"},{"indexed":false,"name":"trader","type":"address"},{"indexed":false,"name":"initialMarginAmount","type":"uint256"},{"indexed":false,"name":"maintenanceMarginAmount","type":"uint256"},{"indexed":false,"name":"currentMarginAmount","type":"uint256"}],"name":"LogMarginLevels","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"loanOrderHash","type":"bytes32"},{"indexed":false,"name":"lender","type":"address"},{"indexed":false,"name":"trader","type":"address"},{"indexed":false,"name":"amountPaid","type":"uint256"},{"indexed":false,"name":"totalAccrued","type":"uint256"}],"name":"LogPayInterest","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"loanOrderHash","type":"bytes32"},{"indexed":false,"name":"trader","type":"address"},{"indexed":false,"name":"sourceTokenAddress","type":"address"},{"indexed":false,"name":"destTokenAddress","type":"address"},{"indexed":false,"name":"sourceTokenAmount","type":"uint256"},{"indexed":false,"name":"destTokenAmount","type":"uint256"}],"name":"LogPositionTraded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"loanOrderHash","type":"bytes32"},{"indexed":false,"name":"trader","type":"address"},{"indexed":false,"name":"profitWithdrawn","type":"uint256"},{"indexed":false,"name":"remainingPosition","type":"uint256"}],"name":"LogWithdrawProfit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":true,"inputs":[],"name":"bZRxTokenContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bZxTo0xContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bZxTo0xV2Contract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"cancelLoanTokenAmount","type":"uint256"}],"name":"cancelLoanOrder","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"orderAddresses","type":"address[6]"},{"name":"orderValues","type":"uint256[10]"},{"name":"cancelLoanTokenAmount","type":"uint256"}],"name":"cancelLoanOrder","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"collateralTokenFilled","type":"address"}],"name":"changeCollateral","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"}],"name":"closeLoan","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"collateralTokenFilled","type":"address"},{"name":"depositAmount","type":"uint256"}],"name":"depositCollateral","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"forceCloanLoan","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"start","type":"uint256"},{"name":"count","type":"uint256"}],"name":"getActiveLoans","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanTokenAddress","type":"address"},{"name":"collateralTokenAddress","type":"address"},{"name":"oracleAddress","type":"address"},{"name":"loanTokenAmountFilled","type":"uint256"},{"name":"initialMarginAmount","type":"uint256"}],"name":"getInitialCollateralRequired","outputs":[{"name":"collateralTokenAmount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"getInterest","outputs":[{"name":"lender","type":"address"},{"name":"interestTokenAddress","type":"address"},{"name":"interestTotalAccrued","type":"uint256"},{"name":"interestPaidSoFar","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"orderAddresses","type":"address[6]"},{"name":"orderValues","type":"uint256[10]"}],"name":"getLoanOrderHash","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanParty","type":"address"},{"name":"count","type":"uint256"},{"name":"activeOnly","type":"bool"}],"name":"getLoansForLender","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanParty","type":"address"},{"name":"count","type":"uint256"},{"name":"activeOnly","type":"bool"}],"name":"getLoansForTrader","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"getMarginLevels","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"start","type":"uint256"},{"name":"count","type":"uint256"}],"name":"getOrdersFillable","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanParty","type":"address"},{"name":"start","type":"uint256"},{"name":"count","type":"uint256"}],"name":"getOrdersForUser","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"getProfitOrLoss","outputs":[{"name":"isProfit","type":"bool"},{"name":"profitOrLoss","type":"uint256"},{"name":"positionTokenAddress","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"getSingleLoan","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"}],"name":"getSingleOrder","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"}],"name":"getUnavailableLoanTokenAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"}],"name":"interestPaid","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"signer","type":"address"},{"name":"hash","type":"bytes32"},{"name":"signature","type":"bytes"}],"name":"isValidSignature","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"liquidatePosition","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"loanList","outputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"}],"name":"loanPositions","outputs":[{"name":"lender","type":"address"},{"name":"trader","type":"address"},{"name":"collateralTokenAddressFilled","type":"address"},{"name":"positionTokenAddressFilled","type":"address"},{"name":"loanTokenAmountFilled","type":"uint256"},{"name":"collateralTokenAmountFilled","type":"uint256"},{"name":"positionTokenAmountFilled","type":"uint256"},{"name":"loanStartUnixTimestampSec","type":"uint256"},{"name":"loanEndUnixTimestampSec","type":"uint256"},{"name":"index","type":"uint256"},{"name":"active","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"oracleAddresses","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"oracleRegistryContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"orderAux","outputs":[{"name":"maker","type":"address"},{"name":"feeRecipientAddress","type":"address"},{"name":"lenderRelayFee","type":"uint256"},{"name":"traderRelayFee","type":"uint256"},{"name":"makerRole","type":"uint256"},{"name":"expirationUnixTimestampSec","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"orderCancelledAmounts","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"orderFilledAmounts","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"orderIndexes","outputs":[{"name":"index","type":"uint256"},{"name":"active","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"orderLender","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"orderList","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"uint256"}],"name":"orderTraders","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"orders","outputs":[{"name":"loanTokenAddress","type":"address"},{"name":"interestTokenAddress","type":"address"},{"name":"collateralTokenAddress","type":"address"},{"name":"oracleAddress","type":"address"},{"name":"loanTokenAmount","type":"uint256"},{"name":"interestAmount","type":"uint256"},{"name":"initialMarginAmount","type":"uint256"},{"name":"maintenanceMarginAmount","type":"uint256"},{"name":"maxDurationUnixTimestampSec","type":"uint256"},{"name":"loanOrderHash","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"payInterest","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"orderAddresses","type":"address[6]"},{"name":"orderValues","type":"uint256[10]"},{"name":"signature","type":"bytes"}],"name":"pushLoanOrderOnChain","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"shouldLiquidate","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"orderAddresses","type":"address[6]"},{"name":"orderValues","type":"uint256[10]"},{"name":"signature","type":"bytes"}],"name":"takeLoanOrderAsLender","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"orderAddresses","type":"address[6]"},{"name":"orderValues","type":"uint256[10]"},{"name":"collateralTokenFilled","type":"address"},{"name":"loanTokenAmountFilled","type":"uint256"},{"name":"signature","type":"bytes"}],"name":"takeLoanOrderAsTrader","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"}],"name":"takeLoanOrderOnChainAsLender","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"collateralTokenFilled","type":"address"},{"name":"loanTokenAmountFilled","type":"uint256"}],"name":"takeLoanOrderOnChainAsTrader","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"orderData0x","type":"bytes"},{"name":"signature0x","type":"bytes"}],"name":"tradePositionWith0x","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"components":[{"name":"makerAddress","type":"address"},{"name":"takerAddress","type":"address"},{"name":"feeRecipientAddress","type":"address"},{"name":"senderAddress","type":"address"},{"name":"makerAssetAmount","type":"uint256"},{"name":"takerAssetAmount","type":"uint256"},{"name":"makerFee","type":"uint256"},{"name":"takerFee","type":"uint256"},{"name":"expirationTimeSeconds","type":"uint256"},{"name":"salt","type":"uint256"},{"name":"makerAssetData","type":"bytes"},{"name":"takerAssetData","type":"bytes"}],"name":"orders0x","type":"tuple[]"},{"name":"signatures0x","type":"bytes[]"}],"name":"tradePositionWith0xV2","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"tradeTokenAddress","type":"address"}],"name":"tradePositionWithOracle","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"vaultContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"collateralTokenFilled","type":"address"},{"name":"withdrawAmount","type":"uint256"}],"name":"withdrawExcessCollateral","outputs":[{"name":"excessCollateral","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"}],"name":"withdrawProfit","outputs":[{"name":"profitAmount","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 59 */
/***/ (function(module, exports) {

module.exports = {"name":"BZxOracle","address":"0x1ED695503927BCD6BD5912323E1c906B85dC60d4","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"previousBZxContract","type":"address"},{"indexed":true,"name":"newBZxContract","type":"address"}],"name":"BZxOwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"payer","type":"address"},{"indexed":false,"name":"gasUsed","type":"uint256"},{"indexed":false,"name":"currentGasPrice","type":"uint256"},{"indexed":false,"name":"refundAmount","type":"uint256"},{"indexed":false,"name":"refundSuccess","type":"bool"}],"name":"GasRefund","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":true,"inputs":[],"name":"bZRxTokenContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bZxContractAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bountyRewardPercent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"didChangeCollateral","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"","type":"bytes32"},{"name":"loanCloser","type":"address"},{"name":"isLiquidation","type":"bool"},{"name":"gasUsed","type":"uint256"}],"name":"didCloseLoan","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"didDepositCollateral","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"},{"name":"lender","type":"address"},{"name":"interestTokenAddress","type":"address"},{"name":"amountOwed","type":"uint256"},{"name":"convert","type":"bool"},{"name":"","type":"uint256"}],"name":"didPayInterest","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"","type":"bytes32"},{"name":"orderAddresses","type":"address[4]"},{"name":"orderAmounts","type":"uint256[4]"}],"name":"didTakeOrder","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"name":"didTradePosition","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"didWithdrawCollateral","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"name":"didWithdrawProfit","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"sourceTokenAddress","type":"address"},{"name":"destTokenAddress","type":"address"},{"name":"sourceTokenAmount","type":"uint256"}],"name":"doManualTrade","outputs":[{"name":"destTokenAmount","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"sourceTokenAddress","type":"address"},{"name":"destTokenAddress","type":"address"},{"name":"sourceTokenAmount","type":"uint256"}],"name":"doTrade","outputs":[{"name":"destTokenAmount","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"emaPeriods","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"emaValue","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"gasUpperBound","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanTokenAddress","type":"address"},{"name":"positionTokenAddress","type":"address"},{"name":"collateralTokenAddress","type":"address"},{"name":"loanTokenAmount","type":"uint256"},{"name":"positionTokenAmount","type":"uint256"},{"name":"collateralTokenAmount","type":"uint256"}],"name":"getCurrentMarginAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"positionTokenAddress","type":"address"},{"name":"loanTokenAddress","type":"address"},{"name":"positionTokenAmount","type":"uint256"},{"name":"loanTokenAmount","type":"uint256"}],"name":"getProfitOrLoss","outputs":[{"name":"isProfit","type":"bool"},{"name":"profitOrLoss","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"sourceTokenAddress","type":"address"},{"name":"destTokenAddress","type":"address"},{"name":"sourceTokenAmount","type":"uint256"}],"name":"getTradeData","outputs":[{"name":"sourceToDestRate","type":"uint256"},{"name":"destTokenAmount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"interestFeePercent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isManualTradingAllowed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"sourceTokenAddress","type":"address"},{"name":"destTokenAddress","type":"address"},{"name":"sourceTokenAmount","type":"uint256"}],"name":"isTradeSupported","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"kyberContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"minInitialMarginAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"minMaintenanceMarginAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"minimumCollateralInEthAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"outlierAdder","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"outlierMultiplier","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"collateralTokenAddress","type":"address"},{"name":"loanTokenAddress","type":"address"},{"name":"collateralTokenAmountUsable","type":"uint256"},{"name":"loanTokenAmountNeeded","type":"uint256"},{"name":"initialMarginAmount","type":"uint256"},{"name":"maintenanceMarginAmount","type":"uint256"},{"name":"isLiquidation","type":"bool"}],"name":"processCollateral","outputs":[{"name":"loanTokenAmountCovered","type":"uint256"},{"name":"collateralTokenAmountUsed","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newAddress","type":"address"}],"name":"setBZRxTokenContractAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newValue","type":"uint256"}],"name":"setBountyRewardPercent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"}],"name":"setDecimals","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newEMAPeriods","type":"uint256"}],"name":"setEMAPeriods","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newEMAValue","type":"uint256"}],"name":"setEMAValue","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newValue","type":"uint256"}],"name":"setGasUpperBound","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newRate","type":"uint256"}],"name":"setInterestFeePercent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newAddress","type":"address"}],"name":"setKyberContractAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_isManualTradingAllowed","type":"bool"}],"name":"setManualTradingAllowed","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newInitialMargin","type":"uint256"},{"name":"newMaintenanceMargin","type":"uint256"}],"name":"setMarginThresholds","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newValue","type":"uint256"}],"name":"setMinimumCollateralInEthAmount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newAddress","type":"address"}],"name":"setVaultContractAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newAddress","type":"address"}],"name":"setWethContractAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"},{"name":"loanTokenAddress","type":"address"},{"name":"positionTokenAddress","type":"address"},{"name":"collateralTokenAddress","type":"address"},{"name":"loanTokenAmount","type":"uint256"},{"name":"positionTokenAmount","type":"uint256"},{"name":"collateralTokenAmount","type":"uint256"},{"name":"maintenanceMarginAmount","type":"uint256"}],"name":"shouldLiquidate","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"throwOnGasRefundFail","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newBZxContractAddress","type":"address"}],"name":"transferBZxOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferEther","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"tokenAddress","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_vaultContract","type":"address"},{"name":"_kyberContract","type":"address"},{"name":"_wethContract","type":"address"},{"name":"_bZRxTokenContract","type":"address"}],"payable":true,"stateMutability":"payable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"constant":true,"inputs":[],"name":"vaultContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"loanTokenAddress","type":"address"},{"name":"positionTokenAddress","type":"address"},{"name":"collateralTokenAddress","type":"address"},{"name":"loanTokenAmount","type":"uint256"},{"name":"positionTokenAmount","type":"uint256"},{"name":"collateralTokenAmount","type":"uint256"},{"name":"maintenanceMarginAmount","type":"uint256"}],"name":"verifyAndLiquidate","outputs":[{"name":"destTokenAmount","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"wethContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}]}

/***/ }),
/* 60 */
/***/ (function(module, exports) {

module.exports = {"name":"BZxTo0x","address":"0x4dE93F5ea6F4f6B51fd6b2ab1aa87Ae09A4B6A74","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"previousBZxContract","type":"address"},{"indexed":true,"name":"newBZxContract","type":"address"}],"name":"BZxOwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"approveFor","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"payable":false,"stateMutability":"nonpayable","type":"fallback"},{"inputs":[{"name":"_exchange","type":"address"},{"name":"_zrxToken","type":"address"},{"name":"_proxy","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"constant":true,"inputs":[],"name":"bZxContractAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"exchangeContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"orderData0x","type":"bytes"}],"name":"getOrderValuesFromData","outputs":[{"name":"orderAddresses","type":"address[5][]"},{"name":"orderValues","type":"uint256[6][]"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"numerator","type":"uint256"},{"name":"denominator","type":"uint256"},{"name":"target","type":"uint256"}],"name":"getPartialAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"signatures","type":"bytes"}],"name":"getSignatureParts","outputs":[{"name":"vs","type":"uint8[]"},{"name":"rs","type":"bytes32[]"},{"name":"ss","type":"bytes32[]"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_exchange","type":"address"}],"name":"set0xExchange","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_proxy","type":"address"}],"name":"set0xTokenProxy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_zrxToken","type":"address"}],"name":"setZRXToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"trader","type":"address"},{"name":"vaultAddress","type":"address"},{"name":"sourceTokenAmountToUse","type":"uint256"},{"name":"orderData0x","type":"bytes"},{"name":"signature0x","type":"bytes"}],"name":"take0xTrade","outputs":[{"name":"destTokenAddress","type":"address"},{"name":"destTokenAmount","type":"uint256"},{"name":"sourceTokenUsedAmount","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"tokenTransferProxyContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newBZxContractAddress","type":"address"}],"name":"transferBZxOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"zrxTokenContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}]}

/***/ }),
/* 61 */
/***/ (function(module, exports) {

module.exports = {"name":"BZRxToken","address":"0xa890bBFFeA779FD4FF9d28469CfC8F2d35bC620d","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"burner","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newName","type":"string"},{"name":"_newSymbol","type":"string"}],"name":"renameToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 62 */
/***/ (function(module, exports) {

module.exports = {"name":"BZxVault","address":"0x964e318eD0E6812cc54CB1aB7bC27d32B5f7efFD","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"previousBZxContract","type":"address"},{"indexed":true,"name":"newBZxContract","type":"address"}],"name":"BZxOwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":true,"inputs":[],"name":"bZxContractAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"from","type":"address"},{"name":"tokenAmount","type":"uint256"}],"name":"depositToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"constant":false,"inputs":[{"name":"newBZxContractAddress","type":"address"}],"name":"transferBZxOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"tokenAmount","type":"uint256"}],"name":"transferTokenFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"withdrawEther","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"to","type":"address"},{"name":"tokenAmount","type":"uint256"}],"name":"withdrawToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 63 */
/***/ (function(module, exports) {

module.exports = {"name":"EIP20","address":"","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_who","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 64 */
/***/ (function(module, exports) {

module.exports = {"name":"OracleRegistry","address":"0x69449744Ea9e5c70dcE2e53A23244143a3Db74f6","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"oracle","type":"address"},{"indexed":false,"name":"name","type":"string"}],"name":"LogAddOracle","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"oracle","type":"address"},{"indexed":false,"name":"oldName","type":"string"},{"indexed":false,"name":"newName","type":"string"}],"name":"LogOracleNameChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"oracle","type":"address"},{"indexed":false,"name":"name","type":"string"}],"name":"LogRemoveOracle","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":false,"inputs":[{"name":"_oracle","type":"address"},{"name":"_name","type":"string"}],"name":"addOracle","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"string"}],"name":"getOracleAddressByName","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOracleAddresses","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"string"}],"name":"getOracleByName","outputs":[{"name":"","type":"address"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOracleList","outputs":[{"name":"","type":"address[]"},{"name":"","type":"uint256[]"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_oracle","type":"address"}],"name":"getOracleMetaData","outputs":[{"name":"","type":"address"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_oracle","type":"address"}],"name":"hasOracle","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"oracleAddresses","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"oracles","outputs":[{"name":"oracle","type":"address"},{"name":"name","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_oracle","type":"address"},{"name":"_index","type":"uint256"}],"name":"removeOracle","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_oracle","type":"address"},{"name":"_name","type":"string"}],"name":"setOracleName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 65 */
/***/ (function(module, exports) {

module.exports = {"name":"TokenRegistry","address":"0x0DdE47E34C50d9C1193a74A0E24f7C743431115D","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"token","type":"address"},{"indexed":false,"name":"name","type":"string"},{"indexed":false,"name":"symbol","type":"string"},{"indexed":false,"name":"decimals","type":"uint8"},{"indexed":false,"name":"url","type":"string"}],"name":"LogAddToken","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"token","type":"address"},{"indexed":false,"name":"name","type":"string"},{"indexed":false,"name":"symbol","type":"string"},{"indexed":false,"name":"decimals","type":"uint8"},{"indexed":false,"name":"url","type":"string"}],"name":"LogRemoveToken","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"token","type":"address"},{"indexed":false,"name":"oldName","type":"string"},{"indexed":false,"name":"newName","type":"string"}],"name":"LogTokenNameChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"token","type":"address"},{"indexed":false,"name":"oldSymbol","type":"string"},{"indexed":false,"name":"newSymbol","type":"string"}],"name":"LogTokenSymbolChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"token","type":"address"},{"indexed":false,"name":"oldURL","type":"string"},{"indexed":false,"name":"newURL","type":"string"}],"name":"LogTokenURLChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_name","type":"string"},{"name":"_symbol","type":"string"},{"name":"_decimals","type":"uint8"},{"name":"_url","type":"string"}],"name":"addToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"string"}],"name":"getTokenAddressByName","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_symbol","type":"string"}],"name":"getTokenAddressBySymbol","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTokenAddresses","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"string"}],"name":"getTokenByName","outputs":[{"name":"","type":"address"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"uint8"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_symbol","type":"string"}],"name":"getTokenBySymbol","outputs":[{"name":"","type":"address"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"uint8"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_token","type":"address"}],"name":"getTokenMetaData","outputs":[{"name":"","type":"address"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"uint8"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_index","type":"uint256"}],"name":"removeToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_name","type":"string"}],"name":"setTokenName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_symbol","type":"string"}],"name":"setTokenSymbol","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_url","type":"string"}],"name":"setTokenURL","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"tokenAddresses","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"tokens","outputs":[{"name":"token","type":"address"},{"name":"name","type":"string"},{"name":"symbol","type":"string"},{"name":"decimals","type":"uint8"},{"name":"url","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 66 */
/***/ (function(module, exports) {

module.exports = {"name":"OracleInterface","address":"","abi":[{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"borrower","type":"address"},{"name":"gasUsed","type":"uint256"}],"name":"didChangeCollateral","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"loanCloser","type":"address"},{"name":"isLiquidation","type":"bool"},{"name":"gasUsed","type":"uint256"}],"name":"didCloseLoan","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"borrower","type":"address"},{"name":"gasUsed","type":"uint256"}],"name":"didDepositCollateral","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"},{"name":"lender","type":"address"},{"name":"interestTokenAddress","type":"address"},{"name":"amountOwed","type":"uint256"},{"name":"convert","type":"bool"},{"name":"gasUsed","type":"uint256"}],"name":"didPayInterest","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"orderAddresses","type":"address[4]"},{"name":"orderAmounts","type":"uint256[4]"}],"name":"didTakeOrder","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"},{"name":"tradeTokenAddress","type":"address"},{"name":"tradeTokenAmount","type":"uint256"},{"name":"gasUsed","type":"uint256"}],"name":"didTradePosition","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"borrower","type":"address"},{"name":"gasUsed","type":"uint256"}],"name":"didWithdrawCollateral","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"borrower","type":"address"},{"name":"profitOrLoss","type":"uint256"},{"name":"gasUsed","type":"uint256"}],"name":"didWithdrawProfit","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"sourceTokenAddress","type":"address"},{"name":"destTokenAddress","type":"address"},{"name":"sourceTokenAmount","type":"uint256"}],"name":"doManualTrade","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"sourceTokenAddress","type":"address"},{"name":"destTokenAddress","type":"address"},{"name":"sourceTokenAmount","type":"uint256"}],"name":"doTrade","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"loanTokenAddress","type":"address"},{"name":"positionTokenAddress","type":"address"},{"name":"collateralTokenAddress","type":"address"},{"name":"loanTokenAmount","type":"uint256"},{"name":"positionTokenAmount","type":"uint256"},{"name":"collateralTokenAmount","type":"uint256"}],"name":"getCurrentMarginAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"positionTokenAddress","type":"address"},{"name":"loanTokenAddress","type":"address"},{"name":"positionTokenAmount","type":"uint256"},{"name":"loanTokenAmount","type":"uint256"}],"name":"getProfitOrLoss","outputs":[{"name":"isProfit","type":"bool"},{"name":"profitOrLoss","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"sourceTokenAddress","type":"address"},{"name":"destTokenAddress","type":"address"},{"name":"sourceTokenAmount","type":"uint256"}],"name":"getTradeData","outputs":[{"name":"sourceToDestRate","type":"uint256"},{"name":"destTokenAmount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"sourceTokenAddress","type":"address"},{"name":"destTokenAddress","type":"address"},{"name":"sourceTokenAmount","type":"uint256"}],"name":"isTradeSupported","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"collateralTokenAddress","type":"address"},{"name":"loanTokenAddress","type":"address"},{"name":"collateralTokenAmountUsable","type":"uint256"},{"name":"loanTokenAmountNeeded","type":"uint256"},{"name":"initialMarginAmount","type":"uint256"},{"name":"maintenanceMarginAmount","type":"uint256"},{"name":"isLiquidation","type":"bool"}],"name":"processCollateral","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"},{"name":"loanTokenAddress","type":"address"},{"name":"positionTokenAddress","type":"address"},{"name":"collateralTokenAddress","type":"address"},{"name":"loanTokenAmount","type":"uint256"},{"name":"positionTokenAmount","type":"uint256"},{"name":"collateralTokenAmount","type":"uint256"},{"name":"maintenanceMarginAmount","type":"uint256"}],"name":"shouldLiquidate","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"loanTokenAddress","type":"address"},{"name":"positionTokenAddress","type":"address"},{"name":"collateralTokenAddress","type":"address"},{"name":"loanTokenAmount","type":"uint256"},{"name":"positionTokenAmount","type":"uint256"},{"name":"collateralTokenAmount","type":"uint256"},{"name":"maintenanceMarginAmount","type":"uint256"}],"name":"verifyAndLiquidate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 67 */
/***/ (function(module, exports) {

module.exports = {"name":"TestNetFaucet","address":"0x3E8195d5e16d4096bF1689544AF42CC301842F5D","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"from","type":"address"},{"name":"tokenAmount","type":"uint256"}],"name":"depositToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"getToken","type":"address"},{"name":"receiver","type":"address"}],"name":"faucet","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"faucetThresholdSecs","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"faucetUsers","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"constant":true,"inputs":[],"name":"oracleContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"getToken","type":"address"},{"name":"receiver","type":"address"},{"name":"getTokenAmount","type":"uint256"}],"name":"oracleExchange","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newValue","type":"uint256"}],"name":"setFaucetThresholdSecs","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newAddress","type":"address"}],"name":"setOracleContractAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"tokenAmount","type":"uint256"}],"name":"transferTokenFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"withdrawEther","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"to","type":"address"},{"name":"tokenAmount","type":"uint256"}],"name":"withdrawToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 68 */
/***/ (function(module, exports) {

module.exports = {"name":"ZRXToken","address":"0xA8E9Fa8f91e5Ae138C74648c9C304F1C75003A8D","abi":[]}

/***/ }),
/* 69 */
/***/ (function(module, exports) {

module.exports = {"name":"WETH","address":"0xc778417E063141139Fce010982780140Aa0cD5Ab","abi":[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"}]}

/***/ }),
/* 70 */
/***/ (function(module, exports) {

module.exports = {"address":"0x4E9Aad8184DE8833365fEA970Cd9149372FDF1e6","abi":[]}

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BZx = __webpack_require__(72);

var _BZx2 = _interopRequireDefault(_BZx);

var _BZxOracle = __webpack_require__(73);

var _BZxOracle2 = _interopRequireDefault(_BZxOracle);

var _BZxTo0x = __webpack_require__(74);

var _BZxTo0x2 = _interopRequireDefault(_BZxTo0x);

var _BZRxToken = __webpack_require__(75);

var _BZRxToken2 = _interopRequireDefault(_BZRxToken);

var _BZxVault = __webpack_require__(76);

var _BZxVault2 = _interopRequireDefault(_BZxVault);

var _EIP = __webpack_require__(77);

var _EIP2 = _interopRequireDefault(_EIP);

var _OracleRegistry = __webpack_require__(78);

var _OracleRegistry2 = _interopRequireDefault(_OracleRegistry);

var _TokenRegistry = __webpack_require__(79);

var _TokenRegistry2 = _interopRequireDefault(_TokenRegistry);

var _OracleInterface = __webpack_require__(80);

var _OracleInterface2 = _interopRequireDefault(_OracleInterface);

var _TestNetFaucet = __webpack_require__(81);

var _TestNetFaucet2 = _interopRequireDefault(_TestNetFaucet);

var _ZRXToken = __webpack_require__(82);

var _ZRXToken2 = _interopRequireDefault(_ZRXToken);

var _WETH = __webpack_require__(83);

var _WETH2 = _interopRequireDefault(_WETH);

var _TokenTransferProxy = __webpack_require__(84);

var _TokenTransferProxy2 = _interopRequireDefault(_TokenTransferProxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  BZx: _BZx2.default,
  BZxOracle: _BZxOracle2.default,
  BZxTo0x: _BZxTo0x2.default,
  BZxToken: _BZRxToken2.default,
  BZxVault: _BZxVault2.default,
  EIP20: _EIP2.default,
  OracleRegistry: _OracleRegistry2.default,
  TokenRegistry: _TokenRegistry2.default,
  ZRXToken: _ZRXToken2.default,
  WETH: _WETH2.default,
  TokenTransferProxy: _TokenTransferProxy2.default,
  OracleInterface: _OracleInterface2.default,
  TestNetFaucet: _TestNetFaucet2.default
};

/***/ }),
/* 72 */
/***/ (function(module, exports) {

module.exports = {"name":"BZx","address":"0xBeAaC3F898ED7587AD8438A12fEfA5403e573176","abi":[{"constant":true,"inputs":[],"name":"DEBUG_MODE","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"maker","type":"address"},{"indexed":false,"name":"cancelLoanTokenAmount","type":"uint256"},{"indexed":false,"name":"remainingLoanTokenAmount","type":"uint256"},{"indexed":false,"name":"loanOrderHash","type":"bytes32"}],"name":"LogLoanCancelled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"lender","type":"address"},{"indexed":false,"name":"trader","type":"address"},{"indexed":false,"name":"isLiquidation","type":"bool"},{"indexed":false,"name":"loanOrderHash","type":"bytes32"}],"name":"LogLoanClosed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"lender","type":"address"},{"indexed":false,"name":"trader","type":"address"},{"indexed":false,"name":"collateralTokenAddressFilled","type":"address"},{"indexed":false,"name":"positionTokenAddressFilled","type":"address"},{"indexed":false,"name":"loanTokenAmountFilled","type":"uint256"},{"indexed":false,"name":"collateralTokenAmountFilled","type":"uint256"},{"indexed":false,"name":"positionTokenAmountFilled","type":"uint256"},{"indexed":false,"name":"loanStartUnixTimestampSec","type":"uint256"},{"indexed":false,"name":"active","type":"bool"},{"indexed":false,"name":"loanOrderHash","type":"bytes32"}],"name":"LogLoanTaken","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"loanOrderHash","type":"bytes32"},{"indexed":false,"name":"trader","type":"address"},{"indexed":false,"name":"initialMarginAmount","type":"uint256"},{"indexed":false,"name":"maintenanceMarginAmount","type":"uint256"},{"indexed":false,"name":"currentMarginAmount","type":"uint256"}],"name":"LogMarginLevels","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"loanOrderHash","type":"bytes32"},{"indexed":false,"name":"lender","type":"address"},{"indexed":false,"name":"trader","type":"address"},{"indexed":false,"name":"amountPaid","type":"uint256"},{"indexed":false,"name":"totalAccrued","type":"uint256"}],"name":"LogPayInterest","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"loanOrderHash","type":"bytes32"},{"indexed":false,"name":"trader","type":"address"},{"indexed":false,"name":"sourceTokenAddress","type":"address"},{"indexed":false,"name":"destTokenAddress","type":"address"},{"indexed":false,"name":"sourceTokenAmount","type":"uint256"},{"indexed":false,"name":"destTokenAmount","type":"uint256"}],"name":"LogPositionTraded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"loanOrderHash","type":"bytes32"},{"indexed":false,"name":"trader","type":"address"},{"indexed":false,"name":"profitWithdrawn","type":"uint256"},{"indexed":false,"name":"remainingPosition","type":"uint256"}],"name":"LogWithdrawProfit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":true,"inputs":[],"name":"bZRxTokenContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bZxTo0xContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"cancelLoanTokenAmount","type":"uint256"}],"name":"cancelLoanOrder","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"orderAddresses","type":"address[6]"},{"name":"orderValues","type":"uint256[9]"},{"name":"cancelLoanTokenAmount","type":"uint256"}],"name":"cancelLoanOrder","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"collateralTokenFilled","type":"address"}],"name":"changeCollateral","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"}],"name":"closeLoan","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"collateralTokenFilled","type":"address"},{"name":"depositAmount","type":"uint256"}],"name":"depositCollateral","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"forceCloanLoan","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"start","type":"uint256"},{"name":"count","type":"uint256"}],"name":"getActiveLoans","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanTokenAddress","type":"address"},{"name":"collateralTokenAddress","type":"address"},{"name":"oracleAddress","type":"address"},{"name":"loanTokenAmountFilled","type":"uint256"},{"name":"initialMarginAmount","type":"uint256"}],"name":"getInitialCollateralRequired","outputs":[{"name":"collateralTokenAmount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"getInterest","outputs":[{"name":"lender","type":"address"},{"name":"interestTokenAddress","type":"address"},{"name":"interestTotalAccrued","type":"uint256"},{"name":"interestPaidSoFar","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"orderAddresses","type":"address[6]"},{"name":"orderValues","type":"uint256[9]"}],"name":"getLoanOrderHash","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanParty","type":"address"},{"name":"count","type":"uint256"},{"name":"activeOnly","type":"bool"}],"name":"getLoansForLender","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanParty","type":"address"},{"name":"count","type":"uint256"},{"name":"activeOnly","type":"bool"}],"name":"getLoansForTrader","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"getMarginLevels","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanParty","type":"address"},{"name":"start","type":"uint256"},{"name":"count","type":"uint256"}],"name":"getOrders","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"getProfitOrLoss","outputs":[{"name":"isProfit","type":"bool"},{"name":"profitOrLoss","type":"uint256"},{"name":"positionTokenAddress","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"getSingleLoan","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"}],"name":"getSingleOrder","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"}],"name":"getUnavailableLoanTokenAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"}],"name":"interestPaid","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"signer","type":"address"},{"name":"hash","type":"bytes32"},{"name":"signature","type":"bytes"}],"name":"isValidSignature","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"liquidatePosition","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"loanList","outputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"}],"name":"loanPositions","outputs":[{"name":"lender","type":"address"},{"name":"trader","type":"address"},{"name":"collateralTokenAddressFilled","type":"address"},{"name":"positionTokenAddressFilled","type":"address"},{"name":"loanTokenAmountFilled","type":"uint256"},{"name":"collateralTokenAmountFilled","type":"uint256"},{"name":"positionTokenAmountFilled","type":"uint256"},{"name":"loanStartUnixTimestampSec","type":"uint256"},{"name":"index","type":"uint256"},{"name":"active","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"oracleAddresses","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"oracleRegistryContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"orderCancelledAmounts","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"orderFilledAmounts","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"orderLender","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"orderList","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"uint256"}],"name":"orderTraders","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"orders","outputs":[{"name":"maker","type":"address"},{"name":"loanTokenAddress","type":"address"},{"name":"interestTokenAddress","type":"address"},{"name":"collateralTokenAddress","type":"address"},{"name":"feeRecipientAddress","type":"address"},{"name":"oracleAddress","type":"address"},{"name":"loanTokenAmount","type":"uint256"},{"name":"interestAmount","type":"uint256"},{"name":"initialMarginAmount","type":"uint256"},{"name":"maintenanceMarginAmount","type":"uint256"},{"name":"lenderRelayFee","type":"uint256"},{"name":"traderRelayFee","type":"uint256"},{"name":"expirationUnixTimestampSec","type":"uint256"},{"name":"loanOrderHash","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"payInterest","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"shouldLiquidate","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"orderAddresses","type":"address[6]"},{"name":"orderValues","type":"uint256[9]"},{"name":"signature","type":"bytes"}],"name":"takeLoanOrderAsLender","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"orderAddresses","type":"address[6]"},{"name":"orderValues","type":"uint256[9]"},{"name":"collateralTokenFilled","type":"address"},{"name":"loanTokenAmountFilled","type":"uint256"},{"name":"signature","type":"bytes"}],"name":"takeLoanOrderAsTrader","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"orderData0x","type":"bytes"},{"name":"signature0x","type":"bytes"}],"name":"tradePositionWith0x","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"tradeTokenAddress","type":"address"}],"name":"tradePositionWithOracle","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"vaultContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"collateralTokenFilled","type":"address"},{"name":"withdrawAmount","type":"uint256"}],"name":"withdrawExcessCollateral","outputs":[{"name":"excessCollateral","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"}],"name":"withdrawProfit","outputs":[{"name":"profitAmount","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 73 */
/***/ (function(module, exports) {

module.exports = {"name":"BZxOracle","address":"0x70eCB85a94052278C350f74d319f101B317BfEa3","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"previousBZxContract","type":"address"},{"indexed":true,"name":"newBZxContract","type":"address"}],"name":"BZxOwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"payer","type":"address"},{"indexed":false,"name":"gasUsed","type":"uint256"},{"indexed":false,"name":"currentGasPrice","type":"uint256"},{"indexed":false,"name":"refundAmount","type":"uint256"},{"indexed":false,"name":"refundSuccess","type":"bool"}],"name":"GasRefund","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":true,"inputs":[],"name":"bZRxTokenContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bZxContractAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bountyRewardPercent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"didChangeCollateral","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"loanCloser","type":"address"},{"name":"isLiquidation","type":"bool"},{"name":"gasUsed","type":"uint256"}],"name":"didCloseLoan","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"didDepositCollateral","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"},{"name":"lender","type":"address"},{"name":"interestTokenAddress","type":"address"},{"name":"amountOwed","type":"uint256"},{"name":"convert","type":"bool"},{"name":"","type":"uint256"}],"name":"didPayInterest","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"taker","type":"address"},{"name":"gasUsed","type":"uint256"}],"name":"didTakeOrder","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"name":"didTradePosition","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"didWithdrawCollateral","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"name":"didWithdrawProfit","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"sourceTokenAddress","type":"address"},{"name":"destTokenAddress","type":"address"},{"name":"sourceTokenAmount","type":"uint256"}],"name":"doManualTrade","outputs":[{"name":"destTokenAmount","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"sourceTokenAddress","type":"address"},{"name":"destTokenAddress","type":"address"},{"name":"sourceTokenAmount","type":"uint256"}],"name":"doTrade","outputs":[{"name":"destTokenAmount","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"collateralTokenAddress","type":"address"},{"name":"loanTokenAddress","type":"address"},{"name":"collateralTokenAmountUsable","type":"uint256"},{"name":"loanTokenAmountNeeded","type":"uint256"},{"name":"initialMarginAmount","type":"uint256"},{"name":"maintenanceMarginAmount","type":"uint256"}],"name":"doTradeofCollateral","outputs":[{"name":"loanTokenAmountCovered","type":"uint256"},{"name":"collateralTokenAmountUsed","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"emaPeriods","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"emaValue","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"uint256"}],"name":"gasRefunds","outputs":[{"name":"payer","type":"address"},{"name":"gasUsed","type":"uint256"},{"name":"isPaid","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"gasRewardPercent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanTokenAddress","type":"address"},{"name":"positionTokenAddress","type":"address"},{"name":"collateralTokenAddress","type":"address"},{"name":"loanTokenAmount","type":"uint256"},{"name":"positionTokenAmount","type":"uint256"},{"name":"collateralTokenAmount","type":"uint256"}],"name":"getCurrentMarginAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"positionTokenAddress","type":"address"},{"name":"loanTokenAddress","type":"address"},{"name":"positionTokenAmount","type":"uint256"},{"name":"loanTokenAmount","type":"uint256"}],"name":"getProfitOrLoss","outputs":[{"name":"isProfit","type":"bool"},{"name":"profitOrLoss","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"sourceTokenAddress","type":"address"},{"name":"destTokenAddress","type":"address"}],"name":"getTradeRate","outputs":[{"name":"rate","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"interestFeePercent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isManualTradingAllowed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"sourceTokenAddress","type":"address"},{"name":"destTokenAddress","type":"address"},{"name":"sourceTokenAmount","type":"uint256"}],"name":"isTradeSupported","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"kyberContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"liquidationThresholdPercent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"minInitialMarginAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"minMaintenanceMarginAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newAddress","type":"address"}],"name":"setBZRxTokenContractAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newValue","type":"uint256"}],"name":"setBountyRewardPercent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newEMAPeriods","type":"uint256"}],"name":"setEMAPeriods","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newValue","type":"uint256"}],"name":"setGasRewardPercent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newRate","type":"uint256"}],"name":"setInterestFeePercent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newAddress","type":"address"}],"name":"setKyberContractAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newValue","type":"uint256"}],"name":"setLiquidationThresholdPercent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_isManualTradingAllowed","type":"bool"}],"name":"setManualTradingAllowed","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newInitialMargin","type":"uint256"},{"name":"newMaintenanceMargin","type":"uint256"}],"name":"setMarginThresholds","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newAddress","type":"address"}],"name":"setVaultContractAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newAddress","type":"address"}],"name":"setWethContractAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"},{"name":"loanTokenAddress","type":"address"},{"name":"positionTokenAddress","type":"address"},{"name":"collateralTokenAddress","type":"address"},{"name":"loanTokenAmount","type":"uint256"},{"name":"positionTokenAmount","type":"uint256"},{"name":"collateralTokenAmount","type":"uint256"},{"name":"maintenanceMarginAmount","type":"uint256"}],"name":"shouldLiquidate","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"throwOnGasRefundFail","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newBZxContractAddress","type":"address"}],"name":"transferBZxOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferEther","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_vaultContract","type":"address"},{"name":"_kyberContract","type":"address"},{"name":"_wethContract","type":"address"},{"name":"_bZRxTokenContract","type":"address"}],"payable":true,"stateMutability":"payable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"constant":false,"inputs":[{"name":"tokenAddress","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"vaultContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"loanTokenAddress","type":"address"},{"name":"positionTokenAddress","type":"address"},{"name":"collateralTokenAddress","type":"address"},{"name":"loanTokenAmount","type":"uint256"},{"name":"positionTokenAmount","type":"uint256"},{"name":"collateralTokenAmount","type":"uint256"},{"name":"maintenanceMarginAmount","type":"uint256"}],"name":"verifyAndLiquidate","outputs":[{"name":"destTokenAmount","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"wethContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}]}

/***/ }),
/* 74 */
/***/ (function(module, exports) {

module.exports = {"name":"BZxTo0x","address":"0xB001b83d571539649Ce1D61f114Ce2055F255d0E","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"previousBZxContract","type":"address"},{"indexed":true,"name":"newBZxContract","type":"address"}],"name":"BZxOwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"approveFor","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"payable":false,"stateMutability":"nonpayable","type":"fallback"},{"inputs":[{"name":"_exchange","type":"address"},{"name":"_zrxToken","type":"address"},{"name":"_proxy","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"constant":true,"inputs":[],"name":"bZxContractAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"exchangeContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"orderData0x","type":"bytes"}],"name":"getOrderValuesFromData","outputs":[{"name":"orderAddresses","type":"address[5][]"},{"name":"orderValues","type":"uint256[6][]"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"numerator","type":"uint256"},{"name":"denominator","type":"uint256"},{"name":"target","type":"uint256"}],"name":"getPartialAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"signatures","type":"bytes"}],"name":"getSignatureParts","outputs":[{"name":"vs","type":"uint8[]"},{"name":"rs","type":"bytes32[]"},{"name":"ss","type":"bytes32[]"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_exchange","type":"address"}],"name":"set0xExchange","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_proxy","type":"address"}],"name":"set0xTokenProxy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_zrxToken","type":"address"}],"name":"setZRXToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"trader","type":"address"},{"name":"vaultAddress","type":"address"},{"name":"sourceTokenAmountToUse","type":"uint256"},{"name":"orderData0x","type":"bytes"},{"name":"signature0x","type":"bytes"}],"name":"take0xTrade","outputs":[{"name":"destTokenAddress","type":"address"},{"name":"destTokenAmount","type":"uint256"},{"name":"sourceTokenUsedAmount","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"tokenTransferProxyContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newBZxContractAddress","type":"address"}],"name":"transferBZxOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"zrxTokenContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}]}

/***/ }),
/* 75 */
/***/ (function(module, exports) {

module.exports = {"name":"BZRxToken","address":"0xa890bBFFeA779FD4FF9d28469CfC8F2d35bC620d","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"burner","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"decreaseApprovalAndCall","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"increaseApprovalAndCall","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newName","type":"string"},{"name":"_newSymbol","type":"string"}],"name":"renameToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"transferAndCall","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"transferFromAndCall","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 76 */
/***/ (function(module, exports) {

module.exports = {"name":"BZxVault","address":"0xa35A5a8Fe271ac81D5AA7FE8B1503d6a15fdC675","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"previousBZxContract","type":"address"},{"indexed":true,"name":"newBZxContract","type":"address"}],"name":"BZxOwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":true,"inputs":[],"name":"bZxContractAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"from","type":"address"},{"name":"tokenAmount","type":"uint256"}],"name":"depositToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"constant":false,"inputs":[{"name":"newBZxContractAddress","type":"address"}],"name":"transferBZxOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"tokenAmount","type":"uint256"}],"name":"transferTokenFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"withdrawEther","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"to","type":"address"},{"name":"tokenAmount","type":"uint256"}],"name":"withdrawToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 77 */
/***/ (function(module, exports) {

module.exports = {"name":"EIP20","address":"","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 78 */
/***/ (function(module, exports) {

module.exports = {"name":"OracleRegistry","address":"0x3B4cE1786146CB10681a4B2595802ae27a6e6543","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"oracle","type":"address"},{"indexed":false,"name":"name","type":"string"}],"name":"LogAddOracle","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"oracle","type":"address"},{"indexed":false,"name":"oldName","type":"string"},{"indexed":false,"name":"newName","type":"string"}],"name":"LogOracleNameChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"oracle","type":"address"},{"indexed":false,"name":"name","type":"string"}],"name":"LogRemoveOracle","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":false,"inputs":[{"name":"_oracle","type":"address"},{"name":"_name","type":"string"}],"name":"addOracle","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"string"}],"name":"getOracleAddressByName","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOracleAddresses","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"string"}],"name":"getOracleByName","outputs":[{"name":"","type":"address"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOracleList","outputs":[{"name":"","type":"address[]"},{"name":"","type":"uint256[]"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_oracle","type":"address"}],"name":"getOracleMetaData","outputs":[{"name":"","type":"address"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_oracle","type":"address"}],"name":"hasOracle","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"oracleAddresses","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"oracles","outputs":[{"name":"oracle","type":"address"},{"name":"name","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_oracle","type":"address"},{"name":"_index","type":"uint256"}],"name":"removeOracle","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_oracle","type":"address"},{"name":"_name","type":"string"}],"name":"setOracleName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 79 */
/***/ (function(module, exports) {

module.exports = {"name":"TokenRegistry","address":"0x0DdE47E34C50d9C1193a74A0E24f7C743431115D","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"token","type":"address"},{"indexed":false,"name":"name","type":"string"},{"indexed":false,"name":"symbol","type":"string"},{"indexed":false,"name":"decimals","type":"uint8"},{"indexed":false,"name":"url","type":"string"}],"name":"LogAddToken","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"token","type":"address"},{"indexed":false,"name":"name","type":"string"},{"indexed":false,"name":"symbol","type":"string"},{"indexed":false,"name":"decimals","type":"uint8"},{"indexed":false,"name":"url","type":"string"}],"name":"LogRemoveToken","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"token","type":"address"},{"indexed":false,"name":"oldName","type":"string"},{"indexed":false,"name":"newName","type":"string"}],"name":"LogTokenNameChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"token","type":"address"},{"indexed":false,"name":"oldSymbol","type":"string"},{"indexed":false,"name":"newSymbol","type":"string"}],"name":"LogTokenSymbolChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"token","type":"address"},{"indexed":false,"name":"oldURL","type":"string"},{"indexed":false,"name":"newURL","type":"string"}],"name":"LogTokenURLChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_name","type":"string"},{"name":"_symbol","type":"string"},{"name":"_decimals","type":"uint8"},{"name":"_url","type":"string"}],"name":"addToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"string"}],"name":"getTokenAddressByName","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_symbol","type":"string"}],"name":"getTokenAddressBySymbol","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTokenAddresses","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"string"}],"name":"getTokenByName","outputs":[{"name":"","type":"address"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"uint8"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_symbol","type":"string"}],"name":"getTokenBySymbol","outputs":[{"name":"","type":"address"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"uint8"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_token","type":"address"}],"name":"getTokenMetaData","outputs":[{"name":"","type":"address"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"uint8"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_index","type":"uint256"}],"name":"removeToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_name","type":"string"}],"name":"setTokenName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_symbol","type":"string"}],"name":"setTokenSymbol","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_url","type":"string"}],"name":"setTokenURL","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"tokenAddresses","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"tokens","outputs":[{"name":"token","type":"address"},{"name":"name","type":"string"},{"name":"symbol","type":"string"},{"name":"decimals","type":"uint8"},{"name":"url","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 80 */
/***/ (function(module, exports) {

module.exports = {"name":"OracleInterface","address":"","abi":[{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"borrower","type":"address"},{"name":"gasUsed","type":"uint256"}],"name":"didChangeCollateral","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"loanCloser","type":"address"},{"name":"isLiquidation","type":"bool"},{"name":"gasUsed","type":"uint256"}],"name":"didCloseLoan","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"borrower","type":"address"},{"name":"gasUsed","type":"uint256"}],"name":"didDepositCollateral","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"},{"name":"lender","type":"address"},{"name":"interestTokenAddress","type":"address"},{"name":"amountOwed","type":"uint256"},{"name":"convert","type":"bool"},{"name":"gasUsed","type":"uint256"}],"name":"didPayInterest","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"taker","type":"address"},{"name":"gasUsed","type":"uint256"}],"name":"didTakeOrder","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"},{"name":"tradeTokenAddress","type":"address"},{"name":"tradeTokenAmount","type":"uint256"},{"name":"gasUsed","type":"uint256"}],"name":"didTradePosition","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"borrower","type":"address"},{"name":"gasUsed","type":"uint256"}],"name":"didWithdrawCollateral","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"borrower","type":"address"},{"name":"profitOrLoss","type":"uint256"},{"name":"gasUsed","type":"uint256"}],"name":"didWithdrawProfit","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"sourceTokenAddress","type":"address"},{"name":"destTokenAddress","type":"address"},{"name":"sourceTokenAmount","type":"uint256"}],"name":"doManualTrade","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"sourceTokenAddress","type":"address"},{"name":"destTokenAddress","type":"address"},{"name":"sourceTokenAmount","type":"uint256"}],"name":"doTrade","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"collateralTokenAddress","type":"address"},{"name":"loanTokenAddress","type":"address"},{"name":"collateralTokenAmountUsable","type":"uint256"},{"name":"loanTokenAmountNeeded","type":"uint256"},{"name":"initialMarginAmount","type":"uint256"},{"name":"maintenanceMarginAmount","type":"uint256"}],"name":"doTradeofCollateral","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"loanTokenAddress","type":"address"},{"name":"positionTokenAddress","type":"address"},{"name":"collateralTokenAddress","type":"address"},{"name":"loanTokenAmount","type":"uint256"},{"name":"positionTokenAmount","type":"uint256"},{"name":"collateralTokenAmount","type":"uint256"}],"name":"getCurrentMarginAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"positionTokenAddress","type":"address"},{"name":"loanTokenAddress","type":"address"},{"name":"positionTokenAmount","type":"uint256"},{"name":"loanTokenAmount","type":"uint256"}],"name":"getProfitOrLoss","outputs":[{"name":"isProfit","type":"bool"},{"name":"profitOrLoss","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"sourceTokenAddress","type":"address"},{"name":"destTokenAddress","type":"address"}],"name":"getTradeRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"sourceTokenAddress","type":"address"},{"name":"destTokenAddress","type":"address"},{"name":"sourceTokenAmount","type":"uint256"}],"name":"isTradeSupported","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"},{"name":"loanTokenAddress","type":"address"},{"name":"positionTokenAddress","type":"address"},{"name":"collateralTokenAddress","type":"address"},{"name":"loanTokenAmount","type":"uint256"},{"name":"positionTokenAmount","type":"uint256"},{"name":"collateralTokenAmount","type":"uint256"},{"name":"maintenanceMarginAmount","type":"uint256"}],"name":"shouldLiquidate","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"loanTokenAddress","type":"address"},{"name":"positionTokenAddress","type":"address"},{"name":"collateralTokenAddress","type":"address"},{"name":"loanTokenAmount","type":"uint256"},{"name":"positionTokenAmount","type":"uint256"},{"name":"collateralTokenAmount","type":"uint256"},{"name":"maintenanceMarginAmount","type":"uint256"}],"name":"verifyAndLiquidate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 81 */
/***/ (function(module, exports) {

module.exports = {"name":"TestNetFaucet","address":"0x3E8195d5e16d4096bF1689544AF42CC301842F5D","abi":[{"constant":true,"inputs":[],"name":"ORACLE_CONTRACT","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"from","type":"address"},{"name":"tokenAmount","type":"uint256"}],"name":"depositToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"getToken","type":"address"},{"name":"receiver","type":"address"}],"name":"faucet","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"faucetThresholdSecs","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"faucetUsers","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"getToken","type":"address"},{"name":"receiver","type":"address"},{"name":"getTokenAmount","type":"uint256"}],"name":"oracleExchange","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newValue","type":"uint256"}],"name":"setFaucetThresholdSecs","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newAddress","type":"address"}],"name":"setOracleContractAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"tokenAmount","type":"uint256"}],"name":"transferTokenFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"withdrawEther","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"to","type":"address"},{"name":"tokenAmount","type":"uint256"}],"name":"withdrawToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 82 */
/***/ (function(module, exports) {

module.exports = {"name":"ZRXToken","address":"0xA8E9Fa8f91e5Ae138C74648c9C304F1C75003A8D","abi":[]}

/***/ }),
/* 83 */
/***/ (function(module, exports) {

module.exports = {"name":"WETH","address":"0xc778417E063141139Fce010982780140Aa0cD5Ab","abi":[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"}]}

/***/ }),
/* 84 */
/***/ (function(module, exports) {

module.exports = {"address":"0x4E9Aad8184DE8833365fEA970Cd9149372FDF1e6","abi":[]}

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BZx = __webpack_require__(86);

var _BZx2 = _interopRequireDefault(_BZx);

var _BZxOracle = __webpack_require__(87);

var _BZxOracle2 = _interopRequireDefault(_BZxOracle);

var _BZxTo0x = __webpack_require__(88);

var _BZxTo0x2 = _interopRequireDefault(_BZxTo0x);

var _BZRxToken = __webpack_require__(89);

var _BZRxToken2 = _interopRequireDefault(_BZRxToken);

var _BZxVault = __webpack_require__(90);

var _BZxVault2 = _interopRequireDefault(_BZxVault);

var _EIP = __webpack_require__(91);

var _EIP2 = _interopRequireDefault(_EIP);

var _OracleRegistry = __webpack_require__(92);

var _OracleRegistry2 = _interopRequireDefault(_OracleRegistry);

var _TokenRegistry = __webpack_require__(93);

var _TokenRegistry2 = _interopRequireDefault(_TokenRegistry);

var _OracleInterface = __webpack_require__(94);

var _OracleInterface2 = _interopRequireDefault(_OracleInterface);

var _TestNetFaucet = __webpack_require__(95);

var _TestNetFaucet2 = _interopRequireDefault(_TestNetFaucet);

var _ZRXToken = __webpack_require__(96);

var _ZRXToken2 = _interopRequireDefault(_ZRXToken);

var _WETH = __webpack_require__(97);

var _WETH2 = _interopRequireDefault(_WETH);

var _TokenTransferProxy = __webpack_require__(98);

var _TokenTransferProxy2 = _interopRequireDefault(_TokenTransferProxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  BZx: _BZx2.default,
  BZxOracle: _BZxOracle2.default,
  BZxTo0x: _BZxTo0x2.default,
  BZxToken: _BZRxToken2.default,
  BZxVault: _BZxVault2.default,
  EIP20: _EIP2.default,
  OracleRegistry: _OracleRegistry2.default,
  TokenRegistry: _TokenRegistry2.default,
  ZRXToken: _ZRXToken2.default,
  WETH: _WETH2.default,
  TokenTransferProxy: _TokenTransferProxy2.default,
  OracleInterface: _OracleInterface2.default,
  TestNetFaucet: _TestNetFaucet2.default
};

/***/ }),
/* 86 */
/***/ (function(module, exports) {

module.exports = {"name":"BZx","address":"0xBeAaC3F898ED7587AD8438A12fEfA5403e573176","abi":[{"constant":true,"inputs":[],"name":"DEBUG_MODE","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"maker","type":"address"},{"indexed":false,"name":"cancelLoanTokenAmount","type":"uint256"},{"indexed":false,"name":"remainingLoanTokenAmount","type":"uint256"},{"indexed":false,"name":"loanOrderHash","type":"bytes32"}],"name":"LogLoanCancelled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"lender","type":"address"},{"indexed":false,"name":"trader","type":"address"},{"indexed":false,"name":"isLiquidation","type":"bool"},{"indexed":false,"name":"loanOrderHash","type":"bytes32"}],"name":"LogLoanClosed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"lender","type":"address"},{"indexed":false,"name":"trader","type":"address"},{"indexed":false,"name":"collateralTokenAddressFilled","type":"address"},{"indexed":false,"name":"positionTokenAddressFilled","type":"address"},{"indexed":false,"name":"loanTokenAmountFilled","type":"uint256"},{"indexed":false,"name":"collateralTokenAmountFilled","type":"uint256"},{"indexed":false,"name":"positionTokenAmountFilled","type":"uint256"},{"indexed":false,"name":"loanStartUnixTimestampSec","type":"uint256"},{"indexed":false,"name":"active","type":"bool"},{"indexed":false,"name":"loanOrderHash","type":"bytes32"}],"name":"LogLoanTaken","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"loanOrderHash","type":"bytes32"},{"indexed":false,"name":"trader","type":"address"},{"indexed":false,"name":"initialMarginAmount","type":"uint256"},{"indexed":false,"name":"maintenanceMarginAmount","type":"uint256"},{"indexed":false,"name":"currentMarginAmount","type":"uint256"}],"name":"LogMarginLevels","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"loanOrderHash","type":"bytes32"},{"indexed":false,"name":"lender","type":"address"},{"indexed":false,"name":"trader","type":"address"},{"indexed":false,"name":"amountPaid","type":"uint256"},{"indexed":false,"name":"totalAccrued","type":"uint256"}],"name":"LogPayInterest","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"loanOrderHash","type":"bytes32"},{"indexed":false,"name":"trader","type":"address"},{"indexed":false,"name":"sourceTokenAddress","type":"address"},{"indexed":false,"name":"destTokenAddress","type":"address"},{"indexed":false,"name":"sourceTokenAmount","type":"uint256"},{"indexed":false,"name":"destTokenAmount","type":"uint256"}],"name":"LogPositionTraded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"loanOrderHash","type":"bytes32"},{"indexed":false,"name":"trader","type":"address"},{"indexed":false,"name":"profitWithdrawn","type":"uint256"},{"indexed":false,"name":"remainingPosition","type":"uint256"}],"name":"LogWithdrawProfit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":true,"inputs":[],"name":"bZRxTokenContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bZxTo0xContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"cancelLoanTokenAmount","type":"uint256"}],"name":"cancelLoanOrder","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"orderAddresses","type":"address[6]"},{"name":"orderValues","type":"uint256[9]"},{"name":"cancelLoanTokenAmount","type":"uint256"}],"name":"cancelLoanOrder","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"collateralTokenFilled","type":"address"}],"name":"changeCollateral","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"}],"name":"closeLoan","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"collateralTokenFilled","type":"address"},{"name":"depositAmount","type":"uint256"}],"name":"depositCollateral","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"forceCloanLoan","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"start","type":"uint256"},{"name":"count","type":"uint256"}],"name":"getActiveLoans","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanTokenAddress","type":"address"},{"name":"collateralTokenAddress","type":"address"},{"name":"oracleAddress","type":"address"},{"name":"loanTokenAmountFilled","type":"uint256"},{"name":"initialMarginAmount","type":"uint256"}],"name":"getInitialCollateralRequired","outputs":[{"name":"collateralTokenAmount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"getInterest","outputs":[{"name":"lender","type":"address"},{"name":"interestTokenAddress","type":"address"},{"name":"interestTotalAccrued","type":"uint256"},{"name":"interestPaidSoFar","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"orderAddresses","type":"address[6]"},{"name":"orderValues","type":"uint256[9]"}],"name":"getLoanOrderHash","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanParty","type":"address"},{"name":"count","type":"uint256"},{"name":"activeOnly","type":"bool"}],"name":"getLoansForLender","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanParty","type":"address"},{"name":"count","type":"uint256"},{"name":"activeOnly","type":"bool"}],"name":"getLoansForTrader","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"getMarginLevels","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanParty","type":"address"},{"name":"start","type":"uint256"},{"name":"count","type":"uint256"}],"name":"getOrders","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"getProfitOrLoss","outputs":[{"name":"isProfit","type":"bool"},{"name":"profitOrLoss","type":"uint256"},{"name":"positionTokenAddress","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"getSingleLoan","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"}],"name":"getSingleOrder","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"}],"name":"getUnavailableLoanTokenAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"}],"name":"interestPaid","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"signer","type":"address"},{"name":"hash","type":"bytes32"},{"name":"signature","type":"bytes"}],"name":"isValidSignature","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"liquidatePosition","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"loanList","outputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"}],"name":"loanPositions","outputs":[{"name":"lender","type":"address"},{"name":"trader","type":"address"},{"name":"collateralTokenAddressFilled","type":"address"},{"name":"positionTokenAddressFilled","type":"address"},{"name":"loanTokenAmountFilled","type":"uint256"},{"name":"collateralTokenAmountFilled","type":"uint256"},{"name":"positionTokenAmountFilled","type":"uint256"},{"name":"loanStartUnixTimestampSec","type":"uint256"},{"name":"index","type":"uint256"},{"name":"active","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"oracleAddresses","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"oracleRegistryContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"orderCancelledAmounts","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"orderFilledAmounts","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"orderLender","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"orderList","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"uint256"}],"name":"orderTraders","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"orders","outputs":[{"name":"maker","type":"address"},{"name":"loanTokenAddress","type":"address"},{"name":"interestTokenAddress","type":"address"},{"name":"collateralTokenAddress","type":"address"},{"name":"feeRecipientAddress","type":"address"},{"name":"oracleAddress","type":"address"},{"name":"loanTokenAmount","type":"uint256"},{"name":"interestAmount","type":"uint256"},{"name":"initialMarginAmount","type":"uint256"},{"name":"maintenanceMarginAmount","type":"uint256"},{"name":"lenderRelayFee","type":"uint256"},{"name":"traderRelayFee","type":"uint256"},{"name":"expirationUnixTimestampSec","type":"uint256"},{"name":"loanOrderHash","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"payInterest","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"}],"name":"shouldLiquidate","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"orderAddresses","type":"address[6]"},{"name":"orderValues","type":"uint256[9]"},{"name":"signature","type":"bytes"}],"name":"takeLoanOrderAsLender","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"orderAddresses","type":"address[6]"},{"name":"orderValues","type":"uint256[9]"},{"name":"collateralTokenFilled","type":"address"},{"name":"loanTokenAmountFilled","type":"uint256"},{"name":"signature","type":"bytes"}],"name":"takeLoanOrderAsTrader","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"orderData0x","type":"bytes"},{"name":"signature0x","type":"bytes"}],"name":"tradePositionWith0x","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"tradeTokenAddress","type":"address"}],"name":"tradePositionWithOracle","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"vaultContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"collateralTokenFilled","type":"address"},{"name":"withdrawAmount","type":"uint256"}],"name":"withdrawExcessCollateral","outputs":[{"name":"excessCollateral","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"}],"name":"withdrawProfit","outputs":[{"name":"profitAmount","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 87 */
/***/ (function(module, exports) {

module.exports = {"name":"BZxOracle","address":"0x70eCB85a94052278C350f74d319f101B317BfEa3","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"previousBZxContract","type":"address"},{"indexed":true,"name":"newBZxContract","type":"address"}],"name":"BZxOwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"payer","type":"address"},{"indexed":false,"name":"gasUsed","type":"uint256"},{"indexed":false,"name":"currentGasPrice","type":"uint256"},{"indexed":false,"name":"refundAmount","type":"uint256"},{"indexed":false,"name":"refundSuccess","type":"bool"}],"name":"GasRefund","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":true,"inputs":[],"name":"bZRxTokenContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bZxContractAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bountyRewardPercent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"didChangeCollateral","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"loanCloser","type":"address"},{"name":"isLiquidation","type":"bool"},{"name":"gasUsed","type":"uint256"}],"name":"didCloseLoan","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"didDepositCollateral","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"},{"name":"lender","type":"address"},{"name":"interestTokenAddress","type":"address"},{"name":"amountOwed","type":"uint256"},{"name":"convert","type":"bool"},{"name":"","type":"uint256"}],"name":"didPayInterest","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"taker","type":"address"},{"name":"gasUsed","type":"uint256"}],"name":"didTakeOrder","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"name":"didTradePosition","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"didWithdrawCollateral","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"name":"didWithdrawProfit","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"sourceTokenAddress","type":"address"},{"name":"destTokenAddress","type":"address"},{"name":"sourceTokenAmount","type":"uint256"}],"name":"doManualTrade","outputs":[{"name":"destTokenAmount","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"sourceTokenAddress","type":"address"},{"name":"destTokenAddress","type":"address"},{"name":"sourceTokenAmount","type":"uint256"}],"name":"doTrade","outputs":[{"name":"destTokenAmount","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"collateralTokenAddress","type":"address"},{"name":"loanTokenAddress","type":"address"},{"name":"collateralTokenAmountUsable","type":"uint256"},{"name":"loanTokenAmountNeeded","type":"uint256"},{"name":"initialMarginAmount","type":"uint256"},{"name":"maintenanceMarginAmount","type":"uint256"}],"name":"doTradeofCollateral","outputs":[{"name":"loanTokenAmountCovered","type":"uint256"},{"name":"collateralTokenAmountUsed","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"emaPeriods","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"emaValue","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"uint256"}],"name":"gasRefunds","outputs":[{"name":"payer","type":"address"},{"name":"gasUsed","type":"uint256"},{"name":"isPaid","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"gasRewardPercent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanTokenAddress","type":"address"},{"name":"positionTokenAddress","type":"address"},{"name":"collateralTokenAddress","type":"address"},{"name":"loanTokenAmount","type":"uint256"},{"name":"positionTokenAmount","type":"uint256"},{"name":"collateralTokenAmount","type":"uint256"}],"name":"getCurrentMarginAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"positionTokenAddress","type":"address"},{"name":"loanTokenAddress","type":"address"},{"name":"positionTokenAmount","type":"uint256"},{"name":"loanTokenAmount","type":"uint256"}],"name":"getProfitOrLoss","outputs":[{"name":"isProfit","type":"bool"},{"name":"profitOrLoss","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"sourceTokenAddress","type":"address"},{"name":"destTokenAddress","type":"address"}],"name":"getTradeRate","outputs":[{"name":"rate","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"interestFeePercent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isManualTradingAllowed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"sourceTokenAddress","type":"address"},{"name":"destTokenAddress","type":"address"},{"name":"sourceTokenAmount","type":"uint256"}],"name":"isTradeSupported","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"kyberContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"liquidationThresholdPercent","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"minInitialMarginAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"minMaintenanceMarginAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newAddress","type":"address"}],"name":"setBZRxTokenContractAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newValue","type":"uint256"}],"name":"setBountyRewardPercent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newEMAPeriods","type":"uint256"}],"name":"setEMAPeriods","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newValue","type":"uint256"}],"name":"setGasRewardPercent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newRate","type":"uint256"}],"name":"setInterestFeePercent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newAddress","type":"address"}],"name":"setKyberContractAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newValue","type":"uint256"}],"name":"setLiquidationThresholdPercent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_isManualTradingAllowed","type":"bool"}],"name":"setManualTradingAllowed","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newInitialMargin","type":"uint256"},{"name":"newMaintenanceMargin","type":"uint256"}],"name":"setMarginThresholds","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newAddress","type":"address"}],"name":"setVaultContractAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newAddress","type":"address"}],"name":"setWethContractAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"},{"name":"","type":"address"},{"name":"loanTokenAddress","type":"address"},{"name":"positionTokenAddress","type":"address"},{"name":"collateralTokenAddress","type":"address"},{"name":"loanTokenAmount","type":"uint256"},{"name":"positionTokenAmount","type":"uint256"},{"name":"collateralTokenAmount","type":"uint256"},{"name":"maintenanceMarginAmount","type":"uint256"}],"name":"shouldLiquidate","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"throwOnGasRefundFail","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newBZxContractAddress","type":"address"}],"name":"transferBZxOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferEther","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_vaultContract","type":"address"},{"name":"_kyberContract","type":"address"},{"name":"_wethContract","type":"address"},{"name":"_bZRxTokenContract","type":"address"}],"payable":true,"stateMutability":"payable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"constant":false,"inputs":[{"name":"tokenAddress","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"vaultContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"loanTokenAddress","type":"address"},{"name":"positionTokenAddress","type":"address"},{"name":"collateralTokenAddress","type":"address"},{"name":"loanTokenAmount","type":"uint256"},{"name":"positionTokenAmount","type":"uint256"},{"name":"collateralTokenAmount","type":"uint256"},{"name":"maintenanceMarginAmount","type":"uint256"}],"name":"verifyAndLiquidate","outputs":[{"name":"destTokenAmount","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"wethContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}]}

/***/ }),
/* 88 */
/***/ (function(module, exports) {

module.exports = {"name":"BZxTo0x","address":"0xB001b83d571539649Ce1D61f114Ce2055F255d0E","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"previousBZxContract","type":"address"},{"indexed":true,"name":"newBZxContract","type":"address"}],"name":"BZxOwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"approveFor","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"payable":false,"stateMutability":"nonpayable","type":"fallback"},{"inputs":[{"name":"_exchange","type":"address"},{"name":"_zrxToken","type":"address"},{"name":"_proxy","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"constant":true,"inputs":[],"name":"bZxContractAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"exchangeContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"orderData0x","type":"bytes"}],"name":"getOrderValuesFromData","outputs":[{"name":"orderAddresses","type":"address[5][]"},{"name":"orderValues","type":"uint256[6][]"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"numerator","type":"uint256"},{"name":"denominator","type":"uint256"},{"name":"target","type":"uint256"}],"name":"getPartialAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"signatures","type":"bytes"}],"name":"getSignatureParts","outputs":[{"name":"vs","type":"uint8[]"},{"name":"rs","type":"bytes32[]"},{"name":"ss","type":"bytes32[]"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_exchange","type":"address"}],"name":"set0xExchange","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_proxy","type":"address"}],"name":"set0xTokenProxy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_zrxToken","type":"address"}],"name":"setZRXToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"trader","type":"address"},{"name":"vaultAddress","type":"address"},{"name":"sourceTokenAmountToUse","type":"uint256"},{"name":"orderData0x","type":"bytes"},{"name":"signature0x","type":"bytes"}],"name":"take0xTrade","outputs":[{"name":"destTokenAddress","type":"address"},{"name":"destTokenAmount","type":"uint256"},{"name":"sourceTokenUsedAmount","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"tokenTransferProxyContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newBZxContractAddress","type":"address"}],"name":"transferBZxOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"zrxTokenContract","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}]}

/***/ }),
/* 89 */
/***/ (function(module, exports) {

module.exports = {"name":"BZRxToken","address":"0xa890bBFFeA779FD4FF9d28469CfC8F2d35bC620d","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"burner","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"decreaseApprovalAndCall","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"increaseApprovalAndCall","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newName","type":"string"},{"name":"_newSymbol","type":"string"}],"name":"renameToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"transferAndCall","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"transferFromAndCall","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 90 */
/***/ (function(module, exports) {

module.exports = {"name":"BZxVault","address":"0xa35A5a8Fe271ac81D5AA7FE8B1503d6a15fdC675","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"previousBZxContract","type":"address"},{"indexed":true,"name":"newBZxContract","type":"address"}],"name":"BZxOwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":true,"inputs":[],"name":"bZxContractAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"from","type":"address"},{"name":"tokenAmount","type":"uint256"}],"name":"depositToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"constant":false,"inputs":[{"name":"newBZxContractAddress","type":"address"}],"name":"transferBZxOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"tokenAmount","type":"uint256"}],"name":"transferTokenFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"withdrawEther","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"to","type":"address"},{"name":"tokenAmount","type":"uint256"}],"name":"withdrawToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 91 */
/***/ (function(module, exports) {

module.exports = {"name":"EIP20","address":"","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 92 */
/***/ (function(module, exports) {

module.exports = {"name":"OracleRegistry","address":"0x3B4cE1786146CB10681a4B2595802ae27a6e6543","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"oracle","type":"address"},{"indexed":false,"name":"name","type":"string"}],"name":"LogAddOracle","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"oracle","type":"address"},{"indexed":false,"name":"oldName","type":"string"},{"indexed":false,"name":"newName","type":"string"}],"name":"LogOracleNameChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"oracle","type":"address"},{"indexed":false,"name":"name","type":"string"}],"name":"LogRemoveOracle","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"}],"name":"OwnershipRenounced","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":false,"inputs":[{"name":"_oracle","type":"address"},{"name":"_name","type":"string"}],"name":"addOracle","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"string"}],"name":"getOracleAddressByName","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOracleAddresses","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"string"}],"name":"getOracleByName","outputs":[{"name":"","type":"address"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOracleList","outputs":[{"name":"","type":"address[]"},{"name":"","type":"uint256[]"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_oracle","type":"address"}],"name":"getOracleMetaData","outputs":[{"name":"","type":"address"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_oracle","type":"address"}],"name":"hasOracle","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"oracleAddresses","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"oracles","outputs":[{"name":"oracle","type":"address"},{"name":"name","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_oracle","type":"address"},{"name":"_index","type":"uint256"}],"name":"removeOracle","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_oracle","type":"address"},{"name":"_name","type":"string"}],"name":"setOracleName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 93 */
/***/ (function(module, exports) {

module.exports = {"name":"TokenRegistry","address":"0x0DdE47E34C50d9C1193a74A0E24f7C743431115D","abi":[{"anonymous":false,"inputs":[{"indexed":true,"name":"token","type":"address"},{"indexed":false,"name":"name","type":"string"},{"indexed":false,"name":"symbol","type":"string"},{"indexed":false,"name":"decimals","type":"uint8"},{"indexed":false,"name":"url","type":"string"}],"name":"LogAddToken","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"token","type":"address"},{"indexed":false,"name":"name","type":"string"},{"indexed":false,"name":"symbol","type":"string"},{"indexed":false,"name":"decimals","type":"uint8"},{"indexed":false,"name":"url","type":"string"}],"name":"LogRemoveToken","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"token","type":"address"},{"indexed":false,"name":"oldName","type":"string"},{"indexed":false,"name":"newName","type":"string"}],"name":"LogTokenNameChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"token","type":"address"},{"indexed":false,"name":"oldSymbol","type":"string"},{"indexed":false,"name":"newSymbol","type":"string"}],"name":"LogTokenSymbolChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"token","type":"address"},{"indexed":false,"name":"oldURL","type":"string"},{"indexed":false,"name":"newURL","type":"string"}],"name":"LogTokenURLChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_name","type":"string"},{"name":"_symbol","type":"string"},{"name":"_decimals","type":"uint8"},{"name":"_url","type":"string"}],"name":"addToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"string"}],"name":"getTokenAddressByName","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_symbol","type":"string"}],"name":"getTokenAddressBySymbol","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTokenAddresses","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"string"}],"name":"getTokenByName","outputs":[{"name":"","type":"address"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"uint8"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_symbol","type":"string"}],"name":"getTokenBySymbol","outputs":[{"name":"","type":"address"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"uint8"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_token","type":"address"}],"name":"getTokenMetaData","outputs":[{"name":"","type":"address"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"uint8"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_index","type":"uint256"}],"name":"removeToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_name","type":"string"}],"name":"setTokenName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_symbol","type":"string"}],"name":"setTokenSymbol","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_token","type":"address"},{"name":"_url","type":"string"}],"name":"setTokenURL","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"tokenAddresses","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"tokens","outputs":[{"name":"token","type":"address"},{"name":"name","type":"string"},{"name":"symbol","type":"string"},{"name":"decimals","type":"uint8"},{"name":"url","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 94 */
/***/ (function(module, exports) {

module.exports = {"name":"OracleInterface","address":"","abi":[{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"borrower","type":"address"},{"name":"gasUsed","type":"uint256"}],"name":"didChangeCollateral","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"loanCloser","type":"address"},{"name":"isLiquidation","type":"bool"},{"name":"gasUsed","type":"uint256"}],"name":"didCloseLoan","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"borrower","type":"address"},{"name":"gasUsed","type":"uint256"}],"name":"didDepositCollateral","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"},{"name":"lender","type":"address"},{"name":"interestTokenAddress","type":"address"},{"name":"amountOwed","type":"uint256"},{"name":"convert","type":"bool"},{"name":"gasUsed","type":"uint256"}],"name":"didPayInterest","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"taker","type":"address"},{"name":"gasUsed","type":"uint256"}],"name":"didTakeOrder","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"},{"name":"tradeTokenAddress","type":"address"},{"name":"tradeTokenAmount","type":"uint256"},{"name":"gasUsed","type":"uint256"}],"name":"didTradePosition","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"borrower","type":"address"},{"name":"gasUsed","type":"uint256"}],"name":"didWithdrawCollateral","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"borrower","type":"address"},{"name":"profitOrLoss","type":"uint256"},{"name":"gasUsed","type":"uint256"}],"name":"didWithdrawProfit","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"sourceTokenAddress","type":"address"},{"name":"destTokenAddress","type":"address"},{"name":"sourceTokenAmount","type":"uint256"}],"name":"doManualTrade","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"sourceTokenAddress","type":"address"},{"name":"destTokenAddress","type":"address"},{"name":"sourceTokenAmount","type":"uint256"}],"name":"doTrade","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"collateralTokenAddress","type":"address"},{"name":"loanTokenAddress","type":"address"},{"name":"collateralTokenAmountUsable","type":"uint256"},{"name":"loanTokenAmountNeeded","type":"uint256"},{"name":"initialMarginAmount","type":"uint256"},{"name":"maintenanceMarginAmount","type":"uint256"}],"name":"doTradeofCollateral","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"loanTokenAddress","type":"address"},{"name":"positionTokenAddress","type":"address"},{"name":"collateralTokenAddress","type":"address"},{"name":"loanTokenAmount","type":"uint256"},{"name":"positionTokenAmount","type":"uint256"},{"name":"collateralTokenAmount","type":"uint256"}],"name":"getCurrentMarginAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"positionTokenAddress","type":"address"},{"name":"loanTokenAddress","type":"address"},{"name":"positionTokenAmount","type":"uint256"},{"name":"loanTokenAmount","type":"uint256"}],"name":"getProfitOrLoss","outputs":[{"name":"isProfit","type":"bool"},{"name":"profitOrLoss","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"sourceTokenAddress","type":"address"},{"name":"destTokenAddress","type":"address"}],"name":"getTradeRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"sourceTokenAddress","type":"address"},{"name":"destTokenAddress","type":"address"},{"name":"sourceTokenAmount","type":"uint256"}],"name":"isTradeSupported","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"loanOrderHash","type":"bytes32"},{"name":"trader","type":"address"},{"name":"loanTokenAddress","type":"address"},{"name":"positionTokenAddress","type":"address"},{"name":"collateralTokenAddress","type":"address"},{"name":"loanTokenAmount","type":"uint256"},{"name":"positionTokenAmount","type":"uint256"},{"name":"collateralTokenAmount","type":"uint256"},{"name":"maintenanceMarginAmount","type":"uint256"}],"name":"shouldLiquidate","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"loanTokenAddress","type":"address"},{"name":"positionTokenAddress","type":"address"},{"name":"collateralTokenAddress","type":"address"},{"name":"loanTokenAmount","type":"uint256"},{"name":"positionTokenAmount","type":"uint256"},{"name":"collateralTokenAmount","type":"uint256"},{"name":"maintenanceMarginAmount","type":"uint256"}],"name":"verifyAndLiquidate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 95 */
/***/ (function(module, exports) {

module.exports = {"name":"TestNetFaucet","address":"0x3E8195d5e16d4096bF1689544AF42CC301842F5D","abi":[{"constant":true,"inputs":[],"name":"ORACLE_CONTRACT","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"from","type":"address"},{"name":"tokenAmount","type":"uint256"}],"name":"depositToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"getToken","type":"address"},{"name":"receiver","type":"address"}],"name":"faucet","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"faucetThresholdSecs","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"faucetUsers","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"getToken","type":"address"},{"name":"receiver","type":"address"},{"name":"getTokenAmount","type":"uint256"}],"name":"oracleExchange","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newValue","type":"uint256"}],"name":"setFaucetThresholdSecs","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newAddress","type":"address"}],"name":"setOracleContractAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"tokenAmount","type":"uint256"}],"name":"transferTokenFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"withdrawEther","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"to","type":"address"},{"name":"tokenAmount","type":"uint256"}],"name":"withdrawToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]}

/***/ }),
/* 96 */
/***/ (function(module, exports) {

module.exports = {"name":"ZRXToken","address":"0xA8E9Fa8f91e5Ae138C74648c9C304F1C75003A8D","abi":[]}

/***/ }),
/* 97 */
/***/ (function(module, exports) {

module.exports = {"name":"WETH","address":"0xc778417E063141139Fce010982780140Aa0cD5Ab","abi":[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"}]}

/***/ }),
/* 98 */
/***/ (function(module, exports) {

module.exports = {"address":"0x4E9Aad8184DE8833365fEA970Cd9149372FDF1e6","abi":[]}

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTokenList = undefined;

var _utils = __webpack_require__(0);

var utils = _interopRequireWildcard(_utils);

var _contracts = __webpack_require__(1);

var _addresses = __webpack_require__(2);

var Addresses = _interopRequireWildcard(_addresses);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const getTokenList = exports.getTokenList = (() => {
  var _ref = _asyncToGenerator(function* ({ web3, networkId }) {
    const tokenRegistryContract = yield utils.getContractInstance(web3, (0, _contracts.getContracts)(networkId).TokenRegistry.abi, Addresses.getAddresses(networkId).TokenRegistry);

    const tokenAddresses = yield tokenRegistryContract.methods.getTokenAddresses().call();

    const getTokenPs = tokenAddresses.map((() => {
      var _ref2 = _asyncToGenerator(function* (address) {
        const doesExist = yield utils.doesContractExistAtAddress(web3, address);
        if (doesExist) {
          const tokenData = yield tokenRegistryContract.methods.getTokenMetaData(address).call();
          return {
            address: tokenData[0].toLowerCase(),
            name: tokenData[1],
            symbol: tokenData[2],
            decimals: tokenData[3],
            url: tokenData[4]
          };
        }
        return null;
      });

      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    })());

    const tokensRaw = yield Promise.all(getTokenPs);
    const tokens = tokensRaw.filter(function (token) {
      return !!token;
    });

    return tokens;
  });

  return function getTokenList(_x) {
    return _ref.apply(this, arguments);
  };
})();

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllowance = exports.setAllowance = undefined;

var _assert = __webpack_require__(4);

var _utils = __webpack_require__(5);

var _utils2 = __webpack_require__(0);

var CoreUtils = _interopRequireWildcard(_utils2);

var _contracts = __webpack_require__(1);

var _addresses = __webpack_require__(2);

var Addresses = _interopRequireWildcard(_addresses);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const erc20Abi = _contracts.local.EIP20.abi;

const setAllowance = exports.setAllowance = ({ web3, networkId }, {
  tokenAddress,
  ownerAddress,
  spenderAddress = Addresses.getAddresses(networkId).BZxVault,
  amountInBaseUnits,
  getObject,
  txOpts
}) => {
  _assert.assert.isETHAddressHex("ownerAddress", ownerAddress);
  _assert.assert.isETHAddressHex("spenderAddress", spenderAddress);
  _assert.assert.isETHAddressHex("tokenAddress", tokenAddress);
  _assert.assert.isValidBaseUnitAmount("amountInBaseUnits", amountInBaseUnits);

  const tokenContract = CoreUtils.getContractInstance(web3, erc20Abi, tokenAddress);

  const txObj = tokenContract.methods.approve(spenderAddress, amountInBaseUnits);

  if (getObject) {
    return txObj;
  }
  return txObj.send(txOpts);
};

const getAllowance = exports.getAllowance = (() => {
  var _ref = _asyncToGenerator(function* ({ web3, networkId }, {
    tokenAddress,
    ownerAddress,
    spenderAddress = Addresses.getAddresses(networkId).BZxVault
  }) {
    _assert.assert.isETHAddressHex("ownerAddress", ownerAddress);
    _assert.assert.isETHAddressHex("spenderAddress", spenderAddress);
    _assert.assert.isETHAddressHex("tokenAddress", tokenAddress);

    const tokenContract = yield CoreUtils.getContractInstance(web3, erc20Abi, tokenAddress);
    const allowanceValue = yield tokenContract.methods.allowance(ownerAddress, spenderAddress).call();
    return new _utils.BigNumber(allowanceValue);
  });

  return function getAllowance(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getConversionData = exports.isTradeSupported = exports.getOracleList = exports.formatOracleList = exports.cleanOracleNames = exports.getOracleListRaw = undefined;

var _ramda = __webpack_require__(3);

var _assert = __webpack_require__(4);

var _utils = __webpack_require__(0);

var utils = _interopRequireWildcard(_utils);

var _contracts = __webpack_require__(1);

var _addresses = __webpack_require__(2);

var Addresses = _interopRequireWildcard(_addresses);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const getOracleListRaw = exports.getOracleListRaw = (() => {
  var _ref = _asyncToGenerator(function* ({ web3, networkId }) {
    const ORACLE_ADDRESSES = 0;
    const ORACLE_NAME_LENGTHS = 1;
    const ORACLE_NAMES_ALL_CONCAT = 2;

    const oracleRegistryContract = yield utils.getContractInstance(web3, (0, _contracts.getContracts)(networkId).OracleRegistry.abi, Addresses.getAddresses(networkId).OracleRegistry);

    const res = yield oracleRegistryContract.methods.getOracleList().call();
    const oracleAddresses = res[ORACLE_ADDRESSES];
    const oracleNameLengths = res[ORACLE_NAME_LENGTHS];
    const oracleNamesAllConcat = res[ORACLE_NAMES_ALL_CONCAT];

    return {
      oracleAddresses,
      oracleNameLengths,
      oracleNamesAllConcat
    };
  });

  return function getOracleListRaw(_x) {
    return _ref.apply(this, arguments);
  };
})();

const cleanOracleNames = exports.cleanOracleNames = ({
  oracleNameLengths,
  oracleNamesAllConcat
}) => {
  const convertStrToNum = (0, _ramda.map)(str => Number(str));
  const getSubstringIndiciesPairs = lengths => {
    // eslint-disable-next-line no-unused-vars
    const [accum, indiciesPairs] = (0, _ramda.mapAccum)((acc, val) => [acc + val, [acc, acc + val]], 0)(lengths);
    return indiciesPairs;
  };
  const getNames = (0, _ramda.map)(indicies => oracleNamesAllConcat.substring(indicies[0], indicies[1]));

  const oracleNames = (0, _ramda.pipe)(convertStrToNum, getSubstringIndiciesPairs, getNames)(oracleNameLengths);

  return oracleNames;
};

const formatOracleList = exports.formatOracleList = ({ oracleAddresses, oracleNames }) => (0, _ramda.zipWith)((address, name) => ({ address: address.toLowerCase(), name }), oracleAddresses, oracleNames);

const getOracleList = exports.getOracleList = (() => {
  var _ref2 = _asyncToGenerator(function* ({ web3, networkId }) {
    const {
      oracleAddresses,
      oracleNameLengths,
      oracleNamesAllConcat
    } = yield getOracleListRaw({ web3, networkId });

    const oracleNames = cleanOracleNames({
      oracleNameLengths,
      oracleNamesAllConcat
    });

    return formatOracleList({ oracleAddresses, oracleNames });
  });

  return function getOracleList(_x2) {
    return _ref2.apply(this, arguments);
  };
})();

const isTradeSupported = exports.isTradeSupported = (() => {
  var _ref3 = _asyncToGenerator(function* ({ web3, networkId }, { sourceTokenAddress, destTokenAddress, oracleAddress }) {
    _assert.assert.isETHAddressHex("sourceTokenAddress", sourceTokenAddress);
    _assert.assert.isETHAddressHex("destTokenAddress", destTokenAddress);
    _assert.assert.isETHAddressHex("oracleAddress", oracleAddress);

    const oracleContract = yield utils.getContractInstance(web3, (0, _contracts.getContracts)(networkId).OracleInterface.abi, oracleAddress);

    const queriesP = Promise.all([oracleContract.methods.isTradeSupported(sourceTokenAddress, destTokenAddress).call(), oracleContract.methods.isTradeSupported(destTokenAddress, sourceTokenAddress).call()]);

    const [isSupportedForward, isSupportedReverse] = yield queriesP;
    const isSupported = isSupportedForward && isSupportedReverse;

    return isSupported;
  });

  return function isTradeSupported(_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
})();

const getConversionData = exports.getConversionData = (() => {
  var _ref4 = _asyncToGenerator(function* ({ web3, networkId }, sourceTokenAddress, destTokenAddress, sourceTokenAmount, oracleAddress) {
    _assert.assert.isETHAddressHex("sourceTokenAddress", sourceTokenAddress);
    _assert.assert.isETHAddressHex("destTokenAddress", destTokenAddress);
    _assert.assert.isETHAddressHex("oracleAddress", oracleAddress);

    const oracleContract = yield utils.getContractInstance(web3, (0, _contracts.getContracts)(networkId).OracleInterface.abi, oracleAddress);

    const data = yield oracleContract.methods.getTradeData(sourceTokenAddress, destTokenAddress, sourceTokenAmount).call();

    return {
      "rate": 0 in data && data[0] ? data[0] : 0,
      "amount": 1 in data && data[1] ? data[1] : 0
    };
  });

  return function getConversionData(_x5, _x6, _x7, _x8, _x9) {
    return _ref4.apply(this, arguments);
  };
})();

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInitialCollateralRequired = exports.cancelLoanOrderWithHash = exports.cancelLoanOrder = exports.takeLoanOrderOnChainAsLender = exports.takeLoanOrderOnChainAsTrader = exports.pushLoanOrderOnChain = exports.takeLoanOrderAsTrader = exports.takeLoanOrderAsLender = undefined;

var _signature = __webpack_require__(7);

var Signature = _interopRequireWildcard(_signature);

var _utils = __webpack_require__(0);

var CoreUtils = _interopRequireWildcard(_utils);

var _contracts = __webpack_require__(1);

var _addresses = __webpack_require__(2);

var Addresses = _interopRequireWildcard(_addresses);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const checkForValidSignature = order => {
  Signature.isValidSignature({
    account: order.makerAddress,
    orderHash: CoreUtils.getLoanOrderHashHex(order),
    signature: order.signature
  });
};

const takeLoanOrderAsLender = exports.takeLoanOrderAsLender = ({ web3, networkId }, { order, getObject, txOpts }) => {
  checkForValidSignature(order);

  const bZxContract = CoreUtils.getContractInstance(web3, (0, _contracts.getContracts)(networkId).BZx.abi, Addresses.getAddresses(networkId).BZx);

  const orderAddresses = [order.makerAddress, order.loanTokenAddress, order.interestTokenAddress, order.collateralTokenAddress, order.feeRecipientAddress, order.oracleAddress];

  const orderValues = [order.loanTokenAmount, order.interestAmount, order.initialMarginAmount, order.maintenanceMarginAmount, order.lenderRelayFee, order.traderRelayFee, order.maxDurationUnixTimestampSec, order.expirationUnixTimestampSec, order.makerRole, order.salt];

  const txObj = bZxContract.methods.takeLoanOrderAsLender(orderAddresses, orderValues, order.signature);

  if (getObject) {
    return txObj;
  }
  return txObj.send(txOpts);
};

const takeLoanOrderAsTrader = exports.takeLoanOrderAsTrader = ({ web3, networkId }, { order, collateralTokenAddress, loanTokenAmountFilled, getObject, txOpts }) => {
  checkForValidSignature(order);

  const bZxContract = CoreUtils.getContractInstance(web3, (0, _contracts.getContracts)(networkId).BZx.abi, Addresses.getAddresses(networkId).BZx);

  const orderAddresses = [order.makerAddress, order.loanTokenAddress, order.interestTokenAddress, order.collateralTokenAddress, order.feeRecipientAddress, order.oracleAddress];

  const orderValues = [order.loanTokenAmount, order.interestAmount, order.initialMarginAmount, order.maintenanceMarginAmount, order.lenderRelayFee, order.traderRelayFee, order.maxDurationUnixTimestampSec, order.expirationUnixTimestampSec, order.makerRole, order.salt];

  const txObj = bZxContract.methods.takeLoanOrderAsTrader(orderAddresses, orderValues, collateralTokenAddress, loanTokenAmountFilled, order.signature);

  if (getObject) {
    return txObj;
  }
  return txObj.send(txOpts);
};

const pushLoanOrderOnChain = exports.pushLoanOrderOnChain = ({ web3, networkId }, { order, getObject, txOpts }) => {
  checkForValidSignature(order);

  const bZxContract = CoreUtils.getContractInstance(web3, (0, _contracts.getContracts)(networkId).BZx.abi, Addresses.getAddresses(networkId).BZx);

  const orderAddresses = [order.makerAddress, order.loanTokenAddress, order.interestTokenAddress, order.collateralTokenAddress, order.feeRecipientAddress, order.oracleAddress];

  const orderValues = [order.loanTokenAmount, order.interestAmount, order.initialMarginAmount, order.maintenanceMarginAmount, order.lenderRelayFee, order.traderRelayFee, order.maxDurationUnixTimestampSec, order.expirationUnixTimestampSec, order.makerRole, order.salt];

  const txObj = bZxContract.methods.pushLoanOrderOnChain(orderAddresses, orderValues, order.signature);

  if (getObject) {
    return txObj;
  }
  return txObj.send(txOpts);
};

const takeLoanOrderOnChainAsTrader = exports.takeLoanOrderOnChainAsTrader = ({ web3, networkId }, { loanOrderHash, collateralTokenAddress, loanTokenAmountFilled, getObject, txOpts }) => {
  const bZxContract = CoreUtils.getContractInstance(web3, (0, _contracts.getContracts)(networkId).BZx.abi, Addresses.getAddresses(networkId).BZx);

  const txObj = bZxContract.methods.takeLoanOrderOnChainAsTrader(loanOrderHash, collateralTokenAddress, loanTokenAmountFilled);

  if (getObject) {
    return txObj;
  }
  return txObj.send(txOpts);
};

const takeLoanOrderOnChainAsLender = exports.takeLoanOrderOnChainAsLender = ({ web3, networkId }, { loanOrderHash, getObject, txOpts }) => {
  const bZxContract = CoreUtils.getContractInstance(web3, (0, _contracts.getContracts)(networkId).BZx.abi, Addresses.getAddresses(networkId).BZx);

  const txObj = bZxContract.methods.takeLoanOrderOnChainAsLender(loanOrderHash);

  if (getObject) {
    return txObj;
  }
  return txObj.send(txOpts);
};

const cancelLoanOrder = exports.cancelLoanOrder = ({ web3, networkId }, { order, cancelLoanTokenAmount, getObject, txOpts }) => {
  checkForValidSignature(order);

  const bZxContract = CoreUtils.getContractInstance(web3, (0, _contracts.getContracts)(networkId).BZx.abi, Addresses.getAddresses(networkId).BZx);

  const orderAddresses = [order.makerAddress, order.loanTokenAddress, order.interestTokenAddress, order.collateralTokenAddress, order.feeRecipientAddress, order.oracleAddress];

  const orderValues = [order.loanTokenAmount, order.interestAmount, order.initialMarginAmount, order.maintenanceMarginAmount, order.lenderRelayFee, order.traderRelayFee, order.maxDurationUnixTimestampSec, order.expirationUnixTimestampSec, order.makerRole, order.salt];

  const txObj = bZxContract.methods.cancelLoanOrder(orderAddresses, orderValues, cancelLoanTokenAmount);

  if (getObject) {
    return txObj;
  }
  return txObj.send(txOpts);
};

const cancelLoanOrderWithHash = exports.cancelLoanOrderWithHash = ({ web3, networkId }, { loanOrderHash, cancelLoanTokenAmount, getObject, txOpts }) => {
  const bZxContract = CoreUtils.getContractInstance(web3, (0, _contracts.getContracts)(networkId).BZx.abi, Addresses.getAddresses(networkId).BZx);

  const txObj = bZxContract.methods.cancelLoanOrder(loanOrderHash, cancelLoanTokenAmount);

  if (getObject) {
    return txObj;
  }
  return txObj.send(txOpts);
};

const getInitialCollateralRequired = exports.getInitialCollateralRequired = (() => {
  var _ref = _asyncToGenerator(function* ({ web3, networkId }, loanTokenAddress, collateralTokenAddress, oracleAddress, loanTokenAmountFilled, initialMarginAmount) {
    const bZxContract = yield CoreUtils.getContractInstance(web3, (0, _contracts.getContracts)(networkId).BZx.abi, Addresses.getAddresses(networkId).BZx);
    let initialCollateralRequired = null;
    try {
      initialCollateralRequired = yield bZxContract.methods.getInitialCollateralRequired(loanTokenAddress, collateralTokenAddress, oracleAddress, loanTokenAmountFilled, initialMarginAmount).call();
    } catch (e) {
      console.log(e);
    }
    return initialCollateralRequired;
  });

  return function getInitialCollateralRequired(_x, _x2, _x3, _x4, _x5, _x6) {
    return _ref.apply(this, arguments);
  };
})();

/***/ }),
/* 103 */
/***/ (function(module, exports) {

module.exports = require("eth-sig-util");

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseSignatureHexAsRSV = exports.parseSignatureHexAsVRS = exports.isValidSignature = undefined;

var _ethereumjsUtil = __webpack_require__(8);

var ethUtil = _interopRequireWildcard(_ethereumjsUtil);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const isValidSignature = exports.isValidSignature = (data, signature, signerAddress) => {
    const dataBuff = ethUtil.toBuffer(data);
    const msgHashBuff = ethUtil.hashPersonalMessage(dataBuff);
    try {
        const pubKey = ethUtil.ecrecover(msgHashBuff, signature.v, ethUtil.toBuffer(signature.r), ethUtil.toBuffer(signature.s));
        const retrievedAddress = ethUtil.bufferToHex(ethUtil.pubToAddress(pubKey));
        return retrievedAddress === signerAddress;
    } catch (err) {
        return false;
    }
};

const parseSignatureHexAsVRS = exports.parseSignatureHexAsVRS = signatureHex => {
    const signatureBuffer = ethUtil.toBuffer(signatureHex);
    let v = signatureBuffer[0];
    if (v < 27) {
        v += 27;
    }
    const r = signatureBuffer.slice(1, 33);
    const s = signatureBuffer.slice(33, 65);
    const ecSignature = {
        v,
        r: ethUtil.bufferToHex(r),
        s: ethUtil.bufferToHex(s)
    };
    return ecSignature;
};

const parseSignatureHexAsRSV = exports.parseSignatureHexAsRSV = signatureHex => {
    const sig = ethUtil.fromRpcSig(signatureHex);
    const ecSignature = {
        v: sig.v,
        r: ethUtil.bufferToHex(sig.r),
        s: ethUtil.bufferToHex(sig.s)
    };
    return ecSignature;
};

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOrdersForUser = exports.getOrdersFillable = exports.getSingleOrder = undefined;

var _loans = __webpack_require__(106);

Object.keys(_loans).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _loans[key];
    }
  });
});

var _utils = __webpack_require__(0);

var CoreUtils = _interopRequireWildcard(_utils);

var _contracts = __webpack_require__(1);

var _addresses = __webpack_require__(2);

var Addresses = _interopRequireWildcard(_addresses);

var _orders = __webpack_require__(108);

var OrderUtils = _interopRequireWildcard(_orders);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const getSingleOrder = exports.getSingleOrder = (() => {
  var _ref = _asyncToGenerator(function* ({ web3, networkId }, { loanOrderHash }) {
    const bZxContract = yield CoreUtils.getContractInstance(web3, (0, _contracts.getContracts)(networkId).BZx.abi, Addresses.getAddresses(networkId).BZx);

    const data = yield bZxContract.methods.getSingleOrder(loanOrderHash).call();

    const cleanedData = OrderUtils.cleanData(data);
    if (cleanedData.length > 0) return cleanedData[0];
    return {};
  });

  return function getSingleOrder(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

const getOrdersFillable = exports.getOrdersFillable = (() => {
  var _ref2 = _asyncToGenerator(function* ({ web3, networkId }, { start, count }) {
    const bZxContract = yield CoreUtils.getContractInstance(web3, (0, _contracts.getContracts)(networkId).BZx.abi, Addresses.getAddresses(networkId).BZx);

    const data = yield bZxContract.methods.getOrdersFillable(start, count).call();

    return OrderUtils.cleanData(data);
  });

  return function getOrdersFillable(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
})();

const getOrdersForUser = exports.getOrdersForUser = (() => {
  var _ref3 = _asyncToGenerator(function* ({ web3, networkId }, { loanPartyAddress, start, count }) {
    const bZxContract = yield CoreUtils.getContractInstance(web3, (0, _contracts.getContracts)(networkId).BZx.abi, Addresses.getAddresses(networkId).BZx);

    const data = yield bZxContract.methods.getOrdersForUser(loanPartyAddress, start, count).call();

    return OrderUtils.cleanData(data);
  });

  return function getOrdersForUser(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
})();

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLoansForTrader = exports.getLoansForLender = exports.getSingleLoan = undefined;

var _utils = __webpack_require__(0);

var CoreUtils = _interopRequireWildcard(_utils);

var _contracts = __webpack_require__(1);

var _addresses = __webpack_require__(2);

var Addresses = _interopRequireWildcard(_addresses);

var _loanPositions = __webpack_require__(107);

var LoanPosUtils = _interopRequireWildcard(_loanPositions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const getSingleLoan = exports.getSingleLoan = (() => {
  var _ref = _asyncToGenerator(function* ({ web3, networkId }, { loanOrderHash, trader }) {
    const bZxContract = yield CoreUtils.getContractInstance(web3, (0, _contracts.getContracts)(networkId).BZx.abi, Addresses.getAddresses(networkId).BZx);

    const data = yield bZxContract.methods.getSingleLoan(loanOrderHash, trader).call();

    const cleanedData = LoanPosUtils.cleanData(data);
    if (cleanedData.length > 0) return cleanedData[0];
    return {};
  });

  return function getSingleLoan(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

const getLoansForLender = exports.getLoansForLender = (() => {
  var _ref2 = _asyncToGenerator(function* ({ web3, networkId }, { address, count, activeOnly }) {
    const bZxContract = yield CoreUtils.getContractInstance(web3, (0, _contracts.getContracts)(networkId).BZx.abi, Addresses.getAddresses(networkId).BZx);

    const data = yield bZxContract.methods.getLoansForLender(address, count, activeOnly).call();

    return LoanPosUtils.cleanData(data);
  });

  return function getLoansForLender(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
})();

const getLoansForTrader = exports.getLoansForTrader = (() => {
  var _ref3 = _asyncToGenerator(function* ({ web3, networkId }, { address, count, activeOnly }) {
    const bZxContract = yield CoreUtils.getContractInstance(web3, (0, _contracts.getContracts)(networkId).BZx.abi, Addresses.getAddresses(networkId).BZx);

    const data = yield bZxContract.methods.getLoansForTrader(address, count, activeOnly).call();

    return LoanPosUtils.cleanData(data);
  });

  return function getLoansForTrader(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
})();

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cleanData = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _ramda = __webpack_require__(3);

var _index = __webpack_require__(9);

var Utils = _interopRequireWildcard(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const NUM_LOAN_POS_FIELDS = 16;

const getLoanPosition = params => _extends({}, (0, _ramda.map)((0, _ramda.pipe)(Utils.substr24, Utils.prepend0x), {
  lender: params[0],
  trader: params[1],
  collateralTokenAddressFilled: params[2],
  positionTokenAddressFilled: params[3],
  loanTokenAddress: params[12],
  interestTokenAddress: params[13]
}), (0, _ramda.map)((0, _ramda.pipe)(Utils.prepend0x, Utils.parseIntHex), {
  loanTokenAmountFilled: params[4],
  collateralTokenAmountFilled: params[5],
  positionTokenAmountFilled: params[6],
  loanStartUnixTimestampSec: params[7],
  loanEndUnixTimestampSec: params[8],
  index: params[9],
  active: params[10],
  interestTotalAccrued: params[14],
  interestPaidSoFar: params[15]
}), (0, _ramda.map)((0, _ramda.pipe)(Utils.prepend0x), {
  loanOrderHash: params[11]
}));

const checkProperObjCount = Utils.makeCheckProperObjCount(NUM_LOAN_POS_FIELDS);
const getOrderObjArray = Utils.makeGetOrderObjArray(NUM_LOAN_POS_FIELDS);

const cleanData = exports.cleanData = raw => raw ? (0, _ramda.pipe)(Utils.remove0xPrefix, checkProperObjCount, getOrderObjArray, (0, _ramda.map)((0, _ramda.pipe)(Utils.getOrderParams, getLoanPosition)))(raw) : [];

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cleanData = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _ramda = __webpack_require__(3);

var _index = __webpack_require__(9);

var Utils = _interopRequireWildcard(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const NUM_ORDER_FIELDS = 20;

const getOrder = params => _extends({}, (0, _ramda.map)((0, _ramda.pipe)(Utils.substr24, Utils.prepend0x), {
  maker: params[0],
  loanTokenAddress: params[1],
  interestTokenAddress: params[2],
  collateralTokenAddress: params[3],
  feeRecipientAddress: params[4],
  oracleAddress: params[5],
  lender: params[15]
}), (0, _ramda.map)((0, _ramda.pipe)(Utils.prepend0x, Utils.parseIntHex), {
  loanTokenAmount: params[6],
  interestAmount: params[7],
  initialMarginAmount: params[8],
  maintenanceMarginAmount: params[9],
  lenderRelayFee: params[10],
  traderRelayFee: params[11],
  maxDurationUnixTimestampSec: params[12],
  expirationUnixTimestampSec: params[13],
  orderFilledAmount: params[16],
  orderCancelledAmount: params[17],
  orderTraderCount: params[18],
  addedUnixTimestampSec: params[19]
}), {
  loanOrderHash: Utils.prepend0x(params[14])
});

const checkProperObjCount = Utils.makeCheckProperObjCount(NUM_ORDER_FIELDS);
const getOrderObjArray = Utils.makeGetOrderObjArray(NUM_ORDER_FIELDS);

const cleanData = exports.cleanData = raw => raw ? (0, _ramda.pipe)(Utils.remove0xPrefix, checkProperObjCount, getOrderObjArray, (0, _ramda.map)((0, _ramda.pipe)(Utils.getOrderParams, getOrder)))(raw) : [];

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transferToken = undefined;

var _utils = __webpack_require__(0);

var CoreUtils = _interopRequireWildcard(_utils);

var _EIP = __webpack_require__(14);

var _EIP2 = _interopRequireDefault(_EIP);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const transferToken = exports.transferToken = ({ web3 }, {
  tokenAddress,
  to,
  amount,
  getObject,
  txOpts
}) => {
  const tokenContract = CoreUtils.getContractInstance(web3, _EIP2.default.abi, tokenAddress);

  const txObj = tokenContract.methods.transfer(to, amount);

  if (getObject) {
    return txObj;
  }
  return txObj.send(txOpts);
};

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
const ContractDoesNotExist = exports.ContractDoesNotExist = "Contract does not exist at address.";
const NoNetworkId = exports.NoNetworkId = "Missing networkId. Provide a networkId param.";
const InvalidSignature = exports.InvalidSignature = "Signature is invalid.";

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tradePositionWithOracle = exports.tradePositionWith0x = undefined;

var _ramda = __webpack_require__(3);

var _web3Utils = __webpack_require__(13);

var _web3Utils2 = _interopRequireDefault(_web3Utils);

var _bn = __webpack_require__(12);

var _bn2 = _interopRequireDefault(_bn);

var _ethereumjsAbi = __webpack_require__(112);

var _ethereumjsAbi2 = _interopRequireDefault(_ethereumjsAbi);

var _ethereumjsUtil = __webpack_require__(8);

var _ethereumjsUtil2 = _interopRequireDefault(_ethereumjsUtil);

var _orderUtils = __webpack_require__(113);

var _orderUtils2 = _interopRequireDefault(_orderUtils);

var _utils = __webpack_require__(0);

var CoreUtils = _interopRequireWildcard(_utils);

var _contracts = __webpack_require__(1);

var _zeroEx = __webpack_require__(114);

var ZeroExTradeUtils = _interopRequireWildcard(_zeroEx);

var _signature = __webpack_require__(7);

var Signature = _interopRequireWildcard(_signature);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const makeBN = arg => new _bn2.default(arg);
const padLeft = arg => _web3Utils2.default.padLeft(arg, 64);
const prepend0x = arg => `0x${arg}`;

const tradePositionWith0x = exports.tradePositionWith0x = ({ web3, networkId }, { order0x, orderHashBZx, getObject, txOpts }) => {

  const rpcSig0x = _ethereumjsUtil2.default.toRpcSig(order0x.signedOrder.ecSignature.v, order0x.signedOrder.ecSignature.r, order0x.signedOrder.ecSignature.s);

  const transformedOrder0x = ZeroExTradeUtils.transform0xOrder(order0x);
  const orderHash0x = _orderUtils2.default.getOrderHashHex(transformedOrder0x);

  Signature.isValidSignature({
    account: order0x.signedOrder.maker,
    orderHash: orderHash0x,
    signature: rpcSig0x
  });

  const contracts = (0, _contracts.getContracts)(networkId);
  const bZxContract = CoreUtils.getContractInstance(web3, contracts.BZx.abi, contracts.BZx.address);

  const values = [...[transformedOrder0x.maker, transformedOrder0x.taker, transformedOrder0x.makerTokenAddress, transformedOrder0x.takerTokenAddress, transformedOrder0x.feeRecipient].map(padLeft), ...[transformedOrder0x.makerTokenAmount, transformedOrder0x.takerTokenAmount, transformedOrder0x.makerFee, transformedOrder0x.takerFee, transformedOrder0x.expirationUnixTimestampSec, transformedOrder0x.salt].map(value => (0, _ramda.pipe)(makeBN, padLeft, prepend0x)(value))];

  const types = (0, _ramda.repeat)("bytes32", values.length);
  const hashBuff = _ethereumjsAbi2.default.solidityPack(types, values);
  const order0xTightlyPacked = _ethereumjsUtil2.default.bufferToHex(hashBuff);

  const txObj = bZxContract.methods.tradePositionWith0x(orderHashBZx, order0xTightlyPacked, rpcSig0x);

  if (getObject) {
    return txObj;
  }
  return txObj.send(txOpts);
};

const tradePositionWithOracle = exports.tradePositionWithOracle = ({ web3, networkId }, { orderHash, tradeTokenAddress, getObject, txOpts = {} } = {}) => {
  const contracts = (0, _contracts.getContracts)(networkId);
  const bZxContract = CoreUtils.getContractInstance(web3, contracts.BZx.abi, contracts.BZx.address);

  const txObj = bZxContract.methods.tradePositionWithOracle(orderHash, tradeTokenAddress);

  if (getObject) {
    return txObj;
  }
  return txObj.send(txOpts);
};

/***/ }),
/* 112 */
/***/ (function(module, exports) {

module.exports = require("ethereumjs-abi");

/***/ }),
/* 113 */
/***/ (function(module, exports) {

module.exports = require("@0xproject/order-utils");

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transform0xOrder = undefined;

var _constants = __webpack_require__(6);

var constants = _interopRequireWildcard(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const transform0xOrder = exports.transform0xOrder = ({
  signedOrder
}) => ({
  exchangeContractAddress: signedOrder.exchangeContractAddress,
  expirationUnixTimestampSec: signedOrder.expirationUnixTimestampSec,
  feeRecipient: signedOrder.feeRecipient,
  maker: signedOrder.maker,
  makerFee: signedOrder.makerFee,
  makerTokenAddress: signedOrder.makerTokenAddress,
  makerTokenAmount: signedOrder.makerTokenAmount,
  salt: signedOrder.salt,
  taker: signedOrder.taker || constants.NULL_ADDRESS,
  takerFee: signedOrder.takerFee,
  takerTokenAddress: signedOrder.takerTokenAddress,
  takerTokenAmount: signedOrder.takerTokenAmount
});

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getProfitOrLoss = exports.withdrawProfit = exports.closeLoan = exports.getInterest = exports.payInterest = exports.withdrawExcessCollateral = exports.depositCollateral = exports.changeCollateral = undefined;

var _utils = __webpack_require__(0);

var CoreUtils = _interopRequireWildcard(_utils);

var _contracts = __webpack_require__(1);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const changeCollateral = exports.changeCollateral = ({ web3, networkId, addresses }, { loanOrderHash, collateralTokenFilled, getObject, txOpts }) => {
  const bZxContract = CoreUtils.getContractInstance(web3, (0, _contracts.getContracts)(networkId).BZx.abi, addresses.BZx);

  const txObj = bZxContract.methods.changeCollateral(loanOrderHash, collateralTokenFilled);

  if (getObject) {
    return txObj;
  }
  return txObj.send(txOpts);
};

const depositCollateral = exports.depositCollateral = ({ web3, networkId, addresses }, { loanOrderHash, collateralTokenFilled, depositAmount, getObject, txOpts }) => {
  const bZxContract = CoreUtils.getContractInstance(web3, (0, _contracts.getContracts)(networkId).BZx.abi, addresses.BZx);

  const txObj = bZxContract.methods.depositCollateral(loanOrderHash, collateralTokenFilled, depositAmount);

  if (getObject) {
    return txObj;
  }
  return txObj.send(txOpts);
};

const withdrawExcessCollateral = exports.withdrawExcessCollateral = ({ web3, networkId, addresses }, { loanOrderHash, collateralTokenFilled, withdrawAmount, getObject, txOpts }) => {
  const bZxContract = CoreUtils.getContractInstance(web3, (0, _contracts.getContracts)(networkId).BZx.abi, addresses.BZx);

  const txObj = bZxContract.methods.withdrawExcessCollateral(loanOrderHash, collateralTokenFilled, withdrawAmount);

  if (getObject) {
    return txObj;
  }
  return txObj.send(txOpts);
};

const payInterest = exports.payInterest = ({ web3, networkId, addresses }, { loanOrderHash, trader, getObject, txOpts }) => {
  const bZxContract = CoreUtils.getContractInstance(web3, (0, _contracts.getContracts)(networkId).BZx.abi, addresses.BZx);

  const txObj = bZxContract.methods.payInterest(loanOrderHash, trader);

  if (getObject) {
    return txObj;
  }
  return txObj.send(txOpts);
};

const getInterest = exports.getInterest = (() => {
  var _ref = _asyncToGenerator(function* ({ web3, networkId, addresses }, { loanOrderHash, trader }) {
    const bZxContract = CoreUtils.getContractInstance(web3, (0, _contracts.getContracts)(networkId).BZx.abi, addresses.BZx);
    const data = yield bZxContract.methods.getInterest(loanOrderHash, trader).call();
    return {
      lender: data[0],
      interestTokenAddress: data[1],
      interestTotalAccrued: data[2],
      interestPaidSoFar: data[3]
    };
  });

  return function getInterest(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

const closeLoan = exports.closeLoan = ({ web3, networkId, addresses }, { loanOrderHash, getObject, txOpts }) => {
  const bZxContract = CoreUtils.getContractInstance(web3, (0, _contracts.getContracts)(networkId).BZx.abi, addresses.BZx);

  const txObj = bZxContract.methods.closeLoan(loanOrderHash);

  if (getObject) {
    return txObj;
  }
  return txObj.send(txOpts);
};

const withdrawProfit = exports.withdrawProfit = ({ web3, networkId, addresses }, { loanOrderHash, getObject, txOpts }) => {
  const bZxContract = CoreUtils.getContractInstance(web3, (0, _contracts.getContracts)(networkId).BZx.abi, addresses.BZx);

  const txObj = bZxContract.methods.withdrawProfit(loanOrderHash);

  if (getObject) {
    return txObj;
  }
  return txObj.send(txOpts);
};

const getProfitOrLoss = exports.getProfitOrLoss = (() => {
  var _ref2 = _asyncToGenerator(function* ({ web3, networkId, addresses }, { loanOrderHash, trader }) {
    const bZxContract = yield CoreUtils.getContractInstance(web3, (0, _contracts.getContracts)(networkId).BZx.abi, addresses.BZx);

    const data = yield bZxContract.methods.getProfitOrLoss(loanOrderHash, trader).call();

    return {
      isProfit: data.isProfit,
      profitOrLoss: data.profitOrLoss,
      positionTokenAddress: data.positionTokenAddress
    };
  });

  return function getProfitOrLoss(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
})();

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.liquidateLoan = exports.getMarginLevels = exports.getActiveLoans = undefined;

var _utils = __webpack_require__(0);

var CoreUtils = _interopRequireWildcard(_utils);

var _contracts = __webpack_require__(1);

var _activeLoans = __webpack_require__(117);

var ActiveLoansUtils = _interopRequireWildcard(_activeLoans);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const getActiveLoans = exports.getActiveLoans = (() => {
  var _ref = _asyncToGenerator(function* ({ web3, networkId, addresses }, { start, count }) {
    const bZxContract = CoreUtils.getContractInstance(web3, (0, _contracts.getContracts)(networkId).BZx.abi, addresses.BZx);
    const data = yield bZxContract.methods.getActiveLoans(start, count).call();
    return ActiveLoansUtils.cleanData(data);
  });

  return function getActiveLoans(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

const getMarginLevels = exports.getMarginLevels = (() => {
  var _ref2 = _asyncToGenerator(function* ({ web3, networkId, addresses }, { loanOrderHash, trader }) {
    const bZxContract = CoreUtils.getContractInstance(web3, (0, _contracts.getContracts)(networkId).BZx.abi, addresses.BZx);
    const data = yield bZxContract.methods.getMarginLevels(loanOrderHash, trader).call();
    return {
      initialMarginAmount: data[0],
      maintenanceMarginAmount: data[1],
      currentMarginAmount: data[2]
    };
  });

  return function getMarginLevels(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
})();

const liquidateLoan = exports.liquidateLoan = ({ web3, networkId, addresses }, { loanOrderHash, trader, getObject, txOpts }) => {
  const bZxContract = CoreUtils.getContractInstance(web3, (0, _contracts.getContracts)(networkId).BZx.abi, addresses.BZx);

  const txObj = bZxContract.methods.liquidatePosition(loanOrderHash, trader);

  if (getObject) {
    return txObj;
  }
  return txObj.send(txOpts);
};

/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cleanData = undefined;

var _ramda = __webpack_require__(3);

var _index = __webpack_require__(9);

var OrderHistoryUtils = _interopRequireWildcard(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const NUM_LOAN_FIELDS = 3;

const getLoan = params => ({
  loanOrderHash: OrderHistoryUtils.prepend0x(params[0]),
  trader: (0, _ramda.pipe)(OrderHistoryUtils.substr24, OrderHistoryUtils.prepend0x)(params[1]),
  loanEndUnixTimestampSec: OrderHistoryUtils.parseIntHex(params[2])
});

const checkProperObjCount = OrderHistoryUtils.makeCheckProperObjCount(NUM_LOAN_FIELDS);
const getOrderObjArray = OrderHistoryUtils.makeGetOrderObjArray(NUM_LOAN_FIELDS);

const cleanData = exports.cleanData = raw => raw ? (0, _ramda.pipe)(OrderHistoryUtils.remove0xPrefix, checkProperObjCount, getOrderObjArray, (0, _ramda.map)((0, _ramda.pipe)(OrderHistoryUtils.getOrderParams, getLoan)))(raw) : [];

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unwrapEth = exports.wrapEth = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _utils = __webpack_require__(0);

var CoreUtils = _interopRequireWildcard(_utils);

var _contracts = __webpack_require__(1);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const wrapEth = exports.wrapEth = ({ web3, networkId, addresses }, {
  amount,
  getObject,
  txOpts
}) => {
  const wethContract = CoreUtils.getContractInstance(web3, (0, _contracts.getContracts)(networkId).WETH.abi, addresses.WETH);

  const txObj = wethContract.methods.deposit();

  if (getObject) {
    return txObj;
  }
  return txObj.send(_extends({}, txOpts, { value: amount }));
};

const unwrapEth = exports.unwrapEth = ({ web3, networkId, addresses }, {
  amount,
  getObject,
  txOpts
}) => {
  const wethContract = CoreUtils.getContractInstance(web3, (0, _contracts.getContracts)(networkId).WETH.abi, addresses.WETH);

  const txObj = wethContract.methods.withdraw(amount);

  if (getObject) {
    return txObj;
  }
  return txObj.send(txOpts);
};

/***/ }),
/* 119 */
/***/ (function(module, exports) {

module.exports = require("web3");

/***/ })
/******/ ]);
});