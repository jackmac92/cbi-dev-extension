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

export const createEventListeners = (events, genericListener) =>
  Object.keys(events).reduce(
    (acc, entity) => [
      ...acc,
      ...events[entity].map(e => {
        const name = e.slice(2).toLowerCase();
        return [chrome[entity][e], genericListener(entity, name)];
      }),
    ],
    []
  );
