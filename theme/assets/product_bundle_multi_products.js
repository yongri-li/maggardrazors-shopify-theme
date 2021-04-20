jQuery(function() { 
  var total_price = 0;
  var total_discounted_price = 0;
  var temp_value = 0; // value from special variants group
  var temp_discount_value = 0;
  $( ".product_bundle_items_header" ).on( "click", function() {
    var header_classes = $(this).attr("class");
    if(header_classes.includes('product_bundle_items_header_no_active')) {
      $(".product_bundle_items_header").not(this).removeClass('product_bundle_items_header_active');
      $(".product_bundle_items_header").not(this).addClass('product_bundle_items_header_no_active');    
      $(".product_bundle_items_header").not(this).parent().children('.product_bundle_wrap').addClass('product_bundle_wrap_hide');
      //hide the review page, hide quality input box
      $(".product_select_results").addClass('product_select_results_hide');
      $(".product_bundle_cart_box").addClass('product_bundle_add_cart_box_hide');

      var classes = $(this).parent().children('.product_bundle_wrap').attr("class");
      var classes_len = classes.split(" ").length;
      if(classes_len > 1) {
        $(this).removeClass('product_bundle_items_header_no_active');
        $(this).addClass('product_bundle_items_header_active');
        $(this).parent().children('.product_bundle_wrap').removeClass('product_bundle_wrap_hide');
      } else {
        $(this).removeClass('product_bundle_items_header_active');
        $(this).addClass('product_bundle_items_header_no_active');      
        $(this).parent().children('.product_bundle_wrap').addClass('product_bundle_wrap_hide');
      } 
    } else {
      console.log("wrap impossible")
    }    
  });
  $(".product_bundle_varient").on('click', function() {
    if(temp_value != 0) {
      total_price -= temp_value;
      total_discounted_price -= temp_discount_value;      
    } 
    total_price += parseFloat($(this).data('product-price'));
    if($(this).data('discount-percent') != "") {
      var addPercentAmount = parseFloat($(this).data('product-price'))*(100 - $(this).data('discount-percent'))/100;
      total_discounted_price += addPercentAmount;
      temp_discount_value = parseFloat($(this).data('product-price'))*(100 - $(this).data('discount-percent'))/100;
    } else if ($(this).data('discount-fixed') != "") {
      var addFixedAmount = parseFloat($(this).data('product-price')) - $(this).data('discount-fixed') * 100;
      total_discounted_price += addFixedAmount;
      temp_discount_value = addFixedAmount;
    } else {
      total_discounted_price += parseFloat($(this).data('product-price'));;
      temp_discount_value = parseFloat($(this).data('product-price'));
    }
    temp_value = parseFloat($(this).data('product-price'));
    $('.product-bundle-price .product_bundle_variant_price').text(formatMoney(total_price));
    $('.product-bundle-price .product_bundle_discount_price').text(formatMoney(total_discounted_price));
    $(this).parent().children('.product_bundle_varient').each(function() {
      $(this).removeClass('product_bundle_varient_selection');
    });
    $(this).addClass('product_bundle_varient_selection');
    $(this).closest('.product_bundle_wrap').children('.product-select-actions').children('.select-continue-btn').removeAttr("disabled");
    $(this).closest('.product_bundle_wrap').children('.product-select-actions').children('.select-continue-btn').removeClass("select-continue-btn-disable");
  });
  $('.product_variant_select').on('change', function() {
    var variant_id = $(this).find(':selected').data('product-variant-option-id');
    var variant_price = $(this).find(':selected').data('product-variant-option-price');
    var variant_old_price = variant_price;
    var variant_percent = $(this).find(':selected').data('option-discount-percent');
    var variant_fixed = $(this).find(':selected').data('option-discount-fixed');
    if(variant_percent != undefined) {
      variant_price = variant_price*(100 - variant_percent)/100;
      $(this).closest('.product_bundle_varient').attr('data-discount-percent', variant_percent);
    } else if (variant_fixed != undefined) {
      variant_price = variant_price - variant_fixed * 100;
      $(this).closest('.product_bundle_varient').attr('data-discount-fixed', variant_fixed);
    }
    $(this).closest('.product_bundle_varient').find('.product_bundle_variant_price').text(formatMoney(variant_old_price));
    $(this).closest('.product_bundle_varient').find('.product_bundle_discount_price').text(formatMoney(variant_price));
    $(this).closest('.product_bundle_varient').attr('data-product-variant-id', variant_id);
  });
  $(".select-continue-btn").on('click', function() {
    temp_value = 0;
    temp_discount_value = 0;
    $(this).closest('.product_bundle_wrap').addClass('product_bundle_wrap_hide');
    const $bundleItem = $(this).closest('.product_bundle_items');
    $bundleItem.children('.product_bundle_items_header').removeClass('product_bundle_items_header_active');
    $bundleItem.children('.product_bundle_items_header').addClass('product_bundle_items_header_no_active');
    $bundleItem.nextAll('.product_bundle_items').eq(0).find('.product_bundle_items_header').removeClass('product_bundle_items_header_disable_no_active');
    $bundleItem.nextAll('.product_bundle_items').eq(0).find('.product_bundle_items_header').addClass('product_bundle_items_header_active');
    $bundleItem.nextAll('.product_bundle_items').eq(0).find('.product_bundle_wrap').removeClass('product_bundle_wrap_hide');  
    var classes = $(this).attr("class");
    if(classes.includes('last-bundle--mark')) {
      $('.product_bundle_reviews').empty();
      $('.product_bundle_varient_selection').each(function(index) {
        if($(this).data('product-quantity') != undefined) {
          $('<div>'+(index+1)+". " + $(this).data('product-name')+'( <b>Quantity</b>: '+$(this).data('product-quantity')+' )</div>').appendTo($('.product_bundle_reviews'));
        } else {
          $('<div>'+(index+1)+". " + $(this).data('product-name')+'</div>').appendTo($('.product_bundle_reviews'));
        }        
      });
      $('.product_bundle_cart_box').removeClass('product_bundle_add_cart_box_hide');
      $('.product_select_results').removeClass('product_select_results_hide');
    }
  });
  $(".select-not-need-btn").on('click', function() {
    temp_value = 0;
    temp_discount_value = 0;
    const $bundleItem0 =  $(this).closest('.product_bundle_wrap');
    const $bundleItem = $(this).closest('.product_bundle_items');
    $bundleItem0.addClass('product_bundle_wrap_hide');
    $bundleItem0.children('.product_bundle_items_variants').children('.product_bundle_varient').removeClass('product_bundle_varient_selection');    
    $bundleItem.children('.product_bundle_items_header').removeClass('product_bundle_items_header_active');
    $bundleItem.children('.product_bundle_items_header').addClass('product_bundle_items_header_no_active');
    $bundleItem.nextAll('.product_bundle_items').eq(0).find('.product_bundle_items_header').removeClass('product_bundle_items_header_no_active_disable');
    $bundleItem.nextAll('.product_bundle_items').eq(0).find('.product_bundle_items_header').addClass('product_bundle_items_header_active');
    $bundleItem.nextAll('.product_bundle_items').eq(0).find('.product_bundle_wrap').removeClass('product_bundle_wrap_hide');  
    var classes = $(this).attr("class");
    if(classes.includes('last-not-bundle')) {
      $('.product_bundle_reviews').empty();
      $('.product_bundle_varient_selection').each(function(index) {
        $('<div>'+(index+1)+". " + $(this).data('product-name')+'</div>').appendTo($('.product_bundle_reviews'));
      });
      $('.product_bundle_cart_box').removeClass('product_bundle_add_cart_box_hide');
    } 
    if(classes.includes('last-bundle--mark')) {
      $('.product_bundle_reviews').empty();
      $('.product_bundle_varient_selection').each(function(index) {
        $('<div>'+(index+1)+". " + $(this).data('product-name')+'</div>').appendTo($('.product_bundle_reviews'));
      });
      $('.product_bundle_cart_box').removeClass('product_bundle_add_cart_box_hide');
      $('.product_select_results').removeClass('product_select_results_hide');
    } 
  });
  $(".product_bundle_cart_btn").on("click", function() {
    let quantity = $(".product_bundle_quantity").val();
    var timestamp = ( new Date() ).getTime()
    
    let formData = {
      'items': [
        {
          'id': $('.product-details').data('product-variant-id'),
          'quantity':parseInt(quantity, 0),
          "properties" : {
            '_bundle_ts': timestamp,
            '_bundle_master': 'true'
          }
        }
      ]
    };

    $('.product_bundle_varient_selection').each(function() {
        var discountPercent = $(this).data('discount-percent');
        var discountFixed = $(this).data('discount-fixed');
        var individual_quantity = $(this).data('product-quantity');
        var individual_product_quantity = 0;
        if (individual_quantity != undefined) {
          individual_product_quantity = parseInt(individual_quantity);
        } else {
          individual_product_quantity = 1;
        }

        if(discountPercent != "") {
          formData.items.push({
            'id':$(this).data('product-variant-id'),
            'quantity':parseInt(quantity*individual_product_quantity, 0),
            "properties" : {
              '_discount-percent': discountPercent,
              '_bundle_ts': timestamp,
              '_bundle_slave': 'true'
            }
          });    
        } else if(discountFixed != "") {
          formData.items.push({
            'id':$(this).data('product-variant-id'),
            'quantity':parseInt(quantity*individual_product_quantity, 0),
            "properties" : {
              '_discount-fixed': discountFixed*100*parseInt(quantity*individual_product_quantity, 0),
              '_bundle_ts': timestamp,
              '_bundle_slave': 'true'
            }
          });    
        } else {
          formData.items.push({
            'id':$(this).data('product-variant-id'),
            'quantity':parseInt(quantity*individual_product_quantity, 0),
            "properties" : {              
              '_bundle_ts': timestamp,
              '_bundle_slave': 'true'
            }          
          });
        }
            
    });  

    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      location.href = "/cart";
      //return response.json();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  });

  //show the bundle minimum price
  $(window).on('load', function() {
    var total_minimum_price = 0;
    $('.product_bundle_wrap').each(function() {
      //console.log($(this).find('.item_discount_value').data('item-discount-price')+",");
      var temp_minimum = 0;
      var dont_required = $(this).find('.select-not-need-btn').length;
      if(dont_required > 0) {
        temp_minimum = 0;
      } else {
        $(this).find('.item_discount_value').each(function(index) {
          var item_value = $(this).data('item-discount-price');
          if(index == 0) {
            temp_minimum = item_value;
          } else {
            if(temp_minimum > item_value) {
              temp_minimum = item_value;
            }
          }
        });
      }      
      console.log(temp_minimum);
      total_minimum_price+=parseFloat(temp_minimum);
    });

    $('.bundle_minimum_price').text('From '+ formatMoney(total_minimum_price));
    //console.log("Total...", total_minimum_price)
  });
})