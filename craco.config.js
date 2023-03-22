const path = require('path')

const resolvePath = (p) => path.resolve(__dirname, p)

module.exports = {
  webpack: {
    alias: {
      '@assets': resolvePath('./src/assets'),
      '@reducers': resolvePath('./src/store/reducers'),
      '@hooks': resolvePath('./src/hooks'),
      '@utils': resolvePath('./src/utils'),
      '@layout': resolvePath('./src/components/layout'),
      '@modals': resolvePath('./src/components/modals'),
      '@pages': resolvePath('./src/components/pages'),
      '@providers': resolvePath('./src/components/providers'),
      '@ui': resolvePath('./src/components/ui'),
    },
  },
}
