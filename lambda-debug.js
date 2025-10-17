export const handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  const method = event.requestContext?.http?.method || event.httpMethod || 'UNKNOWN';
  const origin = event.headers?.origin || event.headers?.Origin || 'NO_ORIGIN';
  
  console.log('Method:', method);
  console.log('Origin:', origin);
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS, POST',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      method,
      origin,
      eventKeys: Object.keys(event),
      hasRequestContext: !!event.requestContext,
      hasHttp: !!event.requestContext?.http,
      httpMethod: event.requestContext?.http?.method,
      directHttpMethod: event.httpMethod
    }),
  };
};
