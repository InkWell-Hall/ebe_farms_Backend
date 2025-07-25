
export const otpGenerator = (length = 6) => {
    let otp = "";
    for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10)
    }
    return otp;
};


export const calculateCartSummary = (cart) => {
  let itemCount = 0;
  let totalAmount = 0;

  cart.items.forEach((item) => {
    console.log('Item Advert:', item.advert);
    if (item.advert && item.advert.price) {
      itemCount += item.quantity;
      totalAmount += item.quantity * item.advert.price;
    }
  });

  return { itemCount, totalAmount };
}
