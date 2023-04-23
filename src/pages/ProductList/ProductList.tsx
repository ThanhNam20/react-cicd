import { useQuery } from '@tanstack/react-query'
import Pagination from 'src/components/Pagination'
import useQueryParams from 'src/hooks/useQueryParams'
import userQueryConfig, { QueryConfig } from 'src/hooks/useQueryConfig'
import categoryApi from 'src/services/category.api'
import productApi from 'src/services/product.api'
import { ProductListConfig } from 'src/types/product.type'
import AsideFilter from './AsideFilter'
import Product from './Product/Product'
import SortProductList from './SortProductList'

const ProductList = () => {
  const queryParams: QueryConfig = useQueryParams()
  const queryConfig = userQueryConfig()
  const { data: productData } = useQuery({
    queryKey: ['products', queryParams],
    queryFn: () => {
      return productApi.getProducts(queryParams as ProductListConfig)
    },
    keepPreviousData: true,
    staleTime: 3 * 60 * 1000
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getCategories()
  })

  return (
    <div className='bg-gray-200 py-6'>
      <div className='container'>
        <div className='grid grid-cols-12 gap-6'>
          <div className='col-span-3'>
            {categoriesData && <AsideFilter queryConfig={queryConfig} categories={categoriesData.data.data} />}
          </div>
          <div className='col-span-9'>
            <SortProductList queryConfig={queryConfig} pageSize={productData?.data.data.pagination.page_size} />
            <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
              {productData &&
                productData.data.data.products.map((product) => (
                  <div key={product._id} className='col-span-1'>
                    <Product product={product} />
                  </div>
                ))}
            </div>
            <Pagination queryConfig={queryConfig} pageSize={productData?.data.data.pagination.page_size} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductList
