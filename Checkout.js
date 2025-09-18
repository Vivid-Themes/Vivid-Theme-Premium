//-----------------PAYMENT METHODS------------------------------------//

function initializeNewPaymentMethods() {
  const paymentWidgets = document.querySelectorAll("#payment-settings .widget");

  paymentWidgets.forEach((widget) => {
    const title = widget.querySelector("h2").textContent.trim();
    const links = widget.querySelectorAll(".widget-content ul li a");

    // Check "Active" status
    let isActive = true;
    links.forEach((link) => {
      if (link.textContent.trim().toLowerCase() === "active") {
        if (link.getAttribute("href").toLowerCase() === "false") {
          isActive = false;
        }
      }
    });

    if (!isActive) {
      // Hide payment method option in selection
      const optionMap = {
        Paypal: "paypal",
        EasyPaisa: "easypaisa",
        "Bank Transfer": "bank",
        "UPI Transfer": "upi",
        "Cash on Delivery": "cod",
      };

      const methodKey = optionMap[title];
      if (methodKey) {
        const optionElement = document.querySelector(
          `.payment-option[onclick*="${methodKey}"]`
        );
        if (optionElement) optionElement.style.display = "none";
      }

      // Hide payment form template
      const formMap = {
        Paypal: "paypal-form",
        EasyPaisa: "easypaisa-form",
        "Bank Transfer": "bank-form",
        "UPI Transfer": "upi-form",
      };

      const formId = formMap[title];
      if (formId) {
        const formElement = document.getElementById(formId);
        if (formElement) formElement.style.display = "none";
      }
      return; // Skip processing this method
    }

    // Process active payment methods
    if (title === "Paypal") {
      links.forEach((link) => {
        if (link.textContent.trim().toLowerCase() === "paypal") {
          const paypalLink = link.getAttribute("href");
          if (paypalLink) {
            const paypalButton = document.getElementById(
              "paypal-redirect-button"
            );
            if (paypalButton) {
              paypalButton.setAttribute("data-paypal-link", paypalLink);
            }
          }
        }
      });
    } else if (title === "EasyPaisa") {
      const form = document.getElementById("easypaisa-form");
      if (form) {
        links.forEach((link) => {
          const label = link.textContent.trim().toLowerCase();
          if (label.includes("account name")) {
            form.querySelector(".info-box:nth-of-type(1) p").textContent =
              link.getAttribute("href");
          } else if (label.includes("account number")) {
            form.querySelector(".info-box:nth-of-type(2) p").textContent =
              link.getAttribute("href");
          } else if (label.includes("qr code")) {
            form.querySelector(".qr-code").src = link.getAttribute("href");
          }
        });
      }
    } else if (title === "Bank Transfer") {
      const form = document.getElementById("bank-form");
      if (form) {
        links.forEach((link) => {
          const label = link.textContent.trim().toLowerCase();
          if (label.includes("account name")) {
            form.querySelector(".info-box:nth-of-type(1) p").textContent =
              link.getAttribute("href");
          } else if (label.includes("account number")) {
            form.querySelector(".info-box:nth-of-type(2) p").textContent =
              link.getAttribute("href");
          } else if (label.includes("bank name")) {
            form.querySelector(".info-box:nth-of-type(3) p").textContent =
              link.getAttribute("href");
          } else if (label.includes("ifsc")) {
            form.querySelector(".info-box:nth-of-type(4) p").textContent =
              link.getAttribute("href");
          }
        });
      }
    } else if (title === "UPI Transfer") {
      const upiDetailsContainer = document.getElementById(
        "upi-options-container-template"
      );
      if (upiDetailsContainer) {
        const upiOptionsContainer = document.createElement("div");
        upiOptionsContainer.className = "upi-options-container";

        links.forEach((link) => {
          const label = link.textContent.trim().toLowerCase();
          if (label !== "active") {
            const name = link.textContent.trim();
            const qrUrl = link.getAttribute("href");

            const optionDiv = document.createElement("div");
            optionDiv.className = "upi-payment-option";
            optionDiv.innerHTML = `
              <img src="${qrUrl}" alt="${name} UPI QR Code" class="qr-code">
              <h3>${name}</h3>
            `;
            upiOptionsContainer.appendChild(optionDiv);
          }
        });
        upiDetailsContainer.appendChild(upiOptionsContainer);
      }
    }
  });
}

//---------------------------------------Checkout Page Original Script--------------------------------//

let selectedPaymentMethod = null;
let customerData = {};
let currentTab = "contact-section";

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function generateOrderId() {
  const orders = JSON.parse(localStorage.getItem("bloggerStoreOrders") || "[]");
  const orderCount = orders.length + 1;
  return `ORD-${1000 + orderCount}`;
}

const checkoutCart = {
  getCart: function () {
    try {
      const cart = localStorage.getItem("simpleCart");
      if (!cart || cart === "[]") return [];
      const parsedCart = JSON.parse(cart);
      return Array.isArray(parsedCart)
        ? parsedCart.map((item) => ({
            id: item.id || "missing-id",
            title: item.title || "Untitled Product",
            image: item.image || "https://via.placeholder.com/80?text=No+Image",
            currentPrice: item.currentPrice || "$0.00",
            oldPrice: item.oldPrice || "",
            variant: item.variant || {},
            quantity: item.quantity || 1,
            variantKey: item.variantKey || "",
          }))
        : [];
    } catch (e) {
      console.error("Error loading cart:", e);
      return [];
    }
  },
  getCurrency: function () {
    const cart = this.getCart();
    if (cart.length > 0) {
      const price = cart[0].currentPrice || "$0.00";
      const match = price.match(/[$₹₨Rs]*/);
      return match && match[0] ? match[0] : "$";
    }
    return "$";
  },
  calculateTotals: function () {
    const cart = this.getCart();
    let subtotal = 0;
    cart.forEach((item) => {
      const priceStr = item.currentPrice.replace(/[^0-9.-]/g, "");
      const price = parseFloat(priceStr) || 0;
      subtotal += price * item.quantity;
    });
    const shipping = this.calculateShipping(subtotal);
    const total = subtotal + shipping;
    return {
      subtotal,
      shipping,
      total,
    };
  },
  calculateShipping: function (subtotal) {
    if (subtotal === 0) return 0;
    return subtotal > 50 ? 0 : 5.99;
  },
  updateOrderSummary: function () {
    const cart = this.getCart();
    const currency = this.getCurrency();
    const cartItemsContainer = document.getElementById("cart-items");
    if (!cartItemsContainer) return;
    const totals = this.calculateTotals();
    cartItemsContainer.innerHTML = "";
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="empty-cart-message">
          <i class="bi bi-bag-x"></i>
          <p>Your cart is empty</p>
        </div>
      `;
    } else {
      cart.forEach((item) => {
        const price =
          parseFloat(item.currentPrice.replace(/[^0-9.-]/g, "")) || 0;
        const itemTotal = price * item.quantity;
        let variantText = "";
        if (item.variant && typeof item.variant === "object") {
          variantText = Object.values(item.variant)
            .filter((val) => val && val !== "undefined")
            .join(" / ");
        }
        const itemElement = document.createElement("div");
        itemElement.className = "cart-item";
        itemElement.innerHTML = `
          <img src="${item.image}" alt="${
          item.title
        }" loading="lazy" class="cart-item-image">
          <div class="cart-item-details">
            <h4 class="cart-item-title">${item.title}</h4>
            ${
              variantText
                ? `<div class="cart-item-variant">${variantText}</div>`
                : ""
            }
            <div class="cart-item-meta">
              <span class="cart-item-quantity">Qty: ${item.quantity}</span>
              <span class="cart-item-price">${item.currentPrice}</span>
            </div>
          </div>
        `;
        cartItemsContainer.appendChild(itemElement);
      });
    }
    document.getElementById(
      "cart-subtotal"
    ).textContent = `${currency}${totals.subtotal.toFixed(2)}`;
    document.getElementById("cart-shipping").textContent =
      totals.shipping === 0
        ? "Free"
        : `${currency}${totals.shipping.toFixed(2)}`;
    document.getElementById(
      "cart-total"
    ).textContent = `${currency}${totals.total.toFixed(2)}`;
    const codTotalElement = document.getElementById("cod-total");
    if (codTotalElement) {
      codTotalElement.textContent = `${currency}${totals.total.toFixed(2)}`;
    }
  },
  getOrderDetailsHTML: function () {
    const cart = this.getCart();
    const currency = this.getCurrency();
    const totals = this.calculateTotals();
    if (cart.length === 0) {
      return '<div class="empty-cart-message">Your cart is empty</div>';
    }
    let itemsHTML = cart
      .map((item) => {
        const price =
          parseFloat(item.currentPrice.replace(/[^0-9.-]/g, "")) || 0;
        const itemTotal = price * item.quantity;
        let variantText = "";
        if (item.variant && typeof item.variant === "object") {
          variantText = Object.values(item.variant)
            .filter((val) => val && val !== "undefined")
            .join(" / ");
        }
        return `
        <div class="cart-item" >
          <img src="${item.image}" alt="${item.title}" loading="lazy" >
          <div class="cart-item-details">
            <h4 >${item.title}</h4>
            ${variantText ? `<div >${variantText}</div>` : ""}
            <div >
              <span>${item.quantity} × ${item.currentPrice}</span>
              <strong>${currency}${itemTotal.toFixed(2)}</strong>
            </div>
          </div>
        </div>
      `;
      })
      .join("");
    return `
        <h3>Order Summary</h3>
        ${itemsHTML}
        <div class="order-totals">
          <div >
            <span>Subtotal</span>
            <span>${currency}${totals.subtotal.toFixed(2)}</span>
          </div>
          <div >
            <span>Shipping</span>
            <span>${
              totals.shipping === 0
                ? "Free"
                : `${currency}${totals.shipping.toFixed(2)}`
            }</span>
          </div>
          <div >
            <span>Total</span>
            <span>${currency}${totals.total.toFixed(2)}</span>
          </div>
        </div>
    `;
  },
};

function showTab(tabId) {
  const tabs = ["contact-section", "shipping-section", "selection", "details"];
  const steps = [
    "step-contact",
    "step-shipping",
    "step-selection",
    "step-details",
  ];
  tabs.forEach((tab) => {
    const tabElement = document.getElementById(tab);
    if (tabElement) tabElement.classList.add("hidden");
  });
  steps.forEach((step) => {
    const stepElement = document.getElementById(step);
    if (stepElement) {
      stepElement.classList.remove("active", "completed");
      if (steps.indexOf(`step-${tabId.replace("-section", "")}`) > -1) {
        if (step === `step-${tabId.replace("-section", "")}`) {
          stepElement.classList.add("active");
        } else if (
          steps.indexOf(step) <
          steps.indexOf(`step-${tabId.replace("-section", "")}`)
        ) {
          stepElement.classList.add("completed");
        }
      }
    }
  });
  const targetTab = document.getElementById(tabId);
  if (targetTab) {
    targetTab.classList.remove("hidden");
    currentTab = tabId;
  }
  if (tabId === "details" && selectedPaymentMethod) {
    loadDetailsTab();
  }
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateContact() {
  const email = document.getElementById("email").value;
  const emailError = document.getElementById("email-error");
  let isValid = true;
  if (!validateEmail(email)) {
    emailError.classList.remove("hidden");
    document.getElementById("email").classList.add("input-error");
    isValid = false;
  } else {
    emailError.classList.add("hidden");
    document.getElementById("email").classList.remove("input-error");
  }
  return isValid;
}

function validateShipping() {
  const fields = ["name", "address", "city", "state", "country", "zip"];
  let isValid = true;
  fields.forEach((field) => {
    const input = document.getElementById(field);
    const error = document.getElementById(`${field}-error`);
    if (!input.value.trim()) {
      error.classList.remove("hidden");
      input.classList.add("input-error");
      isValid = false;
    } else {
      error.classList.add("hidden");
      input.classList.remove("input-error");
    }
  });
  if (!document.getElementById("same-as-shipping").checked) {
    const billingFields = [
      "checkout-billing-name",
      "checkout-billing-address",
      "checkout-billing-city",
      "checkout-billing-state",
      "checkout-billing-country",
      "checkout-billing-zip",
    ];
    billingFields.forEach((field) => {
      const input = document.getElementById(field);
      const error = document.getElementById(`${field}-error`);
      if (!input.value.trim()) {
        error.classList.remove("hidden");
        input.classList.add("input-error");
        isValid = false;
      } else {
        error.classList.add("hidden");
        input.classList.remove("input-error");
      }
    });
  }
  return isValid;
}

function selectMethod(method) {
  selectedPaymentMethod = method;
  document.querySelectorAll(".payment-option").forEach((option) => {
    option.classList.remove("selected");
  });
  const selectedOption = document.querySelector(
    `.payment-option[onclick="selectMethod('${method}')"]`
  );
  if (selectedOption) selectedOption.classList.add("selected");
  const nextButton = document.getElementById("next-button");
  if (nextButton) nextButton.classList.remove("hidden");
}

function loadDetailsTab() {
  const formContent = document.getElementById("form-content");
  const paymentIcon = document.getElementById("payment-icon");

  customerData = {
    email: document.getElementById("email").value || "",
    phone: document.getElementById("phone").value || "",
    notes: document.getElementById("notes").value || "",
    paymentMethod: selectedPaymentMethod,
    shippingAddress: {
      name: document.getElementById("name").value || "",
      address: document.getElementById("address").value || "",
      city: document.getElementById("city").value || "",
      state: document.getElementById("state").value || "",
      country: document.getElementById("country").value || "",
      zip: document.getElementById("zip").value || "",
    },
  };

  if (document.getElementById("same-as-shipping").checked) {
    customerData.billingAddress = { ...customerData.shippingAddress };
  } else {
    customerData.billingAddress = {
      name: document.getElementById("checkout-billing-name").value || "",
      address: document.getElementById("checkout-billing-address").value || "",
      city: document.getElementById("checkout-billing-city").value || "",
      state: document.getElementById("checkout-billing-state").value || "",
      country: document.getElementById("checkout-billing-country").value || "",
      zip: document.getElementById("checkout-billing-zip").value || "",
    };
  }

  let paymentFormContent = "";
  const iconMap = {
    cod: "https://img.icons8.com/color/48/000000/cash-in-hand.png",
    paypal:
      "https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.png",
    easypaisa:
      "https://seeklogo.com/images/E/easypaisa-new-logo-412D450720-seeklogo.com.png",
    upi: "https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg",
    bank: "https://uxwing.com/wp-content/themes/uxwing/download/banking-finance/bank-transfer-icon.png",
  };

  paymentIcon.src = iconMap[selectedPaymentMethod] || "";

  const templateId = `${selectedPaymentMethod}-form`;
  const template = document.getElementById(templateId);
  if (template) {
    paymentFormContent = template.innerHTML;
  }

  formContent.innerHTML = `
    ${paymentFormContent}
    <div class="customer-details-section" style="display:none;">
      <h3 class="section-title">Customer Information</h3>
      <div class="detail-row"><strong>Name:</strong> ${
        customerData.shippingAddress.name || "Not provided"
      }</div>
    </div>
  `;
}

function processPayment(methodName) {
  const formSection = document.querySelector(".form-section");
  const totals = checkoutCart.calculateTotals();
  const cart = checkoutCart.getCart();

  const orderData = {
    orderId: generateOrderId(),
    email: customerData.email,
    phone: customerData.phone,
    shippingAddress: customerData.shippingAddress,
    billingAddress: customerData.billingAddress,
    notes: customerData.notes,
    paymentMethod: methodName,
    items: cart,
    subtotal: totals.subtotal,
    shipping: totals.shipping,
    total: totals.total,
    date: new Date().toISOString(),
    status: "Pending",
  };

  if (methodName === "PayPal") {
    const paypalButton = document.getElementById("paypal-redirect-button");
    const paypalLink = paypalButton.getAttribute("data-paypal-link");
    if (paypalLink) {
      window.open(paypalLink, "_blank");
    }
  }

  console.log("Order submitted:", orderData);

  let orders = JSON.parse(localStorage.getItem("bloggerStoreOrders") || "[]");
  orders.push(orderData);
  localStorage.setItem("bloggerStoreOrders", JSON.stringify(orders));

  const formatAddressForDisplay = (addr) => {
    return `${addr.name}\n${addr.address}\n${addr.city}, ${addr.state} ${addr.zip}\n${addr.country}`;
  };

  const shippingAddr = formatAddressForDisplay(customerData.shippingAddress);
  let billingAddr;
  const isSameAddress =
    JSON.stringify(customerData.shippingAddress) ===
    JSON.stringify(customerData.billingAddress);

  if (isSameAddress) {
    billingAddr = "Same as shipping address";
  } else {
    billingAddr = formatAddressForDisplay(customerData.billingAddress);
  }

  const orderSummaryHTML = checkoutCart.getOrderDetailsHTML();

  formSection.innerHTML = `
    <div class="order-confirmation">
      <div class="success-animation">
        <svg viewBox="0 0 100 100">
          <path class="checkmark" fill="none" stroke-width="6" stroke-miterlimit="10" d="M25,52l20,20l40-40" />
        </svg>
        <h2>Order Confirmed!</h2>
      </div>
      <div class="confirmation-details">
        <p>Thank you, ${customerData.shippingAddress.name || "Customer"}!</p>
        <p>Your order #${
          orderData.orderId
        } has been received. A confirmation has been sent to your email.</p>
        
        <div class="confirmation-summaries-grid">
          <div class="summary-section">
            ${orderSummaryHTML}
          </div>
          <div class="summary-section">
            <h3>Customer & Payment Details</h3>
            
            <h4>Payment Method</h4>
            <p>${orderData.paymentMethod}</p>

            <h4>Contact Information</h4>
            <p><strong>Email:</strong> ${customerData.email}</p>
            <p><strong>Phone:</strong> ${
              customerData.phone || "Not provided"
            }</p>

            <h4>Shipping Address</h4>
            <p class="address-details">${shippingAddr}</p>

            <h4>Billing Address</h4>
            <p class="address-details">${billingAddr}</p>
          </div>
        </div>

        <a href="/p/shop.html" class="button primary-button" style="margin-top: 2rem;">Continue Shopping</a>
      </div>
    </div>
  `;

  localStorage.removeItem("simpleCart");

  const cartCount = document.querySelector(".cart-count");
  if (cartCount) cartCount.textContent = "0";

  checkoutCart.updateOrderSummary();
}

function validateAndProceedToDetails() {
  if (!selectedPaymentMethod) {
    alert("Please select a payment method.");
    return;
  }
  showTab("details");
}

document.addEventListener("DOMContentLoaded", function () {
  checkoutCart.updateOrderSummary();
  initializeNewPaymentMethods();

  if (checkoutCart.getCart().length === 0) {
    const formSection = document.querySelector(".form-section");
    const progressBar = document.querySelector(".progress-bar");
    if (formSection) {
      formSection.innerHTML = `
            <div class="empty-cart-message">
              <i class="bi bi-bag-x"></i>
              <p>Your cart is empty.</p>
              <span>Please add items to your cart to proceed with checkout.</span>
              <a href="/p/shop.html" class="button primary-button" style="margin-top: 1.5rem;">Return to Shop</a>
            </div>
          `;
    }
    if (progressBar) {
      progressBar.style.display = "none";
    }
    return;
  }

  showTab("contact-section");
  const sameAsShipping = document.getElementById("same-as-shipping");
  const billingSection = document.getElementById(
    "checkout-billing-address-section"
  );
  if (sameAsShipping && billingSection) {
    sameAsShipping.addEventListener("change", function () {
      billingSection.style.display = this.checked ? "none" : "grid";
    });
    billingSection.style.display = sameAsShipping.checked ? "none" : "grid";
  }
  document
    .getElementById("contact-next")
    .addEventListener("click", function () {
      if (validateContact()) showTab("shipping-section");
    });
  document
    .getElementById("shipping-back")
    .addEventListener("click", function () {
      showTab("contact-section");
    });
  document
    .getElementById("shipping-next")
    .addEventListener("click", function () {
      if (validateShipping()) showTab("selection");
    });
  document
    .getElementById("selection-back")
    .addEventListener("click", function () {
      showTab("shipping-section");
    });
  document
    .getElementById("next-button")
    .addEventListener("click", function (e) {
      e.preventDefault();
      validateAndProceedToDetails();
    });
  document.querySelectorAll(".input-field").forEach((input) => {
    input.addEventListener("input", function () {
      this.classList.toggle("filled", this.value.trim() !== "");
    });
    input.classList.toggle("filled", input.value.trim() !== "");
  });
});

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("view-checkout")) {
    e.preventDefault();
    window.location.href = "/p/checkout.html";
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const checkoutPage = document.getElementById("CheckoutPage");
  if (checkoutPage) {
    const isCheckoutPage =
      window.location.pathname.includes("/p/checkout.html");
    checkoutPage.style.display = isCheckoutPage ? "block" : "none";
  }
});
