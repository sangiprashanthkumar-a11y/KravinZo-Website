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
  ]);

if (error) {
  console.error("Supabase Error:", error);
  return res.status(500).json({
    success: false,
    error: error.message
  });
}

return res.status(200).json({
  success: true,
  data
});
