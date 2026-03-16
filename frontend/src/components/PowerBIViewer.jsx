import React from 'react';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';

export default function PowerBIViewer({ embedUrl, accessToken, reportId }) {
  // Se faltar algum dos dados necessários, exibe o estado de carregamento
  if (!embedUrl || !accessToken || !reportId) {
    return (
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[600px] w-full h-full relative overflow-hidden">
        {/* Spinner animado com a cor secundária */}
        <div className="w-12 h-12 border-4 border-gray-100 border-t-secondary rounded-full animate-spin"></div>
        
        <h3 className="mt-4 text-sm font-semibold text-gray-700">Carregando Relatório...</h3>
        <p className="mt-1 text-sm text-gray-400">Autenticando com o Power BI</p>

        {/* Efeito visual de fundo subtil */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-50 animate-pulse"></div>
      </div>
    );
  }

  // Configuração do componente Power BI
  const embedConfig = {
    type: 'report',
    id: reportId,
    embedUrl: embedUrl,
    accessToken: accessToken,
    tokenType: models.TokenType.Embed, // Crucial para App Owns Data (Service Principal)
    settings: {
      panes: {
        pageNavigation: {
          visible: false // Esconde abas de página embaixo
        },
        filters: {
          visible: false, // Esconde o painel de filtros lateral
          expanded: false
        }
      },
      background: models.BackgroundType.Transparent
    }
  };

  return (
    <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 min-h-[600px] w-full h-full overflow-hidden flex flex-col">
      <PowerBIEmbed
        embedConfig={embedConfig}
        cssClassName="w-full h-full flex-1 border-none outline-none min-h-[600px]"
        getEmbeddedComponent={(embeddedReport) => {
          // Aqui poderíamos adicionar listeners de eventos, caso necessário
          console.log(`Report embedded:`, embeddedReport);
        }}
      />
    </div>
  );
}
