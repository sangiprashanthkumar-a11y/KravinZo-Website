import WebSocket from "ws";
import { createClient } from "@supabase/supabase-js";

function isAdminAuthenticated(req) {
  const cookieHeader = req.headers.cookie || "";

  const cookies = Object.fromEntries(
    cookieHeader.split(";").map(cookie => {
      const [name, ...value] = cookie.trim().split("=");
      return [name, value.join("=")];
    })
  );

  const adminToken = cookies.kravinzo_admin;

  if (!adminToken || !process.env.ADMIN_SESSION_SECRET) {
    return false;
  }

  const crypto = require("crypto");

  const expectedToken = crypto
    .createHmac("sha256", process.env.ADMIN_SESSION_SECRET)
    .update(process.env.ADMIN_USERNAME)
    .digest("hex");

  return adminToken === expectedToken;
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    realtime: {
      transport: WebSocket
    }
  }
);

export default async function handler(req, res) {

  if (!isAdminAuthenticated(req)) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized"
    });
  }

  try {
    const { orderId, status } = req.body || {};

    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        error: "orderId and status are required"
      });
    }

    const allowedStatuses = [
      "pending",
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

    const { data, error } = await supabase
  .from("orders")
  .update({ status: status })
  .eq("order_id", orderId)
  .select();

if (error) {
  console.error("Supabase update status error:", error);

  return res.status(500).json({
    success: false,
    error: error.message
  });
}

if (!data || data.length === 0) {
  return res.status(404).json({
    success: false,
    error: "Order not found"
  });
}

return res.status(200).json({
  success: true,
  message: "Order status updated successfully",
  order: data[0]
});

    if (error) {
      console.error("Supabase update status error:", error);

      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: data
    });

  } catch (error) {
    console.error("Update order status error:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Failed to update order status"
    });
  }
}
