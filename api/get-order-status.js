import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {
    // ==============================
    // READ ADMIN COOKIE
    // ==============================
    const cookieHeader = req.headers.cookie || "";

    const adminCookieMatch = cookieHeader.match(
      /(?:^|;\s*)kravinzo_admin=([^;]+)/
    );

    const adminCookie = adminCookieMatch
      ? decodeURIComponent(adminCookieMatch[1])
      : null;

    if (!adminCookie) {
      console.log("ADMIN COOKIE NOT FOUND");

      return res.status(401).json({
        success: false,
        error: "Unauthorized"
      });
    }

    // ==============================
    // CREATE EXPECTED TOKEN
    // ==============================
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
    const ADMIN_SESSION_SECRET =
      process.env.ADMIN_SESSION_SECRET;

    if (!ADMIN_USERNAME || !ADMIN_SESSION_SECRET) {
      console.error("Admin environment variables missing");

      return res.status(500).json({
        success: false,
        error: "Admin configuration is missing"
      });
    }

    const expectedToken = Buffer.from(
      `${ADMIN_USERNAME}:${ADMIN_SESSION_SECRET}`
    ).toString("base64");

    // ==============================
    // VERIFY TOKEN
    // ==============================
    if (adminCookie !== expectedToken) {
      console.log("ADMIN COOKIE INVALID");

      return res.status(401).json({
        success: false,
        error: "Unauthorized"
      });
    }

    console.log("ADMIN AUTHENTICATION SUCCESS");

    // ==============================
    // SUPABASE
    // ==============================
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Supabase environment variables missing");

      return res.status(500).json({
        success: false,
        error: "Supabase environment variables are missing"
      });
    }

    const supabase = createClient(
      supabaseUrl,
      supabaseKey
    );

    // ==============================
    // GET ORDERS
    // ==============================
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", {
        ascending: false
      });

    if (error) {
      console.error("SUPABASE ERROR:", error);

      return res.status(500).json({
        success: false,
        error: error.message || "Failed to get orders"
      });
    }

    // ==============================
    // SUCCESS
    // ==============================
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
