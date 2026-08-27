
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
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase get orders error:", error);

      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    return res.status(200).json({
      success: true,
      orders: data || []
    });

  } catch (error) {
    console.error("Get orders error:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Failed to get orders"
    });
  }
}
