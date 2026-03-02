import admin from "firebase-admin";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MercadoPagoConfig, Preference } from "mercadopago";

dotenv.config();
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Nueva configuración correcta
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

app.post("/create-preference", async (req, res) => {
  try {
    const { items, orderId } = req.body;

    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: items.map((item) => ({
          title: item.title,
          unit_price: Number(item.price),
          quantity: Number(item.quantity),
          currency_id: "PEN",
        })),
        metadata: {
          orderId: orderId, // IMPORTANTE
        },
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

    // Consultar el pago en Mercado Pago
    const payment = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        },
      },
    );

    const paymentData = await payment.json();

    if (paymentData.status === "approved") {
      const orderId = paymentData.metadata?.orderId;

      if (orderId) {
        await db.collection("ordenes").doc(orderId).update({
          estadoPago: "pagado",
          estado: "confirmado",
        });

        console.log("Orden actualizada a pagado:", orderId);
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error en webhook:", error);
    res.sendStatus(500);
  }
});

app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});
