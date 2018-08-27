import * as CoreUtils from "../core/utils";
import { getContracts } from "../contracts";

export const changeCollateral = (
  { web3, networkId, addresses },
  { loanOrderHash, collateralTokenFilled, getObject, txOpts }
) => {
  const bZxContract = CoreUtils.getContractInstance(
    web3,
    getContracts(networkId).BZx.abi,
    addresses.BZx
  );

  const txObj = bZxContract.methods
    .changeCollateral(loanOrderHash, collateralTokenFilled);

  if (getObject) {
    return txObj;
  }
    return txObj.send(txOpts);
};

export const depositCollateral = (
  { web3, networkId, addresses },
  { loanOrderHash, collateralTokenFilled, depositAmount, getObject, txOpts }
) => {
  const bZxContract = CoreUtils.getContractInstance(
    web3,
    getContracts(networkId).BZx.abi,
    addresses.BZx
  );

  const txObj = bZxContract.methods
    .depositCollateral(
      loanOrderHash,
      collateralTokenFilled,
      depositAmount
    );

  if (getObject) {
    return txObj;
  }
    return txObj.send(txOpts);
};

export const withdrawExcessCollateral = (
  { web3, networkId, addresses },
  { loanOrderHash, collateralTokenFilled, withdrawAmount, getObject, txOpts }
) => {
  const bZxContract = CoreUtils.getContractInstance(
    web3,
    getContracts(networkId).BZx.abi,
    addresses.BZx
  );

  const txObj = bZxContract.methods
    .withdrawExcessCollateral(
      loanOrderHash,
      collateralTokenFilled,
      withdrawAmount
    );

  if (getObject) {
    return txObj;
  }
    return txObj.send(txOpts);
};

export const payInterest = (
  { web3, networkId, addresses },
  { loanOrderHash, trader, getObject, txOpts }
) => {
  const bZxContract = CoreUtils.getContractInstance(
    web3,
    getContracts(networkId).BZx.abi,
    addresses.BZx
  );

  const txObj = bZxContract.methods
    .payInterest(loanOrderHash, trader);

  if (getObject) {
    return txObj;
  }
    return txObj.send(txOpts);
};

export const getInterest = async (
  { web3, networkId, addresses },
  { loanOrderHash, trader }
) => {
  const bZxContract = CoreUtils.getContractInstance(
    web3,
    getContracts(networkId).BZx.abi,
    addresses.BZx
  );
  const data = await bZxContract.methods
    .getInterest(loanOrderHash, trader)
    .call();
  return {
    lender: data[0],
    interestTokenAddress: data[1],
    interestTotalAccrued: data[2],
    interestPaidSoFar: data[3]
  };
};

export const closeLoan = (
  { web3, networkId, addresses },
  { loanOrderHash, getObject, txOpts }
) => {
  const bZxContract = CoreUtils.getContractInstance(
    web3,
    getContracts(networkId).BZx.abi,
    addresses.BZx
  );

  const txObj = bZxContract.methods
    .closeLoan(loanOrderHash);

  if (getObject) {
    return txObj;
  }
    return txObj.send(txOpts);
};

export const withdrawProfit = (
  { web3, networkId, addresses },
  { loanOrderHash, getObject, txOpts }
) => {
  const bZxContract = CoreUtils.getContractInstance(
    web3,
    getContracts(networkId).BZx.abi,
    addresses.BZx
  );

  const txObj = bZxContract.methods
    .withdrawProfit(loanOrderHash);

  if (getObject) {
    return txObj;
  }
    return txObj.send(txOpts);
};

export const getProfitOrLoss = async (
  { web3, networkId, addresses },
  { loanOrderHash, trader }
) => {
  const bZxContract = await CoreUtils.getContractInstance(
    web3,
    getContracts(networkId).BZx.abi,
    addresses.BZx
  );

  const data = await bZxContract.methods
    .getProfitOrLoss(loanOrderHash, trader)
    .call();

  return {
    isProfit: data.isProfit,
    profitOrLoss: data.profitOrLoss,
    positionTokenAddress: data.positionTokenAddress
  };
};
