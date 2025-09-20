import { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Dashboard from './components/Dashboard';
import MatchedUseCasesPage from './components/MatchedUseCasesPage';
import AIUseCasesPage from './components/AIUseCasesPage';
import RealUseCasesPage from './components/RealUseCasesPage';
import CurrentStateAnalysisWizard from './components/CurrentStateAnalysisWizard';
import FutureStateAnalysisWizard from './components/FutureStateAnalysisWizard';
import { StrategyResponse } from './types';
import { CurrentStateAnalysis, ScoreBreakdown } from './types/currentStateAnalysis';
import { FutureStateAnalysis, FutureScoreBreakdown } from './types/futureStateAnalysis';

type ViewState = 'login' | 'signup' | 'dashboard' | 'matched' | 'ai' | 'real' | 'analysis' | 'future-analysis';

function AppContent() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [activeTab, setActiveTab] = useState<'identification' | 'implementation' | 'financials'>('identification');
  const [strategyData, setStrategyData] = useState<StrategyResponse | null>(null);
  const [realUseCasesData, setRealUseCasesData] = useState<any[]>([]);
  const [analysisData, setAnalysisData] = useState<{ analysis: CurrentStateAnalysis; scores: ScoreBreakdown } | null>(null);
  const [futureAnalysisData, setFutureAnalysisData] = useState<{ analysis: FutureStateAnalysis; scores: FutureScoreBreakdown } | null>(null);
  const [selectedSector, setSelectedSector] = useState<string>('service'); // Add sector state

  if (!user) {
    return currentView === 'signup' ? (
      <SignupPage onShowLogin={() => setCurrentView('login')} />
    ) : (
      <LoginPage onShowSignup={() => setCurrentView('signup')} />
    );
  }

  const handleGenerateStrategy = (response: StrategyResponse) => {
    console.log("Received strategy response:", response);
    
    // Ensure the response has all the required properties
    const validResponse = {
      matchedUseCases: response.matchedUseCases || {},
      aiUseCases: response.aiUseCases || {},
      realUseCases: response.realUseCases || {}
    };
    
    setStrategyData(validResponse);
    // Switch to implementation tab instead of matched view
    setActiveTab('implementation');
    setCurrentView('dashboard');
  };

  const handleNavigateToTab = (tab: 'identification' | 'implementation' | 'financials') => {
    setActiveTab(tab);
    switch (tab) {
      case 'identification':
        setCurrentView('dashboard');
        break;
      case 'implementation':
        setCurrentView('dashboard');
        break;
      case 'financials':
        setCurrentView('analysis');
        break;
    }
  };

  const handleRestart = () => {
    setCurrentView('dashboard');
    setStrategyData(null);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard 
          onGenerateStrategy={handleGenerateStrategy} 
          onStartAnalysis={() => setCurrentView('analysis')}
          onSectorChange={setSelectedSector}
          initialTab={activeTab}
          realUseCasesData={realUseCasesData}
        />;
      
      case 'analysis':
        return (
          <CurrentStateAnalysisWizard
            onComplete={(analysis, scores) => {
              setAnalysisData({ analysis, scores });
              setCurrentView('dashboard');
              alert(`Analysis complete! Total score: ${scores.total}/300 - ${scores.outcome}`);
            }}
            onStartFutureAnalysis={() => setCurrentView('future-analysis')}
            onNavigateToTab={handleNavigateToTab}
          />
        );
      
      case 'future-analysis':
        return (
          <FutureStateAnalysisWizard
            onComplete={(analysis, scores) => {
              setFutureAnalysisData({ analysis, scores });
              setCurrentView('dashboard');
              alert(`Future State Planning complete! Total score: ${scores.total}/302 - ${scores.outcome}`);
            }}
            currentAnalysis={analysisData || undefined}
            onNavigateToTab={handleNavigateToTab}
          />
        );
      
      case 'matched':
        return strategyData ? (
          <MatchedUseCasesPage
            useCases={strategyData.matchedUseCases}
            sector={selectedSector}
            onViewAIUseCases={(passedRealUseCasesData) => {
              console.log("Transitioning to AI Use Cases view");
              if (passedRealUseCasesData) {
                setRealUseCasesData(passedRealUseCasesData);
              }
              setCurrentView('ai');
            }}
            onViewPrevious={() => setCurrentView('dashboard')}
            onRestart={handleRestart}
          />
        ) : null;
      
      case 'ai':
        console.log("AI Use Cases data:", strategyData?.aiUseCases);
        return strategyData ? (
          <AIUseCasesPage
            useCases={strategyData.aiUseCases || {}}
            onViewRealUseCases={(passedRealUseCasesData) => {
              if (passedRealUseCasesData) {
                setRealUseCasesData(passedRealUseCasesData);
              }
              setCurrentView('real');
            }}
            onViewPrevious={() => setCurrentView('matched')}
            onRestart={handleRestart}
            realUseCasesData={realUseCasesData}
          />
        ) : null;
      
      case 'real':
        return strategyData ? (
          <RealUseCasesPage
            useCases={strategyData.realUseCases}
            onRestart={handleRestart}
            onViewPrevious={() => setCurrentView('ai')}
            realUseCasesData={realUseCasesData}
          />
        ) : null;
      
      default:
        return <Dashboard 
          onGenerateStrategy={handleGenerateStrategy} 
          onStartAnalysis={() => setCurrentView('analysis')}
          initialTab={activeTab}
          realUseCasesData={realUseCasesData}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Header />
      <main>{renderCurrentView()}</main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
