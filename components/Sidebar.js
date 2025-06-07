import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { AuthContext } from '../src/contexts/AuthContext';
import { SettingsContext } from '../contexts/SettingsContext';
import Image from 'next/image';

export default function Sidebar() {
  const router = useRouter();
  const currentPath = router.pathname;
  const { logout } = useContext(AuthContext);
  const { companyName, logoUrl, primaryColor } = useContext(SettingsContext);
  const [isAnnouncementMenuOpen, setAnnouncementMenuOpen] = useState(false);

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };

  const toggleAnnouncementMenu = () => {
    setAnnouncementMenuOpen(!isAnnouncementMenuOpen);
  };

  return (
    <nav className="sncf-sidebar bg-white shadow-sm">
      <div className="sncf-sidebar-header">
        <Link href="/admin" className="d-flex align-items-center p-3 text-decoration-none">
          <div className="sidebar-logo-container">
            <Image 
              src={logoUrl || "/images/sncf-logo.png"}
              alt="SNCF Logo"
              width={100}
              height={28}
              priority
              className="sidebar-logo"
            />
          </div>
          <span className="ms-3 fw-bold" style={{ color: primaryColor }}>{companyName}</span>
        </Link>
      </div>
      
      <div className="sncf-sidebar-content">
        <div className="nav flex-column">
          <Link 
            href="/admin" 
            className={`sncf-nav-link ${currentPath === '/admin' ? 'active' : ''}`}
          >
            <span className="material-icons">dashboard</span>
            <span>Dashboard</span>
          </Link>

          <div className="sncf-nav-section">
            <div className="sncf-nav-section-title">Gestion</div>
            <Link 
              href="/admin/entreprise" 
              className={`sncf-nav-link ${currentPath === '/admin/entreprise' ? 'active' : ''}`}
            >
              <span className="material-icons">business</span>
              <span>Entreprise</span>
            </Link>

            <Link 
              href="/stations" 
              className={`sncf-nav-link ${currentPath === '/stations' ? 'active' : ''}`}
            >
              <span className="material-icons">train</span>
              <span>Gestion de gares</span>
            </Link>

            <Link 
              href="/admin/materiels-roulants" 
              className={`sncf-nav-link ${currentPath === '/admin/materiels-roulants' ? 'active' : ''}`}
            >
              <span className="material-icons">settings</span>
              <span>Matériels Roulants</span>
            </Link>
            <Link 
              href="/admin/billetique" 
              className={`sncf-nav-link ${currentPath === '/admin/billetique' ? 'active' : ''}`}
            >
              <div className="d-flex align-items-center">
                <span className="material-icons">confirmation_number</span>
                <span>Gestion de la Billetique</span>
              </div>
            </Link>
            <Link
              href="/admin/compositions-trains"
              className={`sncf-nav-link ${currentPath === '/admin/compositions-trains' ? 'active' : ''}`}
            >
              <span className="material-icons">view_carousel</span>
              <span>Compositions Trains</span>
            </Link>
          </div>

          <div className="sncf-nav-section">
            <div className="sncf-nav-section-title">Horaires & Trafic</div>
            <Link 
              href="/admin/horaires" 
              className={`sncf-nav-link ${currentPath === '/admin/horaires' ? 'active' : ''}`}
            >
              <span className="material-icons">schedule</span>
              <span>Horaires</span>
            </Link>

          <Link 
            href="/admin/gestion-horaires" 
            className={`sncf-nav-link ${currentPath === '/admin/gestion-horaires' ? 'active' : ''}`}
          >
            <span className="material-icons">today</span>
            <span>Panneau de Contrôle</span>
          </Link>

          <Link 
            href="/admin/gestion-actualites" 
            className={`sncf-nav-link ${currentPath === '/admin/gestion-actualites' ? 'active' : ''}`}
          >
            <span className="material-icons">article</span>
            <span>Gestion Actualités</span>
          </Link>

          <Link 
            href="/admin/info-trafics" 
            className={`sncf-nav-link ${currentPath === '/admin/info-trafics' ? 'active' : ''}`}
          >
            <span className="material-icons">info</span>
            <span>Infos Trafic</span>
          </Link>

          <Link 
            href="/admin/attribution-voie" 
            className={`sncf-nav-link ${currentPath === '/admin/attribution-voie' ? 'active' : ''}`}
          >
            <span className="material-icons">alt_route</span>
            <span>Attribution Voie</span>
          </Link>
        </div>

          <div className="sncf-nav-section">
            <div className="sncf-nav-section-title">Annonces Sonores</div>
            <div className={`sncf-nav-group ${isAnnouncementMenuOpen ? 'open' : ''}`}>
              <button 
                onClick={toggleAnnouncementMenu}
                className="sncf-nav-link w-100"
              >
                <span className="material-icons">campaign</span>
                <span>Système d'annonces</span>
                <span className="material-icons ms-auto">
                  {isAnnouncementMenuOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>
              
              <div className="sncf-nav-group-content">
                <Link 
                  href="/admin/banque-de-sons" 
                  className={`sncf-nav-link ${currentPath === '/admin/banque-de-sons' ? 'active' : ''}`}
                >
                  <span className="material-icons">library_music</span>
                  <span>Banque de sons</span>
                </Link>
                
                <Link 
                  href="/admin/conception-annonce" 
                  className={`sncf-nav-link ${currentPath === '/admin/conception-annonce' ? 'active' : ''}`}
                >
                  <span className="material-icons">edit</span>
                  <span>Conception annonce</span>
                </Link>
                
                <Link 
                  href="/admin/liste-annonces" 
                  className={`sncf-nav-link ${currentPath === '/admin/liste-annonces' ? 'active' : ''}`}
                >
                  <span className="material-icons">list</span>
                  <span>Liste annonces</span>
                </Link>
              </div>
          </div>
        </div>

        <div className="sncf-nav-section">
          <div className="sncf-nav-section-title">Système</div>
          <Link 
            href="/admin/sauvegarde" 
            className={`sncf-nav-link ${currentPath === '/admin/sauvegarde' ? 'active' : ''}`}
          >
            <span className="material-icons">save</span>
            <span>Sauvegarde</span>
          </Link>

          <Link 
            href="/admin/admin-profile" 
            className={`sncf-nav-link ${currentPath === '/admin/admin-profile' ? 'active' : ''}`}
          >
            <span className="material-icons">person</span>
            <span>Profil Admin</span>
          </Link>

          <Link 
            href="/admin/update" 
            className={`sncf-nav-link ${currentPath === '/admin/update' ? 'active' : ''}`}
          >
            <span className="material-icons">system_update</span>
            <span>Mise à jour</span>
          </Link>
        </div>
        </div>
      </div>

      <div className="sncf-sidebar-footer">
        <button 
          onClick={handleLogout} 
          className="sncf-nav-link w-100 text-danger border-0 bg-transparent"
        >
          <span className="material-icons">logout</span>
          <span>Déconnexion</span>
        </button>
      </div>

      <style jsx>{`
        .sncf-sidebar {
          width: 280px;
          height: 100vh;
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
        }

        .sncf-sidebar-content {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
        }

        .sncf-nav-section {
          margin-bottom: 1.5rem;
        }

        .sncf-nav-section-title {
          font-size: 0.75rem;
          text-transform: uppercase;
          color: #6c757d;
          margin-bottom: 0.5rem;
          padding: 0 0.5rem;
        }

        .sncf-nav-link {
          display: flex;
          align-items: center;
          padding: 0.75rem;
          color: #495057;
          text-decoration: none;
          border-radius: 0.5rem;
          margin-bottom: 0.25rem;
          transition: all 0.2s;
        }

        .sncf-nav-link:hover {
          background-color: ${primaryColor}15;
          color: ${primaryColor};
        }

        .sncf-nav-link.active {
          background-color: ${primaryColor}15;
          color: ${primaryColor};
          font-weight: 500;
        }

        .sncf-nav-link .material-icons {
          margin-right: 0.75rem;
          font-size: 1.25rem;
        }

        .sncf-nav-group-content {
          padding-left: 1rem;
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-out;
        }

        .sncf-nav-group.open .sncf-nav-group-content {
          max-height: 500px;
        }

        .sncf-sidebar-footer {
          padding: 1rem;
          border-top: 1px solid #e9ecef;
        }

        .text-danger {
          color: #dc3545;
        }

        .text-danger:hover {
          background-color: #dc354520 !important;
          color: #dc3545 !important;
        }
      `}</style>
    </nav>
  );
}
