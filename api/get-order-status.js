import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  // ==============================
  // ONLY GET REQUESTS
  // ==============================
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {
    // ==============================
    // GET ORDER ID
    // ==============================
    const { orderId } = req.query;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        error: "Order ID is required"
      });
    }

    // ==============================
    // SUPABASE ENVIRONMENT
    // ==============================
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error(
        "SUPABASE ENVIRONMENT VARIABLES MISSING"
      );

      return res.status(500).json({
        success: false,
        error:
          "Supabase environment variables are missing"
      });
    }

    // ==============================
    // SUPABASE CLIENT
    // NO WEBSOCKET
    // NO REALTIME
    // ==============================
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

    // ==============================
    // GET SINGLE ORDER
    // ==============================
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("order_id", orderId)
      .maybeSingle();

    // ==============================
    // DATABASE ERROR
    // ==============================
    if (error) {
      console.error(
        "GET ORDER STATUS SUPABASE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        error:
          error.message ||
          "Failed to get order status"
      });
    }

    // ==============================
    // ORDER NOT FOUND
    // ==============================
    if (!data) {
      return res.status(404).json({
        success: false,
        error: "Order not found"
      });
    }

    // ==============================
    // SUCCESS
    // ==============================
    return res.status(200).json({
      success: true,
      order: data
    });

  } catch (error) {
    console.error(
      "GET ORDER STATUS SERVER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      error:
        error?.message ||
        "Failed to get order status"
    });
  }
}
