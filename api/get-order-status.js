import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {
    // =========================
    // ADMIN LOGIN CHECK
    // =========================
    const cookieHeader = req.headers.cookie || "";

    const cookies = Object.fromEntries(
      cookieHeader.split(";").map(cookie => {
        const [key, ...value] = cookie.trim().split("=");
        return [key, value.join("=")];
      })
    );

    const adminCookie = cookies.kravinzo_admin;

    if (!adminCookie) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized. Please login."
      });
    }

    // =========================
    // VERIFY ADMIN SESSION
    // =========================
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminSessionSecret = process.env.ADMIN_SESSION_SECRET;

    if (!adminUsername || !adminSessionSecret) {
      console.error("Missing admin environment variables");

      return res.status(500).json({
        success: false,
        error: "Admin configuration is missing on server."
      });
    }

    const expectedToken = Buffer.from(
      `${adminUsername}:${adminSessionSecret}`
    ).toString("base64");

    if (adminCookie !== expectedToken) {
      return res.status(401).json({
        success: false,
        error: "Invalid admin session. Please login again."
      });
    }

    // =========================
    // SUPABASE
    // =========================
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase environment variables");

      return res.status(500).json({
        success: false,
        error: "Supabase environment variables are missing"
      });
    }

    const supabase = createClient(
      supabaseUrl,
      supabaseKey
    );

    // =========================
    // GET ALL ORDERS
    // =========================
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", {
        ascending: false
      });

    if (error) {
      console.error("Supabase orders error:", error);

      return res.status(500).json({
        success: false,
        error: error.message || "Failed to get orders"
      });
    }

    return res.status(200).json({
      success: true,
      orders: data || []
    });

  } catch (error) {
    console.error("GET ORDERS ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error?.message || "Failed to get orders"
    });
  }
}
