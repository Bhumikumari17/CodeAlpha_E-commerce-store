// LOGIN
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("https://codealpha-e-commerce-store-he6e.onrender.com/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.message === "Login Successful ✅") {
                alert(data.message);
               window.location.href = "../index.html";
            } else {
                alert(data.message);
            }

        } catch (error) {
            alert("Server connection failed!");
        }
    });
}


// SIGNUP
const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("https://codealpha-e-commerce-store-he6e.onrender.com/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();
            alert(data.message);

        } catch (error) {
            alert("Server connection failed!");
        }
    });
}

// =======================
// ADD TO CART
// =======================

const addCartButtons = document.querySelectorAll(".add-cart");

addCartButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const product =
            button.parentElement;

        const item = {
            id: product.dataset.id,
            name: product.dataset.name,
            price: product.dataset.price,
            image: product.querySelector("img").getAttribute("src"),
            quantity: 1
        };

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        const existing = cart.find(p => p.id === item.id);

        if (existing) {
            existing.quantity++;
        } else {
            cart.push(item);
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        alert("Product Added To Cart 🛒");
    });

});

// ============================
// SHOW CART ITEMS
// ============================

const cartContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

if (cartContainer) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let total = 0;

    cartContainer.innerHTML = "";

    cart.forEach((item, index) => {

        total += Number(item.price) * item.quantity;

        cartContainer.innerHTML += `

        <div class="product-card">

            <img src="../${item.image}" alt="${item.name}">

            <h3>${item.name}</h3>

            <p>₹${item.price}</p>

           <div class="quantity-box">

    <button onclick="decreaseQty(${index})">-</button>

    <span>${item.quantity}</span>

    <button onclick="increaseQty(${index})">+</button>

</div>

            <button onclick="removeItem(${index})">
                Remove
            </button>

        </div>

        `;

    });

    cartTotal.innerHTML = `Total : ₹${total}`;

}

function removeItem(index){

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.splice(index,1);

    localStorage.setItem("cart",JSON.stringify(cart));

    location.reload();

}

// ============================
// INCREASE QUANTITY
// ============================

function increaseQty(index){

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart[index].quantity++;

    localStorage.setItem("cart", JSON.stringify(cart));

    location.reload();

}

// ============================
// DECREASE QUANTITY
// ============================

function decreaseQty(index){

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if(cart[index].quantity > 1){

        cart[index].quantity--;

    }else{

        cart.splice(index,1);

    }

    localStorage.setItem("cart", JSON.stringify(cart));

    location.reload();

}

// ===========================
// CHECKOUT
// ===========================

const checkoutForm = document.getElementById("checkoutForm");

if (checkoutForm) {

    checkoutForm.addEventListener("submit", (e) => {

        e.preventDefault();

        alert("🎉 Order Placed Successfully!");

        localStorage.removeItem("cart");

        window.location.href="../index.html";

    });

}

// ==========================
// SEARCH PRODUCT
// ==========================

const search = document.getElementById("search");

if(search){

search.addEventListener("keyup",()=>{

const value = search.value.toLowerCase();

const cards = document.querySelectorAll(".product-card");

cards.forEach((card)=>{

const title = card.querySelector("h3").innerText.toLowerCase();

if(title.includes(value)){

card.style.display="block";

}else{

card.style.display="none";

}

});

});

}

// =======================
// PLACE ORDER
// =======================

const checkoutBtn = document.getElementById("checkout-btn");

if (checkoutBtn) {

    checkoutBtn.addEventListener("click", async () => {

        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        if (cart.length === 0) {
            alert("Cart is Empty 🛒");
            return;
        }

        const customerName = prompt("Enter Your Name");

        if (!customerName) return;

        let totalAmount = 0;

        cart.forEach(item => {
            totalAmount += item.price * item.quantity;
        });

        try {

            const response = await fetch("https://codealpha-e-commerce-store-he6e.onrender.com/order", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    customerName,
                    totalAmount,
                    items: cart
                })

            });

            const data = await response.json();

            alert(data.message);

            localStorage.removeItem("cart");

            window.location.href = "cart.html";

        } catch (error) {

            alert("Order Failed!");

        }

    });

}