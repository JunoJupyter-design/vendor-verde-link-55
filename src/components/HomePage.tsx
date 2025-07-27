import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import LoginModal from "@/components/LoginModal";
import SignupModal from "@/components/SignupModal";
import { Heart, Store, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Food Emoji Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl transform -rotate-12">🍅</div>
        <div className="absolute top-20 right-20 text-5xl transform rotate-45">🥔</div>
        <div className="absolute top-40 left-1/4 text-4xl transform -rotate-45">🧅</div>
        <div className="absolute bottom-20 left-20 text-7xl transform rotate-12">🥛</div>
        <div className="absolute bottom-40 right-10 text-5xl transform -rotate-12">🍎</div>
        <div className="absolute top-1/3 right-1/3 text-6xl transform rotate-90">🥚</div>
        <div className="absolute bottom-1/3 left-1/3 text-4xl transform -rotate-90">🥦</div>
        <div className="absolute top-1/2 left-10 text-5xl transform rotate-45">🌶️</div>
        <div className="absolute bottom-10 right-1/4 text-6xl transform -rotate-45">🧄</div>
        <div className="absolute top-60 right-1/2 text-4xl transform rotate-12">🍞</div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6">
        <div className="flex items-center gap-2">
          <Heart className="h-8 w-8 text-primary fill-primary animate-pulse" />
          <h1 className="text-2xl font-bold text-primary">बाज़ार बंधु</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <LanguageToggle />
          <Button
            variant="outline"
            onClick={() => setShowLogin(true)}
            className="bg-white/10 text-primary border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 hover:scale-105"
          >
            {t('login')}
          </Button>
          <Button
            onClick={() => setShowSignup(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:scale-105 shadow-primary"
          >
            {t('signup')}
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="animate-slide-in">
            <h2 className="text-4xl md:text-6xl font-bold text-primary mb-4 leading-tight">
              {t('welcome')}
            </h2>
            <div className="flex items-center justify-center gap-2 mb-8">
              <Heart className="h-6 w-6 text-red-500 fill-red-500 animate-bounce" />
              <p className="text-xl text-muted-foreground">
                आपका विश्वसनीय बाज़ार साथी
              </p>
              <Heart className="h-6 w-6 text-red-500 fill-red-500 animate-bounce" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div 
              className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 cursor-pointer"
              onClick={() => navigate('/grocery')}
            >
              <ShoppingCart className="h-10 w-10 text-primary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-primary mb-3 text-center">Grocery Store</h3>
              <p className="text-muted-foreground text-center">Browse fresh groceries and daily essentials</p>
            </div>
            
            <div 
              className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 cursor-pointer"
              onClick={() => navigate('/marketplace')}
            >
              <Store className="h-10 w-10 text-primary mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-primary mb-3 text-center">Vendor Marketplace</h3>
              <p className="text-muted-foreground text-center">Connect wholesalers with street vendors</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl mb-4 text-center">🏪</div>
              <h3 className="text-xl font-semibold text-primary mb-3 text-center">विक्रेताओं के लिए</h3>
              <p className="text-muted-foreground text-center">अपने उत्पादों को सीधे ग्राहकों तक पहुंचाएं</p>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
      <SignupModal open={showSignup} onClose={() => setShowSignup(false)} />
    </div>
  );
};

export default HomePage;