import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { auth, db, appId, createUserWithEmailAndPassword, signInWithEmailAndPassword, doc, setDoc } from '@/lib/firebase';

interface MarketplaceAuthProps {
  onAuthSuccess: () => void;
}

const MarketplaceAuth: React.FC<MarketplaceAuthProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedUserType, setSelectedUserType] = useState('Vendor');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const userDocRef = doc(db, `artifacts/${appId}/users`, user.uid);
        await setDoc(userDocRef, {
          email: user.email,
          userType: selectedUserType,
          uid: user.uid,
        });
      }
      onAuthSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">
            Welcome to VerdeLink
          </CardTitle>
          <p className="text-muted-foreground">
            {isLogin ? 'Log in to your account' : 'Connecting vendors and suppliers'}
          </p>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleAuthAction} className="space-y-4">
            {!isLogin && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">I am a...</Label>
                <div className="flex rounded-lg border overflow-hidden">
                  <Button
                    type="button"
                    variant={selectedUserType === 'Vendor' ? 'default' : 'outline'}
                    className="w-1/2 rounded-none"
                    onClick={() => setSelectedUserType('Vendor')}
                  >
                    Street Vendor
                  </Button>
                  <Button
                    type="button"
                    variant={selectedUserType === 'Wholesaler' ? 'default' : 'outline'}
                    className="w-1/2 rounded-none"
                    onClick={() => setSelectedUserType('Wholesaler')}
                  >
                    Wholesaler
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Loading...' : (isLogin ? 'Log In' : 'Create Account')}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <Button 
              variant="link" 
              className="p-0 ml-1 h-auto font-semibold"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketplaceAuth;