export default async function handler(req, res) {
  const API_KEY = '079993b1-9cc5-4cbd-b871-8c375d65ba7c';
  const response = await fetch(`https://www.wsdot.wa.gov/ferries/api/schedule/rest/schedule/${req.query.date}/1?apiaccesscode=${API_KEY}`);
  const data = await response.json();
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json(data);
}
