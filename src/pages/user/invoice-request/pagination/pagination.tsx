import React, { useState, useEffect } from 'react';
import './paginated.css'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { setSizeQuery } from 'store/reducers';

interface Props {
  pageCount: number;
  initialPage?: number;
  onPageChange: (selectedPage: number) => void;
}

const Pagination: React.FC<Props> = ({ pageCount, onPageChange, initialPage = 1 }) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const dispatch = useDispatch()
  const [inputPage, setInputPage] = useState(initialPage);
  const [endPage, setEndPage] = useState(Math.min(5, pageCount));
  const [startPage, setStartPage] = useState(0);

  useEffect(() => {
    setStartPage(0);
    setEndPage(Math.min(5, pageCount));
  }, [pageCount]);

  useEffect(() => {
    setCurrentPage(initialPage);
    setInputPage(initialPage);

    let newStartPage = 0;
    let newEndPage = Math.min(5, pageCount);

    if (currentPage >= 3 && currentPage + 2 < pageCount) {
      newStartPage = currentPage - 2;
      newEndPage = currentPage + 3;
    } else if (currentPage >= 3 && currentPage + 2 >= pageCount) {
      newStartPage = Math.max(0, pageCount - 5);
      newEndPage = pageCount;
    }

    setStartPage(newStartPage);
    setEndPage(newEndPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, initialPage, pageCount]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    dispatch(setSizeQuery(pageNumber + 1))
    onPageChange(pageNumber);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 0; i < pageCount; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers.slice(startPage, endPage).map((pageNumber) => (
      <div
        key={pageNumber}
        className={`page-item ${pageNumber === currentPage ? 'active' : ''}`}
        onClick={() => handlePageChange(pageNumber)}
      >
        <button className="page-link">{pageNumber + 1}</button>
      </div>
    ));
  };

  return (
    <div className='class-pagination-action'>
      <div className={'page-item'}>
        {currentPage === 0
          ? <button className="page-link disabled">
            <IoIosArrowBack />
          </button>
          : <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
            <IoIosArrowBack stroke='white' />
          </button>
        }
      </div>
      {renderPageNumbers()}
      <div className={'page-item'}>
        {currentPage === pageCount - 1
          ? <button className="page-link disabled">
            <IoIosArrowForward />
          </button>
          : <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
            <IoIosArrowForward />
          </button>
        }
      </div>
    </div>
  );
};

export default Pagination;
