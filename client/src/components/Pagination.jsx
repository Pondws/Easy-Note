const Pagination = ({ notesPerPage, totalNotes, paginate, currentPage }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalNotes / notesPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="join mt-6 flex justify-center">
            {pageNumbers.map(number => (
                <button key={number} className={`join-item btn btn-lg ${currentPage === number ? 'btn-warning' : ''}`} onClick={() => paginate(number)}>
                    {number}
                </button>
            ))}
        </div>
    );
};

export default Pagination