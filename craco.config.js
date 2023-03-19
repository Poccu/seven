const path = require('path')

const resolvePath = (p) => path.resolve(__dirname, p)

module.exports = {
  webpack: {
    alias: {
      '@reducers': resolvePath('./src/store/reducers'),
      '@hooks': resolvePath('./src/hooks'),
      '@providers': resolvePath('./src/components/providers'),
      '@modals': resolvePath('./src/components/modals'),
      '@ui': resolvePath('./src/components/ui'),
    },
  },
}
