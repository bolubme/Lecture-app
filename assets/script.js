var webstore = new Vue({
  el: "#app",
  data: {
    siteheader: "After School Club",
    product: {
      id: 1001,
      subject: "Math",
      location: "London",
      price: 1000,
      image: "ty.jpeg",
      availableInventory: 5,
    },
    showProduct: true,
    cart: [],
  },
  methods: {
    addToCart: function () {
      this.cart.push(this.product.id);
    },
    showCheckout() {
      this.showProduct = this.showProduct ? false : true;
    },
  },
  computed: {
    cartItemCount: function () {
      return this.cart.length || "";
    },
    canAddToCart: function () {
      return this.product.availableInventory > this.cartItemCount;
    },
  },
});
