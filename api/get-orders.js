import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {
    // -----------------------------
    // 1. Read admin cookie
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
        error: "Unauthorized"
      });
    }

    // -----------------------------
    // 2. Environment variables
    // -----------------------------
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
    const ADMIN_SESSION_SECRET =
      process.env.ADMIN_SESSION_SECRET;

    if (!ADMIN_USERNAME || !ADMIN_SESSION_SECRET) {
      console.error("Admin environment variables missing");

      return res.status(500).json({
        success: false,
        error: "Admin configuration is missing on server."
      });
    }

    // -----------------------------
    // 3. Verify cookie
    // -----------------------------
    const expectedToken = Buffer.from(
      `${ADMIN_USERNAME}:${ADMIN_SESSION_SECRET}`
    ).toString("base64");

    if (adminCookie !== expectedToken) {
      console.error("Invalid admin session cookie");

      return res.status(401).json({
        success: false,
        error: "Unauthorized"
      });
    }

    // -----------------------------
    // 4. Supabase
    // -----------------------------
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Supabase environment variables missing");

      return res.status(500).json({
        success: false,
        error: "Supabase configuration is missing."
      });
    }

    const supabase = createClient(
      supabaseUrl,
      supabaseKey
    );

    // -----------------------------
    // 5. Get all orders
    // -----------------------------
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", {
        ascending: false
      });

    if (error) {
      console.error("Supabase get-orders error:", error);

      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    // -----------------------------
    // 6. Return orders
    // -----------------------------
    return res.status(200).json({
      success: true,
      orders: data || []
    });

  } catch (error) {
    console.error("Get orders error:", error);

    return res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
}
