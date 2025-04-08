const axios = require("axios");

module.exports = async (req, res) => {
  const { asin } = req.query;

  if (!asin) {
    return res.status(400).json({ error: "ASIN is required" });
  }

  try {
    const response = await axios.get("https://real-time-amazon-data.p.rapidapi.com/product-offers", {
      params: {
        asin: asin,
        country: "IN",
        limit: 1,
        page: 1
      },
      headers: {
        "x-rapidapi-key": "f9838736e1mshd14837be6cbe3b8p1c49aejsnd4bb0576a44e", // <-- direct likh diya yahan
        "x-rapidapi-host": "real-time-amazon-data.p.rapidapi.com"
      }
    });

    const data = response.data?.data || {};
    const price = data.product_price || "N/A";
    const mrp = data.product_original_price || "N/A";

    let discount = "N/A";
    try {
      const priceInt = parseInt(price.replace(/[^\d]/g, ""));
      const mrpInt = parseInt(mrp.replace(/[^\d]/g, ""));
      if (priceInt && mrpInt && mrpInt > priceInt) {
        discount = `${100 - Math.round((priceInt * 100) / mrpInt)}%`;
      }
    } catch (err) {
      // Ignore parsing errors
    }

    res.status(200).json({
      asin,
      price,
      mrp,
      discount,
      country: "IN"
    });

  } catch (error) {
    console.error("❌ API Error:", error.message);
    res.status(500).json({ error: "Something went wrong xxx" });
  }
};
