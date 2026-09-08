import { createClient } from "@supabase/supabase-js";
import { createHmac } from "crypto";

function isAdminAuthenticated(req) { 
  const cookieHeader = req.headers.cookie || "";

  const cookies = {};

  cookieHeader.split(";").forEach((cookie) => {
    const parts = cookie.trim().split("=");

    const name = parts.shift();

    if (name) {
      cookies[name] = parts.join("=");
    }
  });

  const adminToken = cookies.kravinzo_admin;

  const secret = process.env.ADMIN_SESSION_SECRET;
  const username = process.env.ADMIN_USERNAME;

  if (!adminToken || !secret || !username) {
    return false;
  }

  const expectedToken = createHmac("sha256", secret)
    .update(username)
    .digest("hex");

  return adminToken === expectedToken;
}

export default async function handler(req, res) {
  try {
    // METHOD
    if (req.method !== "POST") {
      return res.status(405).json({
        success: false,
        error: "Method not allowed"
      });
    }

    // ADMIN AUTH
    if (!isAdminAuthenticated(req)) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized"
      });
    }

    // ENV
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl) {
      return res.status(500).json({
        success: false,
        error: "SUPABASE_URL is missing"
      });
    }

    if (!supabaseKey) {
      return res.status(500).json({
        success: false,
        error: "SUPABASE_SERVICE_ROLE_KEY is missing"
      });
    }

    // SUPABASE
    const supabase = createClient(
      supabaseUrl,
      supabaseKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // REQUEST BODY
    const body = req.body || {};

    const orderId = String(body.orderId || "").trim();
    const status = String(body.status || "").trim();

    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        error: "orderId and status are required"
      });
    }

    // ALLOWED STATUS
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

    // UPDATE
    const { data, error } = await supabase
      .from("orders")
      .update({
        status: status
      })
      .eq("order_id", orderId)
      .select()
      .single();

    // SUPABASE ERROR
    if (error) {
      console.error("SUPABASE UPDATE ERROR:", error);

      return res.status(500).json({
        success: false,
        error: error.message,
        details: error.details || null,
        hint: error.hint || null,
        code: error.code || null
      });
    }

    // ORDER NOT FOUND
    if (!data) {
      return res.status(404).json({
        success: false,
        error: "Order not found"
      });
    }

    // SUCCESS
    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: data
    });

  } catch (error) {
    console.error("UPDATE STATUS ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Failed to update order status",
      name: error.name || null
    });
  }
}
