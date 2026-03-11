import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useApi } from "../../hooks/useApi";
import formStyles from "../../styles/Forms.module.css";

const CreateClubForm = () => {
    const { makeApiCall } = useApi();
    const navigate = useNavigate();

    const [ clubName, setClubName ] = useState("");
    const [ isPending, setIsPending ] = useState(false);
    const [ error, setError ] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log({ clubName });
    };

    return (
        <form
            className={`${formStyles.formContainer} ${formStyles.fullWidth}`}
            onSubmit={handleSubmit}
        >
            <div className={formStyles.inputGroup}>
                <label htmlFor="name">*Club Name:</label>
                <input
                    id="name"
                    type="text"
                    value={clubName}
                    onChange={(e) => setClubName(e.target.value)}
                    placeholder="Archery Club"
                    required
                />
            </div>

            <button
                type="submit"
                disabled={isPending}
            >
                Create Club
            </button>

        </form>
    );
};

export default CreateClubForm;
