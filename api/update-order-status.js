```javascript
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

function isAdminAuthenticated(req) {
  const cookieHeader = req.headers.cookie || "";

  const cookies = Object.fromEntries(
    cookieHeader
      .split(";")
      .filter(Boolean)
      .map(cookie => {
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
    .update(process.env.ADMIN_USERNAME || "")
    .digest("hex");

  return adminToken === expectedToken;
}

export default async function handler(req, res) {

  try {

    // METHOD CHECK
    if (req.method !== "POST") {
      return res.status(405).json({
        success: false,
        error: "Method not allowed"
      });
    }


    // ADMIN CHECK
    if (!isAdminAuthenticated(req)) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized"
      });
    }


    // ENV CHECK
    if (!process.env.SUPABASE_URL) {
      return res.status(500).json({
        success: false,
        error: "SUPABASE_URL is missing in Vercel Environment Variables"
      });
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({
        success: false,
        error: "SUPABASE_SERVICE_ROLE_KEY is missing in Vercel Environment Variables"
      });
    }


    // CREATE SUPABASE CLIENT
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


    // READ BODY
    const { orderId, status } = req.body || {};


    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        error: "orderId and status are required",
        received: {
          orderId,
          status
        }
      });
    }


    // ALLOWED STATUSES
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
        error: "Invalid order status",
        receivedStatus: status
      });
    }


    // UPDATE ORDER
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

      console.error(
        "SUPABASE UPDATE ERROR:",
        error
      );

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

    console.error(
      "UPDATE ORDER STATUS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      error:
        error?.message ||
        "Unknown server error",

      name:
        error?.name || null,

      stack:
        error?.stack || null
    });
  }
}
```
