const axios = require("axios");

module.exports = async (req, res) => {
  const { asin } = req.query;

  if (!asin) {
    return res.status(400).json({ error: "ASIN is required" });
  }

  try {
    const url = `https://real-time-amazon-data.p.rapidapi.com/product-offers`;
    const response = await axios.get(url, {
      params: {
        asin: asin,
        country: "IN",
        limit: 100,
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
    if (price !== "N/A" && mrp !== "N/A") {
      try {
        const priceInt = parseInt(price.replace(/[^\d]/g, ""));
        const mrpInt = parseInt(mrp.replace(/[^\d]/g, ""));
        const discountPercent = 100 - Math.round((priceInt * 100) / mrpInt);
        discount = `${discountPercent}%`;
      } catch (err) {
        discount = "N/A";
      }
    }

    return res.status(200).json({ price, mrp, discount });

  } catch (error) {
    console.error("❌ Error fetching data:", error.message);
    return res.status(500).json({ error: "Something went wrong Kus" });
  }
};
