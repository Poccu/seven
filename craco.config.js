const path = require('path')

const resolvePath = (p) => path.resolve(__dirname, p)

module.exports = {
  webpack: {
    alias: {
      '@reducers': resolvePath('./src/store/reducers'),
      '@hooks': resolvePath('./src/hooks'),
      '@layout': resolvePath('./src/components/layout'),
      '@modals': resolvePath('./src/components/modals'),
      '@pages': resolvePath('./src/components/pages'),
      '@providers': resolvePath('./src/components/providers'),
      '@ui': resolvePath('./src/components/ui'),
    },
  },
}
