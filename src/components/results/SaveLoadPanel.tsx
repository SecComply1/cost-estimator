"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, FolderOpen, Trash2, ChevronDown, ChevronUp, Check } from "lucide-react";
import { EstimatorInput, EstimatorOutput, EstimateMetadata } from "@/types";
import Button from "@/components/ui/Button";
import { useEstimatorStore } from "@/store/estimator";
import { useRouter } from "next/navigation";
import frameworksData from "@/config/frameworks.json";

interface SavedEstimate {
  id: string;
  timestamp: number;
  prospectName: string;
  frameworks: string[];
  input: EstimatorInput;
  output: EstimatorOutput;
  metadata: EstimateMetadata;
  marginAdjustment: { margin: number; discount: number };
}

const STORAGE_KEY = "seccomply_estimates";
const MAX_SAVED = 50;

function loadSavedEstimates(): SavedEstimate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedEstimate[];
  } catch {
    return [];
  }
}

function persistEstimates(estimates: SavedEstimate[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(estimates));
}

function getFrameworkName(id: string) {
  return frameworksData.frameworks.find((f) => f.id === id)?.name ?? id;
}

interface SaveLoadPanelProps {
  input: EstimatorInput;
  output: EstimatorOutput;
  metadata: EstimateMetadata;
  marginAdjustment: { margin: number; discount: number };
}

const SaveLoadPanel = ({ input, output, metadata, marginAdjustment }: SaveLoadPanelProps) => {
  const router = useRouter();
  const { updateFormData, setStep, resetForm } = useEstimatorStore();
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [estimates, setEstimates] = useState<SavedEstimate[]>([]);

  useEffect(() => {
    setEstimates(loadSavedEstimates());
  }, []);

  const handleSave = () => {
    const existing = loadSavedEstimates();
    const newEntry: SavedEstimate = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: Date.now(),
      prospectName: metadata.prospectName || "Unknown Prospect",
      frameworks: input.selectedFrameworks,
      input,
      output,
      metadata,
      marginAdjustment,
    };

    // Prepend and keep max 50, pruning oldest
    const updated = [newEntry, ...existing].slice(0, MAX_SAVED);
    persistEstimates(updated);
    setEstimates(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLoad = (estimate: SavedEstimate) => {
    resetForm();
    // Pre-fill the store with saved input
    updateFormData(estimate.input);
    // Store the saved output in sessionStorage
    sessionStorage.setItem("estimator-result", JSON.stringify(estimate.output));
    // Navigate to results
    router.push("/results");
  };

  const handleDelete = (id: string) => {
    const updated = estimates.filter((e) => e.id !== id);
    persistEstimates(updated);
    setEstimates(updated);
  };

  const formatDate = (ts: number) =>
    new Date(ts).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-[#111827] border border-[#1E293B] rounded-xl p-5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Save className="w-5 h-5 text-[#3B82F6]" />
          <h3 className="font-jetbrains font-bold text-[#F1F5F9]">Saved Estimates</h3>
          {estimates.length > 0 && (
            <span className="text-xs bg-[#1E293B] text-[#94A3B8] rounded-full px-2 py-0.5 font-jetbrains">
              {estimates.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleSave}
            className="gap-2"
          >
            {saved ? (
              <>
                <Check className="w-3 h-3" />
                Saved
              </>
            ) : (
              <>
                <Save className="w-3 h-3" />
                Save Estimate
              </>
            )}
          </Button>

          {estimates.length > 0 && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-1 text-xs text-[#94A3B8] hover:text-[#F1F5F9] transition-colors"
            >
              <FolderOpen className="w-4 h-4" />
              Recent
              {expanded ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {expanded && estimates.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-2 max-h-80 overflow-y-auto pr-1">
              {estimates.map((est) => (
                <div
                  key={est.id}
                  className="flex items-center justify-between gap-3 p-3 bg-[#0A0E17] border border-[#1E293B] rounded-lg hover:border-[#334155] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#F1F5F9] truncate">
                      {est.prospectName}
                    </p>
                    <p className="text-xs text-[#475569] mt-0.5">
                      {formatDate(est.timestamp)} &middot;{" "}
                      {est.frameworks.slice(0, 2).map(getFrameworkName).join(", ")}
                      {est.frameworks.length > 2 && ` +${est.frameworks.length - 2} more`}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleLoad(est)}
                      className="text-xs text-[#3B82F6] hover:underline px-2 py-1 rounded hover:bg-[#3B82F6]/10 transition-colors"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => handleDelete(est.id)}
                      className="p-1 text-[#475569] hover:text-[#EF4444] transition-colors rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {expanded && estimates.length === 0 && (
        <p className="mt-3 text-sm text-[#475569] text-center py-3">
          No saved estimates yet. Click &quot;Save Estimate&quot; to save this one.
        </p>
      )}
    </motion.div>
  );
};

export default SaveLoadPanel;
