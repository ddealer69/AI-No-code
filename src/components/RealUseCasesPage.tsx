import React from 'react';
import { Download, Mail, RotateCcw, Building2, Target, TrendingUp } from 'lucide-react';
import { RealUseCase } from '../types';

interface RealUseCasesPageProps {
  useCases: { [key: string]: RealUseCase };
  onRestart: () => void;
}

const RealUseCasesPage: React.FC<RealUseCasesPageProps> = ({
  useCases,
  onRestart
}) => {
  const useCasesList = Object.values(useCases);

  const handleExport = () => {
    const content = useCasesList.map((useCase) => `
Company: ${useCase.company}
Business Process: ${useCase.businessProcess}
Function: ${useCase.function}
Outcome: ${useCase.outcome}

Real Project 1: ${useCase.project1}
Real Project 2: ${useCase.project2}

---
`).join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-strategy-real-use-cases.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleEmailExport = () => {
    const subject = 'AI Strategy Explorer - Real Use Cases Report';
    const body = useCasesList.map((useCase) => `
Company: ${useCase.company}
Business Process: ${useCase.businessProcess}
Function: ${useCase.function}
Outcome: ${useCase.outcome}

Real Project 1: ${useCase.project1}
Real Project 2: ${useCase.project2}
`).join('\n\n---\n\n');

    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Real Use Cases</h1>
          <p className="text-gray-600">Industry examples and proven implementations</p>
        </div>

        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export as TXT</span>
          </button>

          <button
            onClick={handleEmailExport}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Mail className="h-4 w-4" />
            <span>Email Report</span>
          </button>

          <button
            onClick={onRestart}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Restart Journey</span>
          </button>
        </div>
      </div>

      {/* Real Use Cases */}
      <div className="space-y-6">
        {useCasesList.map((useCase) => (
          <div
            key={useCase.id}
            className="bg-white rounded-xl shadow-lg border overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Building2 className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">{useCase.company}</h2>
                </div>
                <div className="text-sm text-blue-600 font-medium">
                  Real World Implementation
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Target className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Business Process</h3>
                      <p className="text-gray-600">{useCase.businessProcess}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Target className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Function</h3>
                      <p className="text-gray-600">{useCase.function}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <TrendingUp className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Achieved Outcome</h3>
                    <p className="text-green-700 font-medium">{useCase.outcome}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Real Project Example 1</h3>
                  <p className="text-gray-700 leading-relaxed">{useCase.project1}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Real Project Example 2</h3>
                  <p className="text-gray-700 leading-relaxed">{useCase.project2}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Section */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Ready to Implement Your AI Strategy?
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          You've explored {useCasesList.length} real-world examples of successful AI implementations. 
          These case studies demonstrate proven approaches and measurable outcomes for similar business challenges.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleExport}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Download Complete Report
          </button>
          <button
            onClick={onRestart}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Explore Another Strategy
          </button>
        </div>
      </div>
    </div>
  );
};

export default RealUseCasesPage;