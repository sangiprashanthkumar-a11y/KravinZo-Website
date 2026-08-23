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
      payment_method,
      payment_id,
      status
    } = req.body;

    if (
      !order_id ||
      !customer_name ||
      !customer_phone ||
      !customer_address ||
      !items ||
      !payment_method ||
      total === undefined
    ) {
      return res.status(400).json({
        success: false,
        error: "Missing required order details"
      });
    }

    const response = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/orders`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "apikey": process.env.SUPABASE_SERVICE_ROLE_KEY,
          "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          "Prefer": "return=representation"
        },

        body: JSON.stringify({
          order_id,
          customer_name,
          customer_phone,
          customer_address,
          items,
          total: Number(total),
          payment_method,
          payment_id: payment_id || null,
          status: status || "New"
        })
      }
    );

    const text = await response.text();

    if (!response.ok) {
      console.error("SUPABASE ERROR:", text);

      return res.status(response.status).json({
        success: false,
        error: text
      });
    }

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    return res.status(200).json({
      success: true,
      message: "Order saved successfully",
      data
    });

  } catch (error) {
    console.error("SAVE ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
