import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth, db, appId, onAuthStateChanged, getDoc, doc, signInAnonymously, signInWithCustomToken } from '@/lib/firebase';
import MarketplaceAuth from './MarketplaceAuth';
import WholesalerDashboard from './WholesalerDashboard';
import VendorMarketplace from './VendorMarketplace';
import { Card, CardContent } from "@/components/ui/card";

const MarketplaceApp: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authAndTokenSignIn = async () => {
      try {
        const initialToken = (window as any).__initial_auth_token;
        if (initialToken) {
          await signInWithCustomToken(auth, initialToken);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        try {
          await signInAnonymously(auth);
        } catch (fallbackError) {
          console.error("Anonymous sign-in also failed:", fallbackError);
        }
      }
    };

    authAndTokenSignIn();
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Fetch user type from Firestore
        try {
          const userDocRef = doc(db, `artifacts/${appId}/users`, currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUserType(userDocSnap.data().userType);
          }
        } catch (error) {
          console.error("Error fetching user type:", error);
        }
      } else {
        setUser(null);
        setUserType(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    setUserType(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Card>
          <CardContent className="p-6">
            <div className="text-xl font-semibold">Loading...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user && userType) {
    if (userType === 'Wholesaler') {
      return <WholesalerDashboard user={user} onLogout={handleLogout} />;
    }
    if (userType === 'Vendor') {
      return <VendorMarketplace user={user} onLogout={handleLogout} />;
    }
  }

  return <MarketplaceAuth onAuthSuccess={() => {}} />;
};

export default MarketplaceApp;