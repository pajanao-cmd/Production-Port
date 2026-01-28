
import React, { useState, useRef } from 'react';
import { Download, Mail, Award, Briefcase, MapPin, Phone, Edit3, Save, X, Trash2, Plus, Camera } from 'lucide-react';
import { Profile, ExperienceItem, AwardItem } from '../types';

interface AboutPageProps {
  profile: Profile;
  onUpdate: (profile: Profile) => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ profile, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Profile>(profile);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onUpdate(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(profile);
    setIsEditing(false);
  };

  const updateField = (field: keyof Profile, value: any) => {
    setEditForm({ ...editForm, [field]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField('avatar_url', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateExperience = (id: string, field: keyof ExperienceItem, value: string) => {
    setEditForm({
      ...editForm,
      experience: editForm.experience.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    });
  };

  const addExperience = () => {
    const newExp: ExperienceItem = {
      id: Math.random().toString(36).substr(2, 9),
      year: 'Year',
      role: 'Role',
      company: 'Company',
      desc: 'Description'
    };
    setEditForm({ ...editForm, experience: [newExp, ...editForm.experience] });
  };

  const deleteExperience = (id: string) => {
    setEditForm({ ...editForm, experience: editForm.experience.filter(item => item.id !== id) });
  };

  const updateAward = (id: string, field: keyof AwardItem, value: string) => {
    setEditForm({
      ...editForm,
      awards: editForm.awards.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    });
  };

  const addAward = () => {
    const newAward: AwardItem = {
      id: Math.random().toString(36).substr(2, 9),
      year: 'Year',
      award: 'Award Name',
      category: 'Category'
    };
    setEditForm({ ...editForm, awards: [newAward, ...editForm.awards] });
  };

  const deleteAward = (id: string) => {
    setEditForm({ ...editForm, awards: editForm.awards.filter(item => item.id !== id) });
  };

  return (
    <div className="pt-24 pb-12 min-h-screen">
      <div className="max-w-5xl mx-auto px-6 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
        
        {/* Edit Button Toggle */}
        <div className="absolute top-0 right-6 z-10">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all text-sm font-medium"
            >
              <Edit3 size={16} /> Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button 
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all text-sm font-medium"
              >
                <X size={16} /> Cancel
              </button>
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-white text-black border border-white rounded-full hover:bg-zinc-200 transition-all text-sm font-bold"
              >
                <Save size={16} /> Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-12 items-start mb-16 mt-8">
          <div className="w-full md:w-1/3 aspect-[3/4] rounded-lg overflow-hidden relative group bg-zinc-900 border border-zinc-800">
            <img 
              src={isEditing ? editForm.avatar_url : profile.avatar_url}
              alt="Profile" 
              className={`w-full h-full object-cover transition-all duration-700 ${isEditing ? 'grayscale-0 opacity-40' : 'grayscale group-hover:grayscale-0'}`}
            />
            
            {isEditing ? (
              <div 
                className="absolute inset-0 flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                 <div className="p-4 rounded-full bg-white/10 backdrop-blur-md mb-2">
                    <Camera size={32} className="text-white" />
                 </div>
                 <span className="text-sm font-bold text-white uppercase tracking-widest">Change Photo</span>
                 <input 
                   ref={fileInputRef}
                   type="file" 
                   accept="image/*" 
                   hidden 
                   onChange={handleImageUpload} 
                 />
              </div>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent pointer-events-none" />
            )}
          </div>
          
          <div className="flex-1 space-y-6 w-full">
            <div>
              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Name</label>
                    <input 
                      type="text" 
                      value={editForm.name} 
                      onChange={(e) => updateField('name', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-2 text-3xl font-bold text-white focus:outline-none focus:border-zinc-600"
                      placeholder="Full Name"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Role</label>
                    <input 
                      type="text" 
                      value={editForm.role} 
                      onChange={(e) => updateField('role', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-2 text-lg text-zinc-400 focus:outline-none focus:border-zinc-600"
                      placeholder="Role • Titles"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-5xl md:text-6xl font-bold serif leading-tight mb-2">{profile.name}</h1>
                  <p className="text-xl text-zinc-400 font-light">{profile.role}</p>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-zinc-500 uppercase tracking-widest">
              {isEditing ? (
                <div className="flex gap-4 w-full">
                   <div className="flex-1 space-y-1">
                     <label className="text-xs font-bold">Location</label>
                     <input 
                      type="text" 
                      value={editForm.location} 
                      onChange={(e) => updateField('location', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-sm text-zinc-400 focus:outline-none focus:border-zinc-600"
                      placeholder="Location"
                    />
                   </div>
                   <div className="flex-1 space-y-1">
                     <label className="text-xs font-bold">Availability</label>
                     <input 
                      type="text" 
                      value={editForm.availability} 
                      onChange={(e) => updateField('availability', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-sm text-zinc-400 focus:outline-none focus:border-zinc-600"
                      placeholder="Availability"
                    />
                   </div>
                </div>
              ) : (
                <>
                  <span className="flex items-center gap-2"><MapPin size={16} /> {profile.location}</span>
                  <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                  <span>{profile.availability}</span>
                </>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-1">
                <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Biography</label>
                <textarea 
                  value={editForm.bio}
                  onChange={(e) => updateField('bio', e.target.value)}
                  rows={5}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded p-4 text-lg text-zinc-300 leading-relaxed focus:outline-none focus:border-zinc-600"
                  placeholder="Short bio..."
                />
              </div>
            ) : (
              <p className="text-lg text-zinc-300 leading-relaxed max-w-2xl">
                {profile.bio}
              </p>
            )}

            {/* Contact Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 mt-6 border-t border-zinc-800/50">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
                 <div className="p-2 bg-zinc-800 rounded-full text-zinc-400">
                    <Mail size={18} />
                 </div>
                 <div className="flex-1">
                    <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Email</p>
                    {isEditing ? (
                      <input 
                        type="email" 
                        value={editForm.email} 
                        onChange={(e) => updateField('email', e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-sm text-zinc-200 mt-1 focus:outline-none focus:border-zinc-600"
                      />
                    ) : (
                      <p className="text-zinc-200 font-medium">{profile.email}</p>
                    )}
                 </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
                 <div className="p-2 bg-zinc-800 rounded-full text-zinc-400">
                    <Phone size={18} />
                 </div>
                 <div className="flex-1">
                    <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Phone / Representation</p>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={editForm.phone} 
                        onChange={(e) => updateField('phone', e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-sm text-zinc-200 mt-1 focus:outline-none focus:border-zinc-600"
                      />
                    ) : (
                      <p className="text-zinc-200 font-medium">{profile.phone}</p>
                    )}
                 </div>
              </div>
            </div>

            {!isEditing && (
              <div className="flex flex-wrap gap-4 pt-4">
                <button className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-zinc-200 transition-colors">
                  <Download size={18} /> Download CV
                </button>
                <button className="flex items-center gap-2 border border-zinc-700 text-white px-6 py-3 rounded-full font-bold hover:bg-zinc-800 transition-colors">
                  <Mail size={18} /> Contact Me
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 border-t border-zinc-900 pt-16">
          
          {/* Experience Column */}
          <div className="space-y-12">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold serif flex items-center gap-3">
                <Briefcase className="text-zinc-500" size={24} /> Selected Experience
              </h2>
              {isEditing && (
                <button onClick={addExperience} className="p-1.5 bg-zinc-800 rounded hover:bg-white hover:text-black transition-colors">
                  <Plus size={16} />
                </button>
              )}
            </div>
            
            <div className="space-y-8 border-l border-zinc-800 pl-8 relative">
              {(isEditing ? editForm.experience : profile.experience).map((job, index) => (
                <div key={job.id} className="relative group/item">
                  <span className="absolute -left-[37px] top-1.5 w-4 h-4 rounded-full bg-zinc-900 border border-zinc-600" />
                  
                  {isEditing ? (
                    <div className="space-y-2 bg-zinc-900/30 p-4 rounded-lg border border-zinc-800/50">
                      <div className="flex gap-2">
                        <input 
                          value={job.year}
                          onChange={(e) => updateExperience(job.id, 'year', e.target.value)}
                          className="w-24 bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs font-bold uppercase"
                          placeholder="Year"
                        />
                        <input 
                          value={job.role}
                          onChange={(e) => updateExperience(job.id, 'role', e.target.value)}
                          className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-sm font-bold"
                          placeholder="Role"
                        />
                         <button onClick={() => deleteExperience(job.id)} className="p-1.5 text-zinc-500 hover:text-red-400">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <input 
                        value={job.company}
                        onChange={(e) => updateExperience(job.id, 'company', e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-sm text-zinc-400"
                        placeholder="Company"
                      />
                      <textarea 
                        value={job.desc}
                        onChange={(e) => updateExperience(job.id, 'desc', e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-sm text-zinc-500"
                        placeholder="Description"
                        rows={2}
                      />
                    </div>
                  ) : (
                    <>
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-1">{job.year}</span>
                      <h3 className="text-xl font-bold text-white">{job.role}</h3>
                      <p className="text-zinc-400 mb-2">{job.company}</p>
                      <p className="text-sm text-zinc-500 leading-relaxed">{job.desc}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Awards & Clients Column */}
          <div className="space-y-16">
            
            {/* Awards */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold serif flex items-center gap-3">
                  <Award className="text-zinc-500" size={24} /> Recognition
                </h2>
                {isEditing && (
                  <button onClick={addAward} className="p-1.5 bg-zinc-800 rounded hover:bg-white hover:text-black transition-colors">
                    <Plus size={16} />
                  </button>
                )}
              </div>

              <ul className="space-y-4">
                {(isEditing ? editForm.awards : profile.awards).map((item, i) => (
                  <li key={item.id} className={`flex justify-between items-baseline border-b border-zinc-900 pb-3 group ${!isEditing && 'hover:border-zinc-700'} transition-colors`}>
                     {isEditing ? (
                       <div className="flex gap-2 w-full items-start">
                         <div className="flex-1 space-y-2">
                           <input 
                              value={item.award}
                              onChange={(e) => updateAward(item.id, 'award', e.target.value)}
                              className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-sm font-medium text-white"
                              placeholder="Award Name"
                           />
                           <input 
                              value={item.category}
                              onChange={(e) => updateAward(item.id, 'category', e.target.value)}
                              className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-500"
                              placeholder="Category"
                           />
                         </div>
                         <div className="flex flex-col items-end gap-2">
                            <input 
                                value={item.year}
                                onChange={(e) => updateAward(item.id, 'year', e.target.value)}
                                className="w-16 bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs font-bold text-zinc-600 text-right"
                                placeholder="Year"
                            />
                            <button onClick={() => deleteAward(item.id)} className="p-1.5 text-zinc-500 hover:text-red-400">
                                <Trash2 size={14} />
                            </button>
                         </div>
                       </div>
                     ) : (
                       <>
                         <div>
                           <span className="text-lg font-medium text-zinc-200 block group-hover:text-white transition-colors">{item.award}</span>
                           <span className="text-sm text-zinc-500">{item.category}</span>
                         </div>
                         <span className="text-xs font-bold text-zinc-600">{item.year}</span>
                       </>
                     )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Client List (Text Cloud) */}
            <div>
              <h2 className="text-2xl font-bold serif mb-6">Select Clients</h2>
              {isEditing ? (
                <div className="space-y-2">
                  <p className="text-xs text-zinc-500 uppercase">Separate clients with commas</p>
                  <textarea 
                    value={editForm.clients.join(', ')}
                    onChange={(e) => updateField('clients', e.target.value.split(',').map(s => s.trim()))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded p-4 text-zinc-300 leading-relaxed focus:outline-none focus:border-zinc-600"
                    rows={4}
                  />
                </div>
              ) : (
                <div className="flex flex-wrap gap-x-6 gap-y-3 text-zinc-500 leading-relaxed">
                  {profile.clients.map(client => (
                    <span key={client} className="hover:text-white transition-colors cursor-default">{client}</span>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
