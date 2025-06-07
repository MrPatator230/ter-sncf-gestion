import Header from '../components/Header';
import { useContext, useEffect, useState } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';
import buttonStyles from '../styles/buttons.module.css';
import Footer from '../components/Footer';
import Layout from '../components/Layout';

const logoNameMap = {
  '/images/logo-ter-aura.svg': 'SNCF TER Aura',
  '/images/logo-ter-bretagne.svg': 'SNCF TER Bretagne',
  '/images/logo-ter-centre.svg': 'SNCF TER Centre',
  '/images/logo-ter-grand_est.svg': 'SNCF TER Grand Est',
  '/images/logo-ter-hdf.svg': 'SNCF TER Hauts-de-France',
  '/images/logo-ter-mobigo.svg': 'SNCF TER Mobigo',
  '/images/logo-ter-normandie.svg': 'SNCF TER Normandie',
  '/images/logo-ter-nouvelle_aquitaine.svg': 'SNCF TER Nouvelle Aquitaine',
  '/images/logo-ter-occitanie.svg': 'SNCF TER Occitanie',
  '/images/logo-ter-paca.svg': 'SNCF TER PACA',
  '/images/logo-ter-pddl.svg': 'SNCF TER PDDL',
};

function InfosTrafficsWidget() {
  const [trafficInfos, setTrafficInfos] = useState([]);

  useEffect(() => {
    const savedTrafficInfos = localStorage.getItem('trafficInfos');
    if (savedTrafficInfos) {
      setTrafficInfos(JSON.parse(savedTrafficInfos));
    }
  }, []);

  if (trafficInfos.length === 0) {
    return (
      <div className="sncf-card h-100">
        <div className="sncf-card-body">
          <h2 className="h4 mb-3">Infos Traffics</h2>
          <p>Aucune info trafic enregistrée.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sncf-card h-100">
      <div className="sncf-card-body">
        <h2 className="h4 mb-3">Infos Traffics</h2>
        <ul className="list-unstyled">
          {trafficInfos.map(info => (
            <li key={info.id} className="mb-3">
              <strong>{info.title}</strong><br />
              <small>{info.startDate || '-'} {info.endDate ? `à ${info.endDate}` : ''}</small><br />
              <span>{info.description}</span><br />
              <span className={`badge bg-secondary`}>{info.impactType}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ActualitesWidget() {
  const [newsPosts, setNewsPosts] = useState([]);

  useEffect(() => {
    const savedNews = localStorage.getItem('newsPosts');
    if (savedNews) {
      const posts = JSON.parse(savedNews);
      // Sort by date descending, handle missing dates by putting them last
      posts.sort((a, b) => {
        const dateA = a.date ? new Date(a.date) : new Date(0);
        const dateB = b.date ? new Date(b.date) : new Date(0);
        return dateB - dateA;
      });
      setNewsPosts(posts.slice(0, 5));
    }
  }, []);

  if (newsPosts.length === 0) {
    return (
      <div className="sncf-card h-100">
        <div className="sncf-card-body">
          <h2 className="h4 mb-3">Actualités</h2>
          <p>Aucune actualité enregistrée.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sncf-card h-100">
      <div className="sncf-card-body">
        <h2 className="h4 mb-3">Actualités</h2>
        <ul className="list-unstyled">
          {newsPosts.map(post => (
            <li key={post.id} className="mb-3">
              <strong>{post.title}</strong><br />
              <small>{post.date && !isNaN(new Date(post.date)) ? new Date(post.date).toLocaleDateString() : ''}</small><br />
              <p>{post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content}</p>
            </li>
          ))}
        </ul>
        <a href="/actualites" className={`btn btn-primary ${buttonStyles['btn-primary']}`}>
          <span className="material-icons me-2">article</span>
          Voir toutes les actualités
        </a>
      </div>
    </div>
  );
}

export default function Home() {
  const { logoUrl } = useContext(SettingsContext);
  const displayName = logoNameMap[logoUrl] || 'SNCF TER Mobigo';

  return (
    <>
      <div className="main-wrapper">
        <Layout>
          <main className="main-container">
            <div className="container-fluid">
              <h1 className="sncf-title mb-4">Bienvenue sur {displayName}</h1>

              <div className="row g-4">
                <div className="col-md-6">
                  <ActualitesWidget />
                </div>

                <div className="col-md-6">
                  <InfosTrafficsWidget />
                </div>

                <div className="col-md-6">
                  <div className="sncf-card h-100">
                    <div className="sncf-card-body">
                      <h2 className="h4 mb-3">Horaires et Itinéraires</h2>
                      <p>Consultez les horaires et planifiez vos trajets en quelques clics.</p>
                      <a href="/verifier-horaires" className={`btn btn-primary ${buttonStyles['btn-primary']}`}>
                        <span className="material-icons me-2">schedule</span>
                        Vérifier les horaires
                      </a>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="sncf-card h-100">
                    <div className="sncf-card-body">
                      <h2 className="h4 mb-3">Abonnements & Billets</h2>
                      <p>Découvrez nos offres d'abonnement et achetez vos billets en ligne.</p>
                      <a href="/abonnements-et-billets" className={`btn btn-primary ${buttonStyles['btn-primary']}`}>
                        <span className="material-icons me-2">card_membership</span>
                        Voir les offres
                      </a>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="sncf-card h-100">
                    <div className="sncf-card-body">
                      <h2 className="h4 mb-3">Nos Gares</h2>
                      <p>Trouvez toutes les informations sur les gares de votre région.</p>
                      <a href="/stations" className={`btn btn-primary ${buttonStyles['btn-primary']}`}>
                        <span className="material-icons me-2">train</span>
                        Explorer les gares
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </Layout>
        <Footer />
      </div>
      <style jsx>{`
        .sncf-card {
          border-color: var(--primary-color);
        }
        .sncf-title {
          color: var(--primary-color);
        }
      `}</style>
    </>
  );
}
