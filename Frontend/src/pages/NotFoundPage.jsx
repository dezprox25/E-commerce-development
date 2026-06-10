import { Link } from 'react-router-dom';
import Breadcrumb from '../components/layout/Breadcrumb';
import Button from '../components/ui/Button';
import './NotFoundPage.css';

export default function NotFoundPage() {
  return (
    <div className="not-found-page">
      <Breadcrumb />
      
      <div className="container">
        <div className="not-found-page__inner">
          <h1 className="not-found-page__title">404 Not Found</h1>
          <p className="not-found-page__text">Your visited page not found. You may go home page.</p>
          
          <Link to="/">
            <Button>Back to home page</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
