import { createClient } from "@supabase/supabase-js";

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
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {
    const {
      order_id,
      customer_name,
      customer_phone,
      customer_address,
      items,
      total,
      paymentmethod,
      payment_id,
      status
    } = req.body;

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          order_id: order_id,
          customer_name: customer_name,
          customer_phone: customer_phone,
          customer_address: customer_address,
          items: items,
          total: total,
          paymentmethod: paymentmethod,
          payment_id: payment_id || null,
          status: status || "New"
        }
      ])
      .select();

    if (error) {
      console.error("Supabase Error:", error);

      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    return res.status(200).json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error("Server Error:", error);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
