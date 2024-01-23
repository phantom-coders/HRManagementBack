// const Order = require('../Model/orderModel');

const orderStatus = async (req, res) => {
  const { transactionId } = req.query;
  console.log('transId is: ', transactionId);
  try {
    const order = await Order.updateOne(
      { tran_id: transactionId },
      { $set: { paid: true } },
    );
    console.log(order);
    // res.send(order);
    if (order.modifiedCount > 0) {
      res.redirect(
        `${process.env.FrontendUrl}/checkout/success?transactionId=${transactionId}`,
      );
      return;
    }
    res.redirect(
      `${process.env.FrontendUrl}/checkout/fail?transactionId=${transactionId}`,
    );
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error');
    res.redirect(
      `${process.env.FrontendUrl}/checkout/fail?transactionId=${transactionId}`,
    );
  }
};

module.exports = {
  orderStatus,
};
