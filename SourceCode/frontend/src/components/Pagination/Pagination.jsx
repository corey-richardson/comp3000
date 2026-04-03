import { ChevronLeft, ChevronRight } from "lucide-react";

import styles from "../../styles/Pagination.module.css";

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
    if (totalPages <= 1) {
        return null;
    }

    const handlePrev = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    const handleNext = () => setCurrentPage(prev => prev + 1);

    return (
        <div className={styles.paginationFooter}>
            <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className={styles.button}
            >
                <ChevronLeft size={16} />
            </button>

            <span className={styles.pageInfo}>Page {currentPage} of {totalPages}</span>

            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={styles.button}
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );
};

export default Pagination;
