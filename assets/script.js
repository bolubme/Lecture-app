var webstore = new Vue({
  el: "#app",
  data: {
    siteheader: "After School Club",
    products: [],
    showProduct: true,
    order: {
      firstName: "",
      phoneNumber: "",
    },
    cart: [],
    filterOption: "ascending",
    sortField: "Location",
    isLoading: true,
    isNameValid: false,
    isPhoneValid: false,
    searchText: "",
  },
  methods: {
    init() {
      this.showProduct = true;
      this.cart = [];
      this.order.firstName = "";
      this.order.phoneNumber = "";
      this.isNameValid = false;
      this.isPhoneValid = false;
    },

    productIndex(product) {
      return this.products.findIndex((p) => p.id === product.id);
    },

    updateAvailability(id, spaceNum) {
      fetch("https://lecture-app.onrender.com/collections/lectures/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          availableInventory: spaceNum,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          return data;
        })
        .catch((err) => {
          return data;
        });
    },

    addToCart(product) {
      const index = this.productIndex(product);
      if (index !== -1 && this.canAddToCart(product)) {
        this.cart.push(product);
        this.products[index].availableInventory--;
      }
      console.log(product);
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

    loadLessonData: async function () {
      console.log("Collecting database from lessons...");
      try {
        const response = await fetch(
          "https://lecture-app.onrender.com/collections/lectures"
        );
        const json = await response.json();
        this.products = json;
        this.isLoading = false;
      } catch (error) {
        console.error("Error loading lesson data:", error);
        this.isLoading = false;
      }
    },

    removeFromCart(product) {
      if (this.cart.length === 1) {
        this.showProduct = true;
      }
      const index = this.cart.indexOf(product);
      if (index !== 1) {
        this.cart.splice(index, 1);
        const productIndex = this.productIndex(product);
        this.products[productIndex].availableInventory++;
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

    orderNow() {
      const orderData = [];
      this.cart.forEach((lectures) => {
        orderData.push({ id: lectures.id });
        this.updateAvailability(lectures._id, lectures.availableInventory);
      });
      console.log(orderData);

      alert("Order Submitted!");
      const url = "https://lecture-app.onrender.com/collections/orders";
      const data = {
        name: this.order.firstName,
        phone: this.order.phoneNumber,
        lessonsOrdered: orderData,
      };
      this.init()

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => console.log("Success:", data))
        .catch((error) => console.error("Error:", error));
    },
  },
  computed: {
    isDataLoading() {
      return this.isLoading;
    },

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

  created: function () {
    this.loadLessonData();
  },
});
