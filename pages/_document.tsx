import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="prehydration">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
