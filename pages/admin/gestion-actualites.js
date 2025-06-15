import { useState, useEffect, useContext } from 'react';
import Sidebar from '../../components/Sidebar';
import { AuthContext } from '../../src/contexts/AuthContext';

export default function GestionActualites() {
  const { role, isAuthenticated } = useContext(AuthContext);

  const [newsPosts, setNewsPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [form, setForm] = useState({
    id: null,
    title: '',
    date: '',
    scheduled: false,
    content: '',
    icon: null,
    attachments: [],
  });

  useEffect(() => {
    if (!isAuthenticated || role !== 'admin') {
      // Redirect to admin login or homepage if not authorized
      window.location.href = '/admin/login';
    }
  }, [isAuthenticated, role]);

  // Fetch news posts from backend API
  useEffect(() => {
    async function fetchNewsPosts() {
      try {
        const response = await fetch('/news_posts');
        if (!response.ok) {
          throw new Error('Failed to fetch news posts');
        }
        const data = await response.json();
        setNewsPosts(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchNewsPosts();
  }, []);

  const saveNewsPosts = (posts) => {
    setNewsPosts(posts);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setForm(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'file') {
      if (name === 'icon') {
        const file = files[0];
        setForm(prev => ({ ...prev, icon: file }));
      } else if (name === 'attachments') {
        const fileList = Array.from(files);
        setForm(prev => ({ ...prev, attachments: fileList }));
      }
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // Upload file helper function
  async function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error('File upload failed');
    }
    const data = await response.json();
    return data.url; // Assuming the API returns the uploaded file URL
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content || (!form.date && form.scheduled)) {
      alert('Veuillez remplir tous les champs requis.');
      return;
    }

    try {
      let iconUrl = null;
      if (form.icon && form.icon instanceof File) {
        iconUrl = await uploadFile(form.icon);
      } else if (editingPost) {
        iconUrl = editingPost.icon;
      }

      let attachmentsUrls = [];
      if (form.attachments.length > 0) {
        for (const file of form.attachments) {
          if (file instanceof File) {
            const url = await uploadFile(file);
            attachmentsUrls.push({ name: file.name, url });
          } else {
            attachmentsUrls.push(file);
          }
        }
      } else if (editingPost) {
        attachmentsUrls = editingPost.attachments || [];
      }

      const postData = {
        title: form.title,
        content: form.content,
        date: form.date,
        icon: iconUrl,
        attachments: attachmentsUrls,
      };

      let response;
      if (editingPost) {
        response = await fetch(`/news_posts/${editingPost.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData),
        });
      } else {
        response = await fetch('/news_posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to save news post');
      }

      // Refresh news posts list
      const updatedResponse = await fetch('/news_posts');
      const updatedPosts = await updatedResponse.json();
      saveNewsPosts(updatedPosts);

      setForm({
        id: null,
        title: '',
        date: '',
        scheduled: false,
        content: '',
        icon: null,
        attachments: [],
      });
      setEditingPost(null);
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la sauvegarde de l\'actualité.');
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setForm({
      id: post.id,
      title: post.title,
      date: post.date,
      scheduled: post.scheduled || false,
      content: post.content,
      icon: null,
      attachments: [],
    });
  };

  const handleDelete = async (id) => {
    if (confirm('Voulez-vous vraiment supprimer cette actualité ?')) {
      try {
        const response = await fetch(`/news_posts/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete news post');
        }
        // Refresh news posts list
        const updatedResponse = await fetch('/news_posts');
        const updatedPosts = await updatedResponse.json();
        saveNewsPosts(updatedPosts);
      } catch (error) {
        console.error(error);
        alert('Erreur lors de la suppression de l\'actualité.');
      }
    }
  };

  return (
    <div id="wrapper" style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div id="content-wrapper" className="d-flex flex-column flex-grow-1">
        <div id="content" className="container mt-4 flex-grow-1">
          <h1>Gestion des Actualités</h1>
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Titre</label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-control"
                value={form.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                id="scheduled"
                name="scheduled"
                className="form-check-input"
                checked={form.scheduled}
                onChange={handleInputChange}
              />
              <label htmlFor="scheduled" className="form-check-label">Programmer la publication</label>
            </div>
            <div className="mb-3">
              <label htmlFor="date" className="form-label">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                className="form-control"
                value={form.date}
                onChange={handleInputChange}
                required={form.scheduled}
                disabled={!form.scheduled}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="content" className="form-label">Contenu</label>
              <textarea
                id="content"
                name="content"
                className="form-control"
                rows="5"
                value={form.content}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="icon" className="form-label">Icône de l'article</label>
              <input
                type="file"
                id="icon"
                name="icon"
                className="form-control"
                accept="image/*"
                onChange={handleInputChange}
              />
              {form.icon && (
                <img
                  src={form.icon instanceof File ? URL.createObjectURL(form.icon) : form.icon}
                  alt="Icon preview"
                  style={{ maxWidth: '100px', marginTop: '10px' }}
                />
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="attachments" className="form-label">Fichiers joints</label>
              <input
                type="file"
                id="attachments"
                name="attachments"
                className="form-control"
                multiple
                onChange={handleInputChange}
              />
              {form.attachments.length > 0 && (
                <ul className="list-group mt-2">
                  {form.attachments.map((file, index) => (
                    <li key={index} className="list-group-item d-flex align-items-center">
                      <input
                        type="text"
                        className="form-control form-control-sm me-2"
                        value={file.name}
                        onChange={(e) => {
                          const newName = e.target.value;
                          setForm(prev => {
                            const newAttachments = [...prev.attachments];
                            newAttachments[index] = new File([file], newName, { type: file.type });
                            return { ...prev, attachments: newAttachments };
                          });
                        }}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button type="submit" className="btn btn-primary">
              {editingPost ? 'Mettre à jour' : 'Créer'}
            </button>
            {editingPost && (
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => {
                  setEditingPost(null);
                  setForm({
                    id: null,
                    title: '',
                    date: '',
                    scheduled: false,
                    content: '',
                    icon: null,
                    attachments: [],
                  });
                }}
              >
                Annuler
              </button>
            )}
          </form>

          <h2>Actualités existantes</h2>
          {newsPosts.length === 0 ? (
            <p>Aucune actualité enregistrée.</p>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Date</th>
                  <th>Programmé</th>
                  <th>Icône</th>
                  <th>Fichiers joints</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {newsPosts.map(post => (
                  <tr key={post.id}>
                    <td><strong>{post.title}</strong></td>
                    <td>{post.date && !isNaN(new Date(post.date)) ? new Date(post.date).toLocaleDateString() : ''}</td>
                    <td>{post.scheduled ? 'Oui' : 'Non'}</td>
                    <td>
                      {post.icon ? (
                        <img src={post.icon} alt="Icon" style={{ maxWidth: '50px' }} />
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>
                      {post.attachments && post.attachments.length > 0 ? (
                        <ul>
                          {post.attachments.map((file, idx) => (
                            <li key={idx}>
                              <a href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</a>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(post)}>Modifier</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(post.id)}>Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
