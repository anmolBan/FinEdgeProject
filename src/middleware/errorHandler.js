function errorHandler(err, req, res, next) {
  console.error('Error:', err.message || err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: 'Validation error', details: err.errors });
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: 'Duplicate key error', details: err.keyValue });
  }

  res.status(500).json({ message: 'Internal server error' });
}

module.exports = errorHandler;
