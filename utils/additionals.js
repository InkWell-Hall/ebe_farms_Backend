
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
    const price = item.advert?.price || 0;
    itemCount += item.quantity;
    totalAmount += item.quantity * price;
  });

  return { itemCount, totalAmount };
};
