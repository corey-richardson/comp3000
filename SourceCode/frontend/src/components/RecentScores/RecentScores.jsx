const RecentScoresSkeleton = () => {
    return ( 
        <div>
            <h2>Recent Scores Skeleton</h2>
            <p className="small centred">Loading...</p>
        </div>
    );
}
 
const RecentScores = ({userId}) => {
    return ( 
        <div>
            <h2>Recent Scores</h2>
        </div>
    );
}
 
export { RecentScoresSkeleton, RecentScores };
