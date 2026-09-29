'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/context';
import {
  FolderGit2,
  Search,
  BookOpen,
  FileCheck,
  AlertTriangle,
  Layers,
  Sparkles,
  ExternalLink,
  Award,
  CheckCircle2,
  Copy,
  Clock,
  ArrowRight,
  ShieldCheck,
  Scale
} from 'lucide-react';

interface SourceDocument {
  id: string;
  sha256: string;
  canonicalName: string;
  fileType: string;
  sizeBytes: number;
  pageCount: number | null;
  isScanned: boolean;
  author: string | null;
  institution: string | null;
  academicPeriod: string | null;
  primaryRole: string;
  authority: string;
  verificationLevel: string;
  whyThisSource: string | null;
  qualityMetrics: string | null;
  locations: Array<{
    id: string;
    repositoryId: string;
    relativePath: string;
    fullPath: string;
    isCanonical: boolean;
    repository: {
      name: string;
      role: string;
      rootPath: string;
    };
  }>;
  problems: any[];
}

interface SourceConflict {
  id: string;
  topic: string;
  description: string;
  resolutionStatus: string;
  resolutionNotes: string | null;
}

export default function SourcesPage() {
  const { language } = useLanguage();
  const [documents, setDocuments] = useState<SourceDocument[]>([]);
  const [conflicts, setConflicts] = useState<SourceConflict[]>([]);
  const [stats, setStats] = useState({
    totalCanonicalDocuments: 0,
    primarySources: 0,
    examPapers: 0,
    exactDuplicateClusters: 339,
    conflictsCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [searching, setSearching] = useState(false);

  // Comparison Modal state
  const [compareSourceA, setCompareSourceA] = useState<SourceDocument | null>(null);
  const [compareSourceB, setCompareSourceB] = useState<SourceDocument | null>(null);
  const [showCompareModal, setShowCompareModal] = useState(false);

  useEffect(() => {
    fetchSources();
  }, [activeTab]);

  const fetchSources = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/sources?role=${activeTab}`);
      const data = await res.json();
      if (data.success) {
        setDocuments(data.documents);
        setStats(data.stats);
        setConflicts(data.conflicts || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`/api/sources/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.success) {
        setSearchResults(data.result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSearching(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const tabs = [
    { id: 'ALL', label: 'Tüm Kaynaklar' },
    { id: 'PRIMARY', label: 'Birincil Kaynaklar (Primary)' },
    { id: 'EXAMS', label: 'Sınav Arşivi (Exams)' },
    { id: 'SUPPORTING', label: 'Destekleyici Notlar' },
    { id: 'DUPLICATES', label: 'Tekilleştirme (339 Duplicates)' },
    { id: 'CONFLICTS', label: 'Çakışmalar & Boşluklar' },
    { id: 'NEEDS_REVIEW', label: 'İnceleme Gerektirenler' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-academic-200 dark:border-academic-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              ESOGÜ LİSANS ARŞİVİ
            </span>
            <span className="text-xs text-academic-500 font-mono">
              Master: D:\Belgeler\Ders | Supplemental: C:\Desktop\2.sınıf Güz
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-academic-900 dark:text-academic-50 mt-1">
            Akademik Kaynak Kütüphanesi & Provenance
          </h1>
          <p className="text-academic-600 dark:text-academic-400 text-sm mt-1 max-w-2xl">
            Axiom'un eğitim ve pratik içerikleri, Eskişehir Osmangazi Üniversitesi resmi öğretim üyesi notlarına ve sınav arşivine dayanır. Akademik otorite ile matematiksel doğrulama birbirinden kesin olarak ayrılmıştır.
          </p>
        </div>

        {/* Global Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg border border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-900/40 text-center">
            <div className="text-xs text-academic-500 font-mono">Tekil Belgeler</div>
            <div className="text-xl font-bold text-academic-900 dark:text-academic-100">{stats.totalCanonicalDocuments}</div>
          </div>
          <div className="p-3 rounded-lg border border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-900/40 text-center">
            <div className="text-xs text-academic-500 font-mono">Primary Otorite</div>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{stats.primarySources}</div>
          </div>
          <div className="p-3 rounded-lg border border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-900/40 text-center">
            <div className="text-xs text-academic-500 font-mono">Gerçek Sınav</div>
            <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{stats.examPapers}</div>
          </div>
          <div className="p-3 rounded-lg border border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-900/40 text-center">
            <div className="text-xs text-academic-500 font-mono">Deduplicate</div>
            <div className="text-xl font-bold text-amber-600 dark:text-amber-400">339 Küme</div>
          </div>
        </div>
      </div>

      {/* Search Engine */}
      <div className="p-6 rounded-xl border border-academic-200 dark:border-academic-800 bg-academic-50 dark:bg-academic-900/30">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-3 text-academic-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Konu, formül veya teorem arayın (örn: Laplace transform, Euler graph, Bernoulli, Cache, Eigenvalues)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-academic-300 dark:border-academic-700 bg-white dark:bg-academic-900 text-academic-900 dark:text-academic-100 placeholder-academic-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-academic-950 font-semibold text-sm rounded-lg transition-colors flex items-center gap-2"
          >
            {searching ? 'Aranıyor...' : 'Kaynaklarda Ara'}
          </button>
        </form>

        {/* Search Results Display */}
        {searchResults && (
          <div className="mt-4 p-4 rounded-lg bg-white dark:bg-academic-900 border border-academic-200 dark:border-academic-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${searchResults.hasDirectSource ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-orange-500/10 text-orange-600 border border-orange-500/20'}`}>
                {searchResults.hasDirectSource ? 'ESOGÜ AKADEMİK KAYNAK MEVCUT' : 'SUPPLEMENTARY / HARİCİ REFERANS'}
              </span>
              <button onClick={() => setSearchResults(null)} className="text-xs text-academic-400 hover:underline">
                Temizle
              </button>
            </div>
            <p className="text-xs text-academic-600 dark:text-academic-400 font-mono">
              {searchResults.statusMessage}
            </p>

            {searchResults.concept && (
              <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 space-y-1">
                <div className="text-xs font-mono text-amber-600 dark:text-amber-400 font-bold">
                  {searchResults.concept.courseName || 'Kavram'}: {searchResults.concept.name}
                </div>
                <div className="text-sm font-serif text-academic-800 dark:text-academic-200">
                  {searchResults.concept.formalStatement}
                </div>
                {searchResults.concept.canonicalFormula && (
                  <div className="text-xs font-mono text-academic-600 dark:text-academic-400 bg-white dark:bg-academic-950 p-2 rounded">
                    Formül: {searchResults.concept.canonicalFormula}
                  </div>
                )}
                <div className="pt-2">
                  <Link
                    href={`/learn?concept=${searchResults.concept.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:underline"
                  >
                    Bu Konuyu Öğrenme Modunda Başlat <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}

            {searchResults.examProblems?.length > 0 && (
              <div className="space-y-1 pt-1">
                <div className="text-xs font-mono text-academic-500 font-bold">Eşleşen Gerçek Sınav Soruları:</div>
                {searchResults.examProblems.map((p: any) => (
                  <div key={p.id} className="p-2 rounded bg-academic-100 dark:bg-academic-950 text-xs font-mono text-academic-700 dark:text-academic-300">
                    <span className="font-bold text-blue-500">[{p.year ? `${p.year} ${p.examType || 'Sınav'}` : 'Sınav'} - {p.location}]</span> {p.prompt}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-academic-200 dark:border-academic-800 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-amber-500 text-academic-950 font-bold'
                : 'text-academic-600 dark:text-academic-400 hover:bg-academic-100 dark:hover:bg-academic-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conflicts & Gaps Tab View */}
      {activeTab === 'CONFLICTS' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-orange-500/20 bg-orange-500/5 space-y-2">
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Akademik Kaynak Çakışma & Kapsam Raporu</span>
            </div>
            <p className="text-xs text-academic-600 dark:text-academic-400">
              Axiom, eksik veya çelişkili kaynakları gizlemez. Bir dersin resmi notu eksikse bunu harici referanslarla etiketleyerek ayrıştırır.
            </p>
          </div>

          <div className="grid gap-4">
            {conflicts.map((c) => (
              <div key={c.id} className="p-4 rounded-xl border border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-900 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-academic-900 dark:text-academic-100">{c.topic}</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold border border-emerald-500/20">
                    {c.resolutionStatus}
                  </span>
                </div>
                <p className="text-xs text-academic-600 dark:text-academic-400">{c.description}</p>
                {c.resolutionNotes && (
                  <div className="text-xs font-mono p-2 rounded bg-academic-50 dark:bg-academic-950 text-academic-700 dark:text-academic-300">
                    <strong>Çözüm Kararı:</strong> {c.resolutionNotes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Duplicates Tab View */}
      {activeTab === 'DUPLICATES' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-2">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
              <Layers className="w-4 h-4" />
              <span>Deduplication & Multi-Location Mimari</span>
            </div>
            <p className="text-xs text-academic-600 dark:text-academic-400">
              Repository 1 (Desktop) ile Repository 2 (D:\Belgeler\Ders) arasında tespit edilen <strong>339 exact duplicate</strong> dosya veritabanında fiziksel olarak tekrarlanmamış; 1 canonical SourceDocument altında çoklu <code>SourceLocation</code> olarak kaydedilmiştir.
            </p>
          </div>

          <div className="grid gap-3">
            {documents.filter(d => d.locations.length > 1).map((d) => (
              <div key={d.id} className="p-4 rounded-xl border border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-900 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-mono text-sm font-bold text-academic-900 dark:text-academic-100">{d.canonicalName}</div>
                  <span className="text-xs font-mono text-academic-400">SHA: {d.sha256.substring(0, 16)}...</span>
                </div>
                <div className="space-y-1">
                  {d.locations.map(loc => (
                    <div key={loc.id} className="flex items-center gap-2 text-xs font-mono">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${loc.isCanonical ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                        {loc.isCanonical ? 'MASTER (Repo 2)' : 'ACTIVE COPY (Repo 1)'}
                      </span>
                      <span className="text-academic-500">{loc.fullPath}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Documents Grid */}
      {activeTab !== 'CONFLICTS' && activeTab !== 'DUPLICATES' && (
        <div className="grid gap-4">
          {loading ? (
            <div className="text-center py-12 text-academic-500 font-mono text-sm">Kaynaklar yükleniyor...</div>
          ) : documents.length === 0 ? (
            <div className="text-center py-12 text-academic-500 font-mono text-sm">Bu filtreye uygun kaynak bulunamadı.</div>
          ) : (
            documents.map((doc) => (
              <div
                key={doc.id}
                className="p-5 rounded-xl border border-academic-200 dark:border-academic-800 bg-white dark:bg-academic-900/60 hover:border-academic-300 dark:hover:border-academic-700 transition-all space-y-3"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                      doc.primaryRole.includes('PRIMARY') ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                      doc.primaryRole === 'EXAM_PAPER' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20' :
                      doc.primaryRole === 'REFERENCE' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20' :
                      'bg-academic-200 dark:bg-academic-800 text-academic-600'
                    }`}>
                      {doc.primaryRole}
                    </span>
                    <span className="text-xs font-mono text-academic-500">
                      {doc.academicPeriod || 'Lisans'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="px-2 py-0.5 rounded bg-academic-100 dark:bg-academic-800 text-academic-600 dark:text-academic-300 font-medium">
                      Otorite: {doc.authority}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-academic-100 dark:bg-academic-800 text-academic-600 dark:text-academic-300 font-medium">
                      Doğrulama: {doc.verificationLevel}
                    </span>
                    <button
                      onClick={() => {
                        if (!compareSourceA) {
                          setCompareSourceA(doc);
                        } else if (!compareSourceB && compareSourceA.id !== doc.id) {
                          setCompareSourceB(doc);
                          setShowCompareModal(true);
                        }
                      }}
                      className="px-2 py-0.5 rounded border border-academic-300 dark:border-academic-700 hover:bg-academic-100 dark:hover:bg-academic-800 text-academic-600 dark:text-academic-400 flex items-center gap-1"
                    >
                      <Scale className="w-3 h-3" />
                      {compareSourceA?.id === doc.id ? 'Seçildi (A)' : 'Karşılaştır'}
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-serif font-bold text-academic-900 dark:text-academic-100">
                    {doc.canonicalName}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-academic-500 font-mono mt-0.5">
                    {doc.author && <span>Yazar: <strong>{doc.author}</strong></span>}
                    <span>•</span>
                    <span>Kurum: {doc.institution}</span>
                    <span>•</span>
                    <span>Tür: {doc.fileType.toUpperCase()} ({formatFileSize(doc.sizeBytes)}{doc.pageCount ? `, ${doc.pageCount} sayfa` : ''})</span>
                  </div>
                </div>

                {/* "Why This Source?" Card */}
                {doc.whyThisSource && (
                  <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 text-xs space-y-1">
                    <div className="font-mono font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5" />
                      Neden Bu Kaynak? (Why This Source?)
                    </div>
                    <p className="text-academic-700 dark:text-academic-300 leading-relaxed">
                      {doc.whyThisSource}
                    </p>
                  </div>
                )}

                {/* Locations footer */}
                <div className="pt-2 border-t border-academic-100 dark:border-academic-800/60 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-academic-500">
                  <div className="flex items-center gap-2">
                    <span>Fiziksel Konum:</span>
                    {doc.locations.map(loc => (
                      <span key={loc.id} className="text-academic-400 bg-academic-100 dark:bg-academic-950 px-2 py-0.5 rounded">
                        {loc.repositoryId === 'repo-master' ? 'Master Archive' : 'Active Semester'}: {loc.relativePath}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Comparison Modal */}
      {showCompareModal && compareSourceA && compareSourceB && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-academic-900 border border-academic-200 dark:border-academic-800 rounded-2xl max-w-4xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-academic-200 dark:border-academic-800 pb-4">
              <div>
                <h2 className="text-xl font-serif font-bold text-academic-900 dark:text-academic-100 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-amber-500" />
                  Akademik Kaynak Karşılaştırma Matrisi
                </h2>
                <p className="text-xs text-academic-500 font-mono mt-0.5">
                  İki kaynağın pedagojik ve bilimsel uygunluk kriterleri karşılaştırması
                </p>
              </div>
              <button
                onClick={() => {
                  setShowCompareModal(false);
                  setCompareSourceA(null);
                  setCompareSourceB(null);
                }}
                className="text-xs font-mono px-3 py-1.5 rounded-lg bg-academic-100 dark:bg-academic-800 text-academic-600 hover:bg-academic-200"
              >
                Kapat
              </button>
            </div>

            {/* Comparison Table */}
            <div className="border border-academic-200 dark:border-academic-800 rounded-xl overflow-hidden text-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-academic-50 dark:bg-academic-950 text-xs font-mono text-academic-500 border-b border-academic-200 dark:border-academic-800">
                    <th className="p-3 w-1/4">Kriter</th>
                    <th className="p-3 w-3/8 text-amber-600 dark:text-amber-400 font-bold">{compareSourceA.canonicalName}</th>
                    <th className="p-3 w-3/8 text-blue-600 dark:text-blue-400 font-bold">{compareSourceB.canonicalName}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-academic-200 dark:divide-academic-800 text-xs">
                  <tr>
                    <td className="p-3 font-semibold font-mono text-academic-600">Akademik Otorite (Authority)</td>
                    <td className="p-3 font-medium">{compareSourceA.authority} ({compareSourceA.author || 'Anonim'})</td>
                    <td className="p-3 font-medium">{compareSourceB.authority} ({compareSourceB.author || 'Anonim'})</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold font-mono text-academic-600">Birincil Rol (Role)</td>
                    <td className="p-3">{compareSourceA.primaryRole}</td>
                    <td className="p-3">{compareSourceB.primaryRole}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold font-mono text-academic-600">Kapsam ve Format (Coverage)</td>
                    <td className="p-3">{compareSourceA.pageCount ? `${compareSourceA.pageCount} sayfa` : 'Dosya'} ({compareSourceA.fileType})</td>
                    <td className="p-3">{compareSourceB.pageCount ? `${compareSourceB.pageCount} sayfa` : 'Dosya'} ({compareSourceB.fileType})</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold font-mono text-academic-600">Doğrulama Düzeyi (Verification)</td>
                    <td className="p-3 font-mono text-emerald-600 font-bold">{compareSourceA.verificationLevel}</td>
                    <td className="p-3 font-mono text-emerald-600 font-bold">{compareSourceB.verificationLevel}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold font-mono text-academic-600">Neden Seçilmeli?</td>
                    <td className="p-3 text-academic-700 dark:text-academic-300">{compareSourceA.whyThisSource || '-'}</td>
                    <td className="p-3 text-academic-700 dark:text-academic-300">{compareSourceB.whyThisSource || '-'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
