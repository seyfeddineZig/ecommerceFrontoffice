const routes = [{
  path: '/',
  component: () =>
    import('layouts/MainLayout.vue'),
  children: [{
    path: '',
    component: () =>
      import('pages/Index.vue')
  },
  {
    path: 'registerSucceeded',
    component: () =>
      import('pages/RegisterSucceeded.vue')
  },
  {
    path: 'product/:id',
    component: () =>
      import('pages/Product.vue')
  },
  {
    path: 'cart',
    component: () =>
      import('pages/Cart.vue')
  },
  {
    path: 'orders',
    component: () =>
      import('pages/Orders.vue')
  },
  {
    path: 'order/:id',
    component: () =>
      import('pages/Order.vue')
  },
  {
    path: 'category/:id',
    component: () =>
      import('pages/Category.vue')
  },
  {
    path: 'brand/:id',
    component: () =>
      import('pages/Brand.vue')
  },
  {
    path: 'chat',
    component: () =>
      import('pages/Chat.vue')
  },
  {
    path: 'profile',
    component: () =>
      import('pages/Profile.vue')
  }
  ]
},
{
  path: '/loginRegister',
  component: () =>
    import('layouts/EmptyLayout.vue'),
  children: [{
    path: '',
    component: () =>
      import('pages/LoginRegister.vue')
  }]
},

// Always leave this as last one,
// but you can also remove it
{
  path: '*',
  component: () =>
    import('pages/Error404.vue')
}
]

export default routes
