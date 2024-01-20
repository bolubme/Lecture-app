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
    searchWord: "",
    searchTemp: [],
    filterTemp: false
  },
  methods: {
    init() {
      this.showProduct = true;
      this.cart = [];
      this.order.firstName = "";
      this.order.phoneNumber = "";
      (this.searchWord = ""), (this.isNameValid = false);
      this.isPhoneValid = false;
      this.loadLessonData();
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
      const foundProduct =
        this.searchWord === ""
          ? this.products.find((p) => p.id === product.id)
          : this.searchTemp.find((p) => p.id === product.id);
    
      if (foundProduct && this.canAddToCart(foundProduct)) {
        this.cart.push(foundProduct);
        foundProduct.availableInventory--;
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

    loadLessonData: function () {
      console.log("Collecting lessons from database...");

      const url = "https://lecture-app.onrender.com/collections/lectures";

      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch data. Status: ${response.status}`);
          }
          return response.json();
        })
        .then((json) => {
          this.products = json;
          this.isLoading = false;
        })
        .catch((error) => {
          console.error("Error loading lesson data:", error);
          this.isLoading = false;
        });
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
        orderData.push({ id: lectures.id, courseName: lectures.subject });
        this.updateAvailability(lectures._id, lectures.availableInventory);
      });

      alert("Order Submitted!");
      const url = "https://lecture-app.onrender.com/collections/orders";
      const data = {
        name: this.order.firstName,
        phone: this.order.phoneNumber,
        lessonsOrdered: orderData,
      };
      this.init();

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

    findProductsByObjects(searchObjects) {
      const result = [];

      searchObjects.forEach((searchObj) => {
        const foundProduct = this.products.find((product) => {
          return product._id === searchObj._id;
        });

        if (foundProduct) {
          result.push(foundProduct);
        }
      });

      return result;
    },

    search() {
      if (this.searchWord.length > 0) {
        this.fetchSearchResults();
      } else {
      }
    },
    fetchSearchResults() {
      const query = encodeURIComponent(this.searchWord);
      const url = `http://localhost:3030/collections/lectures/search/${query}`;

      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          // this.products = data
          this.searchTemp = this.findProductsByObjects(data);
        })
        .catch((error) => {
          console.error("Error fetching search results:", error);
        });
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
      const field = this.sortField.toLowerCase();
      let order = this.filterOption === "ascending" ? 1 : -1;
    
      let filterList;
      if (this.searchWord === "") {
        filterList = this.products;
      } else {
        filterList = this.searchTemp;
      }
    
      return filterList.slice().sort((a, b) => {
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
