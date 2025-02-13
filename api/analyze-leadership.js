export default function handler(req, res) {
    console.log("Received Request:", req.body); // Debugging

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "No data received" });
    }

    res.status(200).json({ message: "Data received successfully!", receivedData: req.body });
}