import { useAuth } from '../context/AuthContext';

const DashboardListView = () => {
    const { dashboards, fetchDashboards, isLoadingDashboards } = useAuth();
    const [selectedReportId, setSelectedReportId] = useState(null);

    useEffect(() => {
        fetchDashboards();
    }, []);

    if (isLoadingDashboards) {
        return <div className="p-8 text-center">Carregando dashboards...</div>;
    }

    return (
        <div className="dashboard-layout" style={{ display: 'flex', flexDirection: 'row' }}>
            <aside className="sidebar" style={{ width: '250px', padding: '20px', background: '#f4f4f4' }}>
                <h3>Meus Dashboards</h3>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {dashboards.map(dashboard => (
                        <li key={dashboard.id} 
                            onClick={() => setSelectedReportId(dashboard.id)}
                            style={{ 
                                padding: '10px', 
                                cursor: 'pointer',
                                fontWeight: selectedReportId === dashboard.id ? 'bold' : 'normal',
                                background: selectedReportId === dashboard.id ? '#ddd' : 'transparent'
                            }}>
                            {dashboard.name}
                        </li>
                    ))}
                </ul>
            </aside>
            <main className="viewer-area" style={{ flex: 1, padding: '20px' }}>
                {selectedReportId ? (
                    <PowerBIEmbedViewer reportId={selectedReportId} />
                ) : (
                    <div className="placeholder">Selecione um dashboard para visualizar...</div>
                )}
            </main>
        </div>
    );
};

export default DashboardListView;
