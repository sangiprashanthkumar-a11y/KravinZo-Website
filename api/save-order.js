import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  try {
    console.log("SAVE ORDER FUNCTION STARTED");

    if (req.method !== "POST") {
      return res.status(405).json({
        success: false,
        error: "Method not allowed"
      });
    }

    if (!process.env.SUPABASE_URL) {
      throw new Error("SUPABASE_URL is missing");
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing");
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const body = req.body || {};

    console.log("Request body:", body);

    const {
      order_id,
      customer_name,
      address,
      phone_number,
      item,
      payment_method,
      total,
      payment_id,
      status
    } = body;

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          order_id,
          customer_name,
          address,
          phone_number,
          item,
          payment_method,
          total,
          payment_id,
          status
        }
      ])
      .select();

    if (error) {
      console.error("SUPABASE ERROR:", error);

      return res.status(500).json({
        success: false,
        error: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
    }

    console.log("ORDER SAVED:", data);

    return res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    console.error("FUNCTION ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error?.message || "Unknown server error"
    });
  }
}
