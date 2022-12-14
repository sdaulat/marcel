const chargeCreditCard = require("./payments/chargeCreditCard");
const authorizeCreditCard = require("./payments/authorizeCreditCard");
const capturePreviouslyAuthorizedAmount = require("./payments/capturePreviousAuthorizedAmount");
const captureFundsAuthorizedThroughAnotherChannel = require("./payments/captureFundsAuthorizedThroughAnotherChannel");
const refundTransaction = require("./payments/refundTransaction");
const debitBankAccount = require("./payments/debitBankAccount");
const creditBankAccount = require("./payments/creditBankAccount");

module.exports = {
  chargeCreditCard,
  authorizeCreditCard,
  capturePreviouslyAuthorizedAmount,
  captureFundsAuthorizedThroughAnotherChannel,
  refundTransaction,
  debitBankAccount,
  creditBankAccount,
};
