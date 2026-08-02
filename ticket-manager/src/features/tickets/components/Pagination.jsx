export default function Pagination({
    pageInfo,
    setPageInfo
}) {
    if (!pageInfo || pageInfo.totalPages <= 1) {
        return null;
    }

    const setPage = (page) => {
        setPageInfo(prev => ({
            ...prev,
            page
        }));
    };

    return (
        <div className="pagination">

            <button
                className="btn btn-ghost"
                disabled={pageInfo.page === 1}
                onClick={() => setPage(pageInfo.page - 1)}
            >
                ←
            </button>

            <span>
                {pageInfo.page} / {pageInfo.totalPages}
            </span>

            <button
                className="btn btn-ghost"
                disabled={pageInfo.page === pageInfo.totalPages}
                onClick={() => setPage(pageInfo.page + 1)}
            >
                →
            </button>

        </div>
    );
}