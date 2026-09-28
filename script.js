/* =========================================
   VOLT X — MAIN JAVASCRIPT
========================================= */


/* =========================================
   PARTICLES
========================================= */

const particles = document.getElementById("particles");

for (let i = 0; i < 55; i++) {

    const particle =
        document.createElement("div");

    particle.className = "particle";

    particle.style.left =
        Math.random() * 100 + "%";

    particle.style.animationDuration =
        (5 + Math.random() * 10) + "s";

    particle.style.animationDelay =
        (-Math.random() * 10) + "s";

    particle.style.opacity =
        Math.random();

    particles.appendChild(particle);
}


/* =========================================
   CURSOR GLOW
========================================= */

const cursorGlow =
    document.getElementById("cursorGlow");

document.addEventListener(
    "mousemove",
    function(event) {

        cursorGlow.style.left =
            event.clientX + "px";

        cursorGlow.style.top =
            event.clientY + "px";

    }
);


/* =========================================
   3D CAN
========================================= */

const can =
    document.getElementById("mainCan");

const canWrapper =
    document.getElementById("canWrapper");


let rotationY = 0;

let rotationX = 0;

let dragging = false;

let lastX = 0;


/* =========================================
   MOUSE PARALLAX
========================================= */

document.addEventListener(
    "mousemove",
    function(event) {

        if (dragging) return;

        const rect =
            canWrapper.getBoundingClientRect();

        const centerX =
            rect.left + rect.width / 2;

        const centerY =
            rect.top + rect.height / 2;


        const x =
            event.clientX - centerX;

        const y =
            event.clientY - centerY;


        const targetY =
            x / 18;

        const targetX =
            -y / 40;


        can.style.transform =

            `rotateX(${targetX}deg)
             rotateY(${targetY}deg)`;
    }
);


/* =========================================
   DRAG START
========================================= */

canWrapper.addEventListener(
    "mousedown",
    function(event) {

        dragging = true;

        lastX =
            event.clientX;

        can.style.transition =
            "none";
    }
);


/* =========================================
   DRAG MOVE
========================================= */

document.addEventListener(
    "mousemove",
    function(event) {

        if (!dragging) return;


        const movement =
            event.clientX - lastX;


        rotationY +=
            movement * 0.8;


        lastX =
            event.clientX;


        can.style.transform =

            `rotateX(${rotationX}deg)
             rotateY(${rotationY}deg)`;
    }
);


/* =========================================
   DRAG END
========================================= */

document.addEventListener(
    "mouseup",
    function() {

        dragging = false;

        can.style.transition =
            "transform .15s ease";
    }
);


/* =========================================
   TOUCH
========================================= */

let touchX = 0;


canWrapper.addEventListener(
    "touchstart",
    function(event) {

        touchX =
            event.touches[0].clientX;

    },
    {
        passive: true
    }
);


canWrapper.addEventListener(
    "touchmove",
    function(event) {

        const currentX =
            event.touches[0].clientX;


        const movement =
            currentX - touchX;


        rotationY +=
            movement * .8;


        touchX =
            currentX;


        can.style.transform =
            `rotateY(${rotationY}deg)`;

    },
    {
        passive: true
    }
);


/* =========================================
   WHEEL
========================================= */

canWrapper.addEventListener(
    "wheel",
    function(event) {

        rotationY +=
            event.deltaY * .15;


        can.style.transform =
            `rotateY(${rotationY}deg)`;

    },
    {
        passive: true
    }
);


/* =========================================
   FLAVOR SYSTEM
========================================= */

function selectFlavor(flavor) {

    const cards =
        document.querySelectorAll(".flavor-card");


    cards.forEach(card => {

        card.classList.remove("active");

    });


    const selected =
        document.querySelector(
            `[data-theme="${flavor}"]`
        );


    if (selected) {

        selected.classList.add("active");

    }


    document.body.classList.remove(
        "berry",
        "ice"
    );


    if (flavor === "berry") {

        document.body.classList.add("berry");

    }


    if (flavor === "ice") {

        document.body.classList.add("ice");

    }


    changeCanFlavor(flavor);
}


/* =========================================
   CHANGE CAN
========================================= */

function changeCanFlavor(flavor) {

    const label =
        document.querySelector(".flavor-label");

    const bolt =
        document.querySelector(".bolt");


    if (flavor === "lime") {

        label.textContent =
            "NEON LIME";

        bolt.textContent =
            "⚡";

    }


    if (flavor === "berry") {

        label.textContent =
            "CYBER BERRY";

        bolt.textContent =
            "✦";

    }


    if (flavor === "ice") {

        label.textContent =
            "ARCTIC ICE";

        bolt.textContent =
            "❄";

    }
}


/* =========================================
   CART
========================================= */

let cart = [];


/* =========================================
   LOAD CART
========================================= */

try {

    const savedCart =
        localStorage.getItem("voltCart");

    if (savedCart) {

        cart =
            JSON.parse(savedCart);

    }

} catch (error) {

    cart = [];

}


/* =========================================
   SAVE CART
========================================= */

function saveCart() {

    localStorage.setItem(
        "voltCart",
        JSON.stringify(cart)
    );
}


/* =========================================
   ADD CART
========================================= */

function addToCart(name, price) {

    const existing =
        cart.find(
            item => item.name === name
        );


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({

            name: name,

            price: price,

            quantity: 1

        });

    }


    saveCart();

    updateCart();

    showToast(
        "⚡ ADDED TO VOLT CART"
    );


    setTimeout(
        openCart,
        350
    );
}


/* =========================================
   UPDATE CART
========================================= */

function updateCart() {

    const container =
        document.getElementById(
            "cartItems"
        );

    const count =
        document.getElementById(
            "cartCount"
        );

    const totalElement =
        document.getElementById(
            "cartTotal"
        );


    let totalQuantity = 0;

    let total = 0;


    cart.forEach(item => {

        totalQuantity +=
            item.quantity;

        total +=
            item.price *
            item.quantity;

    });


    count.textContent =
        totalQuantity;


    if (cart.length === 0) {

        container.innerHTML = `

            <div style="
                text-align:center;
                color:#59625b;
                margin-top:100px;
                font-size:12px;
            ">

                YOUR CART IS EMPTY ⚡

            </div>

        `;

        totalElement.textContent =
            "$0.00";

        return;
    }


    container.innerHTML = "";


    cart.forEach(
        (item, index) => {

            const element =
                document.createElement(
                    "div"
                );

            element.className =
                "cart-item";


            element.innerHTML = `

                <div>

                    <div class="cart-name">
                        ${item.name}
                    </div>

                    <div class="cart-price">
                        $${item.price.toFixed(2)}
                    </div>

                </div>


                <div class="quantity">

                    <button
                        onclick="
                            decreaseItem(${index})
                        "
                    >
                        −
                    </button>

                    <strong>
                        ${item.quantity}
                    </strong>

                    <button
                        onclick="
                            increaseItem(${index})
                        "
                    >
                        +
                    </button>

                    <button
                        class="remove"
                        onclick="
                            removeItem(${index})
                        "
                    >
                        ×
                    </button>

                </div>

            `;


            container.appendChild(
                element
            );

        }
    );


    totalElement.textContent =
        "$" + total.toFixed(2);
}


/* =========================================
   INCREASE
========================================= */

function increaseItem(index) {

    cart[index].quantity++;

    saveCart();

    updateCart();
}


/* =========================================
   DECREASE
========================================= */

function decreaseItem(index) {

    cart[index].quantity--;


    if (
        cart[index].quantity <= 0
    ) {

        cart.splice(index, 1);

    }


    saveCart();

    updateCart();
}


/* =========================================
   REMOVE
========================================= */

function removeItem(index) {

    cart.splice(index, 1);

    saveCart();

    updateCart();

    showToast(
        "ITEM REMOVED"
    );
}


/* =========================================
   OPEN CART
========================================= */

function openCart() {

    document
        .getElementById("cartOverlay")
        .classList.add("active");
}


/* =========================================
   CLOSE CART
========================================= */

function closeCart() {

    document
        .getElementById("cartOverlay")
        .classList.remove("active");
}


/* =========================================
   OUTSIDE CART
========================================= */

document
    .getElementById("cartOverlay")
    .addEventListener(
        "click",
        function(event) {

            if (
                event.target === this
            ) {

                closeCart();

            }

        }
    );


/* =========================================
   CHECKOUT
========================================= */

function checkout() {

    if (cart.length === 0) {

        showToast(
            "CART IS EMPTY"
        );

        return;
    }


    let total = 0;


    cart.forEach(item => {

        total +=
            item.price *
            item.quantity;

    });


    alert(

        "⚡ VOLT X ORDER\n\n" +

        "TOTAL: $" +
        total.toFixed(2) +

        "\n\n" +

        "Thank you for choosing VOLT X!"

    );


    cart = [];

    saveCart();

    updateCart();

    closeCart();
}


/* =========================================
   TOAST
========================================= */

function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        2200
    );
}


/* =========================================
   INFO MODAL
========================================= */

function showInside() {

    document
        .getElementById("infoModal")
        .classList.add("active");
}


function closeInside() {

    document
        .getElementById("infoModal")
        .classList.remove("active");
}


/* =========================================
   ESC CLOSE
========================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape"
        ) {

            closeCart();

            closeInside();

        }

    }
);


/* =========================================
   ENERGY ANIMATION
========================================= */

let energy = 92;

setInterval(
    function() {

        energy +=
            Math.random() * 4 - 2;

        energy =
            Math.max(
                88,
                Math.min(
                    99,
                    energy
                )
            );


        document
            .getElementById(
                "energyNumber"
            )
            .textContent =
            Math.round(energy) + "%";


        document
            .getElementById(
                "energyFill"
            )
            .style.width =
            energy + "%";

    },
    1800
);


/* =========================================
   COUNTDOWN
========================================= */

const dropDate =
    new Date(
        Date.now() +
        (
            3 * 24 * 60 * 60 * 1000
        ) +
        (
            12 * 60 * 60 * 1000
        )
    );


function updateCountdown() {

    const now =
        new Date();

    const difference =
        dropDate - now;


    if (difference <= 0) {

        return;
    }


    const days =
        Math.floor(
            difference /
            (
                1000 *
                60 *
                60 *
                24
            )
        );


    const hours =
        Math.floor(
            (
                difference %
                (
                    1000 *
                    60 *
                    60 *
                    24
                )
            ) /
            (
                1000 *
                60 *
                60
            )
        );


    const minutes =
        Math.floor(
            (
                difference %
                (
                    1000 *
                    60 *
                    60
                )
            ) /
            (
                1000 *
                60
            )
        );


    const seconds =
        Math.floor(
            (
                difference %
                (
                    1000 *
                    60
                )
            ) /
            1000
        );


    document.getElementById(
        "days"
    ).textContent =
        String(days).padStart(2,"0");


    document.getElementById(
        "hours"
    ).textContent =
        String(hours).padStart(2,"0");


    document.getElementById(
        "minutes"
    ).textContent =
        String(minutes).padStart(2,"0");


    document.getElementById(
        "seconds"
    ).textContent =
        String(seconds).padStart(2,"0");
}


setInterval(
    updateCountdown,
    1000
);

updateCountdown();


/* =========================================
   INITIALIZE
========================================= */

updateCart();
