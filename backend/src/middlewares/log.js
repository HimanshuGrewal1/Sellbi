
const requestLogs = [];

export const logRequest = (req, res, next) => {
  const redactedHeaders = { ...req.headers };
  delete redactedHeaders.authorization; 

  requestLogs.push({
    method: req.method,
    path: req.originalUrl,
    timestamp: new Date(),
    headers: redactedHeaders,
  });

  
  if (requestLogs.length > 50) {
    requestLogs.shift();
  }

  next();
};

export const getRecentLogs = () => requestLogs;
