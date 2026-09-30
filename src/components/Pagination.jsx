import { Pagination as BsPagination } from "react-bootstrap";

const Pagination = ({ page, pages, onChange }) => {
  if (!pages || pages <= 1) return null;

  const numbers = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(pages, start + 4);
  for (let i = start; i <= end; i += 1) numbers.push(i);

  return (
    <BsPagination className="justify-content-center mt-4 mb-0">
      <BsPagination.Prev
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        Previous
      </BsPagination.Prev>
      {start > 1 && (
        <BsPagination.Item onClick={() => onChange(1)}>1</BsPagination.Item>
      )}
      {start > 2 && <BsPagination.Ellipsis disabled />}
      {numbers.map((number) => (
        <BsPagination.Item
          key={number}
          active={number === page}
          onClick={() => onChange(number)}
        >
          {number}
        </BsPagination.Item>
      ))}
      {end < pages - 1 && <BsPagination.Ellipsis disabled />}
      {end < pages && (
        <BsPagination.Item onClick={() => onChange(pages)}>
          {pages}
        </BsPagination.Item>
      )}
      <BsPagination.Next
        disabled={page === pages}
        onClick={() => onChange(page + 1)}
      >
        Next
      </BsPagination.Next>
    </BsPagination>
  );
};

export default Pagination;
