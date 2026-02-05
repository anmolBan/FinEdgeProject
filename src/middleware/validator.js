// Generic Zod-based validator middleware for request parts

function validate(schema, source = 'body') {
  return (req, res, next) => {
    try {
      const data = { [source]: req[source], params: req.params, query: req.query };
      const result = schema.safeParse(data);
      if (!result.success) {
        return res.status(400).json({ errors: result.error.errors });
      }
      // overwrite with parsed data to ensure correct types
      if (result.data.body) req.body = result.data.body;
      if (result.data.params) req.params = result.data.params;
      if (result.data.query) req.query = result.data.query;
      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = validate;
