import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Download, Calculator, DollarSign, TrendingUp } from 'lucide-react';
import { jsPDF } from 'jspdf';

// TypeScript interfaces for type safety
interface ProcessInstance {
  name?: string;
  labour: number;
  otherDirectCost: number;
  factoryOverheads: number;
  salesOverheads: number;
  adminOverheads: number;
}

interface CostReductionData {
  processInstances: ProcessInstance[];
  otherFixedCostPerMonth: number;
}

interface QualityDefectData {
  unitsProcessed: number;
  defectPercentage: number;
  perUnitCost: number;
  specialDeduction: number;
}

interface EfficiencyData {
  unitsProcessedBefore: number;
  unitsProcessedAfter: number;
  contributionPerUnit: number;
  additionalCost: number;
}

interface AutomationMetrics {
  opexAutomation: number;
  capexAutomation: number;
}

interface CustomField {
  name: string;
  value: number;
}

interface CustomSection {
  id: string;
  name: string;
  fields: CustomField[];
  formula: string; // Formula like "{field1} * {field2} + {field3}"
}

interface FinancialState {
  costReduction: CostReductionData;
  qualityDefect: QualityDefectData;
  efficiency: EfficiencyData;
  automationMetrics: AutomationMetrics;
  customSections: CustomSection[];
}

interface CurrentFutureStates {
  current: FinancialState;
  future: FinancialState;
}

const FinancialAnalysis: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['costReduction']);
  const [showRoiSummary, setShowRoiSummary] = useState(false);
  const [newInstanceName, setNewInstanceName] = useState('');
  const [showAddInstanceModal, setShowAddInstanceModal] = useState(false);
  const [addingInstanceType, setAddingInstanceType] = useState<'current' | 'future' | null>(null);
  
  // Custom section states
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [customSectionStep, setCustomSectionStep] = useState<'name' | 'fields' | 'formula'>('name');
  const [tempSectionName, setTempSectionName] = useState('');
  const [tempSectionFields, setTempSectionFields] = useState<{ name: string }[]>([]);
  const [tempFieldName, setTempFieldName] = useState('');
  const [tempFormula, setTempFormula] = useState('');
  const [nextSectionId, setNextSectionId] = useState(1);
  
  const [data, setData] = useState<CurrentFutureStates>({
    current: {
      costReduction: {
        processInstances: [
          { name: 'Instance 1', labour: 500, otherDirectCost: 500, factoryOverheads: 50, salesOverheads: 20, adminOverheads: 10 },
          { name: 'Instance 2', labour: 500, otherDirectCost: 0, factoryOverheads: 30, salesOverheads: 20, adminOverheads: 10 },
          { name: 'Instance 3', labour: 700, otherDirectCost: 0, factoryOverheads: 0, salesOverheads: 0, adminOverheads: 0 },
          { name: 'Instance 4', labour: 850, otherDirectCost: 0, factoryOverheads: 0, salesOverheads: 0, adminOverheads: 0 }
        ],
        otherFixedCostPerMonth: 200000
      },
      qualityDefect: {
        unitsProcessed: 100000,
        defectPercentage: 7,
        perUnitCost: 10,
        specialDeduction: 0
      },
      efficiency: {
        unitsProcessedBefore: 100000,
        unitsProcessedAfter: 100000,
        contributionPerUnit: 5,
        additionalCost: 0
      },
      automationMetrics: {
        opexAutomation: 1991000,
        capexAutomation: 1000000
      },
      customSections: []
    },
    future: {
      costReduction: {
        processInstances: [
          { name: 'Instance 1', labour: 500, otherDirectCost: 0, factoryOverheads: 30, salesOverheads: 20, adminOverheads: 10 },
          { name: 'Instance 2', labour: 500, otherDirectCost: 0, factoryOverheads: 30, salesOverheads: 20, adminOverheads: 10 },
          { name: 'Instance 3', labour: 450, otherDirectCost: 0, factoryOverheads: 0, salesOverheads: 0, adminOverheads: 0 },
          { name: 'Instance 4', labour: 0, otherDirectCost: 0, factoryOverheads: 0, salesOverheads: 0, adminOverheads: 0 }
        ],
        otherFixedCostPerMonth: 200000
      },
      qualityDefect: {
        unitsProcessed: 100000,
        defectPercentage: 2,
        perUnitCost: 10,
        specialDeduction: -5000
      },
      efficiency: {
        unitsProcessedBefore: 100000,
        unitsProcessedAfter: 110000,
        contributionPerUnit: 5,
        additionalCost: 8333.33
      },
      automationMetrics: {
        opexAutomation: 1991000,
        capexAutomation: 1000000
      },
      customSections: []
    }
  });

  // Calculate total cost for process instances
  const calculateProcessCost = (instances: ProcessInstance[]): number => {
    return instances.reduce((total, instance) => {
      return total + instance.labour + instance.otherDirectCost + 
             instance.factoryOverheads + instance.salesOverheads + instance.adminOverheads;
    }, 0);
  };

  // Calculate total monthly cost
  const calculateTotalMonthlyCost = (state: FinancialState): number => {
    const processCost = calculateProcessCost(state.costReduction.processInstances);
    return processCost + state.costReduction.otherFixedCostPerMonth;
  };

  // Calculate monthly saving from cost reduction
  const calculateMonthlySaving = (): number => {
    const currentTotal = calculateTotalMonthlyCost(data.current);
    const futureTotal = calculateTotalMonthlyCost(data.future);
    return currentTotal - futureTotal;
  };

  // Calculate quality defect savings
  const calculateQualityDefectSaving = (): number => {
    const currentDefects = (data.current.qualityDefect.unitsProcessed * data.current.qualityDefect.defectPercentage / 100);
    const futureDefects = (data.future.qualityDefect.unitsProcessed * data.future.qualityDefect.defectPercentage / 100);
    const defectReduction = currentDefects - futureDefects;
    return defectReduction * data.current.qualityDefect.perUnitCost;
  };

  // Calculate efficiency improvement savings
  const calculateEfficiencySaving = (): number => {
    const additionalUnits = data.future.efficiency.unitsProcessedAfter - data.current.efficiency.unitsProcessedBefore;
    const benefit = additionalUnits * data.current.efficiency.contributionPerUnit;
    return benefit - data.future.efficiency.additionalCost;
  };

  // Calculate consolidated metrics
  const calculateConsolidatedMetrics = () => {
    const costSavingYearly = calculateMonthlySaving() * 12;
    const qualitySavingYearly = calculateQualityDefectSaving() * 12 + data.future.qualityDefect.specialDeduction * 12;
    const efficiencySavingYearly = calculateEfficiencySaving() * 12;
    
    // Calculate custom section benefits
    const customSavingsYearly: { [key: string]: number } = {};
    data.current.customSections.forEach(section => {
      const currentValue = calculateCustomSectionValue(section);
      const futureValue = calculateCustomSectionValue(
        data.future.customSections.find(s => s.id === section.id)!
      );
      customSavingsYearly[section.name] = (currentValue - futureValue) * 12;
    });
    
    const totalCustomSaving = Object.values(customSavingsYearly).reduce((sum, val) => sum + val, 0);
    const totalBenefit = costSavingYearly + qualitySavingYearly + efficiencySavingYearly + totalCustomSaving;
    const totalInvestment = data.current.automationMetrics.opexAutomation + data.current.automationMetrics.capexAutomation;
    
    const roi = ((totalBenefit - totalInvestment) / totalInvestment) * 100;
    const paybackYears = totalInvestment / totalBenefit;
    const paybackMonths = paybackYears * 12;

    return {
      costSavingYearly,
      qualitySavingYearly,
      efficiencySavingYearly,
      customSavingsYearly,
      totalCustomSaving,
      totalBenefit,
      roi,
      paybackYears,
      paybackMonths
    };
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const updateData = (section: keyof FinancialState, field: string, value: any, type: 'current' | 'future', index?: number) => {
    setData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [section]: section === 'costReduction' && index !== undefined
          ? {
              ...prev[type][section],
              processInstances: prev[type][section].processInstances.map((instance, i) =>
                i === index ? { ...instance, [field]: value } : instance
              )
            }
          : {
              ...prev[type][section],
              [field]: value
            }
      }
    }));
  };

  const addProcessInstance = (type: 'current' | 'future') => {
    if (!newInstanceName.trim()) {
      alert('Please enter an instance name');
      return;
    }

    const newInstance = {
      name: newInstanceName,
      labour: 0,
      otherDirectCost: 0,
      factoryOverheads: 0,
      salesOverheads: 0,
      adminOverheads: 0
    };

    setData(prev => ({
      ...prev,
      current: {
        ...prev.current,
        costReduction: {
          ...prev.current.costReduction,
          processInstances: [
            ...prev.current.costReduction.processInstances,
            newInstance
          ]
        }
      },
      future: {
        ...prev.future,
        costReduction: {
          ...prev.future.costReduction,
          processInstances: [
            ...prev.future.costReduction.processInstances,
            newInstance
          ]
        }
      }
    }));

    setNewInstanceName('');
    setShowAddInstanceModal(false);
    setAddingInstanceType(null);
  };

  const deleteProcessInstance = (type: 'current' | 'future', index: number) => {
    setData(prev => ({
      ...prev,
      current: {
        ...prev.current,
        costReduction: {
          ...prev.current.costReduction,
          processInstances: prev.current.costReduction.processInstances.filter((_, i) => i !== index)
        }
      },
      future: {
        ...prev.future,
        costReduction: {
          ...prev.future.costReduction,
          processInstances: prev.future.costReduction.processInstances.filter((_, i) => i !== index)
        }
      }
    }));
  };

  const addCustomSection = () => {
    if (!tempSectionName.trim()) {
      alert('Please enter a section name');
      return;
    }

    if (tempSectionFields.length === 0) {
      alert('Please add at least one field');
      return;
    }

    if (!tempFormula.trim()) {
      alert('Please enter a formula');
      return;
    }

    const newCustomSection: CustomSection = {
      id: `custom-${nextSectionId}`,
      name: tempSectionName,
      fields: tempSectionFields.map(f => ({ name: f.name, value: 0 })),
      formula: tempFormula
    };

    setData(prev => ({
      ...prev,
      current: {
        ...prev.current,
        customSections: [...prev.current.customSections, newCustomSection]
      },
      future: {
        ...prev.future,
        customSections: [...prev.future.customSections, newCustomSection]
      }
    }));

    setNextSectionId(nextSectionId + 1);
    resetCustomSectionModal();
  };

  const resetCustomSectionModal = () => {
    setShowAddSectionModal(false);
    setCustomSectionStep('name');
    setTempSectionName('');
    setTempSectionFields([]);
    setTempFieldName('');
    setTempFormula('');
  };

  const addFieldToCustomSection = () => {
    if (!tempFieldName.trim()) {
      alert('Please enter a field name');
      return;
    }

    if (tempSectionFields.some(f => f.name.toLowerCase() === tempFieldName.toLowerCase())) {
      alert('Field name already exists');
      return;
    }

    setTempSectionFields([...tempSectionFields, { name: tempFieldName }]);
    setTempFieldName('');
  };

  const removeFieldFromCustomSection = (index: number) => {
    setTempSectionFields(tempSectionFields.filter((_, i) => i !== index));
  };

  const updateCustomSectionField = (type: 'current' | 'future', sectionId: string, fieldName: string, value: number) => {
    setData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        customSections: prev[type].customSections.map(section =>
          section.id === sectionId
            ? {
                ...section,
                fields: section.fields.map(f =>
                  f.name === fieldName ? { ...f, value } : f
                )
              }
            : section
        )
      }
    }));
  };

  const calculateCustomSectionValue = (section: CustomSection): number => {
    try {
      let formula = section.formula;
      section.fields.forEach(field => {
        formula = formula.replace(new RegExp(`\\{${field.name}\\}`, 'g'), field.value.toString());
      });
      const result = Function('"use strict"; return (' + formula + ')')();
      return typeof result === 'number' ? result : 0;
    } catch (e) {
      return 0;
    }
  };

  const deleteCustomSection = (sectionId: string) => {
    setData(prev => ({
      ...prev,
      current: {
        ...prev.current,
        customSections: prev.current.customSections.filter(s => s.id !== sectionId)
      },
      future: {
        ...prev.future,
        customSections: prev.future.customSections.filter(s => s.id !== sectionId)
      }
    }));
  };

  const generateReport = (): string => {
    const metrics = calculateConsolidatedMetrics();
    const timestamp = new Date().toISOString();
    
    const report = [
      'FINANCIAL ANALYSIS REPORT',
      `Generated: ${timestamp}`,
      '='.repeat(80),
      '',
      '>>> CURRENT STATE ANALYSIS',
      '-'.repeat(40),
      'Cost Reduction from Automation:',
      ...data.current.costReduction.processInstances.map((instance, i) => 
        `  Instance ${i + 1}: Labour: $${instance.labour}, Other: $${instance.otherDirectCost}, Factory OH: $${instance.factoryOverheads}, Sales OH: $${instance.salesOverheads}, Admin OH: $${instance.adminOverheads}`
      ),
      `  Other Fixed Cost: $${data.current.costReduction.otherFixedCostPerMonth}`,
      `  Total Monthly Cost: $${calculateTotalMonthlyCost(data.current)}`,
      '',
      'Quality Defect Data:',
      `  Units Processed: ${data.current.qualityDefect.unitsProcessed}`,
      `  Defect %: ${data.current.qualityDefect.defectPercentage}%`,
      `  Per Unit Cost: $${data.current.qualityDefect.perUnitCost}`,
      '',
      'Efficiency Data:',
      `  Units Processed: ${data.current.efficiency.unitsProcessedBefore}`,
      `  Contribution Per Unit: $${data.current.efficiency.contributionPerUnit}`,
      '',
      '>>> FUTURE STATE ANALYSIS',
      '-'.repeat(40),
      'Cost Reduction from Automation:',
      ...data.future.costReduction.processInstances.map((instance, i) => 
        `  Instance ${i + 1}: Labour: $${instance.labour}, Other: $${instance.otherDirectCost}, Factory OH: $${instance.factoryOverheads}, Sales OH: $${instance.salesOverheads}, Admin OH: $${instance.adminOverheads}`
      ),
      `  Other Fixed Cost: $${data.future.costReduction.otherFixedCostPerMonth}`,
      `  Total Monthly Cost: $${calculateTotalMonthlyCost(data.future)}`,
      '',
      'Quality Defect Data:',
      `  Units Processed: ${data.future.qualityDefect.unitsProcessed}`,
      `  Defect %: ${data.future.qualityDefect.defectPercentage}%`,
      `  Per Unit Cost: $${data.future.qualityDefect.perUnitCost}`,
      `  Special Deduction: $${data.future.qualityDefect.specialDeduction}`,
      '',
      'Efficiency Data:',
      `  Units Processed: ${data.future.efficiency.unitsProcessedAfter}`,
      `  Contribution Per Unit: $${data.future.efficiency.contributionPerUnit}`,
      `  Additional Cost: $${data.future.efficiency.additionalCost}`,
      '',
      '>>> CONSOLIDATED METRICS',
      '-'.repeat(40),
      `Cost Reduction Yearly Saving: $${metrics.costSavingYearly.toFixed(2)}`,
      `Quality Defect Yearly Saving: $${metrics.qualitySavingYearly.toFixed(2)}`,
      `Efficiency Yearly Saving: $${metrics.efficiencySavingYearly.toFixed(2)}`,
      `Total Annual Benefit: $${metrics.totalBenefit.toFixed(2)}`,
      `OPEX of Automation: $${data.current.automationMetrics.opexAutomation}`,
      `CAPEX of Automation: $${data.current.automationMetrics.capexAutomation}`,
      `ROI: ${metrics.roi.toFixed(2)}%`,
      `Payback Period: ${metrics.paybackYears.toFixed(2)} years (${metrics.paybackMonths.toFixed(1)} months)`,
      '',
      'END OF FINANCIAL ANALYSIS REPORT'
    ];

    return report.join('\n');
  };

  const downloadReport = () => {
    try {
      const reportText = generateReport();
      const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const a = document.createElement('a');
      a.href = url;
      a.download = `Financial_Analysis_Report_${timestamp}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to download financial analysis report', e);
      alert('Failed to generate report. Please try again.');
    }
  };

  // Check if both current and future state have meaningful data
  const hasCurrentData = () => {
    const current = data.current;
    return current.costReduction.processInstances.some(instance => 
      instance.labour > 0 || instance.otherDirectCost > 0
    ) || current.qualityDefect.unitsProcessed > 0 || current.efficiency.unitsProcessedBefore > 0;
  };

  const hasFutureData = () => {
    const future = data.future;
    return future.costReduction.processInstances.some(instance => 
      instance.labour > 0 || instance.otherDirectCost > 0
    ) || future.qualityDefect.unitsProcessed > 0 || future.efficiency.unitsProcessedAfter > 0;
  };

  const canShowComparison = hasCurrentData() && hasFutureData();

  // Download financial analysis as PDF
  const downloadFinancialAnalysisPDF = async () => {
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 15;

      // Load JPG logo and add it to PDF
      try {
        const response = await fetch('/images/IMG-20250912-WA0002.jpg');
        const blob = await response.blob();
        const reader = new FileReader();
        
        await new Promise((resolve) => {
          reader.onload = (e: any) => {
            try {
              const logoDataUrl = e.target.result;
              pdf.addImage(logoDataUrl, 'JPEG', 15, 8, 20, 12);
              resolve(true);
            } catch (err) {
              console.warn('Error adding logo to PDF:', err);
              resolve(false);
            }
          };
          reader.readAsDataURL(blob);
        });
      } catch (logoError) {
        console.warn('Could not load logo:', logoError);
      }
      
      // Add AI4Profit text on the right
      pdf.setFontSize(16);
      pdf.setTextColor(0, 51, 102);
      pdf.text('AI4Profit', pageWidth - 40, 15);

      // Add a line separator
      pdf.setDrawColor(200, 200, 200);
      pdf.line(15, 25, pageWidth - 15, 25);

      yPosition = 32;

      // Title
      pdf.setFontSize(18);
      pdf.setTextColor(0, 0, 0);
      pdf.text('FINANCIAL ANALYSIS REPORT', 15, yPosition);
      yPosition += 10;

      // Metadata
      pdf.setFontSize(10);
      pdf.setTextColor(80, 80, 80);
      
      const timestamp = new Date().toLocaleString();
      const metadata = [
        `Generated: ${timestamp}`
      ];

      metadata.forEach(line => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 15;
        }
        pdf.text(line, 15, yPosition);
        yPosition += 6;
      });

      yPosition += 5;

      // Current State Section
      pdf.setFontSize(14);
      pdf.setTextColor(0, 51, 102);
      pdf.text('CURRENT STATE ANALYSIS', 15, yPosition);
      yPosition += 8;

      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);

      // Cost Reduction - Current
      pdf.setFont('', 'bold');
      pdf.text('Cost Reduction from Automation:', 15, yPosition);
      yPosition += 5;
      pdf.setFont('', 'normal');

      data.current.costReduction.processInstances.forEach((instance, index) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 15;
        }
        const costInfo = `Instance ${index + 1}: Labour: $${instance.labour}, Other Direct: $${instance.otherDirectCost}, Factory OH: $${instance.factoryOverheads}, Sales OH: $${instance.salesOverheads}, Admin OH: $${instance.adminOverheads}`;
        const wrappedText = pdf.splitTextToSize(costInfo, pageWidth - 30);
        pdf.text(wrappedText, 20, yPosition);
        yPosition += wrappedText.length * 4;
      });

      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = 15;
      }
      pdf.setFont('', 'bold');
      pdf.text(`Other Fixed Cost: $${data.current.costReduction.otherFixedCostPerMonth}`, 20, yPosition);
      yPosition += 5;
      pdf.text(`Total Monthly Cost: $${calculateTotalMonthlyCost(data.current)}`, 20, yPosition);
      yPosition += 8;
      pdf.setFont('', 'normal');

      // Quality Defect - Current
      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = 15;
      }
      pdf.setFont('', 'bold');
      pdf.text('Quality Defect Reduction:', 15, yPosition);
      yPosition += 5;
      pdf.setFont('', 'normal');

      const qualityCurrentInfo = [
        `Units Processed: ${data.current.qualityDefect.unitsProcessed}`,
        `Defect Rate: ${data.current.qualityDefect.defectPercentage}%`,
        `Per Unit Cost: $${data.current.qualityDefect.perUnitCost}`,
        `Monthly Saving: $${calculateQualityDefectSaving()}`
      ];

      qualityCurrentInfo.forEach(info => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 15;
        }
        const wrappedText = pdf.splitTextToSize(info, pageWidth - 30);
        pdf.text(wrappedText, 20, yPosition);
        yPosition += 5;
      });

      yPosition += 3;

      // Efficiency - Current
      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = 15;
      }
      pdf.setFont('', 'bold');
      pdf.text('Efficiency Improvement:', 15, yPosition);
      yPosition += 5;
      pdf.setFont('', 'normal');

      const efficiencyCurrentInfo = [
        `Units Processed: ${data.current.efficiency.unitsProcessedBefore}`,
        `Contribution per Unit: $${data.current.efficiency.contributionPerUnit}`,
        `Monthly Saving: $${calculateEfficiencySaving()}`
      ];

      efficiencyCurrentInfo.forEach(info => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 15;
        }
        const wrappedText = pdf.splitTextToSize(info, pageWidth - 30);
        pdf.text(wrappedText, 20, yPosition);
        yPosition += 5;
      });

      yPosition += 5;

      // Future State Section - New Page
      pdf.addPage();
      yPosition = 15;

      pdf.setFontSize(14);
      pdf.setTextColor(0, 51, 102);
      pdf.text('FUTURE STATE ANALYSIS', 15, yPosition);
      yPosition += 8;

      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);

      // Cost Reduction - Future
      pdf.setFont('', 'bold');
      pdf.text('Cost Reduction from Automation:', 15, yPosition);
      yPosition += 5;
      pdf.setFont('', 'normal');

      data.future.costReduction.processInstances.forEach((instance, index) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 15;
        }
        const costInfo = `Instance ${index + 1}: Labour: $${instance.labour}, Other Direct: $${instance.otherDirectCost}, Factory OH: $${instance.factoryOverheads}, Sales OH: $${instance.salesOverheads}, Admin OH: $${instance.adminOverheads}`;
        const wrappedText = pdf.splitTextToSize(costInfo, pageWidth - 30);
        pdf.text(wrappedText, 20, yPosition);
        yPosition += wrappedText.length * 4;
      });

      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = 15;
      }
      pdf.setFont('', 'bold');
      pdf.text(`Other Fixed Cost: $${data.future.costReduction.otherFixedCostPerMonth}`, 20, yPosition);
      yPosition += 5;
      pdf.text(`Total Monthly Cost: $${calculateTotalMonthlyCost(data.future)}`, 20, yPosition);
      yPosition += 8;
      pdf.setFont('', 'normal');

      // Quality Defect - Future
      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = 15;
      }
      pdf.setFont('', 'bold');
      pdf.text('Quality Defect Reduction:', 15, yPosition);
      yPosition += 5;
      pdf.setFont('', 'normal');

      const qualityFutureInfo = [
        `Units Processed: ${data.future.qualityDefect.unitsProcessed}`,
        `Defect Rate: ${data.future.qualityDefect.defectPercentage}%`,
        `Per Unit Cost: $${data.future.qualityDefect.perUnitCost}`,
        `Special Deduction: $${data.future.qualityDefect.specialDeduction}`
      ];

      qualityFutureInfo.forEach(info => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 15;
        }
        const wrappedText = pdf.splitTextToSize(info, pageWidth - 30);
        pdf.text(wrappedText, 20, yPosition);
        yPosition += 5;
      });

      yPosition += 3;

      // Efficiency - Future
      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = 15;
      }
      pdf.setFont('', 'bold');
      pdf.text('Efficiency Improvement:', 15, yPosition);
      yPosition += 5;
      pdf.setFont('', 'normal');

      const efficiencyFutureInfo = [
        `Units Processed: ${data.future.efficiency.unitsProcessedAfter}`,
        `Contribution per Unit: $${data.future.efficiency.contributionPerUnit}`,
        `Additional Cost: $${data.future.efficiency.additionalCost}`,
        `Monthly Saving: $${calculateEfficiencySaving()}`
      ];

      efficiencyFutureInfo.forEach(info => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 15;
        }
        const wrappedText = pdf.splitTextToSize(info, pageWidth - 30);
        pdf.text(wrappedText, 20, yPosition);
        yPosition += 5;
      });

      yPosition += 5;

      // Automation Metrics Section - New Page
      pdf.addPage();
      yPosition = 15;

      pdf.setFontSize(14);
      pdf.setTextColor(0, 51, 102);
      pdf.text('AUTOMATION INVESTMENT METRICS', 15, yPosition);
      yPosition += 8;

      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);

      pdf.setFont('', 'bold');
      pdf.text('Investment Details:', 15, yPosition);
      yPosition += 5;
      pdf.setFont('', 'normal');

      const investmentInfo = [
        `OPEX of Automation: $${data.current.automationMetrics.opexAutomation}`,
        `CAPEX of Automation: $${data.current.automationMetrics.capexAutomation}`,
        `Total Investment: $${data.current.automationMetrics.opexAutomation + data.current.automationMetrics.capexAutomation}`
      ];

      investmentInfo.forEach(info => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 15;
        }
        const wrappedText = pdf.splitTextToSize(info, pageWidth - 30);
        pdf.text(wrappedText, 20, yPosition);
        yPosition += 5;
      });

      yPosition += 5;

      // Consolidated Metrics
      pdf.setFont('', 'bold');
      pdf.text('Consolidated ROI Metrics:', 15, yPosition);
      yPosition += 5;
      pdf.setFont('', 'normal');

      const consolidatedMetrics = calculateConsolidatedMetrics();
      const consolidatedInfo = [
        `Cost Reduction Yearly Saving: $${consolidatedMetrics.costSavingYearly.toLocaleString()}`,
        `Quality Defect Yearly Saving: $${consolidatedMetrics.qualitySavingYearly.toLocaleString()}`,
        `Efficiency Yearly Saving: $${consolidatedMetrics.efficiencySavingYearly.toLocaleString()}`,
        `Total Annual Benefit: $${consolidatedMetrics.totalBenefit.toLocaleString()}`,
        `ROI: ${consolidatedMetrics.roi.toFixed(2)}%`,
        `Payback Period: ${consolidatedMetrics.paybackYears.toFixed(2)} years (${consolidatedMetrics.paybackMonths.toFixed(1)} months)`
      ];

      consolidatedInfo.forEach(info => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 15;
        }
        const wrappedText = pdf.splitTextToSize(info, pageWidth - 30);
        pdf.text(wrappedText, 20, yPosition);
        yPosition += 5;
      });

      // Add Comparison Section - New Page
      if (canShowComparison) {
        pdf.addPage();
        yPosition = 15;

        pdf.setFontSize(14);
        pdf.setTextColor(0, 51, 102);
        pdf.text('CURRENT VS FUTURE STATE COMPARISON', 15, yPosition);
        yPosition += 8;

        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);

        const comparison = generateComparisonData();

        // Cost Comparison
        pdf.setFont('', 'bold');
        pdf.text('Cost Analysis Comparison:', 15, yPosition);
        yPosition += 5;
        pdf.setFont('', 'normal');

        const costComparisonInfo = [
          `Current Monthly Cost: $${comparison.costs.current.toLocaleString()}`,
          `Future Monthly Cost: $${comparison.costs.future.toLocaleString()}`,
          `Monthly Saving: $${comparison.costs.saving.toLocaleString()} (${comparison.costs.savingPercentage.toFixed(1)}% reduction)`
        ];

        costComparisonInfo.forEach(info => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = 15;
          }
          const wrappedText = pdf.splitTextToSize(info, pageWidth - 30);
          pdf.text(wrappedText, 20, yPosition);
          yPosition += 5;
        });

        yPosition += 3;

        // Quality Comparison
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 15;
        }
        pdf.setFont('', 'bold');
        pdf.text('Quality Improvement Comparison:', 15, yPosition);
        yPosition += 5;
        pdf.setFont('', 'normal');

        const qualityComparisonInfo = [
          `Current Defect Rate: ${comparison.quality.currentDefect}%`,
          `Future Defect Rate: ${comparison.quality.futureDefect}%`,
          `Improvement: -${comparison.quality.improvement.toFixed(1)}%`,
          `Monthly Saving: $${comparison.quality.monthlySaving.toLocaleString()}`
        ];

        qualityComparisonInfo.forEach(info => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = 15;
          }
          const wrappedText = pdf.splitTextToSize(info, pageWidth - 30);
          pdf.text(wrappedText, 20, yPosition);
          yPosition += 5;
        });

        yPosition += 3;

        // Efficiency Comparison
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 15;
        }
        pdf.setFont('', 'bold');
        pdf.text('Efficiency Improvement Comparison:', 15, yPosition);
        yPosition += 5;
        pdf.setFont('', 'normal');

        const efficiencyComparisonInfo = [
          `Current Units/Month: ${comparison.efficiency.currentUnits.toLocaleString()}`,
          `Future Units/Month: ${comparison.efficiency.futureUnits.toLocaleString()}`,
          `Additional Units: +${comparison.efficiency.improvement.toLocaleString()} (${comparison.efficiency.improvementPercentage.toFixed(1)}% increase)`,
          `Monthly Saving: $${comparison.efficiency.monthlySaving.toLocaleString()}`
        ];

        efficiencyComparisonInfo.forEach(info => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = 15;
          }
          const wrappedText = pdf.splitTextToSize(info, pageWidth - 30);
          pdf.text(wrappedText, 20, yPosition);
          yPosition += 5;
        });

        yPosition += 3;

        // Overall Financial Impact & ROI
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 15;
        }
        pdf.setFont('', 'bold');
        pdf.text('Overall Financial Impact & ROI:', 15, yPosition);
        yPosition += 5;
        pdf.setFont('', 'normal');

        const roiComparisonInfo = [
          `Total Annual Benefit: $${comparison.consolidated.totalBenefit.toLocaleString()}`,
          `ROI: ${comparison.consolidated.roi.toFixed(1)}%`,
          `Payback Period: ${comparison.consolidated.paybackYears.toFixed(1)} years (${comparison.consolidated.paybackMonths.toFixed(0)} months)`
        ];

        roiComparisonInfo.forEach(info => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = 15;
          }
          const wrappedText = pdf.splitTextToSize(info, pageWidth - 30);
          pdf.text(wrappedText, 20, yPosition);
          yPosition += 5;
        });
      }

      // Save the PDF
      pdf.save(`Financial_Analysis_${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  // Generate comparison data
  const generateComparisonData = () => {
    const currentTotal = calculateTotalMonthlyCost(data.current);
    const futureTotal = calculateTotalMonthlyCost(data.future);
    const costSaving = calculateMonthlySaving();
    const qualitySaving = calculateQualityDefectSaving();
    const efficiencySaving = calculateEfficiencySaving();
    const metrics = calculateConsolidatedMetrics();

    return {
      costs: {
        current: currentTotal,
        future: futureTotal,
        saving: costSaving,
        savingPercentage: currentTotal > 0 ? ((costSaving / currentTotal) * 100) : 0
      },
      quality: {
        currentDefect: data.current.qualityDefect.defectPercentage,
        futureDefect: data.future.qualityDefect.defectPercentage,
        improvement: data.current.qualityDefect.defectPercentage - data.future.qualityDefect.defectPercentage,
        monthlySaving: qualitySaving
      },
      efficiency: {
        currentUnits: data.current.efficiency.unitsProcessedBefore,
        futureUnits: data.future.efficiency.unitsProcessedAfter,
        improvement: data.future.efficiency.unitsProcessedAfter - data.current.efficiency.unitsProcessedBefore,
        improvementPercentage: data.current.efficiency.unitsProcessedBefore > 0 ? 
          (((data.future.efficiency.unitsProcessedAfter - data.current.efficiency.unitsProcessedBefore) / data.current.efficiency.unitsProcessedBefore) * 100) : 0,
        monthlySaving: efficiencySaving
      },
      consolidated: metrics
    };
  };

  const metrics = calculateConsolidatedMetrics();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 font-serif leading-tight">
            <Calculator className="w-8 h-8 inline mr-3 text-blue-600" />
            Financial Analysis
          </h1>
          <p className="text-base sm:text-lg text-gray-600 font-medium tracking-wide">
            Comprehensive automation ROI and cost-benefit analysis
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mt-4"></div>
        </div>

        {/* Analysis Type Toggle */}
        <div className="mb-8 flex justify-center">
          <div className="bg-white rounded-lg shadow-md p-2 flex flex-wrap gap-2">
            <button
              onClick={() => setShowRoiSummary(false)}
              className={`px-6 py-3 rounded-md font-semibold transition-all ${
                !showRoiSummary
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
            >
              State Analysis
            </button>
            {canShowComparison && (
              <button
                onClick={() => setShowRoiSummary(true)}
                className={`px-6 py-3 rounded-md font-semibold transition-all ${
                  showRoiSummary
                    ? 'bg-green-600 text-white shadow-md'
                    : 'text-green-600 hover:bg-green-50'
                }`}
              >
                RoI Summary
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        {showRoiSummary ? (
          /* RoI Summary View */
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                RoI Summary
              </h2>
              
              {(() => {
                const comparison = generateComparisonData();
                return (
                  <div className="space-y-8">
                    {/* Cost Comparison */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
                        <DollarSign className="w-6 h-6 mr-2" />
                        Cost Analysis Comparison
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg p-4 text-center">
                          <div className="text-sm text-gray-600 mb-1">Current Monthly Cost</div>
                          <div className="text-2xl font-bold text-blue-800">
                            ${comparison.costs.current.toLocaleString()}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center">
                          <div className="text-sm text-gray-600 mb-1">Future Monthly Cost</div>
                          <div className="text-2xl font-bold text-purple-800">
                            ${comparison.costs.future.toLocaleString()}
                          </div>
                        </div>
                        <div className="bg-green-100 rounded-lg p-4 text-center">
                          <div className="text-sm text-green-700 mb-1">Monthly Saving</div>
                          <div className="text-2xl font-bold text-green-800">
                            ${comparison.costs.saving.toLocaleString()}
                          </div>
                          <div className="text-sm text-green-600">
                            ({comparison.costs.savingPercentage.toFixed(1)}% reduction)
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quality Comparison */}
                    <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-green-900 mb-4 flex items-center">
                        <TrendingUp className="w-6 h-6 mr-2" />
                        Quality Improvement Comparison
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-lg p-4 text-center">
                          <div className="text-sm text-gray-600 mb-1">Current Defect Rate</div>
                          <div className="text-2xl font-bold text-red-600">
                            {comparison.quality.currentDefect}%
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center">
                          <div className="text-sm text-gray-600 mb-1">Future Defect Rate</div>
                          <div className="text-2xl font-bold text-green-600">
                            {comparison.quality.futureDefect}%
                          </div>
                        </div>
                        <div className="bg-green-100 rounded-lg p-4 text-center">
                          <div className="text-sm text-green-700 mb-1">Improvement</div>
                          <div className="text-2xl font-bold text-green-800">
                            -{comparison.quality.improvement.toFixed(1)}%
                          </div>
                        </div>
                        <div className="bg-green-100 rounded-lg p-4 text-center">
                          <div className="text-sm text-green-700 mb-1">Monthly Saving</div>
                          <div className="text-xl font-bold text-green-800">
                            ${comparison.quality.monthlySaving.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Efficiency Comparison */}
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-purple-900 mb-4 flex items-center">
                        <Calculator className="w-6 h-6 mr-2" />
                        Efficiency Improvement Comparison
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-lg p-4 text-center">
                          <div className="text-sm text-gray-600 mb-1">Current Units/Month</div>
                          <div className="text-2xl font-bold text-blue-600">
                            {comparison.efficiency.currentUnits.toLocaleString()}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center">
                          <div className="text-sm text-gray-600 mb-1">Future Units/Month</div>
                          <div className="text-2xl font-bold text-purple-600">
                            {comparison.efficiency.futureUnits.toLocaleString()}
                          </div>
                        </div>
                        <div className="bg-purple-100 rounded-lg p-4 text-center">
                          <div className="text-sm text-purple-700 mb-1">Additional Units</div>
                          <div className="text-2xl font-bold text-purple-800">
                            +{comparison.efficiency.improvement.toLocaleString()}
                          </div>
                          <div className="text-sm text-purple-600">
                            ({comparison.efficiency.improvementPercentage.toFixed(1)}% increase)
                          </div>
                        </div>
                        <div className="bg-purple-100 rounded-lg p-4 text-center">
                          <div className="text-sm text-purple-700 mb-1">Monthly Saving</div>
                          <div className="text-xl font-bold text-purple-800">
                            ${comparison.efficiency.monthlySaving.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Custom Sections Comparison */}
                    {data.current.customSections.length > 0 && (
                      <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-orange-900 mb-4 flex items-center">
                          <Calculator className="w-6 h-6 mr-2" />
                          Custom Sections
                        </h3>
                        <div className="space-y-4">
                          {data.current.customSections.map((section) => {
                            const metrics = calculateConsolidatedMetrics();
                            const currentValue = calculateCustomSectionValue(section);
                            const futureValue = calculateCustomSectionValue(
                              data.future.customSections.find(s => s.id === section.id)!
                            );
                            const yearlySaving = (currentValue - futureValue) * 12;
                            
                            return (
                              <div key={section.id} className="bg-white rounded-lg p-4">
                                <h4 className="font-semibold text-gray-800 mb-3">{section.name}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                  <div className="text-center">
                                    <div className="text-sm text-gray-600 mb-1">Current Value</div>
                                    <div className="text-xl font-bold text-blue-600">
                                      ${currentValue.toLocaleString(undefined, {maximumFractionDigits: 2})}
                                    </div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-sm text-gray-600 mb-1">Future Value</div>
                                    <div className="text-xl font-bold text-purple-600">
                                      ${futureValue.toLocaleString(undefined, {maximumFractionDigits: 2})}
                                    </div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-sm text-gray-600 mb-1">Monthly Saving</div>
                                    <div className="text-xl font-bold text-green-600">
                                      ${((currentValue - futureValue)).toLocaleString(undefined, {maximumFractionDigits: 2})}
                                    </div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-sm text-gray-600 mb-1">Annual Saving</div>
                                    <div className="text-xl font-bold text-green-700">
                                      ${yearlySaving.toLocaleString(undefined, {maximumFractionDigits: 2})}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Consolidated ROI Metrics */}
                    <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-indigo-900 mb-4 text-center">
                        Overall Financial Impact & ROI
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white rounded-lg p-4 text-center">
                          <div className="text-sm text-gray-600 mb-1">Total Annual Benefit</div>
                          <div className="text-xl font-bold text-green-600">
                            ${comparison.consolidated.totalBenefit.toLocaleString()}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center">
                          <div className="text-sm text-gray-600 mb-1">ROI</div>
                          <div className={`text-xl font-bold ${comparison.consolidated.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {comparison.consolidated.roi.toFixed(1)}%
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center">
                          <div className="text-sm text-gray-600 mb-1">Payback Period</div>
                          <div className="text-lg font-bold text-blue-600">
                            {comparison.consolidated.paybackYears.toFixed(1)} years
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center">
                          <div className="text-sm text-gray-600 mb-1">Payback (Months)</div>
                          <div className="text-lg font-bold text-blue-600">
                            {comparison.consolidated.paybackMonths.toFixed(0)} months
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
          {/* Section 1: Cost Reduction from Automation */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={() => toggleSection('costReduction')}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold flex items-center justify-between hover:from-blue-700 hover:to-blue-800 transition-all"
            >
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Section 1: Cost Reduction from Automation
              </div>
              {expandedSections.includes('costReduction') ? 
                <ChevronDown className="w-5 h-5" /> : 
                <ChevronRight className="w-5 h-5" />
              }
            </button>
            
            {expandedSections.includes('costReduction') && (
              <div className="p-6">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* Current State */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-blue-700 pb-2 border-b-2 border-blue-400 flex-1">Current State</h3>
                      <button
                        onClick={() => {
                          setAddingInstanceType('current');
                          setShowAddInstanceModal(true);
                        }}
                        className="ml-2 px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-all"
                      >
                        + Add Instance
                      </button>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {data.current.costReduction.processInstances.map((instance, index) => (
                        <div key={index} className="border rounded-lg p-4 bg-blue-50">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-semibold text-gray-800">{instance.name || `Instance ${index + 1}`}</h4>
                            {index > 3 && (
                              <button
                                onClick={() => deleteProcessInstance('current', index)}
                                className="text-red-500 hover:text-red-700 text-sm font-medium"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <label className="block font-medium text-gray-700 mb-1">Labour ($)</label>
                              <input
                                type="number"
                                value={instance.labour}
                                onChange={(e) => updateData('costReduction', 'labour', Number(e.target.value), 'current', index)}
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block font-medium text-gray-700 mb-1">Other Direct ($)</label>
                              <input
                                type="number"
                                value={instance.otherDirectCost}
                                onChange={(e) => updateData('costReduction', 'otherDirectCost', Number(e.target.value), 'current', index)}
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block font-medium text-gray-700 mb-1">Factory OH ($)</label>
                              <input
                                type="number"
                                value={instance.factoryOverheads}
                                onChange={(e) => updateData('costReduction', 'factoryOverheads', Number(e.target.value), 'current', index)}
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block font-medium text-gray-700 mb-1">Sales OH ($)</label>
                              <input
                                type="number"
                                value={instance.salesOverheads}
                                onChange={(e) => updateData('costReduction', 'salesOverheads', Number(e.target.value), 'current', index)}
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="block font-medium text-gray-700 mb-1">Admin OH ($)</label>
                              <input
                                type="number"
                                value={instance.adminOverheads}
                                onChange={(e) => updateData('costReduction', 'adminOverheads', Number(e.target.value), 'current', index)}
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Future State */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-purple-700 pb-2 border-b-2 border-purple-400 flex-1">Future State</h3>
                      <button
                        onClick={() => {
                          setAddingInstanceType('future');
                          setShowAddInstanceModal(true);
                        }}
                        className="ml-2 px-3 py-1 bg-purple-500 text-white text-sm rounded-md hover:bg-purple-600 transition-all"
                      >
                        + Add Instance
                      </button>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {data.future.costReduction.processInstances.map((instance, index) => (
                        <div key={index} className="border rounded-lg p-4 bg-purple-50">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-semibold text-gray-800">{instance.name || `Instance ${index + 1}`}</h4>
                            {index > 3 && (
                              <button
                                onClick={() => deleteProcessInstance('future', index)}
                                className="text-red-500 hover:text-red-700 text-sm font-medium"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <label className="block font-medium text-gray-700 mb-1">Labour ($)</label>
                              <input
                                type="number"
                                value={instance.labour}
                                onChange={(e) => updateData('costReduction', 'labour', Number(e.target.value), 'future', index)}
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                            <div>
                              <label className="block font-medium text-gray-700 mb-1">Other Direct ($)</label>
                              <input
                                type="number"
                                value={instance.otherDirectCost}
                                onChange={(e) => updateData('costReduction', 'otherDirectCost', Number(e.target.value), 'future', index)}
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                            <div>
                              <label className="block font-medium text-gray-700 mb-1">Factory OH ($)</label>
                              <input
                                type="number"
                                value={instance.factoryOverheads}
                                onChange={(e) => updateData('costReduction', 'factoryOverheads', Number(e.target.value), 'future', index)}
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                            <div>
                              <label className="block font-medium text-gray-700 mb-1">Sales OH ($)</label>
                              <input
                                type="number"
                                value={instance.salesOverheads}
                                onChange={(e) => updateData('costReduction', 'salesOverheads', Number(e.target.value), 'future', index)}
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="block font-medium text-gray-700 mb-1">Admin OH ($)</label>
                              <input
                                type="number"
                                value={instance.adminOverheads}
                                onChange={(e) => updateData('costReduction', 'adminOverheads', Number(e.target.value), 'future', index)}
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Other Fixed Cost per Month ($)</label>
                    <input
                      type="number"
                      value={data.current.costReduction.otherFixedCostPerMonth}
                      onChange={(e) => updateData('costReduction', 'otherFixedCostPerMonth', Number(e.target.value), 'current')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-blue-700 mb-1">Total Monthly Cost (Current)</label>
                    <div className="text-2xl font-bold text-blue-800">
                      ${calculateTotalMonthlyCost(data.current).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Other Fixed Cost per Month ($)</label>
                    <input
                      type="number"
                      value={data.future.costReduction.otherFixedCostPerMonth}
                      onChange={(e) => updateData('costReduction', 'otherFixedCostPerMonth', Number(e.target.value), 'future')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-purple-700 mb-1">Total Monthly Cost (Future)</label>
                    <div className="text-2xl font-bold text-purple-800">
                      ${calculateTotalMonthlyCost(data.future).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-green-700 mb-1">Monthly Saving</label>
                    <div className="text-xl font-bold text-green-800">
                      ${calculateMonthlySaving().toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-green-700 mb-1">Yearly Saving</label>
                    <div className="text-xl font-bold text-green-800">
                      ${(calculateMonthlySaving() * 12).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Quality Defect Reduction */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={() => toggleSection('qualityDefect')}
              className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold flex items-center justify-between hover:from-green-700 hover:to-green-800 transition-all"
            >
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Section 2: Quality Defect Reduction from Automation
              </div>
              {expandedSections.includes('qualityDefect') ? 
                <ChevronDown className="w-5 h-5" /> : 
                <ChevronRight className="w-5 h-5" />
              }
            </button>
            
            {expandedSections.includes('qualityDefect') && (
              <div className="p-6">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* Current State */}
                  <div>
                    <h3 className="text-lg font-bold text-blue-700 mb-4 pb-2 border-b-2 border-blue-400">Current State</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Units Processed per Month</label>
                        <input
                          type="number"
                          value={data.current.qualityDefect.unitsProcessed}
                          onChange={(e) => updateData('qualityDefect', 'unitsProcessed', Number(e.target.value), 'current')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Defect Percentage (%)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={data.current.qualityDefect.defectPercentage}
                          onChange={(e) => updateData('qualityDefect', 'defectPercentage', Number(e.target.value), 'current')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Per Unit Cost ($)</label>
                        <input
                          type="number"
                          value={data.current.qualityDefect.perUnitCost}
                          onChange={(e) => updateData('qualityDefect', 'perUnitCost', Number(e.target.value), 'current')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Future State */}
                  <div>
                    <h3 className="text-lg font-bold text-purple-700 mb-4 pb-2 border-b-2 border-purple-400">Future State</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Units Processed per Month</label>
                        <input
                          type="number"
                          value={data.future.qualityDefect.unitsProcessed}
                          onChange={(e) => updateData('qualityDefect', 'unitsProcessed', Number(e.target.value), 'future')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Defect Percentage (%)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={data.future.qualityDefect.defectPercentage}
                          onChange={(e) => updateData('qualityDefect', 'defectPercentage', Number(e.target.value), 'future')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Per Unit Cost ($)</label>
                        <input
                          type="number"
                          value={data.future.qualityDefect.perUnitCost}
                          onChange={(e) => updateData('qualityDefect', 'perUnitCost', Number(e.target.value), 'future')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Special Deduction ($ - salvage value, etc.)</label>
                        <input
                          type="number"
                          value={data.future.qualityDefect.specialDeduction}
                          onChange={(e) => updateData('qualityDefect', 'specialDeduction', Number(e.target.value), 'future')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Efficiency Improvement */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={() => toggleSection('efficiency')}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold flex items-center justify-between hover:from-purple-700 hover:to-purple-800 transition-all"
            >
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Section 3: Efficiency Improvement from Automation
              </div>
              {expandedSections.includes('efficiency') ? 
                <ChevronDown className="w-5 h-5" /> : 
                <ChevronRight className="w-5 h-5" />
              }
            </button>
            
            {expandedSections.includes('efficiency') && (
              <div className="p-6">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* Current State */}
                  <div>
                    <h3 className="text-lg font-bold text-blue-700 mb-4 pb-2 border-b-2 border-blue-400">Current State</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Units Processed per Month (Before)</label>
                        <input
                          type="number"
                          value={data.current.efficiency.unitsProcessedBefore}
                          onChange={(e) => updateData('efficiency', 'unitsProcessedBefore', Number(e.target.value), 'current')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contribution per Unit ($)</label>
                        <input
                          type="number"
                          value={data.current.efficiency.contributionPerUnit}
                          onChange={(e) => updateData('efficiency', 'contributionPerUnit', Number(e.target.value), 'current')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Future State */}
                  <div>
                    <h3 className="text-lg font-bold text-purple-700 mb-4 pb-2 border-b-2 border-purple-400">Future State</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Units Processed per Month (After)</label>
                        <input
                          type="number"
                          value={data.future.efficiency.unitsProcessedAfter}
                          onChange={(e) => updateData('efficiency', 'unitsProcessedAfter', Number(e.target.value), 'future')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contribution per Unit ($)</label>
                        <input
                          type="number"
                          value={data.future.efficiency.contributionPerUnit}
                          onChange={(e) => updateData('efficiency', 'contributionPerUnit', Number(e.target.value), 'future')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Additional Cost ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={data.future.efficiency.additionalCost}
                          onChange={(e) => updateData('efficiency', 'additionalCost', Number(e.target.value), 'future')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Custom Sections */}
          {data.current.customSections.map((section) => (
            <div key={section.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold flex items-center justify-between hover:from-teal-700 hover:to-teal-800 transition-all"
              >
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  {section.name}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCustomSection(section.id);
                    }}
                    className="text-red-300 hover:text-red-100 text-sm"
                  >
                    Delete
                  </button>
                  {expandedSections.includes(section.id) ? 
                    <ChevronDown className="w-5 h-5" /> : 
                    <ChevronRight className="w-5 h-5" />
                  }
                </div>
              </button>

              {expandedSections.includes(section.id) && (
                <div className="p-6">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Current State */}
                    <div>
                      <h3 className="text-lg font-bold text-blue-700 mb-4 pb-2 border-b-2 border-blue-400">Current State</h3>
                      <div className="space-y-3">
                        {section.fields.map((field, idx) => {
                          const currentField = data.current.customSections.find(s => s.id === section.id)?.fields[idx];
                          return (
                            <div key={idx}>
                              <label className="block text-sm font-medium text-gray-700 mb-1">{field.name}</label>
                              <input
                                type="number"
                                value={currentField?.value || 0}
                                onChange={(e) => updateCustomSectionField('current', section.id, field.name, Number(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          );
                        })}
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Formula: {section.formula}</p>
                          <p className="text-lg font-bold text-blue-700">
                            Result: ${calculateCustomSectionValue(data.current.customSections.find(s => s.id === section.id)!).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Future State */}
                    <div>
                      <h3 className="text-lg font-bold text-purple-700 mb-4 pb-2 border-b-2 border-purple-400">Future State</h3>
                      <div className="space-y-3">
                        {section.fields.map((field, idx) => {
                          const futureField = data.future.customSections.find(s => s.id === section.id)?.fields[idx];
                          return (
                            <div key={idx}>
                              <label className="block text-sm font-medium text-gray-700 mb-1">{field.name}</label>
                              <input
                                type="number"
                                value={futureField?.value || 0}
                                onChange={(e) => updateCustomSectionField('future', section.id, field.name, Number(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                          );
                        })}
                        <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Formula: {section.formula}</p>
                          <p className="text-lg font-bold text-purple-700">
                            Result: ${calculateCustomSectionValue(data.future.customSections.find(s => s.id === section.id)!).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add Custom Section Button */}
          <button
            onClick={() => setShowAddSectionModal(true)}
            className="w-full px-6 py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 font-semibold hover:border-gray-400 hover:text-gray-700 transition-all flex items-center justify-center"
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            + Add Custom Section
          </button>

          {/* Automation Metrics Section */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <button
              onClick={() => toggleSection('automationMetrics')}
              className="w-full px-6 py-4 bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold flex items-center justify-between hover:from-orange-700 hover:to-orange-800 transition-all"
            >
              <div className="flex items-center">
                <Calculator className="w-5 h-5 mr-2" />
                Automation Investment Metrics
              </div>
              {expandedSections.includes('automationMetrics') ? 
                <ChevronDown className="w-5 h-5" /> : 
                <ChevronRight className="w-5 h-5" />
              }
            </button>
            
            {expandedSections.includes('automationMetrics') && (
              <div className="p-6">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-6">
                  {/* Current State */}
                  <div>
                    <h3 className="text-lg font-bold text-blue-700 mb-4 pb-2 border-b-2 border-blue-400">Current State</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">OPEX of Automation ($)</label>
                        <input
                          type="number"
                          value={data.current.automationMetrics.opexAutomation}
                          onChange={(e) => updateData('automationMetrics', 'opexAutomation', Number(e.target.value), 'current')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CAPEX of Automation ($)</label>
                        <input
                          type="number"
                          value={data.current.automationMetrics.capexAutomation}
                          onChange={(e) => updateData('automationMetrics', 'capexAutomation', Number(e.target.value), 'current')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Future State */}
                  <div>
                    <h3 className="text-lg font-bold text-purple-700 mb-4 pb-2 border-b-2 border-purple-400">Future State</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">OPEX of Automation ($)</label>
                        <input
                          type="number"
                          value={data.future.automationMetrics.opexAutomation}
                          onChange={(e) => updateData('automationMetrics', 'opexAutomation', Number(e.target.value), 'future')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CAPEX of Automation ($)</label>
                        <input
                          type="number"
                          value={data.future.automationMetrics.capexAutomation}
                          onChange={(e) => updateData('automationMetrics', 'capexAutomation', Number(e.target.value), 'future')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Consolidated Results */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Consolidated Automation Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Total Annual Benefit</label>
                      <div className="text-xl font-bold text-green-600">
                        ${metrics.totalBenefit.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <label className="block text-sm font-medium text-gray-600 mb-1">ROI</label>
                      <div className={`text-xl font-bold ${metrics.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {metrics.roi.toFixed(2)}%
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Payback Period</label>
                      <div className="text-lg font-bold text-blue-600">
                        {metrics.paybackYears.toFixed(2)} years
                        <br />
                        <span className="text-sm text-gray-600">({metrics.paybackMonths.toFixed(1)} months)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        )}

        {/* Download Button */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={downloadReport}
            className="flex items-center px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 font-semibold shadow-md transition-all"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Report (Text)
          </button>
          <button
            onClick={downloadFinancialAnalysisPDF}
            className="flex items-center px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 font-semibold shadow-md transition-all"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Report (PDF)
          </button>
        </div>

        {/* Add Instance Modal */}
        {showAddInstanceModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Add New Instance ({addingInstanceType === 'current' ? 'Current State' : 'Future State'})
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Instance Name</label>
                <input
                  type="text"
                  value={newInstanceName}
                  onChange={(e) => setNewInstanceName(e.target.value)}
                  placeholder="e.g., Instance 5, Process Module A"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                You can enter labor, costs, and overhead values after creating the instance. The instance will be included in all calculations.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAddInstanceModal(false);
                    setNewInstanceName('');
                    setAddingInstanceType(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => addProcessInstance(addingInstanceType!)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                >
                  Add Instance
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Custom Section Modal */}
        {showAddSectionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
              {customSectionStep === 'name' && (
                <>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Step 1: Section Name</h3>
                  <input
                    type="text"
                    value={tempSectionName}
                    onChange={(e) => setTempSectionName(e.target.value)}
                    placeholder="e.g., Energy Cost Reduction, Training Impact"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                    autoFocus
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={resetCustomSectionModal}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setCustomSectionStep('fields')}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                    >
                      Next: Add Fields
                    </button>
                  </div>
                </>
              )}

              {customSectionStep === 'fields' && (
                <>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Step 2: Add Fields</h3>
                  <p className="text-sm text-gray-600 mb-4">Add fields that will be used in your ROI formula. Example: "Monthly Energy Cost", "Efficiency Factor"</p>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Field Name</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tempFieldName}
                        onChange={(e) => setTempFieldName(e.target.value)}
                        placeholder="e.g., Monthly_Cost"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                      <button
                        onClick={addFieldToCustomSection}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
                      >
                        + Add Field
                      </button>
                    </div>
                  </div>

                  {tempSectionFields.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Fields ({tempSectionFields.length})</h4>
                      <div className="space-y-2">
                        {tempSectionFields.map((field, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                            <span className="text-gray-700">{idx + 1}. {field.name}</span>
                            <button
                              onClick={() => removeFieldFromCustomSection(idx)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => setCustomSectionStep('name')}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setCustomSectionStep('formula')}
                      disabled={tempSectionFields.length === 0}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium disabled:opacity-50"
                    >
                      Next: Formula
                    </button>
                  </div>
                </>
              )}

              {customSectionStep === 'formula' && (
                <>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Step 3: ROI Formula</h3>
                  <p className="text-sm text-gray-600 mb-4">Enter a formula using field names in curly braces. Example: {`{Monthly_Cost} * 12 + {Additional_Expense}`}</p>
                  
                  <div className="mb-4 p-3 bg-gray-50 rounded">
                    <h4 className="font-semibold text-gray-800 mb-2">Available Fields:</h4>
                    <div className="flex flex-wrap gap-2">
                      {tempSectionFields.map((field, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded">
                          {`{${field.name}}`}
                        </span>
                      ))}
                    </div>
                  </div>

                  <textarea
                    value={tempFormula}
                    onChange={(e) => setTempFormula(e.target.value)}
                    placeholder={`e.g., {${tempSectionFields.length > 0 ? tempSectionFields[0].name : 'Field'}} * 12`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 font-mono text-sm"
                    rows={3}
                    autoFocus
                  />

                  <div className="flex gap-3">
                    <button
                      onClick={() => setCustomSectionStep('fields')}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
                    >
                      Back
                    </button>
                    <button
                      onClick={addCustomSection}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
                    >
                      Create Section
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialAnalysis;