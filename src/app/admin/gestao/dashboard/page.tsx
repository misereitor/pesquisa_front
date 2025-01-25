// import LineFiveDashboard from '@/components/dashboard/line-five';
import LineFourDashboard from '@/components/dashboard/line-four';
import LineOneDashboard from '@/components/dashboard/line-one';
import LineThreeDashboard from '@/components/dashboard/line-three';
import LineTwoDashboard from '@/components/dashboard/line-two';
import { getAllDataDashboard } from '@/service/reports-services';

export default async function Dashboard() {
  const { votesCategory, countVotes, totalCity, usersVote } =
    await getAllDataDashboard();
  return (
    <div className="w-full">
      <LineOneDashboard countVotes={countVotes} />
      <LineTwoDashboard votesCategory={votesCategory} />
      <LineThreeDashboard usersVote={usersVote} />
      <LineFourDashboard totalCity={totalCity} />
      {/* <LineFiveDashboard votesCategory={votesCategory} /> */}
    </div>
  );
}
