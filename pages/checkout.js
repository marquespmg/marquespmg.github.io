export default function CheckoutPage() {
  // Esta página não será usada, é só para a URL
  return null;
}

export async function getServerSideProps(context) {
  const { products, coupon } = context.query;
  
  // Redireciona para a API
  return {
    redirect: {
      destination: `/api/facebook-checkout?${new URLSearchParams(context.query)}`,
      permanent: false,
    },
  };
}