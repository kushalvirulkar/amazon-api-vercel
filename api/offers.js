const axios = require("axios");

module.exports = async (req, res) => {
  const { asin } = req.query;

  // Debug: Check if environment variable is loaded
  console.log("🔍 RAPIDAPI_KEY from env:", process.env.RAPIDAPI_KEY);

  if (!asin) {
    return res.status(400).json({ error: "ASIN is required" });
  }

  try {
    const response = await axios.get("https://real-time-amazon-data.p.rapidapi.com/product-offers", {
      params: {
        asin,
        country: "IN",
        limit: 1,
        page: 1
      },
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY,
        "x-rapidapi-host": "real-time-amazon-data.p.rapidapi.com"
      }
    });

    const data = response.data.data;
    const price = data.product_price || "N/A";
    const mrp = data.product_original_price || "N/A";

    let discount = "N/A";
    try {
      const priceInt = parseInt(price.replace(/[^\d]/g, ""));
      const mrpInt = parseInt(mrp.replace(/[^\d]/g, ""));
      discount = `${100 - Math.round((priceInt * 100) / mrpInt)}%`;
    } catch (err) {
      console.log("❌ Discount Calculation Error:", err.message);
    }

    res.status(200).json({ price, mrp, discount });
  } catch (error) {
    console.error("❌ API Call Error:", error.message);
    res.status(500).json({ error: "Something went wrong kushal" });
  }
};
