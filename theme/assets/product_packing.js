jQuery(function() {   
  $(".packing_bundle_cart_btn").on("click", function() {
    let quantity = $(".product_bundle_quantity").val();
    var timestamp = ( new Date() ).getTime()
    
    let formData = {
      'items': [
        {
          'id': $('.current_parent_packing').data('variant-id'),
          'quantity':parseInt(quantity, 0),
          "properties" : {
            '_bundle_ts': timestamp,
            '_bundle_master': 'true',
            '_bundle_type':'packing'
          }
        }
      ]
    };
    
    const variant_qty = $('.product_packing_item').data('variant-qty');
    
    formData.items.push({
      'id':$('.product_packing_item').data('variant-id'),
      'quantity':parseInt(quantity*variant_qty, 0),
      "properties" : {              
        '_bundle_ts': timestamp,
        '_bundle_slave': 'true',
        '_product_num':parseInt(variant_qty, 0),
        '_bundle_type':'packing'
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