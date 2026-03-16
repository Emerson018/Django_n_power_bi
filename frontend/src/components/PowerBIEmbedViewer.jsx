import React, { useState, useEffect } from 'react';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';
// import api from '../services/api'; // config axios client

const PowerBIEmbedViewer = ({ reportId }) => {
    const [embedConfig, setEmbedConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmbedData = async () => {
            try {
                setLoading(true);
                // Chamada segura para o backend Django via JWT (ex: axios get /api/dashboards/<id>/embed-data/)
                // const response = await api.get(`/dashboards/${reportId}/embed-data/`);
                // mock response:
                const response = { data: { reportId, embedUrl: "url", embedToken: "token" } }; 
                
                const data = response.data;
                
                setEmbedConfig({
                    type: 'report',
                    id: data.reportId,
                    embedUrl: data.embedUrl,
                    accessToken: data.embedToken,
                    // CRÍTICO: Utilize Embed e não AAD Token (Service Principal / App Owns Data)
                    tokenType: models.TokenType.Embed,
                    settings: {
                        panes: {
                            filters: { expanded: false, visible: false },
                            pageNavigation: { visible: true }
                        },
                        background: models.BackgroundType.Transparent,
                    }
                });
                
            } catch (err) {
                console.error("Erro ao carregar embed do PBI:", err);
                setError("Você não tem permissão para visualizar este dashboard ou houve um erro.");
            } finally {
                setLoading(false);
            }
        };

        if (reportId) {
            fetchEmbedData();
        }
    }, [reportId]);

    if (loading) return <div>Carregando relatório seguro...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!embedConfig) return null;

    return (
        <div className="powerbi-container" style={{ height: '80vh', width: '100%' }}>
            <PowerBIEmbed
                embedConfig={embedConfig}
                cssClassName={"powerbi-iframe-class"}
                eventHandlers={
                    new Map([
                        ['loaded', function () { console.log('Relatório carregado'); }],
                        ['rendered', function () { console.log('Relatório renderizado'); }],
                        ['error', function (event) { console.error('PBI Error:', event.detail); }]
                    ])
                }
            />
        </div>
    );
};

export default PowerBIEmbedViewer;
