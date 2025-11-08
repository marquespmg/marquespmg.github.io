export default function handler(req, res) {
  const { products, coupon } = req.query;

  try {
    // ✅ SEMPRE retorna um JSON válido, mesmo sem parâmetros
    const productQuantities = {};
    
    if (products && products.trim() !== '') {
      for (const productEntry of products.split(',')) {
        const parts = productEntry.split(':');
        if (parts.length === 2) {
          const productId = parts[0].trim();
          const quantity = parseInt(parts[1].trim());
          if (!isNaN(quantity)) {
            productQuantities[productId] = quantity;
          }
        }
      }
    }

    // ✅ FORMATO EXATO QUE O FACEBOOK ESPERA
    const result = {
      products: productQuantities,
      coupon: coupon || 'No coupon applied'
    };

    console.log('✅ Facebook Checkout - Sucesso:', {
      productsReceived: products,
      productsReturned: productQuantities,
      coupon: coupon
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
    
  } catch (error) {
    console.error('❌ Erro Facebook Checkout:', error);
    
    // ✅ SEMPRE retorna JSON válido mesmo com erro
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      products: {},
      coupon: 'No coupon applied'
    });
  }
}
