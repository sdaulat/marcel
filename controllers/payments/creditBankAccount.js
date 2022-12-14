"use strict";
require("dotenv").config();
var ApiContracts = require("authorizenet").APIContracts;
var ApiControllers = require("authorizenet").APIControllers;
var SDKConstants = require("authorizenet").Constants;
//var utils = require("../utils.js");

exports.creditBankAccount = (req, res) => {
  var calculateAmount = () => {
    return 1000;
  };
  var merchantAuthenticationType =
    new ApiContracts.MerchantAuthenticationType();
  merchantAuthenticationType.setName(process.env.apiLoginKey);
  merchantAuthenticationType.setTransactionKey(
    process.env.transactionKey
  );

  var paymentType = new ApiContracts.PaymentType();

  var bankAccountType = new ApiContracts.BankAccountType();
  bankAccountType.setAccountType(
    ApiContracts.BankAccountTypeEnum.SAVINGS
  );
  bankAccountType.setRoutingNumber(
    req.body.transactionRequest.payment.bankAccount.routingNumber
  ); //('121042882');
  //added code
  var bankAccountNum = Math.floor(Math.random() * 9999999999) + 10000;
  bankAccountType.setAccountNumber(
    req.body.transactionRequest.payment.bankAccount.accountNumber
  ); //(bankAccountNum.toString());
  bankAccountType.setNameOnAccount(
    req.body.transactionRequest.payment.bankAccount.nameOnAccount
  ); //('John Doe');;
  paymentType.setBankAccount(bankAccountType);

  var orderDetails = new ApiContracts.OrderType();
  orderDetails.setInvoiceNumber(req.body.orderDetails.invoiceNumber); //("INV-12345");
  orderDetails.setDescription(req.body.orderDetails.description); //("Product Description");

  var transactionRequestType =
    new ApiContracts.TransactionRequestType();
  transactionRequestType.setTransactionType(
    ApiContracts.TransactionTypeEnum.REFUNDTRANSACTION
  );
  transactionRequestType.setPayment(paymentType);
  transactionRequestType.setRefTransId(
    req.body.transactionRequest.refTransId
  );
  transactionRequestType.setAmount(calculateAmount());
  transactionRequestType.setOrder(orderDetails);

  var createRequest = new ApiContracts.CreateTransactionRequest();
  createRequest.setMerchantAuthentication(merchantAuthenticationType);
  createRequest.setTransactionRequest(transactionRequestType);

  //pretty print request
  console.log(JSON.stringify(createRequest.getJSON(), null, 2));

  var ctrl = new ApiControllers.CreateTransactionController(
    createRequest.getJSON()
  );

  ctrl.execute(function () {
    var apiResponse = ctrl.getResponse();

    var response = new ApiContracts.CreateTransactionResponse(
      apiResponse
    );

    //pretty print response
    console.log(JSON.stringify(response, null, 2));

    if (response != null) {
      if (
        response.getMessages().getResultCode() ==
        ApiContracts.MessageTypeEnum.OK
      ) {
        if (response.getTransactionResponse().getMessages() != null) {
          console.log(
            "Successfully created transaction with Transaction ID: " +
              response.getTransactionResponse().getTransId()
          );
          console.log(
            "Response Code: " +
              response.getTransactionResponse().getResponseCode()
          );
          console.log(
            "Message Code: " +
              response
                .getTransactionResponse()
                .getMessages()
                .getMessage()[0]
                .getCode()
          );
          console.log(
            "Description: " +
              response
                .getTransactionResponse()
                .getMessages()
                .getMessage()[0]
                .getDescription()
          );

          res.status(200).json({
            transactionId: response
              .getTransactionResponse()
              .getTransId(),
            messageCode: response
              .getTransactionResponse()
              .getMessages()
              .getMessage()[0]
              .getCode(),
            description: response
              .getTransactionResponse()
              .getMessages()
              .getMessage()[0]
              .getDescription(),
          });
        } else {
          console.log("Failed Transaction.");
          if (response.getTransactionResponse().getErrors() != null) {
            console.log(
              "Error Code: " +
                response
                  .getTransactionResponse()
                  .getErrors()
                  .getError()[0]
                  .getErrorCode()
            );
            console.log(
              "Error message: " +
                response
                  .getTransactionResponse()
                  .getErrors()
                  .getError()[0]
                  .getErrorText()
            );

            res.status(500).json({
              errorCode: response
                .getTransactionResponse()
                .getErrors()
                .getError()[0]
                .getErrorCode(),
              errorMessage: response
                .getTransactionResponse()
                .getErrors()
                .getError()[0]
                .getErrorText(),
            });
          }
        }
      } else {
        console.log("Failed Transaction. ");
        if (
          response.getTransactionResponse() != null &&
          response.getTransactionResponse().getErrors() != null
        ) {
          console.log(
            "Error Code: " +
              response
                .getTransactionResponse()
                .getErrors()
                .getError()[0]
                .getErrorCode()
          );
          console.log(
            "Error message: " +
              response
                .getTransactionResponse()
                .getErrors()
                .getError()[0]
                .getErrorText()
          );

          res.status(500).json({
            errorCode: response
              .getTransactionResponse()
              .getErrors()
              .getError()[0]
              .getErrorCode(),
            errorMessage: response
              .getTransactionResponse()
              .getErrors()
              .getError()[0]
              .getErrorText(),
          });
        } else {
          console.log(
            "Error Code: " +
              response.getMessages().getMessage()[0].getCode()
          );
          console.log(
            "Error message: " +
              response.getMessages().getMessage()[0].getText()
          );

          res.status(500).json({
            errorCode: response
              .getTransactionResponse()
              .getErrors()
              .getError()[0]
              .getErrorCode(),
            errorMessage: response
              .getTransactionResponse()
              .getErrors()
              .getError()[0]
              .getErrorText(),
          });
        }
      }
    } else {
      console.log("Null Response.");
      res.status(500).json({
        message: "Null Response",
      });
    }
  });
};
