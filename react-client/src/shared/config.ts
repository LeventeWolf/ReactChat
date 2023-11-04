interface Config {
  socketIoServerUrl: string
}

const config: Config = {
  socketIoServerUrl: process.env.SOCKET_IO_SERVER_URL ?? ''
}

export default config;