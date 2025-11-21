interface PropTypes {
    userId: string;
}

const RecentScoresSkeleton = () => {
    return ( 
        <div>
            <h1>Recent Scores Skeleton</h1>
        </div>
    );
}
 
const RecentScores = async ({userId} : PropTypes) => {
    return ( 
        <div>
            <h1>Recent Scores</h1>
        </div>
    );
}
 
export { RecentScoresSkeleton, RecentScores };
