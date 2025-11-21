interface PropTypes {
    userId: string;
}

const delay = (ms: number) => 
    new Promise(resolve => setTimeout(resolve, ms));

const RecentScoresSkeleton = () => {
    return ( 
        <div>
            <h1>Recent Scores Skeleton</h1>
        </div>
    );
}
 
const RecentScores = async ({userId} : PropTypes) => {
    await delay(5000);

    return ( 
        <div>
            <h1>Recent Scores</h1>
        </div>
    );
}
 
export { RecentScoresSkeleton, RecentScores };
