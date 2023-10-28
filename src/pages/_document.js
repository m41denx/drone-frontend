import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
        <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1"  />
        </Head>
      <body className="bg-slate-900 text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
