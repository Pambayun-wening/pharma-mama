import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Search,
  Filter,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Beaker,
  FileText,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { ExcipientMonograph, ExcipientCategory } from '../types/game';
import { EXCIPIENTS_DATABASE } from '../data/excipients';
import { APIS_DATABASE } from '../data/apis';
import { COMPATIBILITY_DATABASE } from '../data/compatibility';
import { SCIENTIFIC_REFERENCES } from '../data/references';
import { soundEngine } from '../services/soundEngine';

interface KnowledgeBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialExcipientId?: string;
}

export const KnowledgeBookModal: React.FC<KnowledgeBookModalProps> = ({
  isOpen,
  onClose,
  initialExcipientId,
}) => {
  if (!isOpen) return null;

  // Active Main Tab
  const [activeTab, setActiveTab] = useState<'excipients' | 'apis' | 'matrix' | 'principles' | 'references'>(
    'excipients'
  );

  // Search filter
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Currently selected excipient to view in detail
  const [selectedExcipientId, setSelectedExcipientId] = useState<string>(
    initialExcipientId || 'mcc'
  );

  // Excipients list
  const excipientsList = Object.values(EXCIPIENTS_DATABASE);
  const categoriesList = ['All', 'Diluent', 'Binder', 'Disintegrant', 'Lubricant', 'Glidant', 'Acidifying Agent', 'Alkalizing Agent', 'Suspending Agent', 'Wetting Agent'];

  const filteredExcipients = excipientsList.filter((exc) => {
    const matchesSearch =
      exc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exc.synonyms.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      exc.primaryFunction.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat =
      categoryFilter === 'All' || exc.categories.includes(categoryFilter as ExcipientCategory);
    return matchesSearch && matchesCat;
  });

  const selectedExc = EXCIPIENTS_DATABASE[selectedExcipientId] || excipientsList[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-pop-in">
      <div className="relative w-full max-w-5xl h-[90vh] bg-white rounded-3xl border-4 border-teal-300 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 p-4 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-yellow-200" />
            <div>
              <h2 className="text-lg sm:text-2xl font-bubble font-bold tracking-wide leading-tight">
                Handbook of Pharmaceutical Excipients (HOPE)
              </h2>
              <p className="text-xs text-teal-100 font-medium">
                Scientific Formulation Compendium &amp; Compatibility Reference Library
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundEngine.playPop();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-white/20 transition-all text-white cursor-pointer active:scale-90"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-teal-50/80 px-4 py-2 border-b border-teal-200 flex items-center gap-1.5 overflow-x-auto custom-scrollbar flex-shrink-0">
          <button
            onClick={() => {
              soundEngine.playPop();
              setActiveTab('excipients');
            }}
            className={`px-3.5 py-1.5 rounded-xl font-bubble text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'excipients'
                ? 'bg-teal-600 text-white shadow-mama-sm'
                : 'text-teal-900 hover:bg-teal-100'
            }`}
          >
            Excipient Monographs
          </button>

          <button
            onClick={() => {
              soundEngine.playPop();
              setActiveTab('apis');
            }}
            className={`px-3.5 py-1.5 rounded-xl font-bubble text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'apis'
                ? 'bg-teal-600 text-white shadow-mama-sm'
                : 'text-teal-900 hover:bg-teal-100'
            }`}
          >
            API Monographs
          </button>

          <button
            onClick={() => {
              soundEngine.playPop();
              setActiveTab('matrix');
            }}
            className={`px-3.5 py-1.5 rounded-xl font-bubble text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'matrix'
                ? 'bg-teal-600 text-white shadow-mama-sm'
                : 'text-teal-900 hover:bg-teal-100'
            }`}
          >
            Compatibility Matrix
          </button>

          <button
            onClick={() => {
              soundEngine.playPop();
              setActiveTab('principles');
            }}
            className={`px-3.5 py-1.5 rounded-xl font-bubble text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'principles'
                ? 'bg-teal-600 text-white shadow-mama-sm'
                : 'text-teal-900 hover:bg-teal-100'
            }`}
          >
            Formulation Principles
          </button>

          <button
            onClick={() => {
              soundEngine.playPop();
              setActiveTab('references');
            }}
            className={`px-3.5 py-1.5 rounded-xl font-bubble text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'references'
                ? 'bg-teal-600 text-white shadow-mama-sm'
                : 'text-teal-900 hover:bg-teal-100'
            }`}
          >
            HOPE References &amp; Citations
          </button>
        </div>

        {/* Tab 1: Excipient Monographs */}
        {activeTab === 'excipients' && (
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 min-h-0 overflow-hidden">
            {/* Left Column: Filterable List (4 Cols) */}
            <div className="md:col-span-4 border-r border-slate-200 p-3 sm:p-4 flex flex-col min-h-0 bg-slate-50/60">
              {/* Search Bar */}
              <div className="relative mb-2">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search excipients, synonyms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex gap-1 overflow-x-auto pb-2 mb-2 custom-scrollbar flex-shrink-0">
                {categoriesList.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
                      categoryFilter === cat
                        ? 'bg-teal-600 text-white'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Scrollable list */}
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1.5 pr-1">
                {filteredExcipients.map((exc) => {
                  const isSelected = selectedExcipientId === exc.id;
                  return (
                    <button
                      key={exc.id}
                      onClick={() => {
                        soundEngine.playPop();
                        setSelectedExcipientId(exc.id);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col ${
                        isSelected
                          ? 'bg-teal-50 border-teal-400 shadow-sm'
                          : 'bg-white hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="font-bubble text-xs font-bold text-slate-800 truncate">
                          {exc.name}
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${exc.colorTag}`}>
                          {exc.categories[0]}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">{exc.primaryFunction}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Full Detailed HOPE Monograph (8 Cols) */}
            <div className="md:col-span-8 p-5 sm:p-6 overflow-y-auto custom-scrollbar space-y-4">
              {selectedExc ? (
                <div className="space-y-4">
                  {/* Monograph Title Header */}
                  <div className="border-b pb-3">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-300">
                        HOPE {selectedExc.hopeReference.edition} (pp. {selectedExc.hopeReference.page})
                      </span>
                      <div className="flex items-center gap-1">
                        {selectedExc.categories.map((c) => (
                          <span
                            key={c}
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bubble font-black text-slate-800">
                      {selectedExc.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      <strong>Synonyms:</strong> {selectedExc.synonyms.join(', ')}
                    </p>
                  </div>

                  {/* Primary Description */}
                  <div>
                    <h4 className="font-bubble text-xs font-bold uppercase tracking-wider text-teal-700 mb-1">
                      Description &amp; Physicochemical Properties
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      {selectedExc.description}
                    </p>
                  </div>

                  {/* Physical Properties Table */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="font-bold text-slate-500 block mb-0.5">Appearance:</span>
                      <span className="text-slate-800">{selectedExc.physicalProperties.appearance}</span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="font-bold text-slate-500 block mb-0.5">Solubility:</span>
                      <span className="text-slate-800">{selectedExc.physicalProperties.solubility}</span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="font-bold text-slate-500 block mb-0.5">Flowability:</span>
                      <span className="text-slate-800">{selectedExc.physicalProperties.flowability}</span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <span className="font-bold text-slate-500 block mb-0.5">Hygroscopicity:</span>
                      <span className="text-slate-800">{selectedExc.physicalProperties.hygroscopicity}</span>
                    </div>
                  </div>

                  {/* Typical Pharmaceutical Uses */}
                  <div>
                    <h4 className="font-bubble text-xs font-bold uppercase tracking-wider text-teal-700 mb-1">
                      Typical Applications &amp; Concentrations in Formulations
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {selectedExc.typicalConcentrations.map((tc, idx) => (
                        <div key={idx} className="flex justify-between p-2 rounded-xl bg-teal-50/60 border border-teal-200">
                          <span className="font-bold text-teal-900">{tc.use}:</span>
                          <span className="font-mono text-teal-700 font-bold">{tc.range}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CRITICAL: Known Incompatibilities */}
                  <div className="bg-rose-50 p-4 rounded-2xl border-2 border-rose-200">
                    <h4 className="font-bubble text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5 mb-2">
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      Known Incompatibilities (HOPE Monograph)
                    </h4>
                    <ul className="space-y-1.5 text-xs text-rose-900 list-disc list-inside">
                      {selectedExc.knownIncompatibilities.map((incomp, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {incomp}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Formulation Considerations */}
                  <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200">
                    <h4 className="font-bubble text-xs font-bold uppercase tracking-wider text-amber-900 mb-1">
                      Formulation &amp; Compounding Considerations
                    </h4>
                    <p className="text-xs text-amber-900 leading-relaxed">
                      {selectedExc.formulationConsiderations}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* Tab 2: API Monographs */}
        {activeTab === 'apis' && (
          <div className="p-6 overflow-y-auto custom-scrollbar space-y-4">
            <h3 className="font-bubble text-lg font-bold text-slate-800">
              Active Pharmaceutical Ingredients (APIs) Compendium
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.values(APIS_DATABASE).map((api) => (
                <div key={api.id} className="bg-slate-50 p-4 rounded-3xl border-2 border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bubble text-base font-bold text-slate-800">{api.name}</h4>
                    <span className="text-[10px] font-bold bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full border border-pink-300">
                      {api.bcsClass}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">{api.structureDescription}</p>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                    <span className="font-bold text-slate-500 block">Stability &amp; Degradation Concerns:</span>
                    <ul className="list-disc list-inside space-y-1 text-slate-700">
                      {api.stabilityConcerns.map((sc, idx) => (
                        <li key={idx} className="text-[11px] leading-snug">{sc}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900">
                    <strong>Formulation Challenge:</strong> {api.formulationChallenges}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Compatibility Matrix */}
        {activeTab === 'matrix' && (
          <div className="p-6 overflow-y-auto custom-scrollbar space-y-4">
            <h3 className="font-bubble text-lg font-bold text-slate-800">
              Interactive Pharmaceutical Compatibility Database
            </h3>
            <p className="text-xs text-slate-600">
              Predefined compatibility evaluations based on peer-reviewed solid-state degradation chemistry.
            </p>

            <div className="space-y-3">
              {COMPATIBILITY_DATABASE.map((record) => (
                <div key={record.id} className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-bubble font-bold text-sm text-slate-800">
                      {record.itemAName} + {record.itemBName}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-lg">
                        {record.interactionType}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                          record.status === 'Generally compatible'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : record.status === 'Condition-dependent compatibility'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-rose-100 text-rose-800 border-rose-300'
                        }`}
                      >
                        {record.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{record.scientificExplanation}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                    <div className="bg-amber-50 p-2 rounded-xl text-amber-900">
                      <strong>Conditions:</strong> {record.formulationConditions}
                    </div>
                    <div className="bg-teal-50 p-2 rounded-xl text-teal-900">
                      <strong>Recommendation:</strong> {record.practicalRecommendation}
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400 pt-1">
                    Citation: {record.supportingReference.sourceTitle} (Edition: {record.supportingReference.edition}, p. {record.supportingReference.page}).
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Formulation Principles */}
        {activeTab === 'principles' && (
          <div className="p-6 overflow-y-auto custom-scrollbar space-y-4 text-xs text-slate-700">
            <h3 className="font-bubble text-lg font-bold text-slate-800">
              Core Formulation Science Principles
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-pink-50/60 p-4 rounded-3xl border-2 border-pink-200 space-y-2">
                <h4 className="font-bubble text-sm font-bold text-pink-900">
                  1. The Maillard Reaction in Solid Dosage Forms
                </h4>
                <p className="leading-relaxed">
                  Reducing sugars (like Lactose) possess a free open-chain aldehyde group that reacts with primary or secondary aliphatic/aromatic amines to form an N-glycosylamine, followed by an Amadori rearrangement and polymer condensation to dark brown melanoidin pigments. Non-reducing polyols (like Mannitol) or pure MCC do not undergo this degradation pathway.
                </p>
              </div>

              <div className="bg-blue-50/60 p-4 rounded-3xl border-2 border-blue-200 space-y-2">
                <h4 className="font-bubble text-sm font-bold text-blue-900">
                  2. Lubricant Sensitivity &amp; Over-Blending
                </h4>
                <p className="leading-relaxed">
                  Magnesium stearate consists of lamellar crystallites. As blending shear is prolonged past 3–5 minutes, these sheets continuously delaminate and coat disintegrant pores and drug particles with a monomolecular hydrophobic film. This severely impedes water penetration, causing tablet disintegration failure and delayed dissolution.
                </p>
              </div>

              <div className="bg-amber-50/60 p-4 rounded-3xl border-2 border-amber-200 space-y-2">
                <h4 className="font-bubble text-sm font-bold text-amber-900">
                  3. Effervescent Tablet Moisture Dynamics
                </h4>
                <p className="leading-relaxed">
                  Effervescence relies on the stoichiometric reaction between an organic acid (Citric acid) and a basic carbonate (Sodium bicarbonate). Because the reaction generates water as a product (C6H8O7 + 3 NaHCO3 -&gt; Na3C6H5O7 + 3 H2O + 3 CO2), any trace moisture in processing triggers an autocatalytic breakdown chain. Cleanroom relative humidity must be maintained strictly below 25% RH.
                </p>
              </div>

              <div className="bg-emerald-50/60 p-4 rounded-3xl border-2 border-emerald-200 space-y-2">
                <h4 className="font-bubble text-sm font-bold text-emerald-900">
                  4. Oral Suspensions &amp; Stokes' Law
                </h4>
                <p className="leading-relaxed">
                  Sedimentation velocity of insoluble particles is governed by Stokes' Law: v = [2r²(ρp - ρm)g] / (9η). By using shear-thinning polymers like Xanthan gum, the medium viscosity η at rest is very high, keeping particles suspended indefinitely without dense caking, while dropping sharply upon shaking for easy administration.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: HOPE References & Citations */}
        {activeTab === 'references' && (
          <div className="p-6 overflow-y-auto custom-scrollbar space-y-4">
            <h3 className="font-bubble text-lg font-bold text-slate-800">
              Verified Scientific References &amp; Bibliographies
            </h3>
            <p className="text-xs text-slate-600">
              Transparency statement: All excipient monographs and compatibility interactions within Pharma Mama are traced directly to established pharmaceutical reference compendia.
            </p>

            <div className="space-y-3">
              {Object.values(SCIENTIFIC_REFERENCES).map((ref) => (
                <div key={ref.id} className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bubble font-bold text-slate-800 text-sm">{ref.title}</h4>
                    {ref.edition && (
                      <span className="font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full border border-teal-300">
                        {ref.edition}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600">
                    <strong>Authors/Editors:</strong> {ref.authors} ({ref.year})
                  </p>
                  <p className="text-slate-500 mt-0.5">
                    <strong>Publisher:</strong> {ref.publisher} {ref.isbn && `| ISBN: ${ref.isbn}`}
                  </p>
                  <p className="text-[11px] text-teal-800 mt-2 bg-teal-50/80 p-2 rounded-xl border border-teal-200">
                    {ref.notes}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t-2 border-slate-200 flex justify-end flex-shrink-0">
          <button
            onClick={() => {
              soundEngine.playPop();
              onClose();
            }}
            className="px-6 py-2 btn-mama btn-mama-white font-bubble text-sm"
          >
            Close Knowledge Book
          </button>
        </div>
      </div>
    </div>
  );
};
