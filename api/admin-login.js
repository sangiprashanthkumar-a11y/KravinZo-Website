<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>KravinZo Admin</title>

  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
    }

    body {
      background: #f5f5f5;
      padding: 20px;
    }

    #pageLoading {
      position: fixed;
      inset: 0;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: bold;
      z-index: 9999;
    }

    #loginBox {
      max-width: 400px;
      margin: 80px auto;
      background: white;
      padding: 25px;
      border-radius: 14px;
      box-shadow: 0 3px 15px rgba(0,0,0,0.1);
    }

    #loginBox h2 {
      margin-bottom: 20px;
      text-align: center;
    }

    #loginBox input {
      width: 100%;
      padding: 13px;
      margin-bottom: 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 16px;
    }

    #loginButton {
      width: 100%;
      padding: 13px;
      background: #111;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
    }

    #loginButton:hover {
      opacity: 0.85;
    }

    #loginButton:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    #loginError {
      color: red;
      margin-top: 12px;
      text-align: center;
    }

    #adminPage {
      max-width: 750px;
      margin: auto;
    }

    .admin-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      gap: 10px;
      flex-wrap: wrap;
    }

    .admin-title {
      font-size: 30px;
      font-weight: bold;
    }

    .logout-btn {
      background: #d32f2f;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 11px 18px;
      cursor: pointer;
      font-size: 14px;
    }

    .logout-btn:hover {
      opacity: 0.85;
    }

    .order-card {
      background: white;
      padding: 20px;
      margin-bottom: 16px;
      border-radius: 14px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.08);
    }

    .order-card h3 {
      margin-bottom: 14px;
      font-size: 19px;
    }

    .order-info {
      margin-bottom: 8px;
      line-height: 1.5;
      word-break: break-word;
    }

    .items-title {
      margin-top: 14px;
      margin-bottom: 7px;
      font-weight: bold;
    }

    .item {
      padding: 5px 0;
    }

    .status {
      display: inline-block;
      margin-top: 14px;
      margin-bottom: 12px;
      padding: 8px 14px;
      border-radius: 20px;
      background: #eee;
      font-weight: bold;
    }

    .status-new {
      background: #fff3cd;
    }

    .status-preparing {
      background: #ffe0b2;
    }

    .status-ready {
      background: #c8e6c9;
    }

    .status-delivery {
      background: #bbdefb;
    }

    .status-delivered {
      background: #e1bee7;
    }

    .status-buttons {
      margin-top: 5px;
    }

    .status-buttons button {
      padding: 11px 15px;
      margin: 5px 5px 0 0;
      border: none;
      border-radius: 8px;
      color: white;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
    }

    .status-buttons button:hover {
      opacity: 0.85;
    }

    .status-buttons button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .preparing-btn {
      background: #f57c00;
    }

    .ready-btn {
      background: #2e7d32;
    }

    .delivery-btn {
      background: #1976d2;
    }

    .delivered-btn {
      background: #7b1fa2;
    }

    .map-btn {
      margin-top: 8px;
      padding: 10px 14px;
      border: none;
      border-radius: 8px;
      background: #1976d2;
      color: white;
      cursor: pointer;
      font-size: 14px;
    }

    .map-btn:hover {
      opacity: 0.85;
    }

    .completed {
      display: block;
      margin-top: 10px;
      color: #2e7d32;
      font-weight: bold;
      font-size: 15px;
    }

    .empty {
      background: white;
      padding: 25px;
      border-radius: 12px;
      text-align: center;
      color: #555;
    }

    .refresh-text {
      text-align: right;
      color: #777;
      font-size: 12px;
      margin-bottom: 10px;
    }

    @media (max-width: 600px) {
      body {
        padding: 12px;
      }

      .admin-title {
        font-size: 24px;
      }

      .order-card {
        padding: 16px;
      }

      .status-buttons button {
        width: 100%;
        margin-right: 0;
      }
    }
  </style>
</head>


<body>


  <!-- ==========================================
       PAGE LOADING
  =========================================== -->

  <div id="pageLoading">
    Checking admin session...
  </div>


  <!-- ==========================================
       LOGIN
  =========================================== -->

  <div id="loginBox" style="display:none;">

    <h2>
      🔐 KravinZo Admin Login
    </h2>

    <input
      type="text"
      id="adminUsername"
      placeholder="Username"
      autocomplete="username"
    >

    <input
      type="password"
      id="adminPassword"
      placeholder="Password"
      autocomplete="current-password"
    >

    <button id="loginButton">
      Login
    </button>

    <p id="loginError"></p>

  </div>


  <!-- ==========================================
       ADMIN PAGE
  =========================================== -->

  <div
    id="adminPage"
    style="display:none;"
  >

    <div class="admin-header">

      <div class="admin-title">
        🍔 KravinZo Admin
      </div>

      <button
        class="logout-btn"
        id="logoutButton"
      >
        Logout
      </button>

    </div>


    <div class="refresh-text">
      Orders auto-refresh every 15 seconds
    </div>


    <div id="orders">

      <div class="empty">
        Loading orders...
      </div>

    </div>

  </div>



  <script>


    // ==========================================
    // GLOBAL VARIABLES
    // ==========================================

    let kravinZoAudioCtx = null;

    let lastOrderId =
      localStorage.getItem(
        "kravinzoLastOrderId"
      ) || null;


    // ==========================================
    // SHOW LOGIN
    // ==========================================

    function showLogin() {

      document.getElementById(
        "pageLoading"
      ).style.display = "none";

      document.getElementById(
        "loginBox"
      ).style.display = "block";

      document.getElementById(
        "adminPage"
      ).style.display = "none";
    }


    // ==========================================
    // SHOW ADMIN
    // ==========================================

    function showAdmin() {

      document.getElementById(
        "pageLoading"
      ).style.display = "none";

      document.getElementById(
        "loginBox"
      ).style.display = "none";

      document.getElementById(
        "adminPage"
      ).style.display = "block";
    }


    // ==========================================
    // SOUND UNLOCK
    // ==========================================

    function unlockKravinZoSound() {

      const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

      if (!AudioContext) return;


      if (!kravinZoAudioCtx) {

        kravinZoAudioCtx =
          new AudioContext();

      }


      if (
        kravinZoAudioCtx.state ===
        "suspended"
      ) {

        kravinZoAudioCtx.resume();

      }

    }


    // ==========================================
    // NEW ORDER SOUND
    // ==========================================

    function playKravinZoSound() {

      const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

      if (!AudioContext) return;


      if (!kravinZoAudioCtx) {

        kravinZoAudioCtx =
          new AudioContext();

      }


      const ctx =
        kravinZoAudioCtx;


      const playRestaurantBell =
        () => {

          const start =
            ctx.currentTime;


          const compressor =
            ctx.createDynamicsCompressor();


          compressor.threshold.setValueAtTime(
            -18,
            start
          );


          compressor.knee.setValueAtTime(
            8,
            start
          );


          compressor.ratio.setValueAtTime(
            5,
            start
          );


          compressor.attack.setValueAtTime(
            0.003,
            start
          );


          compressor.release.setValueAtTime(
            0.15,
            start
          );


          compressor.connect(
            ctx.destination
          );


          for (
            let r = 0;
            r < 3;
            r++
          ) {

            const t =
              start + (r * 2);


            // MAIN BELL

            const osc1 =
              ctx.createOscillator();

            const gain1 =
              ctx.createGain();


            osc1.type =
              "sine";


            osc1.frequency.setValueAtTime(
              760,
              t
            );


            osc1.frequency.exponentialRampToValueAtTime(
              680,
              t + 1.35
            );


            gain1.gain.setValueAtTime(
              0.001,
              t
            );


            gain1.gain.exponentialRampToValueAtTime(
              0.9,
              t + 0.015
            );


            gain1.gain.exponentialRampToValueAtTime(
              0.001,
              t + 1.5
            );


            osc1.connect(gain1);
            gain1.connect(compressor);


            osc1.start(t);
            osc1.stop(t + 1.55);


            // BRIGHT DING

            const osc2 =
              ctx.createOscillator();

            const gain2 =
              ctx.createGain();


            osc2.type =
              "sine";


            osc2.frequency.setValueAtTime(
              1520,
              t
            );


            osc2.frequency.exponentialRampToValueAtTime(
              1320,
              t + 1.25
            );


            gain2.gain.setValueAtTime(
              0.001,
              t
            );


            gain2.gain.exponentialRampToValueAtTime(
              0.55,
              t + 0.01
            );


            gain2.gain.exponentialRampToValueAtTime(
              0.001,
              t + 1.35
            );


            osc2.connect(gain2);
            gain2.connect(compressor);


            osc2.start(t);
            osc2.stop(t + 1.4);


            // HIGH SPARKLE

            const osc3 =
              ctx.createOscillator();

            const gain3 =
              ctx.createGain();


            osc3.type =
              "sine";


            osc3.frequency.setValueAtTime(
              2280,
              t
            );


            gain3.gain.setValueAtTime(
              0.001,
              t
            );


            gain3.gain.exponentialRampToValueAtTime(
              0.18,
              t + 0.008
            );


            gain3.gain.exponentialRampToValueAtTime(
              0.001,
              t + 0.9
            );


            osc3.connect(gain3);
            gain3.connect(compressor);


            osc3.start(t);
            osc3.stop(t + 1);

          }

        };


      if (
        ctx.state === "suspended"
      ) {

        ctx.resume().then(
          playRestaurantBell
        );

      } else {

        playRestaurantBell();

      }

    }


    // ==========================================
    // ADMIN LOGIN
    // ==========================================

    async function adminLogin() {

      const username =
        document
          .getElementById(
            "adminUsername"
          )
          .value
          .trim();


      const password =
        document
          .getElementById(
            "adminPassword"
          )
          .value;


      const error =
        document.getElementById(
          "loginError"
        );


      const loginButton =
        document.getElementById(
          "loginButton"
        );


      error.textContent = "";


      if (
        !username ||
        !password
      ) {

        error.textContent =
          "Please enter username and password.";

        return;
      }


      loginButton.disabled =
        true;

      loginButton.textContent =
        "Logging in...";


      try {

        const response =
          await fetch(
            "/api/admin-login",
            {
              method: "POST",

              credentials: "include",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body: JSON.stringify({
                username:
                  username,

                password:
                  password
              })
            }
          );


        const data =
          await response.json();


        if (
          response.ok &&
          data.success
        ) {

          unlockKravinZoSound();

          showAdmin();

          await loadOrders();

        } else {

          error.textContent =
            data.error ||
            "Invalid username or password.";

        }


      } catch (err) {

        console.error(
          "Login error:",
          err
        );


        error.textContent =
          "Login failed. Please try again.";

      }


      loginButton.disabled =
        false;

      loginButton.textContent =
        "Login";

    }


    // ==========================================
    // CHECK ADMIN SESSION
    // ==========================================

    async function checkAdminSession() {

      try {

        const response =
          await fetch(
            "/api/get-orders",
            {
              method: "GET",

              credentials: "include",

              cache: "no-store"
            }
          );


        if (response.ok) {

          showAdmin();

          await loadOrders();

          return;
        }


        showLogin();

      } catch (error) {

        console.error(
          "Session check failed:",
          error
        );


        showLogin();

      }

    }


    // ==========================================
    // LOAD ORDERS
    // ==========================================

    async function loadOrders() {

      const ordersContainer =
        document.getElementById(
          "orders"
        );


      try {

        const response =
          await fetch(
            "/api/get-orders",
            {
              method: "GET",

              credentials: "include",

              cache: "no-store"
            }
          );


        // SESSION EXPIRED

        if (
          response.status === 401
        ) {

          showLogin();

          return;
        }


        const responseText =
          await response.text();


        let data;


        try {

          data =
            JSON.parse(
              responseText
            );

        } catch (error) {

          console.error(
            "Invalid JSON:",
            responseText
          );


          ordersContainer.innerHTML =
            '<div class="empty">Server returned invalid response.</div>';

          return;

        }


        if (!response.ok) {

          ordersContainer.innerHTML =
            '<div class="empty">Failed to load orders.</div>';

          return;

        }


        if (
          !data.success ||
          !Array.isArray(
            data.orders
          ) ||
          data.orders.length === 0
        ) {

          ordersContainer.innerHTML =
            '<div class="empty">No orders found.</div>';

          return;

        }


        // ======================================
        // NEW ORDER DETECTION
        // ======================================

        const latestOrder =
          data.orders[0];


        const latestOrderId =
          latestOrder?.order_id;


        if (
          lastOrderId &&
          latestOrderId &&
          latestOrderId !==
            lastOrderId
        ) {

          console.log(
            "🔔 NEW KRAVINZO ORDER:",
            latestOrderId
          );


          playKravinZoSound();

        }


        if (latestOrderId) {

          lastOrderId =
            latestOrderId;


          localStorage.setItem(
            "kravinzoLastOrderId",
            latestOrderId
          );

        }


        // CLEAR

        ordersContainer.innerHTML =
          "";


        // ======================================
        // DISPLAY ORDERS
        // ======================================

        data.orders.forEach(
          order => {

            const card =
              document.createElement(
                "div"
              );


            card.className =
              "order-card";


            // ==================================
            // ITEMS
            // ==================================

            let itemsHTML =
              "Unable to read items";


            try {

              let items =
                order.items;


              if (
                typeof items ===
                "string"
              ) {

                items =
                  JSON.parse(items);

              }


              if (
                Array.isArray(items)
              ) {

                itemsHTML =
                  items
                    .map(
                      item => {

                        const name =
                          item.name ||
                          "Item";


                        const quantity =
                          item.quantity ||
                          1;


                        const itemTotal =
                          item.itemTotal ??
                          item.total ??
                          (
                            Number(
                              item.price
                            || 0
                            ) *
                            quantity
                          );


                        return `
                          <div class="item">
                            ${name}
                            × ${quantity}
                            — ₹${itemTotal}
                          </div>
                        `;

                      }
                    )
                    .join("");

              }

            } catch (error) {

              console.error(
                "Items parse error:",
                error
              );

            }


            // ==================================
            // MAP
            // ==================================

            let mapUrl =
              null;


            let mapButtonHTML =
              "";


            if (
              order.customer_address &&
              order.customer_address.includes(
                "Google Maps:"
              )
            ) {

              mapUrl =
                order.customer_address
                  .split(
                    "Google Maps:"
                  )[1]
                  .trim();


              mapButtonHTML = `
                <button class="map-btn">
                  📍 Open Google Maps
                </button>
              `;

            }


            // ==================================
            // STATUS
            // ==================================

            const currentStatus =
              order.status ||
              "New";


            let statusClass =
              "";


            if (
              currentStatus ===
              "New" ||
              currentStatus ===
              "pending" ||
              currentStatus ===
              "Order Confirmed"
            ) {

              statusClass =
                "status-new";

            } else if (
              currentStatus ===
              "Preparing Food"
            ) {

              statusClass =
                "status-preparing";

            } else if (
              currentStatus ===
              "Food Ready"
            ) {

              statusClass =
                "status-ready";

            } else if (
              currentStatus ===
              "Handed to Delivery"
            ) {

              statusClass =
                "status-delivery";

            } else if (
              currentStatus ===
              "Delivered"
            ) {

              statusClass =
                "status-delivered";

            }


            // ==================================
            // STATUS BUTTON
            // ==================================

            let statusButtonHTML =
              "";


            // NEW

            if (
              currentStatus ===
              "New" ||
              currentStatus ===
              "Order Confirmed" ||
              currentStatus ===
              "pending"
            ) {

              statusButtonHTML = `
                <button
                  class="preparing-btn"
                  data-action="preparing"
                >
                  🍳 Preparing Food
                </button>
              `;

            }


            // PREPARING

            else if (
              currentStatus ===
              "Preparing Food"
            ) {

              statusButtonHTML = `
                <button
                  class="ready-btn"
                  data-action="ready"
                >
                  ✅ Food Ready
                </button>
              `;

            }


            // READY

            else if (
              currentStatus ===
              "Food Ready"
            ) {

              statusButtonHTML = `
                <button
                  class="delivery-btn"
                  data-action="delivery"
                >
                  🛵 Handed to Delivery
                </button>
              `;

            }


            // DELIVERY

            else if (
              currentStatus ===
              "Handed to Delivery"
            ) {

              statusButtonHTML = `
                <button
                  class="delivered-btn"
                  data-action="delivered"
                >
                  🎉 Delivered
                </button>
              `;

            }


            // DELIVERED

            else if (
              currentStatus ===
              "Delivered"
            ) {

              statusButtonHTML = `
                <strong class="completed">
                  ✅ Order Completed
                </strong>
              `;

            }


            // ==================================
            // CARD HTML
            // ==================================

            card.innerHTML = `

              <h3>
                Order #${escapeHTML(
                  order.order_id
                )}
              </h3>


              <div class="order-info">
                <strong>🕐 Order Time:</strong>
                ${
                  order.created_at
                    ? new Date(
                        order.created_at
                      ).toLocaleString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true
                        }
                      )
                    : "N/A"
                }
              </div>


              <div class="order-info">
                <strong>Customer:</strong>
                ${escapeHTML(
                  order.customer_name ||
                  "N/A"
                )}
              </div>


              <div class="order-info">
                <strong>Phone:</strong>
                ${escapeHTML(
                  order.customer_phone ||
                  "N/A"
                )}
              </div>


              <div class="order-info">
                <strong>Address:</strong><br>
                ${formatAddress(
                  order.customer_address ||
                  "N/A"
                )}
              </div>


              ${mapButtonHTML}


              <div class="order-info" style="margin-top:12px;">
                <strong>Total:</strong>
                ₹${Number(
                  order.total || 0
                )}
              </div>


              <div class="items-title">
                Items:
              </div>


              <div>
                ${itemsHTML}
              </div>


              <div
                class="status ${statusClass}"
              >
                📦 Current Status:
                ${escapeHTML(
                  currentStatus
                )}
              </div>


              <div class="status-buttons">
                ${statusButtonHTML}
              </div>

            `;


            // ==================================
            // MAP BUTTON
            // ==================================

            if (mapUrl) {

              const mapButton =
                card.querySelector(
                  ".map-btn"
                );


              if (mapButton) {

                mapButton.addEventListener(
                  "click",
                  () => {

                    openMap(mapUrl);

                  }
                );

              }

            }


            // ==================================
            // PREPARING
            // ==================================

            const preparingButton =
              card.querySelector(
                ".preparing-btn"
              );


            if (preparingButton) {

              preparingButton.addEventListener(
                "click",
                async () => {

                  preparingButton.disabled =
                    true;


                  preparingButton.textContent =
                    "Updating...";


                  await updateStatus(
                    order.order_id,
                    "Preparing Food"
                  );

                }
              );

            }


            // ==================================
            // READY
            // ==================================

            const readyButton =
              card.querySelector(
                ".ready-btn"
              );


            if (readyButton) {

              readyButton.addEventListener(
                "click",
                async () => {

                  readyButton.disabled =
                    true;


                  readyButton.textContent =
                    "Updating...";


                  await updateStatus(
                    order.order_id,
                    "Food Ready"
                  );

                }
              );

            }


            // ==================================
            // DELIVERY
            // ==================================

            const deliveryButton =
              card.querySelector(
                ".delivery-btn"
              );


            if (deliveryButton) {

              deliveryButton.addEventListener(
                "click",
                async () => {

                  deliveryButton.disabled =
                    true;


                  deliveryButton.textContent =
                    "Updating...";


                  await updateStatus(
                    order.order_id,
                    "Handed to Delivery"
                  );

                }
              );

            }


            // ==================================
            // DELIVERED
            // ==================================

            const deliveredButton =
              card.querySelector(
                ".delivered-btn"
              );


            if (deliveredButton) {

              deliveredButton.addEventListener(
                "click",
                async () => {

                  deliveredButton.disabled =
                    true;


                  deliveredButton.textContent =
                    "Updating...";


                  await updateStatus(
                    order.order_id,
                    "Delivered"
                  );

                }
              );

            }


            ordersContainer.appendChild(
              card
            );

          }
        );


      } catch (error) {

        console.error(
          "Load orders error:",
          error
        );


        ordersContainer.innerHTML =
          '<div class="empty">Failed to load orders.</div>';

      }

    }


    // ==========================================
    // ESCAPE HTML
    // ==========================================

    function escapeHTML(value) {

      const div =
        document.createElement(
          "div"
        );


      div.textContent =
        String(value);


      return div.innerHTML;

    }


    // ==========================================
    // FORMAT ADDRESS
    // ==========================================

    function formatAddress(address) {

      const text =
        String(address);


      const parts =
        text.split(
          "Google Maps:"
        );


      return escapeHTML(
        parts[0]
      ).replace(
        /\n/g,
        "<br>"
      );

    }


    // ==========================================
    // GOOGLE MAP
    // ==========================================

    function openMap(url) {

      if (!url) return;


      window.open(
        url,
        "_blank",
        "noopener,noreferrer"
      );

    }


    // ==========================================
    // UPDATE STATUS
    // ==========================================

    async function updateStatus(
      orderId,
      status
    ) {

      try {

        const response =
          await fetch(
            "/api/update-status",
            {
              method: "POST",

              credentials: "include",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body: JSON.stringify({
                orderId:
                  orderId,

                status:
                  status
              })
            }
          );


        const responseText =
          await response.text();


        console.log(
          "STATUS API:",
          response.status
        );


        console.log(
          "STATUS RESPONSE:",
          responseText
        );


        let data;


        try {

          data =
            JSON.parse(
              responseText
            );

        } catch (error) {

          alert(
            "Server Error (" +
            response.status +
            "):\n\n" +
            responseText
          );

          return;

        }


        // SESSION EXPIRED

        if (
          response.status === 401
        ) {

          showLogin();

          return;

        }


        // SUCCESS

        if (
          response.ok &&
          data.success
        ) {

          await loadOrders();

          return;

        }


        // ERROR

        alert(
          data.error ||
          data.message ||
          "Failed to update status"
        );


      } catch (error) {

        console.error(
          "Update status error:",
          error
        );


        alert(
          "Connection error:\n\n" +
          error.message
        );

      }

    }


    // ==========================================
    // LOGOUT
    // ==========================================

    async function logoutAdmin() {

      try {

        await fetch(
          "/api/admin-logout",
          {
            method: "POST",

            credentials: "include"
          }
        );

      } catch (error) {

        console.error(
          "Logout error:",
          error
        );

      }


      showLogin();

    }


    // ==========================================
    // LOGIN BUTTON
    // ==========================================

    document
      .getElementById(
        "loginButton"
      )
      .addEventListener(
        "click",
        adminLogin
      );


    // ==========================================
    // ENTER LOGIN
    // ==========================================

    document
      .getElementById(
        "adminPassword"
      )
      .addEventListener(
        "keydown",
        event => {

          if (
            event.key === "Enter"
          ) {

            adminLogin();

          }

        }
      );


    // ==========================================
    // LOGOUT BUTTON
    // ==========================================

    document
      .getElementById(
        "logoutButton"
      )
      .addEventListener(
        "click",
        logoutAdmin
      );


    // ==========================================
    // AUTO REFRESH
    // ==========================================

    setInterval(
      async () => {

        const adminPage =
          document.getElementById(
            "adminPage"
          );


        if (
          adminPage &&
          adminPage.style.display !==
            "none"
        ) {

          await loadOrders();

        }

      },
      15000
    );


    // ==========================================
    // SOUND UNLOCK
    // ==========================================

    document.addEventListener(
      "click",
      unlockKravinZoSound
    );


    document.addEventListener(
      "keydown",
      unlockKravinZoSound
    );


    // ==========================================
    // START
    // ==========================================

    checkAdminSession();


  </script>

</body>
</html>
