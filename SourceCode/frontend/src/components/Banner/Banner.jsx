import bannerStyles from "./Banner.module.css";
import { APP_NAME } from "../../lib/constants";

const Banner = () => {
    return (
        <div className={ bannerStyles.dashboardImageContainer}>
            <h1>{ APP_NAME }</h1>
            <p>
                Archery clubs are volunteer-led. The Archery Scorekeeper system acts as a &quot;digital secretary&quot;, assisting volunteers with club management, handling archers&apos; score submissions, automating the classification handicap workflow, and managing membership records.
            </p>
            <p>
                With the traditional pen and paper or Excel spreadsheet method of managing scores, club Records Officers can spend hours staring at handicap tables and cross-referencing values against classification tables.
                This system automates the process, performing domain-specific calculations and returning the results instantly to the archer.
            </p>
            <p>
                Club Secretaries and Tournament Officers can manage their members&apos; emergency contact information, keeping their archers safe at and away from the club. Integrated journals allow Coaches to track archers&apos; progress via qualitative written notes and quantitative data metrics.
            </p>

            <p className="small">&copy; corey-richardson 2025, Photo by Jonathon Yau via Archery GB</p>
        </div>
    );
};

export default Banner;
