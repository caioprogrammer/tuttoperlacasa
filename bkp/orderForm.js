let obj = {
    "paymentConfiguration": {
        "requiresAuthenticationForPreAuthorizedPaymentOption": false,
        "allowInstallmentsMerge": null,
        "blockPaymentSession": null,
        "paymentSystemToCheckFirstInstallment": null,
        "defaultPaymentSystemToApplyOnUserOrderForm": null
    },
    "taxConfiguration": null,
    "minimumQuantityAccumulatedForItems": 1,
    "decimalDigitsPrecision": 2,
    "minimumValueAccumulated": 0,
    "apps": [],
    "allowMultipleDeliveries": false,
    "allowManualPrice": null,
    "savePersonalDataAsOptIn": false,
    "maxNumberOfWhiteLabelSellers": null,
    "maskFirstPurchaseData": null,
    "recaptchaValidation": "always",
    "maskStateOnAddress": null
}

const options = {
    method: 'POST',
    headers: {'Content-Type': 'application/json', Accept: 'application/json'},
    body: JSON.stringify(obj)
  };
  
  fetch('/api/checkout/pvt/configuration/orderForm', options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));