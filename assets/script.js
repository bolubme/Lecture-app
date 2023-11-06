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
    filterOption: "ascending",
    sortField: "Location",
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
    sortedProducts() {
      const field = this.sortField.toLowerCase();
      let order = this.filterOption === "ascending" ? 1 : -1;

      return this.products.slice().sort((a, b) => {
        if (field === "location")
          return order * a.location.localeCompare(b.location);
        if (field === "price") return order * (a.price - b.price);
        if (field === "subject")
          return order * a.subject.localeCompare(b.subject);
        if (field === "spaces")
          return order * (a.availableInventory - b.availableInventory);
        if (field === "rating") return order * (a.rating - b.rating);
        return 0;
      });
    },
  },
});
