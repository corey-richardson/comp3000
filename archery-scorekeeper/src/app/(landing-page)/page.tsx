import sideFormStyles from "@/app/styles/SideForm.module.css";
import Banner from "../components/Banner/Banner";
import SignUpForm from "../components/Auth/SignUpForm";
import LoginForm from "../components/Auth/LoginForm";

export default async function LandingPage() {

    return (
        <div className={`centred content ${sideFormStyles.sideForm}`}>

            <div>
                <Banner />
                
                <p className="bold">Welcome to the Archery Club Management Tool!</p>

                <p>
                    Nam vestibulum tempus velit. Sed ipsum lorem, ultrices et posuere pharetra, posuere sit amet sapien. Maecenas gravida vestibulum ex, pharetra auctor risus egestas quis. Etiam sodales velit at posuere pellentesque. Etiam quam mi, viverra ut neque eget, faucibus tincidunt mi. Pellentesque quis neque quis metus imperdiet gravida pretium ac sem. Mauris in dictum eros. Vestibulum sit amet tincidunt mauris. Suspendisse semper auctor dolor, sit amet pharetra odio efficitur non. Aenean ornare posuere nisl, in viverra ligula porta imperdiet. Nam laoreet rhoncus magna facilisis placerat. Nam et porttitor justo, et condimentum tellus.
                </p>
                <p>
                    Ut posuere vestibulum ex, vel pharetra augue luctus nec. Nam nibh nisl, accumsan sed laoreet et, convallis at est. Praesent ornare ligula urna, a blandit tortor cursus et. Sed metus diam, scelerisque id vehicula sit amet, auctor at urna. Donec arcu justo, tincidunt non eleifend id, eleifend eu libero. Cras scelerisque, neque sit amet sollicitudin pellentesque, metus turpis tempus lacus, a porta purus lectus at turpis. Nam fringilla urna et suscipit dapibus. Fusce aliquet libero metus, at facilisis tellus aliquam quis. Pellentesque neque metus, sodales ac turpis at, lacinia tempus neque. Proin sodales ligula et blandit vestibulum. Praesent consectetur hendrerit sem, eu volutpat risus laoreet a. Donec quis varius quam. Etiam sodales ipsum vel orci mollis mattis.
                </p>
                <p>
                    Nulla imperdiet, arcu eget tristique laoreet, tellus nisl hendrerit enim, ultrices hendrerit dolor quam vel purus. Suspendisse sapien tellus, tincidunt vitae sapien ut, ultrices blandit diam. Sed nisi arcu, tristique ac varius eget, dignissim ut orci. Aenean ut tincidunt odio. In placerat feugiat magna, nec gravida quam maximus id. Maecenas non sapien efficitur, molestie quam in, hendrerit risus. Praesent porttitor dictum tortor, id tristique velit feugiat eget. Pellentesque a erat id nibh fringilla pellentesque. Sed turpis arcu, lacinia et mauris vel, ultricies condimentum diam. Integer aliquam tellus sit amet turpis gravida, non commodo eros aliquam. Nam risus ipsum, pellentesque eu aliquam mattis, vulputate ac magna. Curabitur tincidunt iaculis nisl nec tristique. Etiam vel lacinia ligula, vel dictum metus. Cras in magna commodo, ullamcorper magna sed, efficitur mauris. Mauris velit nulla, faucibus et ex eget, iaculis lobortis ante. Aliquam erat volutpat.
                </p>

            </div>

            <div>
                <h1>Auth Forms</h1>
                <LoginForm />
                <SignUpForm />
            </div>

        </div>
    )
}
