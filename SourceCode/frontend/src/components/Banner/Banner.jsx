import { APP_NAME } from "../../lib/constants";

import bannerStyles from "./Banner.module.css";

const Banner = () => {
    return (
        <div className={ bannerStyles.dashboardImageContainer}>
            <h1>{ APP_NAME }</h1>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque eu velit auctor, convallis justo at, malesuada felis. Integer vitae vehicula metus. Integer tincidunt hendrerit laoreet. Etiam accumsan augue sit amet lacus iaculis, et pharetra justo dictum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nulla dapibus posuere hendrerit. Ut leo nisi, facilisis aliquet lobortis ac, ultricies eget est. Sed lorem nisi, mollis vestibulum imperdiet in, ultrices nec elit. Donec sagittis blandit molestie. Nunc congue mollis urna.
            </p>
            <p>
                Donec tempus dictum leo, ac porttitor massa convallis id. Fusce eleifend ipsum ligula, a feugiat elit porta vel. Aliquam dui augue, placerat vel libero et, tempus sollicitudin tortor. Integer posuere eros sed velit vehicula bibendum. Donec turpis orci, sagittis in iaculis at, tincidunt in augue. Fusce auctor tortor sit amet libero dapibus, ac hendrerit nulla tincidunt. Sed in elit ut turpis laoreet convallis.
            </p>

            <p className="small">&copy; corey-richardson 2025, Photo by Jonathon Yau via Archery GB</p>
        </div>
    );
}

export default Banner;
