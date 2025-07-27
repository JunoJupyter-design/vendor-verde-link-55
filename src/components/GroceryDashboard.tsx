import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  ShoppingCart, 
  Trash2, 
  MapPin, 
  Search, 
  Languages, 
  Clock, 
  Package, 
  CreditCard, 
  Calendar as CalendarIcon, 
  CheckCircle, 
  QrCode,
  X,
  RotateCcw,
  AlertTriangle,
  Eye,
  Hash
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend } from "date-fns";

interface Product {
  category: string;
  product: string;
  desc: string;
  img: string;
  mrp: number;
}

interface CartItem {
  product: string;
  frequency: 'oneTime' | 'daily' | 'weekly' | 'monthly';
  quantity: number;
  mrp: number;
  serialNumber?: string;
}

interface DeliverySlot {
  id: string;
  name: string;
  time: string;
}

interface OrderItem extends CartItem {
  serialNumber: string;
  status: 'pending' | 'delivered' | 'cancelled' | 'returned';
  returnReason?: string;
  deliveryDates: string[];
}

interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  deliverySlot: DeliverySlot;
  total: number;
  status: 'pending' | 'paid';
  paymentDue: string;
  monthlyCharge?: number;
}

const GroceryDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("mumbai");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedDeliverySlot, setSelectedDeliverySlot] = useState<DeliverySlot | null>(null);
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);
  const [isPaymentConfirmationOpen, setIsPaymentConfirmationOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("shopping");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [isCalendarPreviewOpen, setIsCalendarPreviewOpen] = useState(false);
  const [selectedOrderForView, setSelectedOrderForView] = useState<Order | null>(null);
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  const [selectedItemForReturn, setSelectedItemForReturn] = useState<{ orderId: string; itemIndex: number } | null>(null);
  const [returnReason, setReturnReason] = useState("");
  const { toast } = useToast();
  const { t, language, toggleLanguage } = useLanguage();

  const DELIVERY_SLOTS: DeliverySlot[] = [
    { id: 'morning', name: t('morningSlot'), time: '9:00 AM – 12:00 PM' },
    { id: 'afternoon', name: t('afternoonSlot'), time: '4:00 PM – 7:00 PM' }
  ];

  const PRODUCTS: Product[] = [
    // Vegetables
    {category: 'vegetables', product: 'onion', desc: 'Fresh onions', img: '🧅', mrp: 20},
    {category: 'vegetables', product: 'tomato', desc: 'Juicy red tomatoes', img: '🍅', mrp: 18},
    {category: 'vegetables', product: 'garlic', desc: 'Aromatic garlic bulbs', img: '🧄', mrp: 25},
    {category: 'vegetables', product: 'potato', desc: 'Fresh potatoes', img: '🥔', mrp: 15},
    {category: 'vegetables', product: 'carrot', desc: 'Fresh orange carrots', img: '🥕', mrp: 22},
    {category: 'vegetables', product: 'cauliflower', desc: 'White fresh cauliflower', img: '🥬', mrp: 30},
    {category: 'vegetables', product: 'spinach', desc: 'Green leafy spinach', img: '🥬', mrp: 25},
    {category: 'vegetables', product: 'beans', desc: 'Fresh green beans', img: '🫛', mrp: 35},
    {category: 'vegetables', product: 'peas', desc: 'Sweet green peas', img: '🟢', mrp: 40},
    {category: 'vegetables', product: 'cabbage', desc: 'Fresh cabbage head', img: '🥬', mrp: 18},
    {category: 'vegetables', product: 'chillies', desc: 'Hot green chillies', img: '🌶️', mrp: 30},
    {category: 'vegetables', product: 'brinjal', desc: 'Purple fresh brinjal', img: '🍆', mrp: 28},
    
    // Dairy Products
    {category: 'dairyProducts', product: 'milk', desc: 'Pure cow milk', img: '🥛', mrp: 45},
    {category: 'dairyProducts', product: 'eggs', desc: 'Organic farm eggs', img: '🥚', mrp: 60},
    
    // Spices and Oils
    {category: 'spicesAndOils', product: 'ghee', desc: 'Pure clarified butter', img: '🧈', mrp: 250},
    {category: 'spicesAndOils', product: 'oil', desc: 'Premium cooking oil', img: '🫒', mrp: 120},
    {category: 'spicesAndOils', product: 'redSpice', desc: 'Hot and spicy red chili powder', img: '🌶️', mrp: 70},
    {category: 'spicesAndOils', product: 'corianderPowder', desc: 'Fresh coriander powder', img: '🌿', mrp: 55},
    {category: 'spicesAndOils', product: 'turmericPowder', desc: 'Pure turmeric powder', img: '🟡', mrp: 80},
    {category: 'spicesAndOils', product: 'garamMasala', desc: 'Aromatic garam masala', img: '🌶️', mrp: 90},
    {category: 'spicesAndOils', product: 'cuminSeeds', desc: 'Whole cumin seeds', img: '🟤', mrp: 120},
    {category: 'spicesAndOils', product: 'blackPepper', desc: 'Ground black pepper', img: '⚫', mrp: 200},
    {category: 'spicesAndOils', product: 'mustardSeeds', desc: 'Black mustard seeds', img: '🟤', mrp: 85},
    {category: 'spicesAndOils', product: 'fenugreek', desc: 'Dried fenugreek leaves', img: '🌿', mrp: 65},
    {category: 'spicesAndOils', product: 'asafoetida', desc: 'Pure asafoetida powder', img: '🟡', mrp: 300},
    
    // Meat & Poultry
    {category: 'meatAndPoultry', product: 'chicken', desc: 'Fresh chicken meat', img: '🍗', mrp: 180},
    {category: 'meatAndPoultry', product: 'mutton', desc: 'Fresh mutton meat', img: '🥩', mrp: 450},
    {category: 'meatAndPoultry', product: 'fish', desc: 'Fresh fish fillets', img: '🐟', mrp: 250},
    {category: 'meatAndPoultry', product: 'prawns', desc: 'Fresh tiger prawns', img: '🦐', mrp: 400},
    
    // Others
    {category: 'others', product: 'apples', desc: 'Best quality, fresh apples', img: '🍎', mrp: 85},
    {category: 'others', product: 'broccoli', desc: 'Crisp green broccoli bunch', img: '🥦', mrp: 90},
    {category: 'others', product: 'rice', desc: 'Premium basmati rice', img: '🍚', mrp: 120},
    {category: 'others', product: 'bread', desc: 'Freshly baked bread', img: '🍞', mrp: 30},
    {category: 'others', product: 'noodles', desc: 'Instant noodles pack', img: '🍜', mrp: 40},
    {category: 'others', product: 'momos', desc: 'Steamed vegetable momos', img: '🥟', mrp: 150}
  ];

  const CATEGORIES = ['vegetables', 'dairyProducts', 'spicesAndOils', 'meatAndPoultry', 'others'];

  const generateSerialNumber = () => {
    const allItems = orders.flatMap(order => order.items);
    return String(allItems.length + cart.length + 1).padStart(3, '0');
  };

  const calculateMonthlyDeliveryDates = (frequency: CartItem['frequency'], startDate: Date = new Date()) => {
    const monthStart = startOfMonth(startDate);
    const monthEnd = endOfMonth(startDate);
    const dates: Date[] = [];

    switch (frequency) {
      case 'oneTime':
        dates.push(startDate);
        break;
      case 'daily':
        // Deliver on weekdays only
        const allDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
        dates.push(...allDays.filter(day => !isWeekend(day)));
        break;
      case 'weekly':
        // Deliver every 7 days, 4 times in a month
        for (let i = 0; i < 4; i++) {
          const deliveryDate = addDays(monthStart, i * 7);
          if (deliveryDate <= monthEnd) {
            dates.push(deliveryDate);
          }
        }
        break;
      case 'monthly':
        dates.push(monthStart);
        break;
    }

    return dates;
  };

  const calculateMonthlyCharge = (item: CartItem) => {
    const deliveryDates = calculateMonthlyDeliveryDates(item.frequency);
    const baseAmount = item.mrp * item.quantity;
    
    switch (item.frequency) {
      case 'oneTime':
        return baseAmount;
      case 'daily':
        return baseAmount * deliveryDates.length; // Number of weekdays
      case 'weekly':
        return baseAmount * 4; // 4 weeks
      case 'monthly':
        return baseAmount;
      default:
        return baseAmount;
    }
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product =>
      t(product.product).toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.desc.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, t]);

  const addToCart = (product: Product, frequency: CartItem['frequency'], quantity: number) => {
    const existingIndex = cart.findIndex(item => item.product === product.product);
    
    if (existingIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].frequency = frequency;
      updatedCart[existingIndex].quantity = quantity;
      setCart(updatedCart);
      toast({
        title: t('cartUpdated'),
        description: `${t(product.product)} subscription updated to ${t(frequency)}, quantity: ${quantity}${t('kg')}`,
      });
    } else {
      setCart([...cart, { 
        product: product.product, 
        frequency, 
        quantity,
        mrp: product.mrp 
      }]);
      toast({
        title: t('addedToCart'),
        description: `${t(product.product)} added with ${t(frequency)} subscription, quantity: ${quantity}${t('kg')}`,
      });
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsCalendarPreviewOpen(true);
  };

  const proceedToDeliverySlots = () => {
    setIsCalendarPreviewOpen(false);
    setIsCheckoutDialogOpen(true);
  };

  const confirmDeliverySlot = (slot: DeliverySlot) => {
    setSelectedDeliverySlot(slot);
    setIsCheckoutDialogOpen(false);
    setIsPaymentConfirmationOpen(true);
  };

  const finalizeOrder = () => {
    if (!selectedDeliverySlot) return;
    
    const orderDate = new Date();
    const paymentDueDate = new Date(orderDate);
    paymentDueDate.setDate(orderDate.getDate() + 30);
    
    const orderItems: OrderItem[] = cart.map(item => ({
      ...item,
      serialNumber: generateSerialNumber(),
      status: 'pending',
      deliveryDates: calculateMonthlyDeliveryDates(item.frequency, orderDate).map(date => format(date, 'yyyy-MM-dd'))
    }));
    
    const monthlyCharge = orderItems.reduce((sum, item) => sum + calculateMonthlyCharge(item), 0);
    
    const newOrder: Order = {
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      date: orderDate.toISOString().split('T')[0],
      items: orderItems,
      deliverySlot: selectedDeliverySlot,
      total: cart.reduce((sum, item) => sum + (item.mrp * item.quantity), 0),
      monthlyCharge,
      status: 'pending',
      paymentDue: paymentDueDate.toISOString().split('T')[0]
    };
    
    setOrders([newOrder, ...orders]);
    setIsPaymentConfirmationOpen(false);
    setCart([]);
    setSelectedDeliverySlot(null);
    setActiveTab("orders");
    
    toast({
      title: t('orderConfirmed'),
      description: t('orderSuccess'),
    });
  };

  const openPaymentDialog = (orderId: string) => {
    setSelectedOrderForPayment(orderId);
    setIsPaymentDialogOpen(true);
    setUpiId("");
  };

  const processPayment = async () => {
    if (!upiId.trim() || !selectedOrderForPayment) return;
    
    setIsProcessingPayment(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setOrders(orders.map(order => 
      order.id === selectedOrderForPayment ? { ...order, status: 'paid' } : order
    ));
    
    setIsProcessingPayment(false);
    setIsPaymentDialogOpen(false);
    setSelectedOrderForPayment(null);
    setUpiId("");
    
    toast({
      title: t('paymentSuccess'),
      description: t('paymentCelebration'),
    });
  };

  const cancelOrderItem = (orderId: string, itemIndex: number) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        const updatedItems = [...order.items];
        updatedItems[itemIndex] = { ...updatedItems[itemIndex], status: 'cancelled' };
        return { ...order, items: updatedItems };
      }
      return order;
    }));
    
    const order = orders.find(o => o.id === orderId);
    const item = order?.items[itemIndex];
    
    toast({
      title: "Order Cancelled",
      description: `Order #${item?.serialNumber} cancelled successfully!`,
    });
  };

  const openReturnDialog = (orderId: string, itemIndex: number) => {
    setSelectedItemForReturn({ orderId, itemIndex });
    setIsReturnDialogOpen(true);
    setReturnReason("");
  };

  const processReturn = () => {
    if (!selectedItemForReturn || !returnReason) return;
    
    const { orderId, itemIndex } = selectedItemForReturn;
    
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        const updatedItems = [...order.items];
        updatedItems[itemIndex] = { 
          ...updatedItems[itemIndex], 
          status: 'returned',
          returnReason 
        };
        return { ...order, items: updatedItems };
      }
      return order;
    }));
    
    const order = orders.find(o => o.id === orderId);
    const item = order?.items[itemIndex];
    
    setIsReturnDialogOpen(false);
    setSelectedItemForReturn(null);
    setReturnReason("");
    
    toast({
      title: "Return Initiated",
      description: `Return initiated for Serial #${item?.serialNumber} due to ${returnReason}. Thank you for letting us know!`,
    });
  };

  const getDaysRemaining = (orderDate: string) => {
    const orderDateObj = new Date(orderDate);
    const paymentDue = new Date(orderDateObj);
    paymentDue.setDate(orderDateObj.getDate() + 30);
    
    const today = new Date();
    const diffTime = paymentDue.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const removeFromCart = (index: number) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    toast({
      title: t('removedFromCart'),
      description: t('itemRemoved'),
    });
  };

  const ProductCard = ({ product }: { product: Product }) => {
    const [frequency, setFrequency] = useState<CartItem['frequency']>("weekly");
    const [quantity, setQuantity] = useState(1);

    return (
      <Card className="group hover:shadow-primary transition-all duration-200 hover:scale-105 animate-fade-in">
        <CardContent className="p-6 text-center">
          <div className="text-4xl mb-4">{product.img}</div>
          <h3 className="font-semibold text-lg text-primary mb-2">{t(product.product)}</h3>
          <p className="text-muted-foreground text-sm mb-3 flex-1">{product.desc}</p>
          <div className="text-lg font-semibold text-secondary mb-4">
            MRP: ₹{product.mrp}/{t('kg')}
          </div>
          <div className="space-y-3 mb-4">
            <Select value={frequency} onValueChange={(value: CartItem['frequency']) => setFrequency(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="oneTime">One Time</SelectItem>
                <SelectItem value="daily">{t('daily')}</SelectItem>
                <SelectItem value="weekly">{t('weekly')}</SelectItem>
                <SelectItem value="monthly">{t('monthly')}</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Label htmlFor={`quantity-${product.product}`} className="text-sm">{t('quantity')}:</Label>
              <Input
                id={`quantity-${product.product}`}
                type="number"
                min="0.5"
                max="99"
                step="0.5"
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
                className="w-20 text-center"
              />
              <span className="text-sm text-muted-foreground">{t('kg')}</span>
            </div>
            <div className="text-sm text-muted-foreground p-2 bg-muted rounded">
              Monthly charge: ₹{calculateMonthlyCharge({ product: product.product, frequency, quantity, mrp: product.mrp })}
            </div>
          </div>
          <Button 
            onClick={() => addToCart(product, frequency, quantity)}
            className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-200"
          >
            {t('addToCart')}
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="max-w-7xl mx-auto p-8">
        <Card className="shadow-primary animate-slide-in">
          <CardHeader className="bg-gradient-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-semibold">
                {t('groceryDashboard')}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Languages className="h-4 w-4" />
                <Select value={language} onValueChange={toggleLanguage}>
                  <SelectTrigger className="w-32 bg-primary-foreground text-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hi">हिंदी</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="shopping" className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  {t('shopping')}
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  {t('viewOrders')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="shopping" className="space-y-6">
            {/* Search and Location */}
            <div className="space-y-6 mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-lg"
                />
              </div>
              
              <div className="flex items-center gap-4">
                <MapPin className="h-5 w-5 text-primary" />
                <Label htmlFor="location" className="font-medium">{t('selectLocation')}</Label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="bengaluru">Bengaluru</SelectItem>
                    <SelectItem value="kolkata">Kolkata</SelectItem>
                    <SelectItem value="chennai">Chennai</SelectItem>
                    <SelectItem value="hyderabad">Hyderabad</SelectItem>
                    <SelectItem value="pune">Pune</SelectItem>
                    <SelectItem value="lucknow">Lucknow</SelectItem>
                    <SelectItem value="jaipur">Jaipur</SelectItem>
                    <SelectItem value="ahmedabad">Ahmedabad</SelectItem>
                    <SelectItem value="chandigarh">Chandigarh</SelectItem>
                    <SelectItem value="kochi">Kochi</SelectItem>
                    <SelectItem value="bhopal">Bhopal</SelectItem>
                    <SelectItem value="indore">Indore</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
              {/* Products Section */}
              <div className="lg:col-span-3">
                {CATEGORIES.map(category => {
                  const categoryProducts = filteredProducts.filter(p => p.category === category);
                  if (categoryProducts.length === 0) return null;

                  return (
                    <div key={category} className="mb-8">
                      <h2 className="text-xl font-bold text-primary mb-6 border-b-2 border-primary/20 pb-2">
                        {t(category)}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categoryProducts.map((product, index) => (
                          <ProductCard key={`${product.product}-${index}`} product={product} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Cart Section */}
              <div className="lg:col-span-1">
                <Card className="sticky top-8 shadow-card">
                  <CardHeader className="bg-muted/50">
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      {t('yourCart')}
                      {cart.length > 0 && (
                        <Badge variant="secondary">{cart.length}</Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {cart.length === 0 ? (
                        <p className="text-muted-foreground text-center italic">{t('cartEmpty')}</p>
                      ) : (
                        cart.map((item, index) => (
                          <div 
                            key={index}
                            className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{t(item.product)}</p>
                              <p className="text-xs text-muted-foreground">{item.frequency} • {t('quantity')}: {item.quantity}{t('kg')}</p>
                              <p className="text-xs text-secondary font-medium">Monthly: ₹{calculateMonthlyCharge(item)}</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeFromCart(index)}
                              className="ml-2 p-1 h-8 w-8"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                    {cart.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">One-time total</span>
                          <span className="font-medium">
                            ₹{cart.reduce((sum, item) => sum + (item.mrp * item.quantity), 0)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-medium">Monthly charge</span>
                          <span className="font-bold text-lg text-primary">
                            ₹{cart.reduce((sum, item) => sum + calculateMonthlyCharge(item), 0)}
                          </span>
                        </div>
                        <Button 
                          className="w-full bg-gradient-primary hover:opacity-90"
                          onClick={handleCheckout}
                        >
                          Preview Calendar & {t('checkout')}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              </div>
              </TabsContent>

              <TabsContent value="orders" className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-primary">{t('orderHistory')}</h2>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {orders.length} {t('totalOrders')}
                  </Badge>
                </div>

                {orders.length === 0 ? (
                  <Card className="text-center py-12">
                    <CardContent>
                      <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-muted-foreground mb-2">{t('noOrdersYet')}</h3>
                      <p className="text-muted-foreground mb-4">{t('startShopping')}</p>
                      <Button onClick={() => setActiveTab("shopping")} className="bg-gradient-primary">
                        {t('startShoppingNow')}
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const daysRemaining = getDaysRemaining(order.date);
                      return (
                        <Card key={order.id} className="shadow-card hover:shadow-primary transition-shadow">
                          <CardHeader className="border-b border-border">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-gradient-primary rounded-full flex items-center justify-center">
                                  <Package className="h-5 w-5 text-primary-foreground" />
                                </div>
                                <div>
                                  <CardTitle className="text-lg">{order.id}</CardTitle>
                                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                                    <CalendarIcon className="h-3 w-3" />
                                    {t('orderDate')}: {new Date(order.date).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-muted-foreground">One-time: ₹{order.total}</div>
                                <div className="text-xl font-bold text-primary">Monthly: ₹{order.monthlyCharge}</div>
                                <Badge 
                                  variant={order.status === 'paid' ? 'default' : 'secondary'}
                                  className={order.status === 'paid' ? 'bg-secondary text-secondary-foreground' : ''}
                                >
                                  {order.status === 'paid' ? (
                                    <><CheckCircle className="h-3 w-3 mr-1" />{t('paid')}</>
                                  ) : (
                                    t('pending')
                                  )}
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-6">
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold mb-3 text-primary flex items-center gap-2">
                                  <Hash className="h-4 w-4" />
                                  Order Items:
                                </h4>
                                <div className="space-y-3">
                                  {order.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 border border-border rounded-lg">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <Badge variant="outline" className="text-xs">
                                            Serial #{item.serialNumber}
                                          </Badge>
                                          <Badge 
                                            variant={
                                              item.status === 'delivered' ? 'default' :
                                              item.status === 'cancelled' ? 'destructive' :
                                              item.status === 'returned' ? 'secondary' : 'outline'
                                            }
                                            className="text-xs"
                                          >
                                            {item.status}
                                          </Badge>
                                        </div>
                                        <p className="font-medium text-sm">{t(item.product)}</p>
                                        <p className="text-xs text-muted-foreground">
                                          {item.frequency} • {item.quantity}{t('kg')} • Monthly: ₹{calculateMonthlyCharge(item)}
                                        </p>
                                        {item.returnReason && (
                                          <p className="text-xs text-destructive mt-1">
                                            Return reason: {item.returnReason}
                                          </p>
                                        )}
                                      </div>
                                      <div className="flex flex-col gap-1 ml-2">
                                        {item.status === 'pending' && (
                                          <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => cancelOrderItem(order.id, idx)}
                                            className="text-xs px-2 py-1 h-6"
                                          >
                                            <X className="h-3 w-3 mr-1" />
                                            Cancel
                                          </Button>
                                        )}
                                        {item.status === 'delivered' && (
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openReturnDialog(order.id, idx)}
                                            className="text-xs px-2 py-1 h-6"
                                          >
                                            <RotateCcw className="h-3 w-3 mr-1" />
                                            Return
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold mb-2 text-primary">{t('deliveryDetails')}:</h4>
                                  <div className="space-y-1 text-sm">
                                    <div className="flex items-center gap-2">
                                      <Clock className="h-4 w-4 text-primary" />
                                      <span className="font-medium">{order.deliverySlot.name}</span>
                                    </div>
                                    <div className="text-muted-foreground ml-6">
                                      {order.deliverySlot.time}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <Button 
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedOrderForView(order)}
                                  >
                                    <Eye className="h-4 w-4 mr-1" />
                                    View Calendar
                                  </Button>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-6 pt-4 border-t border-border">
                              {order.status === 'pending' ? (
                                <div className="flex items-center justify-between">
                                  <div className="text-sm">
                                    <p className="text-muted-foreground">
                                      {daysRemaining > 0 ? (
                                        <>
                                          {t('daysRemaining')}: <span className="font-semibold text-primary">{daysRemaining} {t('days')}</span>
                                          <br />
                                          <span className="text-xs">{t('paymentMessage')}</span>
                                        </>
                                      ) : (
                                        <span className="text-red-600 font-medium">{t('paymentOverdue')}</span>
                                      )}
                                    </p>
                                  </div>
                                  <Button 
                                    onClick={() => openPaymentDialog(order.id)}
                                    className="bg-gradient-primary hover:opacity-90 flex items-center gap-2"
                                  >
                                    <CreditCard className="h-4 w-4" />
                                    {t('payNow')}
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex items-center justify-center text-secondary font-medium">
                                  <CheckCircle className="h-5 w-5 mr-2" />
                                  {t('paymentCompleted')}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Calendar Preview Dialog */}
        <Dialog open={isCalendarPreviewOpen} onOpenChange={setIsCalendarPreviewOpen}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                Delivery Calendar Preview
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <p className="text-muted-foreground">
                Here's when your items will be delivered this month based on their frequencies:
              </p>
              
              {cart.map((item, index) => {
                const deliveryDates = calculateMonthlyDeliveryDates(item.frequency);
                return (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{t(item.product)}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.frequency} • {item.quantity}{t('kg')} • Monthly charge: ₹{calculateMonthlyCharge(item)}
                        </p>
                      </div>
                      <Badge variant="outline">{deliveryDates.length} deliveries</Badge>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-2 text-center text-sm">
                      {deliveryDates.slice(0, 7).map((date, idx) => (
                        <div key={idx} className="p-2 bg-primary/10 rounded text-primary font-medium">
                          {format(date, 'MMM dd')}
                        </div>
                      ))}
                      {deliveryDates.length > 7 && (
                        <div className="p-2 bg-muted rounded text-muted-foreground">
                          +{deliveryDates.length - 7} more...
                        </div>
                      )}
                    </div>
                    <Separator />
                  </div>
                );
              })}
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Monthly Billing Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>One-time charges:</span>
                    <span>₹{cart.filter(item => item.frequency === 'oneTime').reduce((sum, item) => sum + (item.mrp * item.quantity), 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Recurring charges:</span>
                    <span>₹{cart.filter(item => item.frequency !== 'oneTime').reduce((sum, item) => sum + calculateMonthlyCharge(item), 0)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total monthly charge:</span>
                    <span className="text-primary">₹{cart.reduce((sum, item) => sum + calculateMonthlyCharge(item), 0)}</span>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full bg-gradient-primary hover:opacity-90"
                onClick={proceedToDeliverySlots}
              >
                Proceed to Select Delivery Slot
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Order Calendar View Dialog */}
        <Dialog open={!!selectedOrderForView} onOpenChange={() => setSelectedOrderForView(null)}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                Delivery Calendar - {selectedOrderForView?.id}
              </DialogTitle>
            </DialogHeader>
            {selectedOrderForView && (
              <div className="space-y-6 py-4">
                {selectedOrderForView.items.map((item, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">Serial #{item.serialNumber}</Badge>
                          <Badge variant={
                            item.status === 'delivered' ? 'default' :
                            item.status === 'cancelled' ? 'destructive' :
                            item.status === 'returned' ? 'secondary' : 'outline'
                          }>
                            {item.status}
                          </Badge>
                        </div>
                        <h4 className="font-medium">{t(item.product)}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.frequency} • {item.quantity}{t('kg')}
                        </p>
                      </div>
                      <Badge variant="outline">{item.deliveryDates.length} deliveries</Badge>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-2 text-center text-sm">
                      {item.deliveryDates.slice(0, 7).map((dateStr, idx) => {
                        const date = new Date(dateStr);
                        return (
                          <div key={idx} className="p-2 bg-primary/10 rounded text-primary font-medium">
                            {format(date, 'MMM dd')}
                          </div>
                        );
                      })}
                      {item.deliveryDates.length > 7 && (
                        <div className="p-2 bg-muted rounded text-muted-foreground">
                          +{item.deliveryDates.length - 7} more...
                        </div>
                      )}
                    </div>
                    <Separator />
                  </div>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Return Dialog */}
        <Dialog open={isReturnDialogOpen} onOpenChange={setIsReturnDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-primary" />
                Return Product
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-muted-foreground text-sm">
                Please select a reason for returning this product:
              </p>
              
              <Select value={returnReason} onValueChange={setReturnReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rotten">Product was rotten</SelectItem>
                  <SelectItem value="expired">Product was expired</SelectItem>
                  <SelectItem value="damaged">Product was damaged</SelectItem>
                  <SelectItem value="wrong_item">Wrong item delivered</SelectItem>
                  <SelectItem value="quality_issue">Quality issue</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsReturnDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={processReturn}
                  disabled={!returnReason}
                  className="flex-1 bg-gradient-primary hover:opacity-90"
                >
                  Submit Return
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delivery Slot Selection Dialog */}
        <Dialog open={isCheckoutDialogOpen} onOpenChange={setIsCheckoutDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                {t('selectDeliverySlot')}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-muted-foreground text-sm">{t('chooseDeliveryTime')}</p>
              {DELIVERY_SLOTS.map((slot) => (
                <Button
                  key={slot.id}
                  variant="outline"
                  className="w-full justify-start text-left h-auto p-4 hover:bg-primary/5"
                  onClick={() => confirmDeliverySlot(slot)}
                >
                  <div>
                    <div className="font-semibold">{slot.name}</div>
                    <div className="text-sm text-muted-foreground">{slot.time}</div>
                  </div>
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Payment Confirmation Dialog */}
        <Dialog open={isPaymentConfirmationOpen} onOpenChange={setIsPaymentConfirmationOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-primary">
                {t('orderConfirmation')}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="text-center">
                <div className="text-4xl mb-4">🎉</div>
                <p className="text-lg font-medium mb-2">{t('thankYou')}</p>
                <p className="text-muted-foreground">{t('paymentInfo')}</p>
              </div>
              
              {selectedDeliverySlot && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">{t('orderSummary')}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>{t('deliverySlot')}:</span>
                      <span className="font-medium">{selectedDeliverySlot.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('deliveryTime')}:</span>
                      <span className="font-medium">{selectedDeliverySlot.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly charge:</span>
                      <span className="font-bold text-primary">
                        ₹{cart.reduce((sum, item) => sum + calculateMonthlyCharge(item), 0)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              <Button 
                className="w-full bg-gradient-primary hover:opacity-90"
                onClick={finalizeOrder}
              >
                {t('confirmOrder')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* UPI Payment Dialog */}
        <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-primary flex items-center gap-2 justify-center">
                <CreditCard className="h-5 w-5" />
                {t('upiPayment')}
              </DialogTitle>
            </DialogHeader>
            
            {isProcessingPayment ? (
              <div className="text-center py-8">
                <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-lg font-medium mb-2">{t('processingPayment')}</p>
                <p className="text-muted-foreground">{t('pleaseWait')}</p>
              </div>
            ) : (
              <div className="space-y-6 py-4">
                <div className="text-center">
                  <QrCode className="h-16 w-16 text-primary mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">{t('enterUpiId')}</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="upi-id">{t('upiIdLabel')}</Label>
                    <Input
                      id="upi-id"
                      type="text"
                      placeholder="example@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="text-center"
                    />
                  </div>
                  
                  <div className="text-center text-sm text-muted-foreground">
                    <p>{t('orScanQr')}</p>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-gradient-primary hover:opacity-90"
                  onClick={processPayment}
                  disabled={!upiId.trim()}
                >
                  {t('submitPayment')}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default GroceryDashboard;
