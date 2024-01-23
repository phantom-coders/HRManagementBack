// const Order = require('../Model/orderModel');

const { uuid } = require('uuidv4');
const SSLCommerzPayment = require('sslcommerz-lts');
// const serviceModel = require('../Model/serviceModel');
const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
let is_live = process.env.STORE_LIVE_STATUS; //true for live, false for sandbox
// parse boolean
if (is_live == 'true') {
  is_live = true;
} else if (is_live == 'false') {
  is_live = false;
}

console.log(is_live);

// middleware
const makeOrder = async (req, res) => {
  const order = req.query;
  const product = await serviceModel.findById(order.serviceId);
  console.log(product);
  console.log(order);
  // res.json("user created")
  //   const OrderExists = await Order.findOne(order.tran_id);
  //   if (OrderExists) {
  //     res.status(422).json({
  //       error: "Order already exists",
  //       token: generateToken(OrderExists._id),
  //       OrderExists,
  //     });
  //     throw new Error("User already exists");
  //   }
  const dataId = uuid();
  const data = {
    //need to change the price according to the serviceInfo
    serviceId: order?.serviceId,
    total_amount: product?.price,
    currency: 'BDT',
    tran_id: dataId, // use unique tran_id for each api call
    success_url:
      'https://devhiveserver.vercel.app/order/success?transactionId=' + dataId,
    fail_url:
      'https://devhiveserver.vercel.app/order/fail?transactionId=' + dataId,
    cancel_url:
      'https://devhiveserver.vercel.app/order/cancel?transactionId=' + dataId,
    ipn_url: 'https://devhiveserver.vercel.app/order/ipn',
    shipping_method: 'Online',
    product_name: product?.slugTitle,
    product_category: product?.category?.name,
    product_profile: product?.aboutService,
    cus_name: order.cus_name,
    cus_id: order.cus_id,
    cus_email: order.cus_email,
    cus_add1: order.cus_add1,
    cus_add2: order.cus_add1,
    cus_city: order.cus_city,
    cus_state: order.cus_city,
    cus_postcode: order.cus_postcode,
    cus_country: order.cus_country,
    cus_phone: order.cus_phone,
    cus_fax: order.cus_phone,
    ship_name: order.cus_name,
    ship_add1: order.cus_add1,
    ship_add2: order.cus_add1,
    ship_city: order.cus_city,
    ship_state: order.cus_city,
    ship_postcode: order.cus_postcode,
    ship_country: order.cus_country,
    paid: false,
  };
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  sslcz.init(data).then((apiResponse) => {
    const newOrder = Order.create(data);
    console.log(newOrder);
    // Redirect the user to payment gateway
    let GatewayPageURL = apiResponse.GatewayPageURL;
    res.send({ url: GatewayPageURL });
    console.log('Redirecting to: ', GatewayPageURL);
    console.log(data);
  });
};

module.exports = {
  makeOrder,
};
