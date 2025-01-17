import { Suspense, lazy, useContext } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import SEOComponent from 'src/components/SEO'
import path from 'src/contants/path'
import { seoContentStaticPage } from 'src/contants/seo'
import { AppContext } from 'src/contexts/app.context'
import MainLayout from 'src/layouts/MainLayout'
import RegisterLayout from 'src/layouts/RegisterLayout'
import Cart from 'src/pages/Cart'
import NotFound from 'src/pages/NotFound'
import ProductDetail from 'src/pages/ProductDetail'
import ProductList from 'src/pages/ProductList'
import Register from 'src/pages/Register'
import UserLayout from 'src/pages/User/layouts/UserLayout/UserLayout'
import ChangePassword from 'src/pages/User/pages/ChangePassword/ChangePassword'
import HistoryPurchase from 'src/pages/User/pages/HistoryPurchase/HistoryPurchase'
import Profile from 'src/pages/User/pages/Profile/Profile'

const Login = lazy(() => import('src/pages/Login'))

//Những route con trong này sẽ không thể truy cập khi chưa login
function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to={path.login} />
}
// Những route con trong này sẽ bị từ chối truy cập nếu người dùng đã đăng nhập
function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

const useRouteElements = () => {
  const routeElements = useRoutes([
    {
      path: '',
      index: true,
      element: (
        <MainLayout>
          <SEOComponent props={seoContentStaticPage.home} />
          <ProductList />
        </MainLayout>
      )
    },

    {
      path: path.productDetail,
      element: (
        <MainLayout>
          <ProductDetail />
        </MainLayout>
      )
    },

    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: path.cart,
          element: (
            <MainLayout>
              <Cart />
            </MainLayout>
          )
        },
        {
          path: path.user,
          element: (
            <MainLayout>
              <UserLayout />
            </MainLayout>
          ),
          children: [
            {
              path: path.profile,
              element: <Profile />
            },
            {
              path: path.changePassword,
              element: <ChangePassword />
            },
            {
              path: path.historyPurchase,
              element: <HistoryPurchase />
            }
          ]
        }
      ]
    },

    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: path.login,
          element: (
            <RegisterLayout>
              <Suspense>
                <SEOComponent props={seoContentStaticPage.login} />
                <Login />
              </Suspense>
            </RegisterLayout>
          )
        },
        {
          path: path.register,
          element: (
            <RegisterLayout>
              <SEOComponent props={seoContentStaticPage.register} />
              <Register />
            </RegisterLayout>
          )
        }
      ]
    },
    {
      path: '*',
      element: (
        <MainLayout>
          <NotFound />
        </MainLayout>
      )
    }
  ])
  return routeElements
}

export default useRouteElements
