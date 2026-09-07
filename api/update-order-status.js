import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

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

  const expectedToken = crypto
    .createHmac(
      "sha256",
      process.env.ADMIN_SESSION_SECRET
    )
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
    }
  }
);

export default async function handler(req, res) {

  // Only POST allowed
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  // Check admin login
  if (!isAdminAuthenticated(req)) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized"
    });
  }

  try {

    const { orderId, status } = req.body || {};

    // Check required fields
    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        error: "orderId and status are required"
      });
    }

    // Allowed statuses
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

    // Update Supabase
    const { data, error } = await supabase
      .from("orders")
      .update({
        status: status
      })
      .eq("order_id", orderId)
      .select()
      .single();

    // Supabase error
    if (error) {
      console.error(
        "Supabase update status error:",
        error
      );

      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    // Order not found
    if (!data) {
      return res.status(404).json({
        success: false,
        error: "Order not found"
      });
    }

    // Success
    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: data
    });

  } catch (error) {

    console.error(
      "Update order status error:",
      error
    );

    return res.status(500).json({
      success: false,
      error:
        error.message ||
        "Failed to update order status"
    });
  }
}
