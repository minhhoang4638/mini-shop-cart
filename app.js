

const products = [

    {
        id: 1,
        name: "Wireless Headphones",
        price: 1290000,
        category: "Electronics",
        image: "images/Wireless Headphones.jpg"
    },

    {
        id: 2,
        name: "Smart Watch",
        price: 2490000,
        category: "Electronics",
        image: "images/Smart Watch.jpg"
    },

    {
        id: 3,
        name: "Bluetooth Speaker",
        price: 890000,
        category: "Electronics",
        image: "images/Bluetooth Speaker.jpg"
    },

    {
        id: 4,
        name: "Denim Jacket",
        price: 750000,
        category: "Fashion",
        image: "images/Denim Jacket.jpg"
    },

    {
        id: 5,
        name: "Running Shoes",
        price: 1150000,
        category: "Fashion",
        image: "images/Running Shoes.jpg"
    },

    {
        id: 6,
        name: "Baseball Cap",
        price: 190000,
        category: "Fashion",
        image: "images/Baseball Cap.jpg"
    },

    {
        id: 7,
        name: "JavaScript Handbook",
        price: 320000,
        category: "Books",
        image: "images/Javascript Handbook.jpg"
    },

    {
        id: 8,
        name: "Web Design Sketchbook",
        price: 150000,
        category: "Books",
        image: "images/Web design sketchbook.jpg"
    }

];



const productGrid =
    document.getElementById("product-grid");

const categoryFilters =
    document.getElementById("category-filters");

const searchInput =
    document.getElementById("search-input");

const cartCount =
    document.getElementById("cart-count");

const cartTotal =
    document.getElementById("cart-total");

const clearCartButton =
    document.getElementById("clear-cart");




const CART_KEY = "mini-shop-cart";

let activeCategory = "All";

let searchQuery = "";




function loadCart() {

    try {

        const savedCart = JSON.parse(
            localStorage.getItem(CART_KEY) || "[]"
        );

        if (!Array.isArray(savedCart)) {
            return [];
        }

        const normalizedCart = new Map();

        savedCart.forEach(item => {

            const id = Number(item.id);

            const quantity = Number(item.quantity);

            const productExists = products.some(
                product => product.id === id
            );

            if (
                productExists &&
                Number.isInteger(quantity) &&
                quantity > 0
            ) {

                const currentQuantity =
                    normalizedCart.get(id) || 0;

                normalizedCart.set(
                    id,
                    currentQuantity + quantity
                );

            }

        });

        return Array.from(
            normalizedCart,
            ([id, quantity]) => ({
                id,
                quantity
            })
        );

    } catch (error) {

        console.error(
            "Could not load cart:",
            error
        );

        return [];

    }

}


let cart = loadCart();



function saveCart() {

    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );

}



function formatCurrency(price) {

    return price.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND"
    });

}




function renderCategoryButtons() {

    const categories = [

        "All",

        ...new Set(
            products.map(product => product.category)
        )

    ];

    categoryFilters.innerHTML = categories.map(
        category => {

            return `

                <button
                    class="filter-btn ${
                        category === activeCategory
                            ? "active"
                            : ""
                    }"
                    data-category="${category}"
                    type="button"
                >

                    ${category}

                </button>

            `;

        }

    ).join("");

}



function renderProducts() {

    const filteredProducts = products.filter(
        product => {

            const matchesCategory =

                activeCategory === "All" ||

                product.category === activeCategory;


            const matchesSearch =

                product.name.toLowerCase().includes(
                    searchQuery.toLowerCase()
                );


            return matchesCategory && matchesSearch;

        }
    );


    

    if (filteredProducts.length === 0) {

        productGrid.innerHTML = `

            <p class="empty-message">
                No products found.
            </p>

        `;

        return;

    }


    

    productGrid.innerHTML = filteredProducts.map(
        product => {

            const cartItem = cart.find(
                item => item.id === product.id
            );

            const quantity = cartItem
                ? cartItem.quantity
                : 0;


            return `

                <article
                    class="product-card"
                    data-id="${product.id}"
                >

                    <img
                        class="product-image"
                        src="${product.image}"
                        alt="${product.name}"
                        loading="lazy"
                    >


                    <p class="product-category">
                        ${product.category}
                    </p>


                    <h3 class="product-name">
                        ${product.name}
                    </h3>


                    <p class="product-price">
                        ${formatCurrency(product.price)}
                    </p>


                    <button
                        class="add-button"
                        type="button"
                    >

                        ${
                            quantity > 0
                                ? `Add to cart (${quantity} in cart)`
                                : "Add to cart"
                        }

                    </button>

                </article>

            `;

        }

    ).join("");

}




function renderCart() {

   
    const totalItems = cart.reduce(

        (total, item) => {

            return total + item.quantity;

        },

        0

    );


    

    const totalPrice = cart.reduce(

        (total, item) => {

            const product = products.find(
                product => product.id === item.id
            );

            if (!product) {
                return total;
            }

            return total + (
                product.price * item.quantity
            );

        },

        0

    );


    

    cartCount.textContent = totalItems;


  
    cartTotal.textContent = formatCurrency(totalPrice);

}




function addToCart(productId) {

    const existingItem = cart.find(
        item => item.id === productId
    );


    if (existingItem) {

       

        existingItem.quantity++;

    } else {

       

        cart.push({

            id: productId,

            quantity: 1

        });

    }


    

    saveCart();

    renderCart();

    renderProducts();

}


/* =====================================
   11. CATEGORY FILTER EVENT
===================================== */

categoryFilters.addEventListener(
    "click",
    event => {

        const button = event.target.closest(
            ".filter-btn"
        );

        if (!button) {
            return;
        }


        activeCategory = button.dataset.category;


        renderCategoryButtons();

        renderProducts();

    }
);


/* =====================================
   12. EVENT DELEGATION
===================================== */

// One click listener on the product grid

productGrid.addEventListener(
    "click",
    event => {

        // Find clicked product card

        const card = event.target.closest(
            ".product-card"
        );

        if (!card) {
            return;
        }


        // Check whether Add to cart was clicked

        const addButton = event.target.closest(
            ".add-button"
        );

        if (!addButton) {
            return;
        }


        // Read ID from dataset

        const productId = Number(card.dataset.id);


        // Add product to cart

        addToCart(productId);

    }
);


/* =====================================
   13. SEARCH EVENT
===================================== */

searchInput.addEventListener(
    "input",
    event => {

        searchQuery = event.target.value;

        renderProducts();

    }
);


/* =====================================
   14. CLEAR CART
===================================== */

clearCartButton.addEventListener(
    "click",
    () => {

        // Empty cart

        cart = [];


        // Remove cart from localStorage

        localStorage.removeItem(CART_KEY);


        // Update interface

        renderCart();

        renderProducts();

    }
);


/* =====================================
   15. INITIALIZE APPLICATION
===================================== */

renderCategoryButtons();

renderProducts();

renderCart();


