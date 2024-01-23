const allOrders = async (req, res) => {
  const userId = req.params.id;
  const orders = await Order.find({ cus_id: userId });
  res.json(orders);
};

module.exports = {
  allOrders,
};
