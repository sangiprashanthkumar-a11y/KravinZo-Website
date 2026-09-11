export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {
    // -----------------------------
    // 1. Check admin cookie
    // -----------------------------
    const cookieHeader = req.headers.cookie || "";

    const match = cookieHeader.match(
      /(?:^|;\s*)kravinzo_admin=([^;]+)/
    );

    const adminCookie = match
      ? decodeURIComponent(match[1])
      : null;

    if (!adminCookie) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized - admin cookie missing"
      });
    }

    // -----------------------------
    // 2. Admin environment
    // -----------------------------
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
    const ADMIN_SESSION_SECRET =
      process.env.ADMIN_SESSION_SECRET;

    if (!ADMIN_USERNAME || !ADMIN_SESSION_SECRET) {
      return res.status(500).json({
        success: false,
        error: "Admin environment variables missing"
      });
    }

    // -----------------------------
    // 3. Verify admin cookie
    // -----------------------------
    const expectedToken = Buffer.from(
      `${ADMIN_USERNAME}:${ADMIN_SESSION_SECRET}`
    ).toString("base64");

    if (adminCookie !== expectedToken) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized - invalid admin cookie"
      });
    }

    // -----------------------------
    // 4. Read request body
    // -----------------------------
    const { orderId, status } = req.body || {};

    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        error: "orderId and status are required"
      });
    }

    // -----------------------------
    // 5. Allowed statuses
    // -----------------------------
    const allowedStatuses = [
      "New",
      "Order Confirmed",
      "Preparing Food",
      "Food Ready",
      "Handed to Delivery",
      "Delivered"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid order status"
      });
    }

    // -----------------------------
    // 6. Supabase environment
    // -----------------------------
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return res.status(500).json({
        success: false,
        error: "Supabase configuration is missing"
      });
    }

    // -----------------------------
    // 7. Update order using REST API
    //    No WebSocket / ws required
    // -----------------------------
    const response = await fetch(
      `${supabaseUrl}/rest/v1/orders?order_id=eq.${encodeURIComponent(orderId)}`,
      {
        method: "PATCH",
        headers: {
          "apikey": serviceRoleKey,
          "Authorization": `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=representation"
        },
        body: JSON.stringify({
          status: status
        })
      }
    );

    const text = await response.text();

    if (!response.ok) {
      console.error(
        "SUPABASE UPDATE ERROR:",
        response.status,
        text
      );

      return res.status(500).json({
        success: false,
        error: `Supabase update failed: ${text}`
      });
    }

    let updatedOrder = [];

    try {
      updatedOrder = JSON.parse(text);
    } catch {
      updatedOrder = [];
    }

    // -----------------------------
    // 8. Check order exists
    // -----------------------------
    if (!Array.isArray(updatedOrder) || updatedOrder.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Order not found"
      });
    }

    // -----------------------------
    // 9. Success
    // -----------------------------
    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder[0]
    });

  } catch (error) {
    console.error(
      "UPDATE ORDER STATUS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      error: `Server error: ${error.message}`
    });
  }
}
