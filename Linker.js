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

  scripts.forEach(({ comment, src }) => {
    document.write(`\n<!-- ${comment} -->\n`);
    document.write(`<script defer="defer" src="${src}"><\/script>\n`);
  }); but when I sale my website if I need to change my specific link or js name I cant do this , to avail this I want to make a js file on github Linker.js and all my js files like         const scripts = [
    { comment: "Header", src: "https://cdn.jsdelivr.net/gh/Vivid-Themes/Vivid-Theme-Premium@main/Header.js" },
    { comment: "Ecommerce Shortcodes", src: "https://cdn.jsdelivr.net/gh/Vivid-Themes/Vivid-Theme-Premium@main/Main%20Post%20Shortcodes.js" },
    { comment: "Fullpage View Slider", src: "https://cdn.jsdelivr.net/gh/Vivid-Themes/Vivid-Theme-Premium@main/Fullpage%20View%20Slider.js" },
    { comment: "Homepage View Slider", src: "https://cdn.jsdelivr.net/gh/Vivid-Themes/Vivid-Theme-Premium@main/Homepage%20View%20Slider.js" },
    { comment: "Cart", src: "https://cdn.jsdelivr.net/gh/Vivid-Themes/Vivid-Theme-Premium@main/Cart.js" },
    { comment: "Wishlist", src: "https://cdn.jsdelivr.net/gh/Vivid-Themes/Vivid-Theme-Premium@main/Wishlist.js" },
    { comment: "Product Shortcodes", src: "https://cdn.jsdelivr.net/gh/Vivid-Themes/Vivid-Theme-Premium@main/Product%20Shortcodes.js" },
    { comment: "Shop", src: "https://cdn.jsdelivr.net/gh/Vivid-Themes/Vivid-Theme-Premium@main/Shop.js" }
  ];

  scripts.forEach(({ comment, src }) => {
    document.write(`\n<!-- ${comment} -->\n`);
    document.write(`<script defer="defer" src="${src}"><\/script>\n`);
  });
