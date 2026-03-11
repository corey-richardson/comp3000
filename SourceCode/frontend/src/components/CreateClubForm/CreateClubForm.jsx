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
        setIsPending(true);

        try {
            const response = await makeApiCall("/api/clubs", {
                method: "POST",
                body: JSON.stringify({ clubName }),
            });

            const data = await response.json();

            if (response.ok) {
                navigate(`/clubs/${data.id}`);
            } else {
                setError(data.error || "Failed to create club.");
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsPending(false);
        }
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

            { error && <p className="error-message">{error}</p> }
        </form>
    );
};

export default CreateClubForm;
