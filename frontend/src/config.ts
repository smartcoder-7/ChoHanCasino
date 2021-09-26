export const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'http://localhost:3000'
    : 'http://localhost:3000';

const config = {
  socketUrl: process.env.REACT_APP_SOCKET_URL,
};

export default config;
