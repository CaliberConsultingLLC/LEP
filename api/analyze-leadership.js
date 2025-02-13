export default function handler(req, res) {
    console.log("API Request Received:", req.body);
    res.status(200).json({ status: "API is working!" });
}