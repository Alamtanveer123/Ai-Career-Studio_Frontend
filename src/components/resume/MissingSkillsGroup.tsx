import React from 'react';
import { Card } from '../common/Card';
import { Plus, Check, AlertCircle, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface MissingSkillsGroupProps {
  missingSkills: string[];
  matchedSkills: string[];
}

export const MissingSkillsGroup: React.FC<MissingSkillsGroupProps> = ({
  missingSkills,
  matchedSkills,
}) => {
  const { profile, updateProfile, addToast } = useAppStore();

  const handleAddSkill = (skill: string) => {
    if (profile.skills.includes(skill)) {
      addToast('Skill already present', `${skill} is already on your profile.`, 'info');
      return;
    }
    const updated = [...profile.skills, skill];
    updateProfile({ skills: updated });
    addToast('Skill Added to Profile', `Added ${skill} to your technical skills.`, 'success');
  };

  return (
    <Card className="p-5 space-y-4 border-slate-200/90 dark:border-slate-800">
      {/* Missing Skills Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Recommended Missing Skills
            </h4>
          </div>
          <span className="text-[11px] text-slate-400">
            Click <Plus className="w-3 h-3 inline" /> to add to profile
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
          These in-demand skills are frequently required by top Indian tech recruiters for your target role.
        </p>

        {missingSkills.length === 0 ? (
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            Great job! No major keyword gaps identified.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {missingSkills.map((skill) => {
              const alreadyInProfile = profile.skills.includes(skill);
              return (
                <button
                  key={skill}
                  onClick={() => handleAddSkill(skill)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    alreadyInProfile
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      : 'bg-amber-50/70 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/40 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800/60 shadow-2xs'
                  }`}
                  title={alreadyInProfile ? 'Already added to profile' : `Add ${skill} to profile`}
                >
                  {alreadyInProfile ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Plus className="w-3.5 h-3.5 text-amber-600" />
                  )}
                  <span>{skill}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Matched Skills Detected */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Skills Detected In Resume ({matchedSkills.length})
          </h4>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {matchedSkills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              <Check className="w-3 h-3 text-emerald-500" />
              <span>{skill}</span>
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
};
