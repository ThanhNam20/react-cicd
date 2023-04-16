import { sort_by as sortBy } from 'src/contants/product'
import { QueryConfig } from '../ProductList'
import classNames from 'classnames'
import { ProductListConfig } from 'src/types/product.type'
import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import path from 'src/contants/path'

interface Props {
  queryConfig: QueryConfig
  pageSize: number | any
}

export default function SortProductList({ queryConfig, pageSize }: Props) {
  const page = Number(queryConfig.page)
  const { sort_by = sortBy.createdAt, order } = queryConfig
  const navigate = useNavigate()
  const isActivateSortBy = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined> | string) => {
    return sort_by === sortByValue
  }

  const handlePriceOrder = (orderValue: string) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        sort_by: sortBy.price,
        order: orderValue
      }).toString()
    })
  }

  const handleSort = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined> | string) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        sort_by: sortByValue
      }).toString()
    })
  }

  return (
    <div className='bg-gray-300/40 px-3 py-4'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex flex-wrap items-center gap-2'>
          <div>Sắp xếp theo</div>
          <button
            onClick={() => handleSort(sortBy.view)}
            className={classNames('h-8 bg-orange px-4 text-center text-sm capitalize text-black hover:bg-orange/80', {
              'bg-orange text-white hover:bg-orange/80': isActivateSortBy(sortBy.view),
              'bg-white text-black hover:bg-slate-100': !isActivateSortBy(sortBy.view)
            })}
          >
            Phổ biến
          </button>
          <button
            onClick={() => handleSort(sortBy.createdAt)}
            className={classNames('h-8 bg-orange px-4 text-center text-sm capitalize text-black hover:bg-orange/80', {
              'bg-orange text-white hover:bg-orange/80': isActivateSortBy(sortBy.createdAt),
              'bg-white text-black hover:bg-slate-100': !isActivateSortBy(sortBy.createdAt)
            })}
          >
            Mới nhất
          </button>
          <button
            onClick={() => handleSort(sortBy.sold)}
            className={classNames('h-8 bg-orange px-4 text-center text-sm capitalize text-black hover:bg-orange/80', {
              'bg-orange text-white hover:bg-orange/80': isActivateSortBy(sortBy.sold),
              'bg-white text-black hover:bg-slate-100': !isActivateSortBy(sortBy.sold)
            })}
          >
            Bán chạy
          </button>
          <select
            className={classNames(
              'h-8 bg-white px-4 text-left text-sm capitalize text-black outline-none hover:bg-slate-100',
              {
                'bg-orange text-black hover:bg-orange/80': isActivateSortBy(sortBy.price),
                'bg-white text-black hover:bg-slate-100': !isActivateSortBy(sortBy.price)
              }
            )}
            value={order || ''}
            onChange={(event) => {
              handlePriceOrder(event.target.value)
            }}
          >
            <option value='' disabled>
              Giá
            </option>
            <option value='asc'>Giá: Thấp đến cao</option>
            <option value='desc'>Giá: Cao đến thấp</option>
          </select>
        </div>

        {/* <div className='flex items-center'>
          <div>
            <span className='text-orange'>{page}</span>
            <span>{`/${pageSize}`}</span>
          </div>
          <div className='ml-2'>
            <Link
              to={{
                pathname: path.home,
                search: createSearchParams({
                  ...queryConfig,
                  page: (page + 1).toString()
                }).toString()
              }}
              className='cursor-pointed h-8  rounded-bl-sm rounded-tl-sm bg-white/60 px-3 shadow hover:bg-slate-100'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='h-3 w-3'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
              </svg>
            </Link>
            <Link
              to={{
                pathname: path.home,
                search: createSearchParams({
                  ...queryConfig,
                  page: (page - 1).toString()
                }).toString()
              }}
              className='h-8 rounded-br-sm rounded-tr-sm bg-white px-3 shadow hover:bg-slate-100 '
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='h-3 w-3'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
              </svg>
            </Link>
          </div>
        </div> */}
      </div>
    </div>
  )
}
