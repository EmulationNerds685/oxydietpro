import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// 🔥 ESM Safe __dirname Setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generatePDF = async (dietData) => {
  const browser = await puppeteer.launch({
    headless: "new",
  });

  const page = await browser.newPage();

  const htmlContent = generateHTML(dietData);
await page.setContent(htmlContent, {
  waitUntil: "domcontentloaded",
});

  const fileName = `diet-${Date.now()}.pdf`;
  const filePath = path.join(process.cwd(), fileName);

  await page.pdf({
    path: filePath,
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  return filePath;
};


const generateHTML = ({ name, totalCalories, macros, meals }) => {

  const logoFilePath = path.join(process.cwd(), "public", "OxyLogo.png");
  const logoBase64 = fs.readFileSync(logoFilePath).toString("base64");
  const logoSrc = `data:image/png;base64,${logoBase64}`;

  return `
  <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background: #ffffff;
      }

      .header {
        background: #000000;
        color: white;
        text-align: center;
        padding: 30px 20px;
      }

      .header img {
        width: 150px;
        height: auto;
        margin-bottom: 10px;
      }

      .header h1 {
        margin: 5px 0;
        color: #ff6600;
        font-size: 28px;
        letter-spacing: 1px;
      }

      .tagline {
        font-style: italic;
        font-size: 14px;
        margin-bottom: 8px;
      }

      .coach {
        margin-top: 6px;
        font-size: 13px;
      }

      .content {
        padding: 30px;
      }

      .macro-box {
        display: flex;
        justify-content: space-between;
        background: #f2f2f2;
        padding: 12px;
        border-radius: 6px;
        margin-bottom: 20px;
        font-weight: bold;
      }

      h2 {
        margin-top: 25px;
        color: #ff6600;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
      }

      th {
        background-color: #ff6600;
        color: white;
        padding: 8px;
        font-size: 13px;
      }

      td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: center;
        font-size: 12px;
      }

      .footer {
        margin-top: 40px;
        padding: 20px;
        background: #000;
        color: white;
        text-align: center;
        font-size: 12px;
      }

      .footer strong {
        color: #ff6600;
      }

      .disclaimer {
        font-size: 10px;
        margin-top: 8px;
        opacity: 0.8;
      }

    </style>
  </head>

  <body>

    <div class="header">
      <img src="${logoSrc}" style="width:150px; height:auto;" />
      <h1>OXYGEN GYM</h1>
      <div class="tagline">Fuel Your Body With Oxygen</div>
      <div class="coach">Prepared By: <strong>Kunal Gupta</strong></div>
      <div class="coach">Certified Fitness Trainer</div>
    </div>

    <div class="content">

      <h2>Client Name: ${name}</h2>
      <p><strong>Total Calories:</strong> ${totalCalories} kcal</p>

      <div class="macro-box">
        <div>Protein: ${macros.protein}g</div>
        <div>Carbs: ${macros.carbs}g</div>
        <div>Fats: ${macros.fats}g</div>
      </div>

      ${meals.map(meal => `
        <h2>${meal.mealName}</h2>
        <table>
          <tr>
            <th>Food</th>
            <th>Grams</th>
            <th>Calories</th>
            <th>Protein</th>
            <th>Carbs</th>
            <th>Fats</th>
          </tr>

          ${meal.items.map(item => `
            <tr>
              <td>${item.name}</td>
              <td>${item.grams}g</td>
              <td>${item.calories}</td>
              <td>${item.protein}g</td>
              <td>${item.carbs}g</td>
              <td>${item.fats}g</td>
            </tr>
          `).join("")}

        </table>
      `).join("")}

    </div>

    <div class="footer">
      <div><strong>OXYGEN GYM</strong></div>
      <div>Opposite Baleshwar Nath Mandir Back Gate, Ballia, Uttar Pradesh - 277001</div>
      <div>Contact: +91 84708 99395</div>
      <div>Instagram: @oxxygengym</div>

      <div class="disclaimer">
        This diet plan is for general fitness purposes only. 
        Consult a healthcare professional before starting.
      </div>
    </div>

  </body>
  </html>
  `;
};