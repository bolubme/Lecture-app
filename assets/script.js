var webstore = new Vue({
  el: "#app",
  data: {
    siteheader: "After School Club",
    products: products,
    showProduct: true,
    order: {
      firstName: "",
      lastName: "",
    },
    cart: [],
  },
  methods: {
    addToCart(product) {
      this.cart.push(product.id);
    },
    showCheckout() {
      this.showProduct = this.showProduct ? false : true;
    },
    submitForm() {
      alert("Order Submitted!");
    },

    canAddToCart(product) {
      return product.availableInventory > this.cartCount(product.id);
    },

    cartCount(id) {
      let count = 0;
      for (let i = 0; i < this.cart.length; i++) {
        if (this.cart[i] === id) {
          count++;
        }
      }
      return count;
    },
  },
  computed: {
    cartItemCount: function () {
      return this.cart.length || "";
    },
    itemsLeft() {
      return this.product.availableInventory - this.cartItemCount;
    },
  },
});
