import HomeHeader from './modules/home-header';
import LogTrendPanel from './modules/log-trend-panel';
import LoginAnalysisSection from './modules/login-analysis';
import MetricCards from './modules/metric-cards';
import OperationStatsSection from './modules/operation-stats';
import SystemAuditPanel from './modules/system-audit-panel';

const Home = () => {
  return (
    <ASpace
      className="w-full"
      direction="vertical"
      size={[16, 16]}
    >
      <HomeHeader />

      <MetricCards />

      <ARow gutter={[16, 16]}>
        <ACol
          lg={16}
          span={24}
        >
          <LogTrendPanel />
        </ACol>
        <ACol
          lg={8}
          span={24}
        >
          <SystemAuditPanel />
        </ACol>
      </ARow>

      <LoginAnalysisSection />

      <OperationStatsSection />
    </ASpace>
  );
};

export default Home;
