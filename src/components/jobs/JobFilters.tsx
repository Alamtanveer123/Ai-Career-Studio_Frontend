import React from 'react';
import { JobFilterParams } from '../../types/job';
import { Search, MapPin, Briefcase, Award, IndianRupee, RotateCcw } from 'lucide-react';


interface JobFiltersProps {
  filters: JobFilterParams;
  onChange: (filters: JobFilterParams) => void;
  onReset: () => void;
  totalResults: number;
}

const ROLES = [
  'All Roles',
  'Frontend Engineering',
  'Backend Engineering',
  'Full Stack Engineering',
  'AI / Machine Learning',
  'DevOps & Cloud',
  'Product & Design',
];

const LOCATIONS = [
  'All Locations',
  'Bengaluru',
  'Hyderabad',
  'Pune',
  'Delhi NCR',
  'Mumbai',
  'Remote (India)',
];

const EXPERIENCE_LEVELS = [
  'All Levels',
  'Fresher (0-1 yrs)',
  'Junior (1-3 yrs)',
  'Mid-Level (3-5 yrs)',
  'Senior (5-8 yrs)',
  'Lead / Architect (8+ yrs)',
];

export const JobFilters: React.FC<JobFiltersProps> = ({
  filters,
  onChange,
  onReset,
  totalResults,
}) => {
  const quickFilters = [
    { label: 'All Startups', active: !filters.role || filters.role === 'All Roles', onClick: () => onChange({ ...filters, role: 'All Roles' }) },
    { label: 'Remote Only', active: filters.location === 'Remote (India)', onClick: () => onChange({ ...filters, location: filters.location === 'Remote (India)' ? 'All Locations' : 'Remote (India)' }) },
    { label: 'Frontend', active: filters.role === 'Frontend Engineering', onClick: () => onChange({ ...filters, role: 'Frontend Engineering' }) },
    { label: 'AI / ML', active: filters.role === 'AI / Machine Learning', onClick: () => onChange({ ...filters, role: 'AI / Machine Learning' }) },
    { label: '₹25L+ CTC', active: filters.minSalaryLpa === 25, onClick: () => onChange({ ...filters, minSalaryLpa: filters.minSalaryLpa === 25 ? 0 : 25 }) },
  ];

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200/90 dark:border-neutral-800 rounded-2xl p-6 shadow-card space-y-4">
      {/* Top Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={filters.searchQuery || ''}
          onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
          placeholder="Search by role title, technologies (React, TypeScript, Python), or company..."
          className="w-full pl-11 pr-16 py-3 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-neutral-900 dark:text-white"
        />
        {filters.searchQuery && (
          <button
            onClick={() => onChange({ ...filters, searchQuery: '' })}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Quick Filter Pill Buttons */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {quickFilters.map((q) => (
          <button
            key={q.label}
            onClick={q.onClick}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all border ${
              q.active
                ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-900 dark:border-white shadow-xs'
                : 'bg-neutral-100 hover:bg-neutral-200/80 text-neutral-700 border-neutral-200/60 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-300 dark:border-neutral-700'
            }`}
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Filter Selectors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
        {/* Role Selector */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-neutral-400" />
            <span>Role Track</span>
          </label>
          <select
            value={filters.role || 'All Roles'}
            onChange={(e) => onChange({ ...filters, role: e.target.value })}
            className="w-full py-2.5 px-3 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-neutral-400" />
            <span>Location</span>
          </label>
          <select
            value={filters.location || 'All Locations'}
            onChange={(e) => onChange({ ...filters, location: e.target.value })}
            className="w-full py-2.5 px-3 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Experience Level */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-neutral-400" />
            <span>Experience</span>
          </label>
          <select
            value={filters.experience || 'All Levels'}
            onChange={(e) => onChange({ ...filters, experience: e.target.value })}
            className="w-full py-2.5 px-3 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {EXPERIENCE_LEVELS.map((exp) => (
              <option key={exp} value={exp}>
                {exp}
              </option>
            ))}
          </select>
        </div>

        {/* Minimum Salary */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
            <IndianRupee className="w-3.5 h-3.5 text-neutral-400" />
            <span>Min Salary (LPA)</span>
          </label>
          <select
            value={filters.minSalaryLpa || 0}
            onChange={(e) => onChange({ ...filters, minSalaryLpa: Number(e.target.value) })}
            className="w-full py-2.5 px-3 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value={0}>Any Compensation</option>
            <option value={15}>₹15+ LPA</option>
            <option value={25}>₹25+ LPA</option>
            <option value={35}>₹35+ LPA</option>
            <option value={50}>₹50+ LPA</option>
          </select>
        </div>
      </div>

      {/* Footer info bar */}
      <div className="flex items-center justify-between pt-3 text-xs border-t border-neutral-100 dark:border-neutral-800">
        <span className="text-neutral-500 dark:text-neutral-400">
          Showing <strong className="text-neutral-900 dark:text-white font-bold">{totalResults}</strong> open tech startup roles
        </span>

        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>
    </div>
  );
};

