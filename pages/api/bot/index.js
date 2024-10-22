import axios from "axios";

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // Extract data from the request body (sent from the client)
    const requestData = req.body;

    // Make a POST request to the external URL using Axios
    const response = await axios.post(
      "https://neo4j-rank.azurewebsites.net/search/stru",
      requestData
    );

    // Send the response data back to the client
    res.status(200).json(response.data);
  } catch (error) {
    // Handle any errors
    console.error(error);
    res
      .status(error.response?.status || 500)
      .json({ error: "Failed to fetch data" });
  }
}
