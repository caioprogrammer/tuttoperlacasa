// WARNING: THE USAGE OF CUSTOM SCRIPTS IS NOT SUPPORTED. VTEX IS NOT LIABLE FOR ANY DAMAGES THIS MAY CAUSE. THIS MAY BREAK YOUR STORE AND STOP SALES. IN CASE OF ERRORS, PLEASE DELETE THE CONTENT OF THIS SCRIPT.

// var SellerCode = {

//   init: function () {
//     var _this = this;

//     vtexjs.checkout.getOrderForm().then(function (orderForm) {
//       var sellerCode = orderForm && orderForm.openTextField && orderForm.openTextField.value;

//       sellerCode ? _this.sellerCodeAdded(undefined) : _this.sellerCode();
//     });

//     this.eventClick();
//   },

//   async sellerCodeRequest(sellerCode) {
//     $('#seller-code-add').addClass('disabled');
//     $('.seller-code-fields .help_error, .seller-code-fields .success').hide();
//     try {
//       const response = await fetch(`/api/dataentities/CV/search?codigodovendedor=${sellerCode}&_fields=codigodovendedor`, {
//         headers: {
//           Accept: 'application/vnd.vtex.ds.v10+json',
//           'Content-Type': 'application/json'
//         },
//         method: 'GET'
//       }).then((response) => {
//         return response.json();
//       })
//         .then((data) => {
//           checkout.update()
//           this.addSellerCode(sellerCode);
//           $('#seller-code-add').removeClass('disabled');
//         })
//     } catch (error) {
//       $('.seller-code-fields .help_error').text('Código inválido, revise o código digitado.').show();
//       $('#seller-code-add').removeClass('disabled');
//     }
//   },

//   addSellerCode: async function (code) {
//     try {
//       vtexjs.checkout.getOrderForm()
//         .then(function (orderForm) {
//           var marketingData = orderForm.marketingData;
//           marketingData = {
//             'coupon': '',
//             'utmSource': '',
//             'utmCampaign': `${code}`,
//             'utmMedium': '',
//             'utmiCampaign': ``,
//           };

//           return vtexjs.checkout.sendAttachment('marketingData', marketingData);
//         }).done(function (orderForm) {
//           console.log(orderForm.marketingData);
//         })
//     } catch (error) {
//       console.error(error);
//       $('.seller-code-fields .help_error')
//         .text('Algo deu errado, tente novamente')
//         .show();
//     }
//   },

//   sellerCode: function () {
//     var template = `
//     <div id="sellerCode" class="forms seller-code-column summary-seller-code-wrap text-center" data-bind="visible: checkout.hasShippingPreview()">
//       <div class="seller-code summary-seller-code">
//         <form class="seller-code-form" action="">
//           <fieldset class="seller-code-fieldset">
//             <div style="display: block">
//               <p class="seller-code-fields">
//                 <span>
//                   <input
//                     type="text"
//                     id="seller-code"
//                     class="seller-code-value input-small"
//                     placeholder="Código do Vendedor"
//                     data-i18n="[placeholder]totalizers.seller-codeCode;"
//                   />
//                   <button
//                     class="submit-add-seller"
//                     type="submit"
//                     id="cart-coupon-add"
//                     class="btn"
//                     data-i18n="global.add"
//                   >
//                     Adicionar
//                   </button>
//                 </span>
//                 <span
//                   class="success"
//                   style="display: none"
//                 >
//                 </span>
//                 <span class="help_error">
//                 </span>
//               </p>
//             </div>
//           </fieldset>
//         </form>
//       </div>
//     </div>
//     `;

//     $('.summary-totalizers.cart-totalizers .coupon-column').after(template);
//   },

//   sellerCodeAdded: function (sellerCode) {
//     var template = `
//   <div id="sellerCodeRemove" class="forms seller-code-column summary-seller-code-wrap text-center" data-bind="visible: checkout.hasShippingPreview()">
//     <div class="seller-code summary-seller-code">
//       <form class="seller-code-form" action="">
//         <fieldset class="seller-code-fieldset">
//           <div style="display: block">
//             <p class="seller-code-label">
//               <label for="seller-code" data-i18n="totalizers.seller-codeCapitalize"
//                 >Código do vendedor</label
//               >
//             </p>
//             <p class="seller-code-fields">
//               <span>
//                 <i id="seller-code-remove" class="seller-code-value">
//                   ${sellerCode ?? (vtexjs && vtexjs.checkout && vtexjs.checkout.orderForm && vtexjs.checkout.orderForm.openTextField && vtexjs.checkout.orderForm.openTextField.value)}
//                 </i>
//                 <button id="seller-code-remove-btn" class="btn" data-i18n="global.delete">
//                   Excluir
//                 </button>
//               </span>
//               <span class="success" style="display: none"></span>
//               <span class="help_error"></span>
//             </p>
//           </div>
//         </fieldset>
//       </form>
//     </div>
//   </div>
//   `;

//     $('.summary-totalizers.cart-totalizers .coupon-column').after(template);
//   },

  // sellerCodeRemove: function () {
  //   var _this = this;
  //   var sellerCode = vtexjs && vtexjs.checkout && vtexjs.checkout.orderForm && vtexjs.checkout.orderForm.openTextField && vtexjs.checkout.orderForm.openTextField.value;

  //   vtexjs.checkout
  //     .getOrderForm()
  //     .then(function (orderForm) {
  //       var marketingTag =
  //         vtexjs && vtexjs.checkout && vtexjs.checkout.orderForm && vtexjs.checkout.orderForm.marketingData && vtexjs.checkout.orderForm.marketingData.marketingTags && vtexjs.checkout.orderForm.marketingData.marketingTags.length;

  //       var marketingData = marketingTag
  //         ? {
  //           ...orderForm.marketingData,
  //           utmiCampaign: ''
  //         }
  //         : {
  //           ...orderForm.marketingData,
  //           marketingTags: [''],
  //           utmiCampaign: ''
  //         };

  //       return Promise.all([
  //         vtexjs.checkout.sendAttachment('openTextField', {}),
  //         vtexjs.checkout.sendAttachment('marketingData', marketingData)
  //       ]).catch(function (error) {
  //         console.error(error);
  //       });
  //     })
  //     .done(function () {
  //       $('.forms.seller-code-column').remove();
  //       _this.sellerCode();
  //       $('.seller-code-fields .success')
  //         .html('Código "<b>' + sellerCode + '</b>" foi excluido.')
  //         .show();
  //     });
  // },

//   eventClick: function () {
//     var _this = this;

//     $(document).on('submit', '.seller-code-form', function (e) {
//       e.preventDefault();
//       console.log($(e.target).prev().val())
//       var sellerCode = String($(e.target).prev().val());

//       _this.sellerCodeRequest(sellerCode);
//     });

//     $(document).on('click', '#seller-code-remove-btn', function (e) {
//       e.preventDefault();
//       _this.sellerCodeRemove();
//     });
//   }
// };





var sellerObject = {
  init: function () {
    vtexjs.checkout.getOrderForm().then(function (orderForm) {
      var sellerCode = orderForm && orderForm.openTextField && orderForm.openTextField.value;
      sellerCode ? sellerObject.sellerCodeAdded(sellerCode) : sellerObject.sellerCode();
    });

    this.eventClick();
  },

  sellerCode: function () {
    var template = `
    <div id="sellerCode" class="forms seller-code-column summary-seller-code-wrap text-center" data-bind="visible: checkout.hasShippingPreview()">
      <div class="seller-code summary-seller-code">
        <form class="seller-code-form" action="">
          <fieldset class="seller-code-fieldset">
            <div style="display: block">
              <p class="seller-code-fields">
                <span>
                  <input
                    type="text"
                    id="seller-code"
                    class="seller-code-value input-small"
                    placeholder="Código de Vendedor"
                    data-i18n="[placeholder]totalizers.seller-codeCode;"
                  />
                  <button
                    class="submit-add-seller"
                    type="submit"
                    id="cart-coupon-add"
                    class="btn"
                    data-i18n="global.add"
                  >
                    Adicionar
                  </button>
                </span>
                <span
                  class="success"
                  style="display: none"
                >
                </span>
                <span class="help_error">
                </span>
              </p>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
    `;
    $('.summary-totalizers.cart-totalizers .coupon-column').after(template);
  },

  sellerCodeAdded: function (sellerCode) {
    var template = `
    <div id="sellerCodeRemove" class="forms seller-code-column summary-seller-code-wrap text-center" data-bind="visible: checkout.hasShippingPreview()">
      <div class="seller-code summary-seller-code">
        <form class="seller-code-form" action="">
          <fieldset class="seller-code-fieldset">
            <div style="display: block">
              <p class="seller-code-label">
                <label for="seller-code" data-i18n="totalizers.seller-codeCapitalize">Código do vendedor</label>
              </p>
              <p class="seller-code-fields">
                <span>
                  <i id="seller-code-remove" class="seller-code-value">${sellerCode}</i>
                  <button id="seller-code-remove-btn" class="btn" data-i18n="global.delete">Excluir</button>
                </span>
                <span class="success" style="display: none"></span>
                <span class="help_error"></span>
              </p>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
    `;
    $('.summary-totalizers.cart-totalizers .coupon-column').after(template);
  },

  sellerCodeRemove: function () {
    vtexjs.checkout.getOrderForm().then(function (orderForm) {
      var marketingData = {
        ...orderForm.marketingData,
        marketingTags: [''],
        utmCampaign: ''
      };

      return Promise.all([
        vtexjs.checkout.sendAttachment('openTextField', {}),
        vtexjs.checkout.sendAttachment('marketingData', marketingData)
      ]).catch(function (error) {
        console.error(error);
      });
    }).then(function () {
      $('.forms.seller-code-column').remove();
      sellerObject.sellerCode();
      $('.seller-code-fields .success').html('Código foi excluído.').show();
    });
  },

  addSellerCode: function (idConsulta) {
    // Change button text to spinner
    var $submitButton = $('.submit-add-seller');
    var originalButtonText = $submitButton.html();
    $submitButton.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Carregando...');
  
    $.ajax({
      url: '/api/dataentities/CV/search?codigodovendedor=' + idConsulta + '&_fields=codigodovendedor',
      type: 'GET',
      dataType: 'json',
      crossDomain: true,
      success: function (response) {
        if (response.length) {
          var codigoVendedor = response[0].codigodovendedor;
          if (idConsulta == codigoVendedor) {
            vtexjs.checkout.getOrderForm().then(function (orderForm) {
              vtexjs.checkout.sendAttachment('marketingData', {
                utmCampaign: codigoVendedor
              });
  
              vtexjs.checkout.sendAttachment('openTextField', {
                value: codigoVendedor
              }).then(function () {
                $('.forms.seller-code-column').remove();
                sellerObject.sellerCodeAdded(codigoVendedor);
              });
            });
          }
        } else {
          $('.loading.loading-bg').css('display', 'none');
        }
      },
      error: function (err) {
        console.error('Erro:', err.responseText);
      },
      complete: function () {
        // Restore original button text
        $submitButton.html(originalButtonText);
      }
    });
  },

  eventClick: function () {
    $(document).on('submit', '.seller-code-form', function (e) {
      e.preventDefault();
      var sellerCode = $('input#seller-code').val();
      sellerObject.addSellerCode(sellerCode);
    });

    $(document).on('click', '#seller-code-remove-btn', function (e) {
      e.preventDefault();
      sellerObject.sellerCodeRemove();
    });
  }
};

$(window).load(function () {
  sellerObject.init();
});
