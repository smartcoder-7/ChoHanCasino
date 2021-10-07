export const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'http://localhost:3000'
    : 'http://localhost:3000';

const config = {
  socketUrl: process.env.REACT_APP_SOCKET_URL,
  adminAddress: process.env.REACT_APP_ADMIN_ADDRESS,
  casinoContractAddress: process.env.REACT_APP_CASINO_CONTRACT,
};

export default config;
