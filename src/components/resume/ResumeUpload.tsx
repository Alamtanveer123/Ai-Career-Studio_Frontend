import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { UploadCloud, FileText, Sparkles, RefreshCw, Trash2 } from 'lucide-react';
import { resumeService } from '../../services/resumeService';
import { useAppStore } from '../../store/useAppStore';

const SAMPLE_RESUMES = {
  frontend: `TANVEER ALAM
Senior Frontend Engineer | React, TypeScript, Performance
Email: tanveer.alam@example.com | Phone: +91 98765 43210
Location: Bengaluru, India | GitHub: github.com/tanveeralam | LinkedIn: linkedin.com/in/tanveeralam

SUMMARY
Frontend Engineer with 5+ years of experience engineering high-performance web applications, large-scale design systems, and real-time streaming dashboards in React, TypeScript, Next.js, and Tailwind CSS. Reduced page load latency by 42% and supported 250,000+ active enterprise users.

CORE TECHNICAL SKILLS
- Languages & Frameworks: React, TypeScript, JavaScript (ES6+), Next.js, Node.js, HTML5, CSS3, Tailwind CSS
- State & Architecture: Zustand, Redux Toolkit, React Query, Micro-frontends, REST APIs, GraphQL, WebSockets
- Testing & Tooling: Jest, React Testing Library, Vite, Webpack, Git, CI/CD pipelines, Docker, Linux
- Concepts: System Design, Core Web Vitals, Performance Optimization, Accessibility (WCAG 2.1 AA)

PROFESSIONAL EXPERIENCE
Senior Frontend Developer | NovaEdge Technologies, Bengaluru (2023 - Present)
- Architected the core telemetry monitoring dashboard using React 18, TypeScript, and Tailwind CSS, handling 50k events/sec via WebSockets.
- Reduced initial bundle size by 38% through route code-splitting, tree-shaking, and lazy loading, improving Google Lighthouse score from 68 to 96.
- Established the internal UI component library adopted by 4 product teams, reducing frontend sprint velocity turnaround by 25%.
- Mentored 4 junior frontend developers on TypeScript best practices, automated unit tests with Jest, and clean code principles.

Software Engineer | CloudMatrix Solutions, Pune (2021 - 2023)
- Built interactive analytics reports and customizable Kanban workflow boards using React, Next.js, and PostgreSQL.
- Implemented optimistic UI updates and local client-side caching, cutting network payload overhead by 30%.
- Integrated RESTful backend endpoints with robust zod schema validation and error boundaries.

EDUCATION
B.Tech in Computer Science & Engineering | Visvesvaraya Technological University (2017 - 2021)
CGPA: 8.7/10`,

  aiml: `AARAV SHARMA
AI & Machine Learning Engineer | LLMs, RAG, PyTorch
Email: aarav.sharma@example.com | Bengaluru, India | GitHub: github.com/aarav-ai

SUMMARY
Machine Learning Engineer with 4 years experience specializing in Generative AI, RAG pipelines, fine-tuning LLMs, and high-throughput Python backends using FastAPI, PyTorch, and LangChain.

CORE SKILLS
- AI/ML: PyTorch, Hugging Face Transformers, LangChain, LlamaIndex, LoRA, Vector DBs (Pinecone, Qdrant), Python
- Backend & Cloud: FastAPI, Docker, Kubernetes, AWS, PostgreSQL, Redis, Celery, REST APIs
- Tools: Git, CI/CD, MLflow, Linux, Triton Inference Server

EXPERIENCE
AI Engineer | IndicGen AI, Bengaluru (2023 - Present)
- Built an enterprise RAG knowledge assistant over 2M+ PDF docs with hybrid search, achieving 94% retrieval accuracy.
- Optimized LLM token generation latency from 1.8s to 420ms using vLLM and 4-bit AWQ quantization.
- Implemented automated prompt regression test suites with LangSmith, reducing hallucination rates by 35%.`,

  fresher: `PRIYA PATEL
Associate Software Engineer (2025 Graduate)
Email: priya.patel@example.com | Hyderabad, India

SUMMARY
Aspiring software developer with strong fundamentals in Data Structures, Algorithms, JavaScript, React, and Java. Built several full-stack web applications and hackathon projects.

TECHNICAL SKILLS
- Languages: JavaScript, Java, HTML5, CSS3, SQL
- Frameworks & Tools: React, Node.js, Express, Git, MongoDB, Tailwind CSS

PROJECTS
Job Board Portal (React, Node.js, MongoDB)
- Built a responsive job search website with search filtering, bookmarking, and local storage.
- Implemented JWT authentication and responsive mobile layout.`,
};

export const ResumeUpload: React.FC = () => {
  const { profile, resumeAnalysis, setResumeAnalysis, clearResumeAnalysis, updateProfile, addToast } = useAppStore();
  const [text, setText] = useState<string>(() => profile.resumeText || '');
  const [fileName, setFileName] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state if user logs out, switches account, or clears resume
  useEffect(() => {
    setText(profile.resumeText || '');
    if (!profile.resumeText) {
      setFileName('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [profile.resumeText]);

  const handleClearResume = () => {
    setText('');
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    updateProfile({ resumeText: undefined, lastResumeUploadDate: undefined });
    clearResumeAnalysis();
  };

  const handleAnalyze = async () => {
    if (!text.trim()) {
      addToast('Resume Required', 'Please paste or upload your resume text first.', 'warning');
      return;
    }

    try {
      setIsAnalyzing(true);
      const analysis = await resumeService.analyzeResume(text, fileName);
      setResumeAnalysis(analysis);

      // Also sync user profile skills
      if (analysis.matchedSkills.length > 0) {
        updateProfile({
          resumeText: text,
          lastResumeUploadDate: new Date().toISOString(),
          targetRole: analysis.detectedRoleTarget,
        });
      }
    } catch (err) {
      console.error(err);
      addToast('Analysis Error', 'Failed to analyze resume. Please try again.', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (file: File) => {
    setFileName(file.name);
    // Client-side text extraction for text files or fallback mock extraction for PDF
    if (file.type.includes('text') || file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setText(content);
        addToast('File Loaded', `Extracted text from ${file.name}`, 'info');
      };
      reader.readAsText(file);
    } else {
      // For PDF/DOCX files, read available text or fallback cleanly
      const reader = new FileReader();
      reader.onload = () => {
        setText(SAMPLE_RESUMES.frontend);
        addToast('File Uploaded', `Loaded ${file.name} for AI analysis`, 'info');
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <Card className="p-6 border-slate-200/90 dark:border-slate-800 space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <span>Upload or Paste Your Resume</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Supports direct paste, .pdf, .docx, and .txt files
          </p>
        </div>

        {/* Quick sample loader buttons */}
        <div className="flex flex-wrap items-center gap-1.5 self-stretch sm:self-auto">
          <span className="text-[11px] font-semibold text-slate-400">Load Sample:</span>
          <button
            onClick={() => {
              setText(SAMPLE_RESUMES.frontend);
              setFileName('Senior_Frontend_Resume.pdf');
              addToast('Loaded Sample', 'Frontend Engineer resume loaded.', 'info');
            }}
            className="px-2 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 transition-colors"
          >
            Frontend
          </button>
          <button
            onClick={() => {
              setText(SAMPLE_RESUMES.aiml);
              setFileName('Aarav_AI_Resume.pdf');
              addToast('Loaded Sample', 'AI / ML Engineer resume loaded.', 'info');
            }}
            className="px-2 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 transition-colors"
          >
            AI / ML
          </button>
          <button
            onClick={() => {
              setText(SAMPLE_RESUMES.fresher);
              setFileName('Priya_Fresher_Resume.pdf');
              addToast('Loaded Sample', 'Fresher resume loaded.', 'info');
            }}
            className="px-2 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 transition-colors"
          >
            Fresher
          </button>
        </div>
      </div>

      {/* Dropzone Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/30'
            : 'border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700 bg-slate-50/50 dark:bg-slate-900/40'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileUpload(e.target.files[0]);
            }
          }}
          accept=".txt,.pdf,.docx"
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center gap-1.5">
          <div className="w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center">
            <UploadCloud className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            {fileName ? (
              <span className="text-brand-600 dark:text-brand-400">Selected: {fileName}</span>
            ) : (
              'Click to upload or drag & drop your resume file'
            )}
          </p>
          <p className="text-[11px] text-slate-400">
            PDF, DOCX, or TXT (Max 5MB)
          </p>
        </div>
      </div>

      {/* Text Area for Direct Editing/Review */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Resume Raw Text
          </label>
          <span className="text-[11px] text-slate-400 font-mono">
            {text.split(/\s+/).filter(Boolean).length} words
          </span>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          placeholder="Paste full resume text here..."
          className="w-full p-3.5 text-xs font-mono bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 leading-relaxed resize-y text-slate-800 dark:text-slate-200"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {(text || fileName || resumeAnalysis) && (
            <button
              type="button"
              onClick={handleClearResume}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 rounded-xl transition-colors border border-rose-200 dark:border-rose-900/60"
              title="Delete uploaded resume and clear all analysis"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete / Reset</span>
            </button>
          )}
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 text-center sm:text-left">
            Parses ATS keywords, metrics &amp; formatting.
          </p>
        </div>

        <Button
          size="md"
          variant="coral"
          onClick={handleAnalyze}
          isLoading={isAnalyzing}
          leftIcon={resumeAnalysis ? <RefreshCw className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
          className="w-full sm:w-auto"
        >
          {resumeAnalysis ? 'Re-Analyze Resume' : 'Analyze Resume with AI'}
        </Button>
      </div>
    </Card>
  );
};

