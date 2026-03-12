import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import CreateClubForm from "../../components/CreateClubForm/CreateClubForm";

const CreateClub = () => {

    return (
        <div className="centred content">
            <Breadcrumbs />

            <h3>{"Create a New Club."}</h3>
            <p>{"Use this form to create a new club. You will be assigned as the primary Administrator of this group."}</p>

            <CreateClubForm />
        </div>
    );
};

export default CreateClub;
