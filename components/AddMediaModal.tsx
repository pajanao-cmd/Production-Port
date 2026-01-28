
import React, { useState, useRef } from 'react';
import { X, Upload, Link as LinkIcon, Image as ImageIcon, Film } from 'lucide-react';
import { MediaItem, MediaType, MediaSubtype } from '../types';

interface AddMediaModalProps {
  projectId: string;
  initialType: MediaType;
  onClose: () => void;
  onSave: (mediaItem: MediaItem) => void;
}

const AddMediaModal: React.FC<AddMediaModalProps> = ({ projectId, initialType, onClose, onSave }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [formData, setFormData] = useState({
    type: initialType,
    subtype: (initialType === 'video' ? 'highlight' : 'still') as MediaSubtype,
    url: '',
    title: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: MediaItem = {
      id: `m${Math.random().toString(36).substr(2, 9)}`,
      project_id: projectId,
      type: formData.type,
      subtype: formData.subtype,
      url: formData.url,
      title: formData.title,
      sort_order: 99, // Put at end
      is_cover: false
    };
    onSave(newItem);
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, url: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-zinc-900 bg-zinc-950">
          <h2 className="text-xl font-bold serif text-white">Add {formData.type === 'video' ? 'Video Asset' : 'Production Still'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-900 rounded-full text-zinc-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Tabs */}
          <div className="flex p-1 bg-zinc-900 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'upload' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Upload File
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'url' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              External URL
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Asset Type</label>
              <select 
                value={formData.subtype}
                onChange={(e) => setFormData({...formData, subtype: e.target.value as MediaSubtype})}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-zinc-700"
              >
                {formData.type === 'video' ? (
                  <>
                    <option value="highlight">Highlight / Clip</option>
                    <option value="teaser">Teaser / Trailer</option>
                    <option value="bts">Behind The Scenes</option>
                    <option value="breakdown">VFX Breakdown</option>
                  </>
                ) : (
                  <>
                    <option value="still">Production Still</option>
                    <option value="bts">BTS Photo</option>
                  </>
                )}
              </select>
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  {activeTab === 'upload' ? 'File Upload' : 'Asset URL'}
               </label>
               
               {activeTab === 'upload' ? (
                 <div 
                   className={`relative w-full aspect-[21/9] border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden ${formData.url ? 'border-green-500/50 bg-green-500/10' : 'border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900'}`}
                   onClick={() => fileInputRef.current?.click()}
                 >
                   <input 
                     ref={fileInputRef}
                     type="file" 
                     hidden 
                     accept={formData.type === 'video' ? "video/*" : "image/*"} 
                     onChange={handleFileUpload}
                   />
                   
                   {formData.url ? (
                      <div className="text-center text-green-400 space-y-1">
                        <Upload size={24} className="mx-auto" />
                        <p className="text-sm font-bold">File Selected</p>
                        <p className="text-xs opacity-70">Click to replace</p>
                      </div>
                   ) : (
                     <div className="text-center text-zinc-500 space-y-2">
                       {formData.type === 'video' ? <Film size={24} className="mx-auto" /> : <ImageIcon size={24} className="mx-auto" />}
                       <p className="text-sm font-medium">Click to upload {formData.type}</p>
                     </div>
                   )}
                 </div>
               ) : (
                 <div className="relative">
                   <LinkIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                   <input 
                     required={activeTab === 'url'}
                     type="url"
                     className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-zinc-700"
                     placeholder="https://..."
                     value={formData.url}
                     onChange={e => setFormData({...formData, url: e.target.value})}
                   />
                 </div>
               )}
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Title (Optional)</label>
              <input 
                type="text"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-zinc-700"
                placeholder="e.g. Opening Scene"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={!formData.url}
            className="w-full px-6 py-4 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to Project
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMediaModal;
