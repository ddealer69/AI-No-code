import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Dashboard from './components/Dashboard';
import MatchedUseCasesPage from './components/MatchedUseCasesPage';
import AIUseCasesPage from './components/AIUseCasesPage';
import RealUseCasesPage from './components/RealUseCasesPage';
import { StrategyResponse } from './types';

type ViewState = 'login' | 'signup' | 'dashboard' | 'matched' | 'ai' | 'real';

function AppContent() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [strategyData, setStrategyData] = useState<StrategyResponse | null>(null);

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
    setCurrentView('matched');
  };

  const handleRestart = () => {
    setCurrentView('dashboard');
    setStrategyData(null);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onGenerateStrategy={handleGenerateStrategy} />;
      
      case 'matched':
        return strategyData ? (
          <MatchedUseCasesPage
            useCases={strategyData.matchedUseCases}
            onViewAIUseCases={() => {
              console.log("Transitioning to AI Use Cases view");
              setCurrentView('ai');
            }}
            onRestart={handleRestart}
          />
        ) : null;
      
      case 'ai':
        console.log("AI Use Cases data:", strategyData?.aiUseCases);
        return strategyData ? (
          <AIUseCasesPage
            useCases={strategyData.aiUseCases || {}}
            onViewRealUseCases={() => setCurrentView('real')}
            onRestart={handleRestart}
          />
        ) : null;
      
      case 'real':
        return strategyData ? (
          <RealUseCasesPage
            useCases={strategyData.realUseCases}
            onRestart={handleRestart}
          />
        ) : null;
      
      default:
        return <Dashboard onGenerateStrategy={handleGenerateStrategy} />;
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