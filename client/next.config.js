module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  // Разрешаем слушать соединения со всех адресов 
  serverRuntimeConfig: {
    hostname: '0.0.0.0',
  },
  // Отключаем полифиллы для уменьшения размера сборки
  experimental: {
    esmExternals: true,
  },
}