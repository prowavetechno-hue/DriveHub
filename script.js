/* =========================================
   PROWAVE SUPERMARKET
   FINAL JAVASCRIPT
   ========================================= */


/* =========================================
   GAME DATA
   ========================================= */

let game = {
    cash: 50000,
    level: 1,
    sales: 0,
    profit: 0,
    customers: 0,
    storeOpen: false
};


/* =========================================
   PRODUCTS
   ========================================= */

const products = [
    {
        id: "milk",
        name: "Milk",
        icon: "🥛",
        buy: 150,
        sell: 190,
        stock: 0
    },
    {
        id: "bread",
        name: "Bread",
        icon: "🍞",
        buy: 100,
        sell: 140,
        stock: 0
    },
    {
        id: "biscuits",
        name: "Biscuits",
        icon: "🍪",
        buy: 80,
        sell: 120,
        stock: 0
    },
    {
        id: "drink",
        name: "Cold Drink",
        icon: "🥤",
        buy: 100,
        sell: 150,
        stock: 0
    },
    {
        id: "chips",
        name: "Chips",
        icon: "🍟",
        buy: 70,
        sell: 110,
        stock: 0
    },
    {
        id: "rice",
        name: "Rice",
        icon: "🍚",
        buy: 250,
        sell: 320,
        stock: 0
    },
    {
        id: "eggs",
        name: "Eggs",
        icon: "🥚",
        buy: 220,
        sell: 280,
        stock: 0
    },
    {
        id: "water",
        name: "Water",
        icon: "💧",
        buy: 60,
        sell: 90,
        stock: 0
    }
];


/* =========================================
   SCREEN NAVIGATION
   ========================================= */

function openScreen(screenId) {

    const screens =
        document.querySelectorAll(".screen");

    screens.forEach(function(screen) {
        screen.classList.remove("active");
    });

    const selected =
        document.getElementById(screenId);

    if (selected) {
        selected.classList.add("active");
    }

    updateAll();
}


function goHome() {
    openScreen("homeScreen");
}


/* =========================================
   MONEY DISPLAY
   ========================================= */

function updateMoney() {

    const amount =
        "Rs. " + game.cash.toLocaleString();

    const cash =
        document.getElementById("cash");

    const storeCash =
        document.getElementById("storeCash");

    if (cash) {
        cash.textContent = amount;
    }

    if (storeCash) {
        storeCash.textContent = amount;
    }
}


/* =========================================
   NOTIFICATION
   ========================================= */

function notify(message) {

    const box =
        document.getElementById("notification");

    if (!box) {
        return;
    }

    box.textContent = message;

    box.classList.add("show");

    setTimeout(function() {
        box.classList.remove("show");
    }, 2000);
}


/* =========================================
   MARKET
   ========================================= */

function renderMarket() {

    const container =
        document.getElementById("marketProducts");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    products.forEach(function(product) {

        const card =
            document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `
            <div class="product-icon">
                ${product.icon}
            </div>

            <h3>
                ${product.name}
            </h3>

            <p>
                Wholesale:
                Rs. ${product.buy}
            </p>

            <p>
                Selling:
                Rs. ${product.sell}
            </p>

            <p>
                Stock:
                ${product.stock}
            </p>

            <button
                data-buy="${product.id}"
            >
                📦 BUY 1
            </button>
        `;

        container.appendChild(card);
    });
}


/* =========================================
   BUY PRODUCT
   ========================================= */

function buyProduct(productId) {

    const product =
        products.find(function(item) {
            return item.id === productId;
        });

    if (!product) {
        return;
    }

    if (game.cash < product.buy) {

        notify("❌ Not enough cash!");

        return;
    }

    game.cash -= product.buy;

    product.stock += 1;

    renderMarket();

    renderInventory();

    updateMoney();

    notify(
        "📦 " +
        product.name +
        " added to stock!"
    );
}


/* =========================================
   INVENTORY
   ========================================= */

function renderInventory() {

    const container =
        document.getElementById(
            "inventoryProducts"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    products.forEach(function(product) {

        const card =
            document.createElement("div");

        card.className = "product-card";

        const disabled =
            product.stock <= 0
                ? "disabled"
                : "";

        const profit =
            product.sell - product.buy;

        card.innerHTML = `
            <div class="product-icon">
                ${product.icon}
            </div>

            <h3>
                ${product.name}
            </h3>

            <p>
                Stock:
                ${product.stock}
            </p>

            <p>
                Selling:
                Rs. ${product.sell}
            </p>

            <p>
                Profit:
                Rs. ${profit}
            </p>

            <button
                data-sell="${product.id}"
                ${disabled}
            >
                💰 SELL 1
            </button>
        `;

        container.appendChild(card);
    });
}


/* =========================================
   SELL PRODUCT
   ========================================= */

function sellProduct(productId) {

    const product =
        products.find(function(item) {
            return item.id === productId;
        });

    if (!product) {
        return;
    }

    if (product.stock <= 0) {

        notify(
            "❌ " +
            product.name +
            " is out of stock!"
        );

        return;
    }

    product.stock -= 1;

    game.cash += product.sell;

    game.sales += product.sell;

    game.profit +=
        product.sell - product.buy;

    renderInventory();

    renderMarket();

    updateMoney();

    notify(
        "💰 " +
        product.name +
        " sold!"
    );
}


/* =========================================
   STORE
   ========================================= */

function toggleStore() {

    game.storeOpen =
        !game.storeOpen;

    const button =
        document.getElementById(
            "openStoreButton"
        );

    if (game.storeOpen) {

        button.textContent =
            "⏹ CLOSE STORE";

        notify(
            "🏪 Prowave Supermarket is OPEN!"
        );

        startCustomers();

    } else {

        button.textContent =
            "▶ OPEN STORE";

        stopCustomers();

        notify(
            "🏪 Store closed."
        );
    }
}


/* =========================================
   CUSTOMER SYSTEM
   ========================================= */

let customerTimer = null;


function startCustomers() {

    stopCustomers();

    customerTimer =
        setInterval(function() {

            if (!game.storeOpen) {
                return;
            }

            createCustomer();

        }, 5000);
}


function stopCustomers() {

    if (customerTimer !== null) {

        clearInterval(customerTimer);

        customerTimer = null;
    }
}


/* =========================================
   CREATE CUSTOMER
   ========================================= */

function createCustomer() {

    const area =
        document.getElementById(
            "customerArea"
        );

    if (!area) {
        return;
    }

    const available =
        products.filter(function(product) {
            return product.stock > 0;
        });

    if (available.length === 0) {

        notify(
            "⚠️ Buy stock first!"
        );

        return;
    }

    const index =
        Math.floor(
            Math.random() * available.length
        );

    const product =
        available[index];

    const customer =
        document.createElement("div");

    customer.className =
        "customer-card";

    customer.style.cssText =
        "display:flex;align-items:center;gap:10px;padding:12px;margin-bottom:8px;border-radius:12px;background:#151c18;";

    customer.innerHTML = `
        <span style="font-size:28px;">
            🧑
        </span>

        <div style="flex:1;">
            <strong>
                Customer
            </strong>

            <p style="color:#8d9992;font-size:10px;margin-top:4px;">
                Wants ${product.name}
            </p>
        </div>

        <button
            data-serve="${product.id}"
            style="padding:9px;border:0;border-radius:8px;background:#27d875;font-weight:bold;"
        >
            SERVE
        </button>
    `;

    const empty =
        area.querySelector(
            ".empty-customers"
        );

    if (empty) {
        empty.remove();
    }

    area.appendChild(customer);

    game.customers += 1;
}


/* =========================================
   SERVE CUSTOMER
   ========================================= */

function serveCustomer(
    customerElement,
    productId
) {

    const product =
        products.find(function(item) {
            return item.id === productId;
        });

    if (!product) {
        return;
    }

    if (product.stock <= 0) {

        notify(
            "❌ Product is out of stock!"
        );

        return;
    }

    product.stock -= 1;

    game.cash += product.sell;

    game.sales += product.sell;

    game.profit +=
        product.sell - product.buy;

    customerElement.remove();

    renderMarket();

    renderInventory();

    updateMoney();

    notify(
        "💰 Customer purchased " +
        product.name + "!"
    );
}


/* =========================================
   UPGRADES
   ========================================= */

const upgrades = [
    {
        id: "size",
        name: "🏪 Bigger Store",
        description:
            "Increase your supermarket level.",
        cost: 10000
    },
    {
        id: "shelves",
        name: "🗄️ More Shelves",
        description:
            "Make your store look bigger.",
        cost: 7500
    },
    {
        id: "checkout",
        name: "🧾 Faster Checkout",
        description:
            "Serve customers faster.",
        cost: 12000
    }
];


function renderUpgrades() {

    const container =
        document.getElementById(
            "upgradeList"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    upgrades.forEach(function(upgrade) {

        const card =
            document.createElement("div");

        card.className =
            "upgrade-card";

        card.innerHTML = `
            <h3>
                ${upgrade.name}
            </h3>

            <p>
                ${upgrade.description}
            </p>

            <p>
                Level:
                ${game.level}
            </p>

            <button
                data-upgrade="${upgrade.id}"
            >
                Upgrade — Rs. ${upgrade.cost.toLocaleString()}
            </button>
        `;

        container.appendChild(card);
    });
}


/* =========================================
   BUY UPGRADE
   ========================================= */

function buyUpgrade(upgradeId) {

    const upgrade =
        upgrades.find(function(item) {
            return item.id === upgradeId;
        });

    if (!upgrade) {
        return;
    }

    if (game.cash < upgrade.cost) {

        notify(
            "❌ Not enough cash!"
        );

        return;
    }

    game.cash -= upgrade.cost;

    game.level += 1;

    renderUpgrades();

    updateMoney();

    notify(
        "⬆️ Store upgraded to Level " +
        game.level + "!"
    );
}


/* =========================================
   SUPPLIERS
   ========================================= */

const suppliers = [
    {
        id: "fresh",
        name: "🥛 Fresh Foods Supplier",
        description:
            "Milk, bread and eggs.",
        cost: 1500,
        products: ["milk", "bread", "eggs"]
    },
    {
        id: "drinks",
        name: "🥤 Drinks Supplier",
        description:
            "Cold drinks and water.",
        cost: 1200,
        products: ["drink", "water"]
    },
    {
        id: "snacks",
        name: "🍪 Snacks Supplier",
        description:
            "Biscuits and chips.",
        cost: 1000,
        products: ["biscuits", "chips"]
    }
];


function renderSuppliers() {

    const container =
        document.getElementById(
            "supplierList"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    suppliers.forEach(function(supplier) {

        const card =
            document.createElement("div");

        card.className =
            "supplier-card";

        card.innerHTML = `
            <h3>
                ${supplier.name}
            </h3>

            <p>
                ${supplier.description}
            </p>

            <button
                data-supplier="${supplier.id}"
            >
                Order — Rs. ${supplier.cost.toLocaleString()}
            </button>
        `;

        container.appendChild(card);
    });
}


function orderSupplier(supplierId) {

    const supplier =
        suppliers.find(function(item) {
            return item.id === supplierId;
        });

    if (!supplier) {
        return;
    }

    if (game.cash < supplier.cost) {

        notify(
            "❌ Not enough cash!"
        );

        return;
    }

    game.cash -= supplier.cost;

    supplier.products.forEach(
        function(productId) {

            const product =
                products.find(
                    function(item) {
                        return item.id === productId;
                    }
                );

            if (product) {
                product.stock += 3;
            }
        }
    );

    renderMarket();

    renderInventory();

    updateMoney();

    notify(
        "🚚 Supplier delivery received!"
    );
}


/* =========================================
   MISSIONS
   ========================================= */

const missions = [
    {
        id: "sales",
        name: "💰 First Sales",
        description:
            "Make your first sale.",
        reward: 1000
    },
    {
        id: "profit",
        name: "📈 Small Business",
        description:
            "Earn Rs. 2,000 profit.",
        reward: 2500
    },
    {
        id: "customers",
        name: "🛍️ Customer Rush",
        description:
            "Attract 5 customers.",
        reward: 3000
    }
];


function renderMissions() {

    const container =
        document.getElementById(
            "missionList"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    missions.forEach(function(mission) {

        const card =
            document.createElement("div");

        card.className =
            "mission-card";

        let progress = 0;

        if (mission.id === "sales") {
            progress =
                game.sales > 0 ? 1 : 0;
        }

        if (mission.id === "profit") {
            progress =
                Math.min(
                    game.profit / 2000,
                    1
                );
        }

        if (mission.id === "customers") {
            progress =
                Math.min(
                    game.customers / 5,
                    1
                );
        }

        card.innerHTML = `
            <h3>
                ${mission.name}
            </h3>

            <p>
                ${mission.description}
            </p>

            <p>
                Progress:
                ${Math.floor(progress * 100)}%
            </p>

            <p>
                Reward:
                Rs. ${mission.reward.toLocaleString()}
            </p>
        `;

        container.appendChild(card);
    });
}


/* =========================================
   UPDATE EVERYTHING
   ========================================= */

function updateAll() {

    updateMoney();

    renderMarket();

    renderInventory();

    renderUpgrades();

    renderSuppliers();

    renderMissions();
}


/* =========================================
   BUTTON EVENTS
   ========================================= */

document.addEventListener(
    "click",
    function(event) {

        const screenButton =
            event.target.closest(
                "[data-screen]"
            );

        if (screenButton) {

            const screenId =
                screenButton.getAttribute(
                    "data-screen"
                );

            openScreen(screenId);

            return;
        }


        const buyButton =
            event.target.closest(
                "[data-buy]"
            );

        if (buyButton) {

            buyProduct(
                buyButton.getAttribute(
                    "data-buy"
                )
            );

            return;
        }


        const sellButton =
            event.target.closest(
                "[data-sell]"
            );

        if (sellButton) {

            sellProduct(
                sellButton.getAttribute(
                    "data-sell"
                )
            );

            return;
        }


        const serveButton =
            event.target.closest(
                "[data-serve]"
            );

        if (serveButton) {

            const customer =
                serveButton.parentElement;

            serveCustomer(
                customer,
                serveButton.getAttribute(
                    "data-serve"
                )
            );

            return;
        }


        const upgradeButton =
            event.target.closest(
                "[data-upgrade]"
            );

        if (upgradeButton) {

            buyUpgrade(
                upgradeButton.getAttribute(
                    "data-upgrade"
                )
            );

            return;
        }


        const supplierButton =
            event.target.closest(
                "[data-supplier]"
            );

        if (supplierButton) {

            orderSupplier(
                supplierButton.getAttribute(
                    "data-supplier"
                )
            );
        }
    }
);


/* =========================================
   STORE BUTTON
   ========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const storeButton =
            document.getElementById(
                "openStoreButton"
            );

        if (storeButton) {

            storeButton.addEventListener(
                "click",
                toggleStore
            );
        }

        updateAll();
    }
);
