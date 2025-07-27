import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { auth, db, appId, addDoc, collection, query, onSnapshot, signOut } from '@/lib/firebase';
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

interface WholesalerDashboardProps {
  user: User;
  onLogout: () => void;
}

const WholesalerDashboard: React.FC<WholesalerDashboardProps> = ({ user, onLogout }) => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const productsCollectionRef = collection(db, `artifacts/${appId}/public/data/products`);
    const q = query(productsCollectionRef);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const userProducts: Product[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.wholesalerId === user.uid) {
          userProducts.push({ id: doc.id, ...data } as Product);
        }
      });
      setProducts(userProducts);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user.uid]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !price || !quantity) {
      setError('Please fill out all fields.');
      return;
    }
    setError('');
    setAdding(true);
    
    try {
      const productsCollectionRef = collection(db, `artifacts/${appId}/public/data/products`);
      await addDoc(productsCollectionRef, {
        productName,
        price: parseFloat(price),
        quantity,
        wholesalerId: user.uid,
        wholesalerEmail: user.email,
        createdAt: new Date(),
      });
      setProductName('');
      setPrice('');
      setQuantity('');
    } catch (err) {
      console.error("Error adding document: ", err);
      setError('Failed to add product. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    onLogout();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">Wholesaler Dashboard</h1>
          <Button onClick={handleLogout} variant="destructive">
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Product Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Add a New Product</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="productName">Product Name</Label>
                  <Input
                    id="productName"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g., Fresh Tomatoes"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Price (per unit)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g., 2.50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quantity">Available Quantity</Label>
                  <Input
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g., 50 kg"
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={adding}>
                  {adding ? 'Adding...' : 'Add Product'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Product List */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Your Product Listings</h2>
          {loading ? (
            <Card>
              <CardContent className="p-6">
                <p>Loading your products...</p>
              </CardContent>
            </Card>
          ) : products.length > 0 ? (
            <div className="space-y-4">
              {products.map(product => (
                <Card key={product.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-lg text-foreground">{product.productName}</h3>
                        <p className="text-muted-foreground">Price: ${product.price.toFixed(2)}</p>
                        <p className="text-muted-foreground">Quantity: {product.quantity}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">You haven't added any products yet. Use the form to get started!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default WholesalerDashboard;