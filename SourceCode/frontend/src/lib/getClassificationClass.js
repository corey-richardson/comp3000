import styles from "../components/ScoreItems/ScoreItem.module.css";

const getClassificationClass = (key) => {
    if (!key) return styles.classUC;

    if (key.includes("MB")) return styles.classMB;
    if (key.includes("B")) return styles.classBowman;
    if (key.includes("A")) return styles.classArcher;

    return styles.classUC;
};

export default getClassificationClass;
