export const formatMsg = msg => {
  try {
    const stringified = JSON.stringify(msg);
    const encoded = encodeURIComponent(stringified);
    return encoded;
  } catch (e) {
    console.error('Failed to format response');
    throw e;
  }
};
