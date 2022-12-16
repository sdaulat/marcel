"use strict";
require("dotenv").config();
var ApiContracts = require("authorizenet").APIContracts;
var ApiControllers = require("authorizenet").APIControllers;
//var utils = require("../utils.js");

exports.refundTransaction = (req, res) => {
  var merchantAuthenticationType =
    new ApiContracts.MerchantAuthenticationType();
  merchantAuthenticationType.setName(process.env.apiLoginKey);
  merchantAuthenticationType.setTransactionKey(
    process.env.transactionKey
  );

  var creditCard = new ApiContracts.CreditCardType();
  creditCard.setCardNumber(
    req.body.transactionRequest.payment.creditCard.cardNumber
  ); //("4242424242424242");
  creditCard.setExpirationDate(
    req.body.transactionRequest.payment.creditCard.expirationDate
  ); //("0822");
  creditCard.setCardCode(
    req.body.transactionRequest.payment.creditCard.cardCode
  ); //("999");

  var paymentType = new ApiContracts.PaymentType();
  paymentType.setCreditCard(creditCard);

  var transactionRequestType =
    new ApiContracts.TransactionRequestType();
  transactionRequestType.setTransactionType(
    ApiContracts.TransactionTypeEnum.REFUNDTRANSACTION
  );
  transactionRequestType.setPayment(paymentType);
  transactionRequestType.setAmount(utils.getRandomAmount());
  transactionRequestType.setRefTransId(req.params.transactionId);

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
