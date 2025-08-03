import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

// Dynamischer Import, um SSR zu deaktivieren
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDocs() {
  return <SwaggerUI url="/api/swagger" />;
}