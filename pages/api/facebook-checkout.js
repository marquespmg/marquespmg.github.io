// pages/api/facebook-checkout.js
export default function handler(req, res) {
  const { products, coupon } = req.query;

  try {
    // Parse dos produtos NO FORMATO EXATO DO FACEBOOK
    const productQuantities = {};
    
    if (products) {
      for (const productEntry of products.split(',')) {
        const parts = productEntry.split(':');
        if (parts.length === 2) {
          productQuantities[parts[0]] = parseInt(parts[1]); // Product ID -> Quantity
        }
      }
    }

    // ✅ FORMATO EXATO QUE O FACEBOOK ESPERA
    const result = {
      products: productQuantities,
      coupon: coupon || 'No coupon applied'
    };

    console.log('📦 Facebook Checkout - Retornando:', result);
    res.status(200).json(result);
    
  } catch (error) {
    console.error('❌ Erro Facebook Checkout:', error);
    res.status(500).json({
      products: {},
      coupon: 'No coupon applied',
      error: error.message
    });
  }
}
