const openapi = {
  createProxy() {
    return {
      GET() {},
      HEAD() {},
      PUT() {},
      POST() {},
      PATCH() {},
      DELETE() {},
    };
  },
};

export const { GET, HEAD, PUT, POST, PATCH, DELETE } = openapi.createProxy();
