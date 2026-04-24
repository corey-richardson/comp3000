
import LoginForm from "../components/Auth/LoginForm";
import SignUpForm from "../components/Auth/SignUpForm";
import Banner from "../components/Banner/Banner";
import formStyles from "../styles/LandingPageForms.module.css";
import sideFormStyles from "../styles/SideForm.module.css";

export default function LandingPage() {

    return (
        <div className={`centred content ${sideFormStyles.sideForm}`}>

            <div>
                <Banner />

                <p className="bold">Welcome to the Archery Club Management Tool!</p>

                <p>
                    This website is designed to help archery clubs manage their members and score records efficiently and securely. Whether you are a club administrator, records officer, or a regular member, you will find tools tailored to your role:
                </p>
                <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                    <b>Administrators</b> can manage club details, invite new members, assign roles, and oversee all club activities.<br />
                    <b>Captains and Tournament Officers</b> have read-only access to club and member information to assist with the management of emergency contact information and competiton entries.<br />
                    <b>Records Officers</b> have access to member scores, can update records, and help maintain the club&apos;s competitive history.<br />
                    <b>Coaches</b> can view the scores and performance journals of archers part of their club.<br />
                    <b>Members</b> can view their personal details, submit scores, and track their progress and performances.<br />
                </div>
                <p>
                    This tool is free to use and is covered by a <a href="https://github.com/corey-richardson/comp3000/blob/main/LICENSE.txt" target="_blank" rel="noreferrer">GNU General Public License v3.0</a>. This means you are free to use, modify, and share the software, even for commercial purposes, as long as any distributed versions or derivatives remain open-source and are also licensed under the GPL v3.0. You must provide attribution and include the original license when redistributing or publishing changes. Proprietary use or relicensing is not permitted.
                </p>

            </div>

            <div className={formStyles.formBox}>
                <LoginForm />
                <SignUpForm />
            </div>

        </div>
    );
}
