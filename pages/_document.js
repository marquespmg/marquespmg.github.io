import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        {/* Remova o <title> daqui */}
        <link rel="icon" href="/logo.png" />
        <meta name="description" content="Sua loja de produtos especiais" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}