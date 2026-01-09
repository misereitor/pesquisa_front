import CategoryBreakdown from '@/components/dashboard/category-breakdown';
import CategoryPerformance from '@/components/dashboard/category-performance';
import DashboardSummary from '@/components/dashboard/dashboard-summary';
import GeoDistribution from '@/components/dashboard/geo-distribution';
import VotingTimeline from '@/components/dashboard/voting-timeline';
import { getAllDataDashboard } from '@/src/service/reports-services';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const { votesCategory, countVotes, totalCity, usersVote, graphReport } =
    await getAllDataDashboard();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-3 md:p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-emerald-500 to-indigo-600">
            Painel de Controle
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Visão geral das estatísticas e relatórios de votação.
          </p>
        </header>

        <DashboardSummary countVotes={countVotes} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <CategoryPerformance votesCategory={votesCategory} />
          <VotingTimeline usersVote={usersVote} />
        </div>

        <GeoDistribution totalCity={totalCity} />

        <CategoryBreakdown graphReport={graphReport} />
      </div>
    </div>
  );
}
