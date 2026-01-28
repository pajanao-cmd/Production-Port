
import React from 'react';
import { Project } from '../types';
import { PlayCircle, Image as ImageIcon, ChevronRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-xl bg-zinc-900 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98]"
    >
      <div className="aspect-[16/10] overflow-hidden">
        <img 
          src={project.cover_url} 
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-40"
        />
      </div>
      
      {/* Cinematic Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <p className="text-xs font-semibold tracking-widest text-zinc-400 uppercase mb-1">
            {project.year} • {project.role}
          </p>
          <h3 className="text-2xl font-bold serif text-white group-hover:text-zinc-100 transition-colors">
            {project.title}
          </h3>
          
          <div className="flex items-center gap-4 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
             <div className="flex items-center gap-1.5 text-zinc-300 text-sm">
                <PlayCircle size={16} />
                <span>Video</span>
             </div>
             <div className="flex items-center gap-1.5 text-zinc-300 text-sm">
                <ImageIcon size={16} />
                <span>Stills</span>
             </div>
             <div className="ml-auto text-zinc-50 flex items-center font-medium">
               View <ChevronRight size={18} />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
