 const scripts = [
            { comment: "Header", src: "https://cdn.jsdelivr.net/gh/Vivid-Themes/Vivid-Theme-Pro@main/Header.js" },
            { comment: "Ecommerce Shortcodes", src: "https://cdn.jsdelivr.net/gh/Vivid-Themes/Vivid-Theme-Pro@main/Main%20Post%20Shortcodes.js" },
            { comment: "Fullpage View Slider", src: "https://cdn.jsdelivr.net/gh/Vivid-Themes/Vivid-Theme-Pro@main/Fullpage%20View%20Slider.js" },
            { comment: "Homepage View Slider", src: "https://cdn.jsdelivr.net/gh/Vivid-Themes/Vivid-Theme-Pro@main/Homepage%20View%20Slider.js" },
            { comment: "Cart", src: "https://cdn.jsdelivr.net/gh/Vivid-Themes/Vivid-Theme-Pro@main/Cart.js" },
            { comment: "Wishlist", src: "https://cdn.jsdelivr.net/gh/Vivid-Themes/Vivid-Theme-Pro@main/Wishlist.js" },
            { comment: "Product Shortcodes", src: "https://cdn.jsdelivr.net/gh/Vivid-Themes/Vivid-Theme-Pro@main/Product%20Shortcodes.js" },
            { comment: "Shop", src: "https://cdn.jsdelivr.net/gh/Vivid-Themes/Vivid-Theme-Pro@main/Shop.js" }
        ];

        scripts.forEach(({ comment, src }) => {
            // Add comment before script
            document.write(`\n<!-- ${comment} -->\n`);
            // Add script tag
            document.write(`<script defer="defer" src="${src}"><\/script>\n`);
        });
