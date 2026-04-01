"use client";

import { motion } from "framer-motion";
import { Check, Shield, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { FrameworkId } from "@/types";
import frameworksData from "@/config/frameworks.json";
import Badge from "@/components/ui/Badge";

interface FrameworkSelectorProps {
  selectedFrameworks: FrameworkId[];
  onToggle: (fw: FrameworkId) => void;
}

type FrameworkEntry = {
  id: string;
  name: string;
  fullName: string;
  category: string;
  categoryLabel: string;
  description: string;
  region: string;
  popular: boolean;
  color: string;
};

const FrameworkSelector = ({ selectedFrameworks, onToggle }: FrameworkSelectorProps) => {
  const categories = frameworksData.categories;

  const frameworksByCategory = categories.map((cat) => ({
    ...cat,
    frameworks: frameworksData.frameworks.filter((fw) => fw.category === cat.id),
  }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-jetbrains text-2xl font-bold text-[#F1F5F9] mb-2">
          Select Compliance Frameworks
        </h2>
        <p className="text-[#94A3B8] text-sm">
          Choose one or more frameworks you need to achieve compliance with. Multi-framework
          discounts will be automatically applied.
        </p>
      </div>

      {selectedFrameworks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2 p-4 bg-[#00E5A0]/5 border border-[#00E5A0]/20 rounded-xl"
        >
          <span className="text-sm text-[#94A3B8] self-center">Selected:</span>
          {selectedFrameworks.map((fw) => {
            const framework = frameworksData.frameworks.find((f) => f.id === fw);
            return (
              <Badge key={fw} variant="success" size="md">
                {framework?.name ?? fw}
              </Badge>
            );
          })}
          {selectedFrameworks.length >= 2 && (
            <Badge variant="info" size="md">
              Multi-framework savings apply!
            </Badge>
          )}
        </motion.div>
      )}

      {selectedFrameworks.length === 0 && (
        <div className="flex items-center gap-2 p-3 bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-lg">
          <AlertCircle className="w-4 h-4 text-[#F59E0B] flex-shrink-0" />
          <span className="text-sm text-[#F59E0B]">Please select at least one framework to continue</span>
        </div>
      )}

      {frameworksByCategory.map((cat) => (
        <div key={cat.id}>
          <h3 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-widest mb-3 flex items-center gap-2">
            <Shield className="w-3.5 h-3.5" />
            {cat.label}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {cat.frameworks.map((fw: FrameworkEntry) => {
              const isSelected = selectedFrameworks.includes(fw.id as FrameworkId);

              return (
                <motion.button
                  key={fw.id}
                  onClick={() => onToggle(fw.id as FrameworkId)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "relative text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer",
                    isSelected
                      ? "border-[#00E5A0] bg-[#00E5A0]/5 shadow-[0_0_20px_rgba(0,229,160,0.15)]"
                      : "border-[#1E293B] bg-[#111827] hover:border-[#334155]"
                  )}
                >
                  {/* Color accent */}
                  <div
                    className="absolute top-0 left-0 w-1 h-full rounded-l-xl"
                    style={{ backgroundColor: fw.color }}
                  />

                  {/* Selected indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#00E5A0] flex items-center justify-center"
                    >
                      <Check className="w-3 h-3 text-[#0A0E17]" strokeWidth={3} />
                    </motion.div>
                  )}

                  <div className="pl-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={cn(
                          "font-jetbrains font-bold text-sm",
                          isSelected ? "text-[#00E5A0]" : "text-[#F1F5F9]"
                        )}
                      >
                        {fw.name}
                      </span>
                      {fw.popular && (
                        <Badge variant="warning" size="sm">Popular</Badge>
                      )}
                    </div>
                    <p className="text-xs text-[#94A3B8] leading-relaxed">
                      {fw.description}
                    </p>
                    <div className="mt-2">
                      <Badge variant="default" size="sm">
                        {fw.region === "india" ? "India" : fw.region === "us" ? "US" : fw.region === "eu" ? "EU" : "Global"}
                      </Badge>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FrameworkSelector;
