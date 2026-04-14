import styles from "../components/ScoreItems/ScoreItem.module.css";

/** MB checks MUST be carried out before B checks as MB "includes" B */

const getClassificationClass = (key) => {
    if (!key) return styles.classUC;

    if (key.includes("MB")) return styles.classMB;
    if (key.includes("B")) return styles.classBowman;
    if (key.includes("A")) return styles.classArcher;

    return styles.classUC;
};

export default getClassificationClass;
