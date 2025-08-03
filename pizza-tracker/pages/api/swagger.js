// pages/api/swagger.js
import swaggerSpec from '../../lib/swagger';

export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(swaggerSpec);
}