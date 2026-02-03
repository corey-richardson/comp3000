import SubmitScoreForm from "../components/SubmitScoreForm/SubmitScoreForm";

const SubmitScore = () => {

    return (
        <div className="centred content">
            <h3>Submit a Score to your club's Records Officer.</h3>
            <p>Use this form to submit your latest archery score to your club's Records Officer. Accurate score submissions help maintain your classification and handicap, and ensure club records are up to date. Please fill in all required fields and double-check your entry before submitting.</p>
            <p><br />Note that if your score qualifies for a Bowman level classification and above, or is to be used in a postal/virtual league then your club's Records Officer may also require a countersigned scoresheet to be submitted alongisde your score.</p>

            <div>
                <SubmitScoreForm />
            </div>
        </div>
    );
}

export default SubmitScore;
