import express, { type Request, type Response } from "express";import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // InfinitePay Checkout Endpoint
  app.post("/api/create-checkout", async (req, res) => {
    const { productId, productName, amountInCents, quantity } = req.body;

    if (!productId || !productName || !amountInCents || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const order_nsu = `ORDER-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const appUrl = process.env.APP_URL || `http://localhost:${PORT}`;

    const payload = {
      handle: "checkout-link", // This might need to be dynamic or from env if InfinitePay requires it
      items: [
        {
          quantity: Number(quantity),
          price: Number(amountInCents),
          description: productName,
        },
      ],
      order_nsu,
      redirect_url: `${appUrl}/obrigado`,
      webhook_url: `${appUrl}/api/webhook/infinitepay`,
    };

    try {
      const response = await axios.post(
        "https://api.infinitepay.io/invoices/public/checkout/links",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            // Add Authorization header if InfinitePay requires it
            // "Authorization": `Bearer ${process.env.INFINITEPAY_API_KEY}`
          },
        }
      );

      if (response.data && response.data.url) {
        return res.json({ url: response.data.url });
      } else {
        console.error("InfinitePay response missing URL:", response.data);
        return res.status(500).json({ message: "Failed to generate checkout URL" });
      }
    } catch (error: any) {
      console.error("Error creating InfinitePay checkout:", error.response?.data || error.message);
      return res.status(error.response?.status || 500).json({
        message: error.response?.data?.message || "Error integrating with InfinitePay",
      });
    }
  });

  // Webhook Endpoint
  app.post("/api/webhook/infinitepay", (req, res) => {
    const payload = req.body;
    console.log("Received InfinitePay Webhook:", JSON.stringify(payload, null, 2));

    // Here you would typically update your database with the payment status
    // For now, we just acknowledge receipt
    res.status(200).send("OK");
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
