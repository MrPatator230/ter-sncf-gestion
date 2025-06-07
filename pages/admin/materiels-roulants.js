import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../components/Sidebar';
import { AuthContext } from '../../src/contexts/AuthContext';

export default function MaterielsRoulants() {
  const { role, isAuthenticated } = useContext(AuthContext);
  const router = useRouter();

  const [materiels, setMateriels] = useState([]);
  const [editingMaterielId, setEditingMaterielId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [name, setName] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    if (!isAuthenticated || role !== 'admin') {
      router.push('/login');
    }
  }, [isAuthenticated, role, router]);

  useEffect(() => {
    const savedMateriels = localStorage.getItem('materielsRoulants');
    if (savedMateriels) {
      setMateriels(JSON.parse(savedMateriels));
    }
  }, []);

  const saveMateriels = (newMateriels) => {
    setMateriels(newMateriels);
    localStorage.setItem('materielsRoulants', JSON.stringify(newMateriels));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !type.trim() || (editingMaterielId === null && !imageFile)) {
      alert('Veuillez remplir tous les champs et ajouter une image.');
      return;
    }

    const processSave = (imageData) => {
      if (editingMaterielId !== null) {
        const updatedMateriels = materiels.map(m => {
          if (m.id === editingMaterielId) {
            return {
              ...m,
              name: name.trim(),
              type: type.trim(),
              imageData: imageData || m.imageData,
              imageName: `${name.toLowerCase().replace(/\s+/g, '-')}.png`
            };
          }
          return m;
        });
        saveMateriels(updatedMateriels);
      } else {
        const newMateriel = {
          id: Date.now(),
          name: name.trim(),
          type: type.trim(),
          imageData,
          imageName: `${name.toLowerCase().replace(/\s+/g, '-')}.png`
        };
        saveMateriels([...materiels, newMateriel]);
      }
      setImageFile(null);
      setName('');
      setType('');
      setEditingMaterielId(null);
      e.target.reset();
    };

    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        processSave(reader.result);
      };
      reader.readAsDataURL(imageFile);
    } else {
      processSave(null);
    }
  };

  const handleDelete = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce matériel roulant ?')) {
      const newMateriels = materiels.filter(m => m.id !== id);
      saveMateriels(newMateriels);
      if (editingMaterielId === id) {
        setEditingMaterielId(null);
        setImageFile(null);
        setName('');
        setType('');
      }
    }
  };

  const handleEdit = (materiel) => {
    setEditingMaterielId(materiel.id);
    setName(materiel.name);
    setType(materiel.type);
    setImageFile(null);
  };

  return (
    <div id="wrapper" style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div id="content-wrapper" className="d-flex flex-column flex-grow-1">
        <div id="content" className="container-fluid py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h3 mb-0" style={{ color: 'var(--aura-primary)' }}>Gestion du Matériel Roulant</h1>
            <button
              onClick={() => {
                setEditingMaterielId(null);
                setName('');
                setType('');
                setImageFile(null);
                document.getElementById('addMaterielForm').reset();
              }}
              className="btn"
              style={{
                backgroundColor: 'var(--aura-primary)',
                color: 'white',
                borderRadius: '25px',
                padding: '0.5rem 1.5rem'
              }}
            >
              Nouveau Matériel Roulant
            </button>
          </div>

          {/* Add/Edit Form */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <form id="addMaterielForm" onSubmit={handleSubmit}>
                <h2 className="h4 mb-4" style={{ color: 'var(--aura-primary)' }}>
                  {editingMaterielId ? 'Modifier le Matériel Roulant' : 'Ajouter un Matériel Roulant'}
                </h2>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label">Nom</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Type</label>
                    <input
                      type="text"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="form-label">
                    Image {editingMaterielId && '(laisser vide pour garder l\'image actuelle)'}
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="form-control"
                    {...(editingMaterielId === null ? { required: true } : {})}
                  />
                </div>
                <div className="d-flex justify-content-end gap-2">
                  {editingMaterielId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingMaterielId(null);
                        setName('');
                        setType('');
                        setImageFile(null);
                      }}
                      className="btn btn-outline-secondary"
                      style={{ borderRadius: '25px' }}
                    >
                      Annuler
                    </button>
                  )}
                  <button
                    type="submit"
                    className="btn"
                    style={{
                      backgroundColor: 'var(--aura-primary)',
                      color: 'white',
                      borderRadius: '25px'
                    }}
                  >
                    {editingMaterielId ? 'Mettre à jour' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Material List */}
          <div className="row g-4">
            {materiels.map(materiel => (
              <div key={materiel.id} className="col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm">
                  <div style={{ height: '200px', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
                    <img
                      src={materiel.imageData}
                      alt={materiel.name}
                      className="w-100 h-100"
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <div className="card-body">
                    <h3 className="h5 card-title" style={{ color: 'var(--aura-primary)' }}>{materiel.name}</h3>
                    <p className="card-text text-muted">Type: {materiel.type}</p>
                    <div className="d-flex justify-content-end gap-2">
                      <button
                        onClick={() => handleEdit(materiel)}
                        className="btn btn-outline-warning"
                        style={{ borderRadius: '25px' }}
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(materiel.id)}
                        className="btn btn-outline-danger"
                        style={{ borderRadius: '25px' }}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .btn:focus {
          box-shadow: 0 0 0 0.25rem rgba(0, 85, 164, 0.25);
        }
        .card {
          border: none;
          transition: transform 0.2s;
        }
        .card:hover {
          transform: translateY(-5px);
        }
        .form-control:focus {
          border-color: var(--aura-primary);
          box-shadow: 0 0 0 0.25rem rgba(0, 85, 164, 0.25);
        }
      `}</style>
    </div>
  );
}
