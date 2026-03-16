import React, { useState, useEffect } from 'react';
import PowerBIEmbedViewer from '../components/PowerBIEmbedViewer';
// import api from '../services/api'; 

const DashboardListView = () => {
    const [dashboards, setDashboards] = useState([]);
    const [selectedReportId, setSelectedReportId] = useState(null);

    useEffect(() => {
        const fetchDashboards = async () => {
            try {
                // Endpoint retorna apenas os dashboards permitidos para a role do usuário (via API Django)
                // const response = await api.get('/dashboards/');
                // mock:
                const response = { data: [{id: 1, name: "Vendas", report_id: "report-x"}] };
                setDashboards(response.data);
            } catch (err) {
                console.error("Erro ao listar dashboards", err);
            }
        };

        fetchDashboards();
    }, []);

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
