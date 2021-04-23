/**
 * Include your custom JavaScript here.
 *
 * We also offer some hooks so you can plug your own logic. For instance, if you want to be notified when the variant
 * changes on product page, you can attach a listener to the document:
 *
 * document.addEventListener('variant:changed', function(event) {
 *   var variant = event.detail.variant; // Gives you access to the whole variant details
 * });
 *
 * You can also add a listener whenever a product is added to the cart:
 *
 * document.addEventListener('product:added', function(event) {
 *   var variant = event.detail.variant; // Get the variant that was added
 *   var quantity = event.detail.quantity; // Get the quantity that was added
 * });
 *
 * If you just want to force refresh the mini-cart without adding a specific product, you can trigger the event
 * "cart:refresh" in a similar way (in that case, passing the quantity is not necessary):
 *
 * document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', {
 *   bubbles: true
 * }));
 */

 $(document).ready(function() {
  $(document).on('click', '.cart-custom_bundle-remove-link', function(e) { 
    e.preventDefault();
    var actions_group_id = $(this).data('bm-remove-ts');
    var line_items = [];
    $(this).closest('.cartitems--list').find('.cart-item').each(function(index) {
      var child_ts = $(this).data('bundle-ts');
      if(actions_group_id == child_ts) {
        line_items.push(index+1);
      }      
    });
    
    for (var i = 0; i < line_items.length; i++) {
      jQuery.ajax({
        type: 'POST',
        url: '/cart/change.js',
        data: { quantity: 0, line: line_items[0]},
        async: false,
        dataType: 'json',
        success: function() {          
        }
      });         
    }    
    location.href = '/cart'; 
  });

  $(document).on('click', '.cart-general-remove-link', function(e) { 
    e.preventDefault();
     var item_varient_id = $(this).closest('.cart-item').data('cartitem-id');    
     jQuery.ajax({
      type: 'POST',
      url: '/cart/update.js',
      data: { quantity: 0, id:item_varient_id},
      async: false,
      dataType: 'json',
      success: function() {          
      }
    });   

    location.href = '/cart'; 
  });

 });