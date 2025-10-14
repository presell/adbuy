import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <style
            dangerouslySetInnerHTML={{
              __html: `
                /* Prevent initial flash before React hydration */
                body.prehydration .drawer,
                body.prehydration .drawer-overlay {
                  visibility: hidden !important;
                  opacity: 0 !important;
                  transform: translateX(-100%) !important;
                  pointer-events: none !important;
                }
              `,
            }}
          />
        </Head>
        <body className="prehydration">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
