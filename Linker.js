(function() {
  // All your scripts with comments
  const scripts = [
    { comment: "Header", src: "https://cdn.jsdelivr.net/gh/Vivid-Themes/Vivid-Theme-Premium@main/Header.js" },
    { comment: "Ecommerce Shortcodes", src: "https://cdn.jsdelivr.net/gh/Vivid-Themes/Vivid-Theme-Premium@main/Main%20Post%20Shortcodes.js" },
    { comment: "Fullpage View Slider", src: "https://cdn.jsdelivr.net/gh/Vivid-Themes/Vivid-Theme-Premium@main/Fullpage%20View%20Slider.js" },
    { comment: "Homepage View Slider", src: "https://cdn.jsdelivr.net/gh/Vivid-Themes/Vivid-Theme-Premium@main/Homepage%20View%20Slider.js" },
    { comment: "Cart", src: "https://cdn.jsdelivr.net/gh/Vivid-Themes/Vivid-Theme-Premium@main/Cart.js" },
    { comment: "Wishlist", src: "https://cdn.jsdelivr.net/gh/Vivid-Themes/Vivid-Theme-Premium@main/Wishlist.js" },
    { comment: "Product Shortcodes", src: "https://cdn.jsdelivr.net/gh/Vivid-Themes/Vivid-Theme-Premium@main/Product%20Shortcodes.js" },
    { comment: "Shop", src: "https://cdn.jsdelivr.net/gh/Vivid-Themes/Vivid-Theme-Premium@main/Shop.js" }
  ];

  // Load scripts sequentially to maintain order
  function loadSequential(list, index = 0) {
    if (index >= list.length) return;
    const s = document.createElement("script");
    s.src = list[index].src;
    s.defer = true;
    s.onload = () => loadSequential(list, index + 1);
    s.onerror = () => loadSequential(list, index + 1);
    document.head.appendChild(s);
  }

  loadSequential(scripts);
})();
