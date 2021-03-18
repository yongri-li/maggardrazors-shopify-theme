jQuery(function() { 
  var total_price = 0;
  var temp_value = 0; // value from special variants group
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
      total_price += parseFloat($(this).data('product-price'));
    } else {
      total_price += parseFloat($(this).data('product-price'));
    }
    temp_value = parseFloat($(this).data('product-price'));
    $('.product-bundle-price').text(formatMoney(total_price));
    $(this).parent().children('.product_bundle_varient').each(function() {
      $(this).removeClass('product_bundle_varient_selection');
    });
    $(this).addClass('product_bundle_varient_selection');
    $(this).closest('.product_bundle_wrap').children('.product-select-actions').children('.select-continue-btn').removeAttr("disabled");
    $(this).closest('.product_bundle_wrap').children('.product-select-actions').children('.select-continue-btn').removeClass("select-continue-btn-disable");
  });
  $(".select-continue-btn").on('click', function() {
    temp_value = 0;
    $(this).closest('.product_bundle_wrap').addClass('product_bundle_wrap_hide');
    const $bundleItem = $(this).closest('.product_bundle_items');
    $bundleItem.children('.product_bundle_items_header').removeClass('product_bundle_items_header_active');
    $bundleItem.children('.product_bundle_items_header').addClass('product_bundle_items_header_no_active');
    $bundleItem.next().children('.product_bundle_items_header').removeClass('product_bundle_items_header_disable_no_active');
    $bundleItem.next().children('.product_bundle_items_header').addClass('product_bundle_items_header_active');
    $bundleItem.next().children('.product_bundle_wrap').removeClass('product_bundle_wrap_hide');  
    var classes = $(this).attr("class");
    if(classes.includes('last-bundle--mark')) {
      $('.product_bundle_reviews').empty();
      $('.product_bundle_varient_selection').each(function(index) {
        $('<div>'+(index+1)+". " + $(this).data('product-name')+'</div>').appendTo($('.product_bundle_reviews'));
      });
      $('.product_bundle_cart_box').removeClass('product_bundle_add_cart_box_hide');
      $('.product_select_results').removeClass('product_select_results_hide');
    }
  });
  $(".select-not-need-btn").on('click', function() {
    temp_value = 0;
    const $bundleItem0 =  $(this).closest('.product_bundle_wrap');
    const $bundleItem = $(this).closest('.product_bundle_items');
    $bundleItem0.addClass('product_bundle_wrap_hide');
    $bundleItem0.children('.product_bundle_items_variants').children('.product_bundle_varient').removeClass('product_bundle_varient_selection');    
    $bundleItem.children('.product_bundle_items_header').removeClass('product_bundle_items_header_active');
    $bundleItem.children('.product_bundle_items_header').addClass('product_bundle_items_header_no_active');
    $bundleItem.next().children('.product_bundle_items_header').removeClass('product_bundle_items_header_no_active_disable');
    $bundleItem.next().children('.product_bundle_items_header').addClass('product_bundle_items_header_active');
    $bundleItem.next().children('.product_bundle_wrap').removeClass('product_bundle_wrap_hide');  
    var classes = $(this).attr("class");
    if(classes.includes('last-not-bundle')) {
      $('.product_bundle_reviews').empty();
      $('.product_bundle_varient_selection').each(function(index) {
        $('<div>'+(index+1)+". " + $(this).data('product-name')+'</div>').appendTo($('.product_bundle_reviews'));
      });
      $('.product_bundle_cart_box').removeClass('product_bundle_add_cart_box_hide');
    }  
  });
  $(".product_bundle_cart_btn").on("click", function() {
    let quantity = $(".product_bundle_quantity").val();
    
    let formData = {
      'items': [
        {
          'id': $('.product-details').data('product-variant-id'),
          'quantity':parseInt(quantity, 0)
        }
      ]
    };

    $('.product_bundle_varient_selection').each(function() {
        const discountPercent = $(this).data('discount-percent');
        const discountFixed = $(this).data('discount-fixed');
        
        if(discountPercent != "") {
          formData.items.push({
            'id':$(this).data('product-variant-id'),
            'quantity':parseInt(quantity, 0),
            "properties" : {
              '_discount-percent': discountPercent
            }
          });    
        } else if(discountFixed != "") {
          formData.items.push({
            'id':$(this).data('product-variant-id'),
            'quantity':parseInt(quantity, 0),
            "properties" : {
              '_discount-fixed': discountFixed
            }
          });    
        } else {
          formData.items.push({
            'id':$(this).data('product-variant-id'),
            'quantity':parseInt(quantity, 0)            
          });
        }
            
    });
    console.log(formData);
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
})