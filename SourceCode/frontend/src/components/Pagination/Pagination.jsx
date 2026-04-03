import { ChevronLeft, ChevronRight } from "lucide-react";

import styles from "./Pagination.module.css";

const Pagination = ({ paginationProps }) => {
    const { currentPage, totalPages, prevPage, nextPage } = paginationProps;

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className={styles.paginationFooter}>
            <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={styles.button}
            >
                <ChevronLeft size={16} />
            </button>

            <span className={styles.pageInfo}>Page {currentPage} of {totalPages}</span>

            <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={styles.button}
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );
};

export default Pagination;
