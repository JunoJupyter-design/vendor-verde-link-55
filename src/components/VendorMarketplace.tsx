import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { auth, db, appId, collection, query, onSnapshot, signOut } from '@/lib/firebase';
import { User } from 'firebase/auth';

interface Product {
  id: string;
  productName: string;
  price: number;
  quantity: string;
  wholesalerId: string;
  wholesalerEmail: string;
  createdAt: any;
}

interface VendorMarketplaceProps {
  user: User;
  onLogout: () => void;
}

const VendorMarketplace: React.FC<VendorMarketplaceProps> = ({ user, onLogout }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const productsCollectionRef = collection(db, `artifacts/${appId}/public/data/products`);
    const q = query(productsCollectionRef);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const productsList: Product[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        productsList.push({ id: doc.id, ...data } as Product);
      });
      setProducts(productsList);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching products: ", err);
      setError("Could not load products. Please try again later.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    onLogout();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">Vendor Marketplace</h1>
          <Button onClick={handleLogout} variant="destructive">
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Available Products</h2>
        
        {loading && (
          <Card>
            <CardContent className="p-6">
              <p>Loading available products...</p>
            </CardContent>
          </Card>
        )}
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.length > 0 ? products.map(product => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl text-primary mb-2">{product.productName}</h3>
                  <p className="text-foreground font-semibold text-lg mb-2">${product.price.toFixed(2)}</p>
                  <p className="text-muted-foreground mb-4">
                    Available: <span className="font-medium">{product.quantity}</span>
                  </p>
                  <div className="border-t pt-4">
                    <p className="text-sm text-muted-foreground">Sold by:</p>
                    <p className="text-sm font-medium text-foreground">{product.wholesalerEmail}</p>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <Card className="col-span-full">
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No products are currently listed in the marketplace.</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default VendorMarketplace;