
import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Image as ImageIcon, Film, Upload } from 'lucide-react';
import { Project } from '../types';

interface CreateProjectModalProps {
  onClose: () => void;
  onSave: (project: Project) => void;
  projectToEdit?: Project | null;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ onClose, onSave, projectToEdit }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    year: new Date().getFullYear(),
    role: '',
    description: '',
    cover_url: ''
  });

  useEffect(() => {
    if (projectToEdit) {
      setFormData({
        title: projectToEdit.title,
        client: projectToEdit.client?.name || 'Client', // Simplification for mock
        year: projectToEdit.year,
        role: projectToEdit.role,
        description: projectToEdit.description,
        cover_url: projectToEdit.cover_url
      });
    }
  }, [projectToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject: Project = {
      id: projectToEdit ? projectToEdit.id : `p${Math.random().toString(36).substr(2, 9)}`,
      title: formData.title,
      client_id: projectToEdit?.client_id || 'dynamic', // Keep existing ID if editing
      category_id: projectToEdit?.category_id || 'dynamic',
      year: formData.year,
      role: formData.role,
      description: formData.description,
      cover_url: formData.cover_url || 'https://picsum.photos/1200/800',
      is_published: true,
      sort_order: projectToEdit?.sort_order || 0
    };
    onSave(newProject);
    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, cover_url: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between p-6 border-b border-zinc-900 sticky top-0 bg-zinc-950 z-10">
          <h2 className="text-2xl font-bold serif text-white">{projectToEdit ? 'Edit Project' : 'Create New Project'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-900 rounded-full text-zinc-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Project Title</label>
              <input 
                required
                type="text"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-white/20"
                placeholder="e.g. Neon Odyssey"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Client</label>
              <input 
                required
                type="text"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-white/20"
                placeholder="e.g. Luxury Brand"
                value={formData.client}
                onChange={e => setFormData({...formData, client: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Year</label>
              <input 
                required
                type="number"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-white/20"
                value={formData.year}
                onChange={e => setFormData({...formData, year: parseInt(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Your Role</label>
              <input 
                required
                type="text"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-white/20"
                placeholder="e.g. Director"
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Description</label>
            <textarea 
              required
              rows={3}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-white/20"
              placeholder="Tell the story of this production..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Cover Image</label>
            
            <div 
              className={`relative w-full aspect-video border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden ${formData.cover_url ? 'border-transparent' : 'border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900'}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                hidden 
                accept="image/*" 
                onChange={handleImageUpload}
              />
              
              {formData.cover_url ? (
                <>
                   <img src={formData.cover_url} alt="Cover Preview" className="absolute inset-0 w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="px-4 py-2 bg-black/60 rounded-full text-white text-sm font-bold flex items-center gap-2 backdrop-blur-md">
                        <Upload size={16} /> Change Image
                      </div>
                   </div>
                </>
              ) : (
                <div className="text-center text-zinc-500 space-y-2">
                  <ImageIcon size={32} className="mx-auto" />
                  <p className="text-sm font-medium">Click to upload cover image</p>
                  <p className="text-xs opacity-50">Supports JPG, PNG, WEBP</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-xl border border-zinc-800 text-zinc-400 font-bold hover:bg-zinc-900 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-6 py-4 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-all shadow-xl"
            >
              {projectToEdit ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
