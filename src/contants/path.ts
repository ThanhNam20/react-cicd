const path = {
  home: '/',
  user: '/user',
  profile: '/user/profile',
  login: '/login',
  register: '/register',
  logout: '/logout',
  productDetail: ':nameId',
  cart: '/cart',
  changePassword: '/user/password',
  historyPurchase: '/user/purchase'
} as const

export default path
