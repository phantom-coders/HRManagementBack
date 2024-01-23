const failStatus = async (req, res) => {
  const { transactionId } = req.query;
  console.log('transId is: ', transactionId);
  //delete data from database
  res.redirect(
    `${process.env.FrontendUrl}/checkout/fail?transactionId=${transactionId}`,
  );
};
const cancelStatus = async (req, res) => {
  const { transactionId } = req.query;
  console.log('transId is: ', transactionId);
  //delete data from database
  try {
    const order = await Order.deleteOne({ tran_id: transactionId });
    console.log(order);
    // res.send(order);
    if (order.deletedCount > 0) {
      res.redirect(
        `${process.env.FrontendUrl}/checkout/cancel?transactionId=${transactionId}`,
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
  failStatus,
  cancelStatus,
};
