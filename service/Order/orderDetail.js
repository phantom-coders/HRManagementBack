const orderDetail = async (req, res) => {
  const tansId = req.params.id;
  const order = await Order.findOne({ tran_id: tansId });
  res.json(order);
};
module.exports = {
  orderDetail,
};
