import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const image_data = req.body.image_data;
    const prompt = req.body.prompt;

    try {
      const response = await axios.post(
        "http://{your-server-address}/generate_code",
        { image_data, prompt }
      );

      const generated_code = response.data.generated_html;
      const hasHtmlHeader = /<html[\s\S]*<\/html>/.test(generated_code);

      if (!hasHtmlHeader) {
        const htmlSkeleton = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.17/dist/tailwind.min.css" rel="stylesheet">
            <title>Generated HTML</title>
          </head>
          <body style={padding:1rem}>
            ${generated_code}
          </body>
          </html>
        `;
        res.status(200).json({ generated_code: htmlSkeleton });
      } else {
        res.status(200).json({ generated_code: generated_code });
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Failed to generate code" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
