import { lazy, Suspense } from 'react';
import MeiQuizPage from './MeiQuizPage';
const Material = lazy(() => import('./MeiGuideMaterial'));
export default function MeiGuidePage() {
 return new URLSearchParams(window.location.search).get('material') === '1'
 ? <Suspense fallback={<p role="status">Abrindo o material completo…</p>}><Material /></Suspense>
 : <MeiQuizPage />;
}
