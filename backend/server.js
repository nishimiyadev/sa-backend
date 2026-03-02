console.log("🔥 VERSION NUEVA ACTIVA 🔥");
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MercadoPagoConfig, Preference } from "mercadopago";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Nueva configuración correcta
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

app.post("/create-preference", async (req, res) => {
  try {
    const { items } = req.body;

    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: items.map((item) => ({
          title: item.title,
          unit_price: Number(item.price),
          quantity: Number(item.quantity),
          currency_id: "PEN",
        })),
        back_urls: {
          success: "https://stayalivemerch.web.app/success",
          failure: "https://stayalivemerch.web.app/failure",
          pending: "https://stayalivemerch.web.app/pending",
        },
        auto_return: "approved",
      },
    });

    res.json({ init_point: response.init_point });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando preferencia" });
  }
});

app.post("/webhook", async (req, res) => {
  try {
    console.log("Webhook recibido:", req.body);

    const paymentId = req.body?.data?.id;

    if (!paymentId) {
      return res.sendStatus(200);
    }

    // Aquí luego verificaremos el pago real
    res.sendStatus(200);
  } catch (error) {
    console.error("Error en webhook:", error);
    res.sendStatus(500);
  }
});

app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});
