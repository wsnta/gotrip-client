import React from 'react';
import './paginated.css'
import { Empty, Tooltip } from 'antd';
import { TypeTransactionHistory } from 'modal/index';

interface IProps {
  paginatedData: TypeTransactionHistory[],
  loading: boolean,
  onNumberChange?: any,
  size: number,
  currentPageProps: number
}

const PaginatedList = (props: IProps) => {

  const { paginatedData } = props

  return (
    <>
      {
         paginatedData.length > 0 ? paginatedData
         .map((element: TypeTransactionHistory, index: number) => {
           return (
             <div className='user grid-container'>
               <div className='user-paginated-item'>
                 <p className='text-truncate text-14'>{element.availableBalance}</p>
               </div>
               <div className='user-paginated-item'>
                 <p className='text-truncate text-14'>{element.accountNo}</p>
               </div>
               <div className='user-paginated-item'>
                 <p className='text-truncate text-14'>{element.creditAmount}</p>
               </div>
               <div className='user-paginated-item col-8'>
                 <Tooltip placement='topLeft' title={<p className='text-13'>{element.description}</p>}>
                   <p className='text-truncate text-14'>{element.description}</p>
                 </Tooltip>
               </div>
               <div className='user-paginated-item col-4'>
                 <p className='text-truncate text-14'>{element.refNo}</p>
               </div>
               <div className='user-paginated-item'>
                 <p className='text-truncate text-14'>{element.transactionDate}</p>
               </div>
               <div className='user-paginated-item'>
                 <p className='text-truncate text-14'>{element.transactionType}</p>
               </div>
               <div className='user-paginated-item'>
                 <p className='text-truncate text-14'>{element.currency}</p>
               </div>
             </div>
           )
         })
         : <Empty description={'Không có dữ liệu.'} style={{ gridColumn: 'span 2 / span 2',  marginTop:'24px'  }} />
      }
    </>
  );
};
export default PaginatedList;
