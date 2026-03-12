import { Link } from "react-router-dom";

import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";

const Clubs = () => {
    return (
        <div className="content">
            <Breadcrumbs />

            <h2>Clubs.</h2>
            <Link to="./create">Create a New Club</Link>
        </div>
    );
};

export default Clubs;
