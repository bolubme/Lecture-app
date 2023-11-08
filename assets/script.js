var webstore = new Vue({
  el: "#app",
  data: {
    siteheader: "After School Club",
    products: products,
    showProduct: true,
    order: {
      firstName: "",
      phoneNumber: "",
    },
    cart: [],
    filterOption: "ascending",
    sortField: "Location",
    isNameValid: false,
    isPhoneValid: false,
    searchText: "",
  },
  methods: {
    productIndex(product) {
      return this.products.findIndex((p) => p.id === product.id);
    },

    addToCart(product) {
      const index = this.productIndex(product);
      if (index !== -1 && this.canAddToCart(product)) {
        this.cart.push(product.id);
        this.products[index].availableInventory--;
      }
    },
    showCheckout() {
      if (this.cart.length > 0) {
        this.showProduct = !this.showProduct;
      }
    },

    canAddToCart(product) {
      const productIndex = this.productIndex(product);
      return (
        productIndex !== -1 &&
        this.products[productIndex].availableInventory > 0
      );
    },

    getProductById(productId) {
      return this.products.find((product) => product.id === productId);
    },

    removeFromCart(productId) {
      if (this.cart.length === 1) {
        this.showProduct = true;
      }
      const index = this.cart.indexOf(productId);
      if (index !== -1) {
        this.cart.splice(index, 1);
        const product = this.getProductById(productId);
        if (product) {
          const productIndex = this.productIndex(product);
          if (productIndex !== -1) {
            this.products[productIndex].availableInventory++;
          }
        }
      }
    },

    validateName() {
      const pattern = /^[A-Za-z\s]+$/;
      this.isNameValid = pattern.test(this.order.firstName);
    },

    validatePhoneNumber() {
      const pattern = /^(\(?(0|\+44)[1-9]{1}\d{1,4}?\)?\s?\d{3,4}\s?\d{3,4})$/;
      this.isPhoneValid = pattern.test(this.order.phoneNumber);
    },

    submitForm() {
      alert("Order Submitted!");
      this.showProduct = true;
      this.cart = [];
      this.order.firstName = "";
      this.order.phoneNumber = "";
      this.isNameValid = false;
      this.isPhoneValid = false;
    },
  },
  computed: {
    cartItemCount: function () {
      return this.cart.length || "";
    },
    filteredProducts() {
      const query = this.searchText.toLowerCase();
      let filtered = this.products.filter((product) => {
        const subject = product.subject.toLowerCase();
        const location = product.location.toLowerCase();
        return subject.includes(query) || location.includes(query);
      });

      const field = this.sortField.toLowerCase();
      let order = this.filterOption === "ascending" ? 1 : -1;

      return filtered.slice().sort((a, b) => {
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

    isFormValid() {
      return this.isNameValid && this.isPhoneValid;
    },
  },
});
