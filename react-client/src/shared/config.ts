interface Config {
  socketIoServerUrl: string
}

const config: Config = {
  socketIoServerUrl: process.env.SOCKET_IO_SERVER_URL ?? 'http://46.101.111.90:9000'
}

export default config;