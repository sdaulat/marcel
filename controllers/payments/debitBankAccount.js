"use strict";
require("dotenv").config();
var ApiContracts = require("authorizenet").APIContracts;
var ApiControllers = require("authorizenet").APIControllers;
//var utils = require("../utils.js");
var constants = require("../../constants.js");

exports.debitBankAccount = (req, res) => {
  var calculateAmount = () => {
    return 1000;
  };
  var merchantAuthenticationType =
    new ApiContracts.MerchantAuthenticationType();
  merchantAuthenticationType.setName(process.env.apiLoginKey);
  merchantAuthenticationType.setTransactionKey(
    process.env.transactionKey
  );

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
  ); //('John Doe');

  var paymentType = new ApiContracts.PaymentType();
  paymentType.setBankAccount(bankAccountType);

  var orderDetails = new ApiContracts.OrderType();
  orderDetails.setInvoiceNumber(req.body.orderDetails.invoiceNumber); //("INV-12345");
  orderDetails.setDescription(req.body.orderDetails.description); //("Product Description");

  var tax = new ApiContracts.ExtendedAmountType();
  tax.setAmount(req.body.transactionRequest.tax.amount); //("4.26");
  tax.setName(req.body.transactionRequest.tax.name); //("level2 tax name");
  tax.setDescription(req.body.transactionRequest.tax.description); //("level2 tax");

  var duty = new ApiContracts.ExtendedAmountType();
  duty.setAmount(req.body.transactionRequest.duty.amount); //("8.55");
  duty.setName(req.body.transactionRequest.duty.name); //("duty name");
  duty.setDescription(req.body.transactionRequest.duty.description); //("duty description");

  var shipping = new ApiContracts.ExtendedAmountType();
  shipping.setAmount(req.body.transactionRequest.shipping.amount); //("8.55");
  shipping.setName(req.body.transactionRequest.shipping.name); //("shipping name");
  shipping.setDescription(
    req.body.transactionRequest.shipping.description
  ); //("shipping description");

  var billTo = new ApiContracts.CustomerAddressType();
  billTo.setFirstName(req.body.transactionRequest.billTo.firstName); //("Ellen");
  billTo.setLastName(req.body.transactionRequest.billTo.lastName); //("Johnson");
  billTo.setCompany(req.body.transactionRequest.billTo.company); //("Souveniropolis");
  billTo.setAddress(req.body.transactionRequest.billTo.address); //("14 Main Street");
  billTo.setCity(req.body.transactionRequest.billTo.city); //("Pecan Springs");
  billTo.setState(req.body.transactionRequest.billTo.state); //("TX");
  billTo.setZip(req.body.transactionRequest.billTo.zip); //("44628");
  billTo.setCountry(req.body.transactionRequest.billTo.country); //("USA");

  var shipTo = new ApiContracts.CustomerAddressType();
  shipTo.setFirstName(req.body.transactionRequest.shipTo.firstName); //("China");
  shipTo.setLastName(req.body.transactionRequest.shipTo.lastName); //("Bayles");
  shipTo.setCompany(req.body.transactionRequest.shipTo.company); //("Thyme for Tea");
  shipTo.setAddress(req.body.transactionRequest.shipTo.address); //("12 Main Street");
  shipTo.setCity(req.body.transactionRequest.shipTo.city); //("Pecan Springs");
  shipTo.setState(req.body.transactionRequest.shipTo.state); //("TX");
  shipTo.setZip(req.body.transactionRequest.shipTo.zip); //("44628");
  shipTo.setCountry(req.body.transactionRequest.shipTo.country); //("USA");

  var lineItem_id1 = new ApiContracts.LineItemType();
  lineItem_id1.setItemId(
    req.body.transactionRequest.lineItems.lineItem.itemId
  ); //("1");
  lineItem_id1.setName(
    req.body.transactionRequest.lineItems.lineItem.name
  ); //("vase");
  lineItem_id1.setDescription(
    req.body.transactionRequest.lineItems.lineItem.description
  ); //("cannes logo");
  lineItem_id1.setQuantity(
    req.body.transactionRequest.lineItems.lineItem.quantity
  ); //("18");
  lineItem_id1.setUnitPrice(
    req.body.transactionRequest.lineItems.lineItem.unitPrice
  ); //(45.0);

  var lineItem_id2 = new ApiContracts.LineItemType();
  lineItem_id2.setItemId(
    req.body.transactionRequest.lineItems.lineItem.itemId
  ); //("2");
  lineItem_id2.setName(
    req.body.transactionRequest.lineItems.lineItem.name
  ); //("vase2");
  lineItem_id2.setDescription(
    req.body.transactionRequest.lineItems.lineItem.description
  ); //("cannes logo2");
  lineItem_id2.setQuantity(
    req.body.transactionRequest.lineItems.lineItem.quantity
  ); //("28");
  lineItem_id2.setUnitPrice(
    req.body.transactionRequest.lineItems.lineItem.unitPrice
  ); //("25.00");

  var lineItemList = [];
  lineItemList.push(lineItem_id1);
  lineItemList.push(lineItem_id2);

  var lineItems = new ApiContracts.ArrayOfLineItem();
  lineItems.setLineItem(lineItemList);

  var transactionRequestType =
    new ApiContracts.TransactionRequestType();
  transactionRequestType.setTransactionType(
    ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION
  );
  transactionRequestType.setPayment(paymentType);
  transactionRequestType.setAmount(calculateAmount());
  transactionRequestType.setLineItems(lineItems);
  transactionRequestType.setOrder(orderDetails);
  transactionRequestType.setTax(tax);
  transactionRequestType.setDuty(duty);
  transactionRequestType.setShipping(shipping);
  transactionRequestType.setBillTo(billTo);
  transactionRequestType.setShipTo(shipTo);

  var createRequest = new ApiContracts.CreateTransactionRequest();
  createRequest.setRefId("123456");
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
