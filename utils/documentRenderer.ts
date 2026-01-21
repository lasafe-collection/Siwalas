
/**
 * Renders structured HTML that is highly compatible with Google Docs.
 * Uses standard table attributes and inline styles.
 */
export function createGoogleDocsCompatibleHtml(content: string, title: string): string {
  return `
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Times New Roman', serif; line-height: 1.5; color: #000; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid black; padding: 8px; text-align: left; vertical-align: top; font-size: 11pt; }
          th { background-color: #f2f2f2; font-weight: bold; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 3px double black; padding-bottom: 10px; }
          .header h1 { font-size: 16pt; margin: 0; text-transform: uppercase; }
          .header p { margin: 2px 0; font-size: 10pt; }
          .doc-title { text-align: center; font-size: 14pt; font-weight: bold; margin-bottom: 20px; text-decoration: underline; text-transform: uppercase; }
          .footer { margin-top: 40px; }
          .sig-container { display: flex; justify-content: space-between; margin-top: 30px; }
          .sig-box { text-align: center; width: 200px; }
          .sig-space { height: 60px; }
        </style>
      </head>
      <body>
        ${content}
      </body>
    </html>
  `;
}

export async function copyHtmlToClipboard(html: string) {
  try {
    const blob = new Blob([html], { type: 'text/html' });
    const data = [new ClipboardItem({ 'text/html': blob })];
    await navigator.clipboard.write(data);
    return true;
  } catch (err) {
    console.error('Failed to copy html: ', err);
    return false;
  }
}
