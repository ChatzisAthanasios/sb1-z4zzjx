import React, { useState, useEffect } from 'react';
import { Mail, Wand2, Sparkles, Zap, BarChart2, Layout, Brain, Lock, ArrowRight } from 'lucide-react';
import { BusinessForm } from './components/BusinessForm';
import { EmailPreview } from './components/EmailPreview';
import { TemplateUpload } from './components/TemplateUpload';
import { CampaignCreator } from './components/CampaignCreator';
import { CampaignManager } from './components/CampaignManager';
import { generateEmail } from './lib/ai';
import { EMAIL_TEMPLATE } from './templates/emailTemplate';
import type { BusinessInfo } from './types/business';

export function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'generator' | 'campaign' | 'manager'>('home');
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [generatedEmail, setGeneratedEmail] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [template, setTemplate] = useState(EMAIL_TEMPLATE);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab === 'manager') {
      setActiveTab('manager');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const handleGenerate = async (info: BusinessInfo) => {
    setIsGenerating(true);
    setError(null);
    setBusinessInfo(info);
    
    try {
      const email = await generateEmail(info, template);
      setGeneratedEmail(email);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to generate email');
      console.error('Failed to generate email:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'campaign':
        return <CampaignCreator />;
      case 'manager':
        return <CampaignManager />;
      case 'generator':
        return (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-neutral-900 mb-4">
                AI-Powered Email Campaign Generator
              </h2>
              <p className="text-xl text-neutral-600">
                Create professional, personalized email campaigns in seconds
              </p>
            </div>

            {error && (
              <div className="mb-8 bg-error-light border border-error text-error-text rounded-lg p-4">
                <p>{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="card">
                  <div className="flex items-center space-x-2 mb-6">
                    <Wand2 className="w-6 h-6 text-primary-600" />
                    <h3 className="text-xl font-semibold text-neutral-900">
                      Business Information
                    </h3>
                  </div>
                  <BusinessForm onSubmit={handleGenerate} isGenerating={isGenerating} />
                </div>

                <div className="card">
                  <TemplateUpload 
                    onTemplateChange={setTemplate}
                    defaultTemplate={EMAIL_TEMPLATE}
                  />
                </div>
              </div>

              <div className="card">
                <h3 className="text-xl font-semibold text-neutral-900 mb-6">
                  Email Preview
                </h3>
                <EmailPreview 
                  html={generatedEmail} 
                  isGenerating={isGenerating}
                  businessInfo={businessInfo}
                  error={error}
                />
              </div>
            </div>
          </main>
        );
      default:
        return (
          <div className="space-y-24">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-16 md:pt-24">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-8 relative z-10">
                  <div className="inline-flex items-center px-4 py-2 bg-primary-100 rounded-full text-primary-700 mb-8">
                    <Sparkles className="w-4 h-4 mr-2" />
                    <span>Revolutionizing Email Marketing with AI</span>
                  </div>
                  <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 tracking-tight">
                    Create Perfect Email Campaigns<br />
                    <span className="text-primary-600">Powered by AI</span>
                  </h1>
                  <p className="max-w-2xl mx-auto text-xl text-neutral-600">
                    Transform your email marketing with AI-driven personalization. Create, manage, and optimize 
                    campaigns that connect with your audience on a deeper level.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <button 
                      onClick={() => setActiveTab('generator')}
                      className="btn-primary text-lg px-8 py-3"
                    >
                      Start Creating
                      <ArrowRight className="w-5 h-5 ml-2 inline" />
                    </button>
                    <a href="#features" className="btn-secondary text-lg px-8 py-3">
                      Learn More
                    </a>
                  </div>
                </div>

                {/* Preview Image */}
                <div className="mt-16 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-primary-600 bg-opacity-5 blur-3xl w-96 h-96 rounded-full"></div>
                  </div>
                  <img 
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"
                    alt="EmailChamp.ai Dashboard"
                    className="relative rounded-xl shadow-2xl border border-gray-200"
                  />
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 bg-gradient-to-b from-primary-50 to-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-neutral-900 mb-4">
                    Everything You Need for Email Success
                  </h2>
                  <p className="text-xl text-neutral-600">
                    Powerful features that make email marketing effortless
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    {
                      icon: Brain,
                      title: "AI-Powered Content",
                      description: "Generate engaging email content tailored to your brand voice and audience preferences."
                    },
                    {
                      icon: Layout,
                      title: "Visual Editor",
                      description: "Drag-and-drop interface for creating beautiful, responsive emails without coding."
                    },
                    {
                      icon: Zap,
                      title: "Smart Automation",
                      description: "Set up intelligent campaign sequences that adapt to subscriber behavior."
                    },
                    {
                      icon: BarChart2,
                      title: "Analytics & Insights",
                      description: "Track performance and get AI-powered recommendations for improvement."
                    },
                    {
                      icon: Lock,
                      title: "Compliance & Security",
                      description: "Stay compliant with email regulations and protect your subscribers' data."
                    },
                    {
                      icon: Mail,
                      title: "Campaign Management",
                      description: "Organize and manage all your email campaigns from a central dashboard."
                    }
                  ].map((feature, index) => (
                    <div key={index} className="card hover:shadow-lg transition-shadow">
                      <div className="p-6">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                          <feature.icon className="w-6 h-6 text-primary-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-neutral-600">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Social Proof */}
            <section className="py-16 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-neutral-900 mb-4">
                    Trusted by Innovative Companies
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
                    {[
                      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=200&h=80&q=80",
                      "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=200&h=80&q=80",
                      "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?auto=format&fit=crop&w=200&h=80&q=80",
                      "https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=200&h=80&q=80"
                    ].map((logo, index) => (
                      <div key={index} className="flex items-center justify-center p-4">
                        <img src={logo} alt={`Company ${index + 1}`} className="max-h-12" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-primary-900 text-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-bold mb-4">
                  Ready to Transform Your Email Marketing?
                </h2>
                <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
                  Join thousands of businesses using EmailChamp.ai to create engaging email campaigns that drive results.
                </p>
                <button 
                  onClick={() => setActiveTab('generator')}
                  className="btn bg-white text-primary-900 hover:bg-primary-50 text-lg px-8 py-3"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2 inline" />
                </button>
              </div>
            </section>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <nav className="bg-white shadow-soft sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="w-8 h-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-neutral-900">EmailChamp.ai</h1>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('home')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'home'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setActiveTab('generator')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'generator'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Email Generator
              </button>
              <button
                onClick={() => setActiveTab('campaign')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'campaign'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Campaign Creator
              </button>
              <button
                onClick={() => setActiveTab('manager')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'manager'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Campaign Manager
              </button>
            </div>
          </div>
        </div>
      </nav>

      {renderContent()}
    </div>
  );
}