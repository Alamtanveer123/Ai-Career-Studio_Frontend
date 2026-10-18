import { ResumeAnalysis } from '../types/resume';
import { apiClient } from './apiClient';

const delay = (ms: number = 200) => new Promise((resolve) => setTimeout(resolve, ms));

// Tech skill keywords commonly checked in Indian high-growth tech firms
const KNOWN_SKILLS = [
  'React', 'TypeScript', 'JavaScript', 'Node.js', 'Next.js', 'Python', 'Go',
  'PostgreSQL', 'MongoDB', 'Redis', 'Kafka', 'Docker', 'Kubernetes', 'AWS',
  'Tailwind CSS', 'GraphQL', 'System Design', 'Git', 'CI/CD', 'FastAPI',
  'Microservices', 'REST APIs', 'Unit Testing', 'Linux', 'Jest'
];

/**
 * Universal Resume Analysis
 * Connects to your backend AI/LLM endpoint at POST /api/resume/analyze
 * If backend is not connected, uses intelligent heuristics fallback.
 */
export async function analyzeResumeWithAI(
  resumeText: string,
  fileName?: string
): Promise<ResumeAnalysis> {
  const cleanText = resumeText.trim();
  const lowerText = cleanText.toLowerCase();
  const wordCount = cleanText ? cleanText.split(/\s+/).length : 0;

  // Detect skills present
  const matchedSkills = KNOWN_SKILLS.filter((skill) =>
    lowerText.includes(skill.toLowerCase())
  );

  // Missing high-leverage skills
  const missingSkills = KNOWN_SKILLS.filter(
    (skill) => !matchedSkills.includes(skill)
  ).slice(0, 7);

  // Section checks
  const hasExperience = lowerText.includes('experience') || lowerText.includes('work history') || lowerText.includes('employment');
  const hasEducation = lowerText.includes('education') || lowerText.includes('degree') || lowerText.includes('b.tech') || lowerText.includes('bachelor');
  const hasProjects = lowerText.includes('project') || lowerText.includes('open source');
  const hasContact = lowerText.includes('@') || lowerText.includes('github') || lowerText.includes('linkedin');
  const hasMetrics = /\d+%\s|\d+\s?k|\d+\s?x|\$|₹|lpa|ms|users|scale|reduced|improved/i.test(cleanText);

  // Score calculations
  let skillsScore = Math.min(95, Math.max(45, matchedSkills.length * 9));
  let impactScore = hasMetrics ? 88 : 55;
  let formattingScore = Math.min(98, 50 + (hasExperience ? 15 : 0) + (hasEducation ? 12 : 0) + (hasProjects ? 13 : 0) + (hasContact ? 10 : 0));
  let experienceScore = wordCount >= 300 ? 86 : wordCount >= 150 ? 70 : 45;

  const overallScore = Math.round(
    skillsScore * 0.35 +
    impactScore * 0.25 +
    formattingScore * 0.20 +
    experienceScore * 0.20
  );

  // Dynamic strengths
  const strengths: string[] = [];
  if (matchedSkills.length >= 5) {
    strengths.push(`Strong core technical stack: detected competencies in ${matchedSkills.slice(0, 4).join(', ')}.`);
  } else {
    strengths.push('Demonstrates relevant foundational development concepts.');
  }
  if (hasMetrics) {
    strengths.push('Effective use of quantified achievements, impact metrics, and percentage improvements.');
  }
  if (hasExperience && hasProjects) {
    strengths.push('Well-structured chronological progression connecting hands-on engineering projects with commercial outcomes.');
  }
  if (hasContact) {
    strengths.push('Clear online footprint with developer profile/portfolio links (GitHub/LinkedIn).');
  }

  // Dynamic weaknesses
  const weaknesses: string[] = [];
  if (!hasMetrics) {
    weaknesses.push('Lacks quantifiable business outcomes: quantify your accomplishments with metrics (e.g. "improved latency by 35%", "scaled to 50k users").');
  }
  if (matchedSkills.length < 5) {
    weaknesses.push('Relatively low density of recognizable keywords: ATS scanners may downgrade score without specific frameworks and tools.');
  }
  if (wordCount < 200) {
    weaknesses.push('Brief narrative length: Expand on engineering architectural decisions, tools leveraged, and challenges solved.');
  }
  if (!lowerText.includes('system design') && !lowerText.includes('architecture')) {
    weaknesses.push('No explicit mention of system design, distributed data flow, or scalability principles.');
  }

  // Actionable suggestions
  const suggestions: string[] = [
    'Add an "Impact Summary" bullet at the top of each work experience role highlighting the key metric moved.',
    'Include modern cloud / container tooling (Docker, Kubernetes, AWS, or Terraform) to appeal to senior tech leads.',
    'Align bullet points with the Google XYZ formula: "Accomplished [X] as measured by [Y] by doing [Z]".',
    'Ensure all GitHub repos referenced in the projects section have updated README files and live demo links.'
  ];

  // Target role determination
  let detectedRoleTarget = 'Full Stack Engineer';
  if (lowerText.includes('react') && !lowerText.includes('backend')) {
    detectedRoleTarget = 'Frontend Engineer';
  } else if (lowerText.includes('fastapi') || lowerText.includes('python') || lowerText.includes('machine learning')) {
    detectedRoleTarget = 'AI / ML Engineer';
  } else if (lowerText.includes('kubernetes') || lowerText.includes('terraform')) {
    detectedRoleTarget = 'DevOps / Cloud Engineer';
  }

  const fallbackAnalysis: ResumeAnalysis = {
    id: `analysis-${Date.now()}`,
    analyzedAt: new Date().toISOString(),
    fileName,
    overallScore,
    sectionScores: {
      impact: impactScore,
      skills: skillsScore,
      formatting: formattingScore,
      experience: experienceScore,
    },
    strengths,
    weaknesses,
    suggestions,
    missingSkills,
    matchedSkills,
    extractedWordCount: wordCount,
    detectedRoleTarget,
  };

  try {
    return await apiClient.post<ResumeAnalysis>(
      '/resume/analyze',
      { resumeText, fileName },
      fallbackAnalysis
    );
  } catch {
    await delay(350);
    return fallbackAnalysis;
  }
}

export const resumeService = {
  analyzeResume: analyzeResumeWithAI,
};

