import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Project, MediaItem, Category, Client, Profile, MediaType } from './types';
import { storageService } from './services/storage';
import ProjectCard from './components/ProjectCard';
import VideoPlayer from './components/VideoPlayer';
import PresentationMode from './components/PresentationMode';
import CreateProjectModal from './components/CreateProjectModal';
import AddMediaModal from './components/AddMediaModal';
import AboutPage from './components/AboutPage';
import { 
  Tv, 
  Download, 
  Trash2, 
  Maximize2, 
  Film, 
  Image as ImageIcon, 
  ChevronLeft, 
  Wifi, 
  WifiOff,
  Search,
  Settings,
  CheckCircle2,
  Loader2,
  Plus,
  Briefcase,
  Edit,
  MoreVertical,
  GripVertical
} from 'lucide-react';

// Mock Data Initial
const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'Neon Odyssey',
    client_id: 'c1',
    category_id: 'cat1',
    year: 2024,
    role: 'Director / Cinematographer',
    description: 'A futuristic narrative feature exploring the intersection of light and memory in a dystopian Tokyo.',
    cover_url: 'https://picsum.photos/id/48/1200/800',
    is_published: true,
    sort_order: 1
  },
  {
    id: 'p2',
    title: 'Vogue Motion',
    client_id: 'c2',
    category_id: 'cat2',
    year: 2023,
    role: 'Executive Producer',
    description: 'Global campaign for high-fashion digital editorial, focusing on fluid camera movements and textured fabrics.',
    cover_url: 'https://picsum.photos/id/22/1200/800',
    is_published: true,
    sort_order: 2
  },
  {
    id: 'p3',
    title: 'Mountain Echoes',
    client_id: 'c3',
    category_id: 'cat1',
    year: 2024,
    role: 'DOP',
    description: 'Breathtaking documentary series capturing the silent majesty of the Swiss Alps during late winter.',
    cover_url: 'https://picsum.photos/id/34/1200/800',
    is_published: true,
    sort_order: 3
  }
];

const INITIAL_PROFILE: Profile = {
  name: 'Alex Morian',
  role: 'Director • Cinematographer • Visual Artist',
  location: 'Tokyo / Los Angeles',
  availability: 'Available for 2024',
  bio: 'With over a decade of experience in visual storytelling, I specialize in crafting high-end commercials and narrative features that explore the human condition through a stylized, atmospheric lens. My work bridges the gap between raw emotion and precise technical execution.',
  email: 'studio@alexmorian.com',
  phone: '+1 (323) 555-0199',
  avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=987&auto=format&fit=crop',
  experience: [
    { id: '1', year: '2020 - Present', role: 'Freelance Director', company: 'Global', desc: 'Directing campaigns for luxury brands including Lexus, Sony, and Shiseido.' },
    { id: '2', year: '2017 - 2020', role: 'Senior Cinematographer', company: 'Vogue Studios', desc: 'Led visual direction for digital editorials and fashion week coverage in Paris and Milan.' },
    { id: '3', year: '2014 - 2017', role: 'Visual Lead', company: 'Neon Agency', desc: 'Developed visual identity systems and directed motion content for tech startups.' }
  ],
  awards: [
    { id: '1', award: 'Cannes Lions', category: 'Best Cinematography (Shortlist)', year: '2023' },
    { id: '2', award: 'Vimeo Staff Pick', category: 'Neon Odyssey', year: '2022' },
    { id: '3', award: 'ADC Awards', category: 'Gold Cube - Motion', year: '2021' },
    { id: '4', award: 'Tokyo Film Festival', category: 'Best Short Documentary', year: '2019' }
  ],
  clients: ['Nike', 'Sony', 'Lexus', 'Shiseido', 'Vogue', 'Netflix', 'HBO', 'Adidas', 'Canon', 'Red Bull', 'Samsung']
};

const MOCK_CLIENTS: Record<string, Client> = {
  'c1': { 
    id: 'c1', 
    name: 'Lexus Global', 
    industry: 'Automotive', 
    logo_url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=200&h=200&fit=crop&q=80' 
  },
  'c2': { 
    id: 'c2', 
    name: 'Vogue Italia', 
    industry: 'Fashion & Lifestyle', 
    logo_url: 'https://images.unsplash.com/photo-1576995853123-5a2946172f02?w=200&h=200&fit=crop&q=80' 
  },
  'c3': { 
    id: 'c3', 
    name: 'National Geographic', 
    industry: 'Documentary', 
    logo_url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=200&h=200&fit=crop&q=80' 
  }
};

const INITIAL_MEDIA_MAP: Record<string, MediaItem[]> = {
  'p1': [
    { id: 'm1', project_id: 'p1', type: 'video', subtype: 'highlight', url: 'https://www.w3schools.com/html/mov_bbb.mp4', sort_order: 0, is_cover: false },
    { id: 'm2', project_id: 'p1', type: 'image', subtype: 'still', url: 'https://picsum.photos/id/40/1200/800', sort_order: 1, is_cover: false },
    { id: 'm3', project_id: 'p1', type: 'image', subtype: 'still', url: 'https://picsum.photos/id/41/1200/800', sort_order: 2, is_cover: false }
  ],
  'p2': [
     { id: 'm4', project_id: 'p2', type: 'video', subtype: 'highlight', url: 'https://www.w3schools.com/html/movie.mp4', sort_order: 0, is_cover: false },
     { id: 'm5', project_id: 'p2', type: 'image', subtype: 'still', url: 'https://picsum.photos/id/24/1200/800', sort_order: 1, is_cover: false }
  ],
  'p3': [
     { id: 'm6', project_id: 'p3', type: 'video', subtype: 'highlight', url: 'https://www.w3schools.com/html/mov_bbb.mp4', sort_order: 0, is_cover: false },
     { id: 'm7', project_id: 'p3', type: 'image', subtype: 'still', url: 'https://picsum.photos/id/30/1200/800', sort_order: 1, is_cover: false }
  ]
};

// --- PAGES ---

interface DashboardProps {
  projects: Project[];
  profile: Profile;
}

const Dashboard: React.FC<DashboardProps> = ({ projects, profile }) => {
  const navigate = useNavigate();
  const [offlineStatus, setOfflineStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const checkOffline = async () => {
      const status: Record<string, boolean> = {};
      for (const p of projects) {
        status[p.id] = await storageService.isProjectOffline(p.id);
      }
      setOfflineStatus(status);
    };
    checkOffline();
  }, [projects]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-16 border-b border-zinc-900 pb-10">
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-zinc-800 shadow-2xl shrink-0">
               <img 
                 src={profile.avatar_url} 
                 alt={profile.name}
                 className="w-full h-full object-cover" 
               />
            </div>
            <div>
               <h1 className="text-4xl md:text-5xl font-bold serif text-white mb-2">{profile.name}</h1>
               <div className="flex flex-wrap gap-4 text-sm text-zinc-400 font-medium tracking-wide uppercase">
                  {profile.role.split('•').map((r, i) => (
                    <React.Fragment key={i}>
                      <span>{r.trim()}</span>
                      {i < profile.role.split('•').length - 1 && <span className="text-zinc-700">•</span>}
                    </React.Fragment>
                  ))}
               </div>
            </div>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <button onClick={() => navigate('/about')} className="flex-1 md:flex-none px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-zinc-200 transition-colors shadow-lg shadow-white/5">
               Contact Me
            </button>
            <button className="md:hidden px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400">
               <Search size={20} />
            </button>
          </div>
        </div>

        <div className="flex justify-between items-end mt-8">
           <p className="text-zinc-400 max-w-2xl leading-relaxed">
             A curated selection of narrative and commercial works. <span className="text-zinc-600">Selected for presentation.</span>
           </p>
           
           <div className="hidden md:flex gap-4">
             <div className="relative">
               <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
               <input 
                 type="text" 
                 placeholder="Search projects..." 
                 className="bg-zinc-900 border border-zinc-800 rounded-full py-2 pl-10 pr-6 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-600 w-64"
               />
             </div>
             <button className="p-2 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-zinc-800 transition-colors">
                <Settings size={20} className="text-zinc-400" />
             </button>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map(project => (
          <div key={project.id} className="relative">
            <ProjectCard 
              project={project} 
              onClick={() => navigate(`/project/${project.id}`)} 
            />
            {offlineStatus[project.id] && (
               <div className="absolute top-4 right-4 bg-zinc-900/80 backdrop-blur-sm p-1.5 rounded-full border border-green-500/30 flex items-center justify-center">
                  <CheckCircle2 size={16} className="text-green-400" />
               </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

interface ProjectDetailProps {
  projects: Project[];
  mediaMap: Record<string, MediaItem[]>;
  onDelete: (id: string) => void;
  onEdit: (project: Project) => void;
  onAddMedia: (media: MediaItem) => void;
  onReorderMedia: (projectId: string, items: MediaItem[]) => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ projects, mediaMap, onDelete, onEdit, onAddMedia, onReorderMedia }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isOffline, setIsOffline] = useState(false);
  const [showPresentation, setShowPresentation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [addMediaType, setAddMediaType] = useState<MediaType | null>(null);

  const project = projects.find(p => p.id === id);
  const mediaItems = id ? mediaMap[id] || [] : [];
  const client = project && project.client_id ? MOCK_CLIENTS[project.client_id] : null;

  // Split mediaItems into videos and images, sorted by sort_order
  const videos = mediaItems.filter(m => m.type === 'video').sort((a, b) => a.sort_order - b.sort_order);
  const images = mediaItems.filter(m => m.type === 'image').sort((a, b) => a.sort_order - b.sort_order);

  useEffect(() => {
    if (id) storageService.isProjectOffline(id).then(setIsOffline);
  }, [id]);

  const toggleOffline = async () => {
    if (!project || !id) return;
    setLoading(true);
    if (isOffline) {
      await storageService.removeOfflineProject(id);
      setIsOffline(false);
    } else {
      await storageService.saveProjectOffline(project, mediaItems);
      setIsOffline(true);
    }
    setLoading(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this project? This cannot be undone.')) {
      if (project) onDelete(project.id);
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination || !id) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    const type = result.destination.droppableId; // 'videos' or 'images'

    if (type === 'videos') {
      const items = Array.from(videos);
      const [reorderedItem] = items.splice(sourceIndex, 1);
      
      if (reorderedItem) {
        items.splice(destinationIndex, 0, reorderedItem);
        
        // Update sort orders
        const updatedVideos = items.map((item, index) => Object.assign({}, item, { sort_order: index }));
        const newMediaList = [...updatedVideos, ...images];
        onReorderMedia(id, newMediaList);
      }
    } else if (type === 'images') {
      const items = Array.from(images);
      const [reorderedItem] = items.splice(sourceIndex, 1);
      
      if (reorderedItem) {
        items.splice(destinationIndex, 0, reorderedItem);
        
        const updatedImages = items.map((item, index) => Object.assign({}, item, { sort_order: index }));
        const newMediaList = [...videos, ...updatedImages];
        onReorderMedia(id, newMediaList);
      }
    }
  };

  if (!project) return <div className="p-20 text-center">Project not found.</div>;

  return (
    <div className="pb-24">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <img 
          src={project.cover_url} 
          className="w-full h-full object-cover" 
          alt={project.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        
        {/* Top Controls */}
        <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-start z-10">
           <button 
              onClick={() => navigate('/')} 
              className="flex items-center gap-1 text-zinc-300 hover:text-white transition-colors bg-black/20 backdrop-blur-md px-4 py-2 rounded-full"
            >
              <ChevronLeft size={20} /> Back
            </button>

            <div className="relative">
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="p-3 bg-black/20 backdrop-blur-md rounded-full text-zinc-300 hover:text-white hover:bg-black/40 transition-colors"
              >
                <MoreVertical size={20} />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <button 
                    onClick={() => { onEdit(project); setShowMenu(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                  >
                    <Edit size={16} /> Edit Project
                  </button>
                  <button 
                    onClick={handleDelete}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors border-t border-zinc-800"
                  >
                    <Trash2 size={16} /> Delete Project
                  </button>
                </div>
              )}
            </div>
        </div>
        
        <div className="absolute bottom-0 inset-x-0 p-8 md:p-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold tracking-[0.2em] text-zinc-400 uppercase mb-2">
              {project.year} • {project.role}
            </p>
            <h1 className="text-5xl md:text-7xl font-bold serif text-white mb-4 leading-tight">{project.title}</h1>
            <p className="text-lg text-zinc-300 line-clamp-2 md:line-clamp-none">{project.description}</p>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => setShowPresentation(true)}
              className="flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-zinc-200 transition-all transform active:scale-95 shadow-2xl"
            >
              <Maximize2 size={20} /> Presentation Mode
            </button>
            <button 
              onClick={toggleOffline}
              disabled={loading}
              className={`flex items-center gap-2 px-6 py-4 rounded-full font-bold transition-all border ${
                isOffline 
                ? 'bg-zinc-800/50 border-zinc-700 text-green-400 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400' 
                : 'bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800'
              }`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 size={20} className="animate-spin" />
                  <span>Downloading...</span>
                </div>
              ) : isOffline ? (
                <><CheckCircle2 size={20} /> Offline Ready</>
              ) : (
                <><Download size={20} /> Keep Offline</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content Gallery */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Videos Column */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="flex items-center gap-2 text-xl font-bold serif">
                <Film size={24} className="text-zinc-500" /> Video Assets
              </h3>
              <button 
                onClick={() => setAddMediaType('video')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-dashed border-zinc-700 text-zinc-400 hover:text-white hover:border-white transition-all text-xs font-bold uppercase"
              >
                <Plus size={14} /> Add Video
              </button>
            </div>
            
            <Droppable droppableId="videos">
              {(provided) => (
                <div 
                  ref={provided.innerRef} 
                  {...provided.droppableProps}
                  className="space-y-8 min-h-[100px]"
                >
                  {videos.length > 0 ? videos.map((m, index) => (
                    <Draggable key={m.id} draggableId={m.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`relative group ${snapshot.isDragging ? 'z-50 opacity-90 scale-[1.02]' : ''}`}
                        >
                           {/* Drag Handle */}
                           <div 
                             {...provided.dragHandleProps}
                             className="absolute left-2 top-2 p-2 bg-black/50 rounded-md text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-20 backdrop-blur-sm"
                           >
                              <GripVertical size={16} />
                           </div>

                           <div className="space-y-3 bg-zinc-950 rounded-lg">
                              <VideoPlayer src={m.url} />
                              <div className="flex justify-between items-center px-1">
                                <p className="text-sm font-medium text-zinc-400 uppercase tracking-widest">{m.subtype}</p>
                                <p className="text-xs text-zinc-600">4K • 24FPS • RAW</p>
                              </div>
                           </div>
                        </div>
                      )}
                    </Draggable>
                  )) : (
                    <div className="p-12 border border-zinc-900 rounded-xl text-center text-zinc-600 italic">
                      No videos available for this project.
                    </div>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* Stills Column */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="flex items-center gap-2 text-xl font-bold serif">
                <ImageIcon size={24} className="text-zinc-500" /> Production Stills
              </h3>
               <button 
                onClick={() => setAddMediaType('image')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-dashed border-zinc-700 text-zinc-400 hover:text-white hover:border-white transition-all text-xs font-bold uppercase"
              >
                <Plus size={14} /> Add Still
              </button>
            </div>

            <Droppable droppableId="images">
              {(provided) => (
                <div 
                  ref={provided.innerRef} 
                  {...provided.droppableProps}
                  className="grid grid-cols-2 gap-4 min-h-[100px]"
                >
                  {images.length > 0 ? images.map((m, index) => (
                    <Draggable key={m.id} draggableId={m.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`relative group aspect-square overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 ${snapshot.isDragging ? 'z-50 shadow-xl ring-2 ring-white/20' : ''}`}
                        >
                           {/* Drag Handle Overlay */}
                           <div 
                             {...provided.dragHandleProps}
                             className="absolute top-2 right-2 p-2 bg-black/50 rounded-md text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-20 backdrop-blur-sm"
                           >
                              <GripVertical size={16} />
                           </div>

                          <img src={m.url} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                            <Maximize2 className="text-white" size={24} />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  )) : (
                    <div className="col-span-2 p-12 border border-zinc-900 rounded-xl text-center text-zinc-600 italic">
                      No production stills available.
                    </div>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>

      {/* Client Section */}
      {client && (
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-16 border-t border-zinc-900">
           <div className="bg-zinc-950/50 rounded-2xl p-8 border border-zinc-900">
             <div className="flex flex-col md:flex-row items-center gap-8">
               <div className="w-24 h-24 rounded-full overflow-hidden bg-white/5 flex-shrink-0 border border-zinc-800">
                 {client.logo_url ? (
                   <img src={client.logo_url} alt={client.name} className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-zinc-600 font-bold text-2xl">
                     {client.name.charAt(0)}
                   </div>
                 )}
               </div>
               <div className="text-center md:text-left space-y-2">
                 <h3 className="text-2xl font-bold serif text-white">{client.name}</h3>
                 <div className="flex items-center justify-center md:justify-start gap-3">
                   <Briefcase size={16} className="text-zinc-500" />
                   <span className="text-zinc-400 uppercase tracking-widest text-xs font-bold">{client.industry || 'Global Brand'}</span>
                 </div>
                 <p className="text-zinc-500 text-sm max-w-xl">
                   Long-standing partnership delivering premium visual content across multiple campaigns and territories.
                 </p>
               </div>
               <div className="md:ml-auto">
                 <button className="px-6 py-2 rounded-full border border-zinc-800 hover:bg-white hover:text-black transition-all text-sm font-medium">
                   View Client Profile
                 </button>
               </div>
             </div>
           </div>
        </div>
      )}

      {showPresentation && (
        <PresentationMode 
          project={project} 
          mediaItems={mediaItems.length > 0 ? mediaItems : [{
            id: 'temp',
            project_id: project.id,
            type: 'image',
            subtype: 'still',
            url: project.cover_url,
            sort_order: 0,
            is_cover: true
          }]} 
          onClose={() => setShowPresentation(false)} 
        />
      )}

      {addMediaType && id && (
        <AddMediaModal 
          projectId={id}
          initialType={addMediaType}
          onClose={() => setAddMediaType(null)}
          onSave={onAddMedia}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [mediaMap, setMediaMap] = useState<Record<string, MediaItem[]>>(INITIAL_MEDIA_MAP);
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const addProject = (newProject: Project) => {
    setProjects([newProject, ...projects]);
  };

  const updateProject = (updatedProject: Project) => {
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
    window.location.hash = '/';
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleAddMedia = (mediaItem: MediaItem) => {
    setMediaMap(prev => {
      const projectMedia = prev[mediaItem.project_id] || [];
      return {
        ...prev,
        [mediaItem.project_id]: [...projectMedia, mediaItem]
      };
    });
  };

  const handleReorderMedia = (projectId: string, items: MediaItem[]) => {
    setMediaMap(prev => ({
      ...prev,
      [projectId]: items
    }));
  };

  return (
    <Router>
      <div className="min-h-screen">
        {/* Persistent Online Indicator */}
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md border ${
          isOnline ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
        }`}>
          {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
          {isOnline ? 'Connected' : 'Offline Mode'}
        </div>

        {/* Global Navigation */}
        <nav className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-900 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 bg-white text-black flex items-center justify-center rounded-lg font-black transition-transform group-hover:rotate-12">
                {profile.name.charAt(0)}
              </div>
              <span className="font-bold tracking-tighter text-xl uppercase">{profile.name}</span>
            </Link>
            
            <div className="hidden sm:flex items-center gap-8 text-sm font-medium text-zinc-400">
              <Link to="/" className="hover:text-white transition-colors">Portfolio</Link>
              <Link to="/about" className="hover:text-white transition-colors">About</Link>
              <a href="#" className="hover:text-white transition-colors">Clients</a>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-zinc-100 text-zinc-950 px-4 py-1.5 rounded-full hover:bg-white transition-all text-xs font-bold uppercase tracking-widest flex items-center gap-2"
              >
                <Plus size={14} /> Add Project
              </button>
            </div>
          </div>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<Dashboard projects={projects} profile={profile} />} />
            <Route 
              path="/project/:id" 
              element={
                <ProjectDetail 
                  projects={projects} 
                  mediaMap={mediaMap}
                  onDelete={deleteProject} 
                  onEdit={handleEditProject} 
                  onAddMedia={handleAddMedia}
                  onReorderMedia={handleReorderMedia}
                />
              } 
            />
            <Route path="/about" element={<AboutPage profile={profile} onUpdate={setProfile} />} />
          </Routes>
        </main>
        
        {isModalOpen && (
          <CreateProjectModal 
            onClose={handleModalClose} 
            onSave={editingProject ? updateProject : addProject} 
            projectToEdit={editingProject}
          />
        )}

        {/* Footer */}
        <footer className="border-t border-zinc-900 py-12 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-zinc-500 text-sm">
              &copy; 2024 Production Portfolio Presenter. All rights reserved.
            </div>
            <div className="flex gap-6 text-zinc-400">
              <Tv size={20} className="hover:text-white cursor-pointer" />
              <Download size={20} className="hover:text-white cursor-pointer" />
              <Film size={20} className="hover:text-white cursor-pointer" />
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;