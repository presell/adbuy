import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      {/* Start in 'prehydration' state so CSS can hide the drawer before JS */}
      <body className="prehydration">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
