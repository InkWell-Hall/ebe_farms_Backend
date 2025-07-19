// utils/advertFilters.js
export const buildAdvertFilter = (userId, advertId, category, price, name, subCategory) => {
    const filter = { user: userId };

    if (advertId) filter._id = advertId;
    if (category) filter.category = new RegExp(`^${category}$`, 'i');
    if (subCategory) filter.subCategory = new RegExp(`^${subCategory}$`, 'i');
    if (name) filter.name = new RegExp(name, 'i'); // partial match
    if (price) filter.price = Number(price); // convert to number if stored as number

    return filter;
};


// calculate item price in cart
 export const calculateCartSummary = (populatedCart) => {
  let total = 0;

  // Count total quantity of items
  const itemCount = populatedCart.items.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate total amount
  populatedCart.items.forEach(item => {
    if (item.advert && item.advert.price) {
      const price = parseFloat(item.advert.price);
      if (!isNaN(price)) {
        total += item.quantity * price;
      }
    }
  });

  // Set totalAmount on the cart (optional)
  populatedCart.totalAmount = parseFloat(total.toFixed(2));

  return {
    itemCount,
    totalAmount: populatedCart.totalAmount
  };
};
