const controller = require("../controllers/payment.controllers");

module.exports = function (app) {
  app.post(
    "/api/payment/charge-credit-card",
    controller.chargeCreditCard.chargeCreditCard
  );
  app.post(
    "/api/payment/authorize-credit-card",
    controller.authorizeCreditCard.authorizeCreditCard
  );
  app.post(
    `/api/payment/capture-previous-authorized-payment/:transactionId`,
    controller.capturePreviouslyAuthorizedAmount
      .capturePreviouslyAuthorizedAmount
  );
  app.post(
    `/api/payment/capture-funds-authorized-from-another-channel`,
    controller.captureFundsAuthorizedThroughAnotherChannel
      .captureFundsAuthorizedThroughAnotherChannel
  );

  app.post(
    `/api/payment/refund-transaction/:transactionId`,
    controller.refundTransaction.refundTransaction
  );
  app.post(
    `/api/payment/debit-bank-account`,
    controller.debitBankAccount.debitBankAccount
  );
  app.post(
    `/api/payment/credit-bank-account`,
    controller.creditBankAccount.creditBankAccount
  );
};
