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
  $(document).on('click', '.cart-item--remove-link', function(e) { 
    e.preventDefault();
    var actions_group_id = $(this).data('bm-remove-ts');
    var jsonObj = {}
    $(this).closest('.cartitems--list').find("[data-bundle-ts='" + actions_group_id +"']").each(function() {
      var child_variant_id = $(this).data('cartitem-id');
      jsonObj[child_variant_id] = 0;
    });      
    var data = {updates: jsonObj};
    jQuery.ajax({
      type: 'POST',
      url: '/cart/update.js',
      data: data,
      dataType: 'json',
      success: function() { 
        location.href = '/cart'; 
      }
    });    
  });
 });