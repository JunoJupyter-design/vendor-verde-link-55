import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Users, Package, TrendingUp } from "lucide-react";

const VendorDashboard = () => {
  const stats = [
    {
      title: "Total Orders",
      value: "247",
      icon: ShoppingCart,
      trend: "+12%",
    },
    {
      title: "Active Vendors",
      value: "1,234",
      icon: Users,
      trend: "+5%",
    },
    {
      title: "Products Listed",
      value: "856",
      icon: Package,
      trend: "+18%",
    },
    {
      title: "Revenue",
      value: "₹45,678",
      icon: TrendingUp,
      trend: "+23%",
    },
  ];

  const recentOrders = [
    {
      id: "ORD-001",
      vendor: "Fresh Fruits Co.",
      product: "Organic Apples",
      quantity: "50 kg",
      amount: "₹2,500",
      status: "Processing",
    },
    {
      id: "ORD-002",
      vendor: "Green Vegetables",
      product: "Mixed Vegetables",
      quantity: "30 kg",
      amount: "₹1,800",
      status: "Delivered",
    },
    {
      id: "ORD-003",
      vendor: "Spice Masters",
      product: "Turmeric Powder",
      quantity: "10 kg",
      amount: "₹800",
      status: "Pending",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-primary">Verde Link</h1>
              <span className="text-muted-foreground">Vendor Marketplace</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">Profile</Button>
              <Button>New Order</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-card hover:shadow-primary transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-secondary font-medium">{stat.trend}</p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Orders */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors duration-200"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="font-medium text-foreground">{order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.vendor}</p>
                      </div>
                      <div>
                        <p className="text-sm text-foreground">{order.product}</p>
                        <p className="text-sm text-muted-foreground">{order.quantity}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium text-foreground">{order.amount}</p>
                      <p
                        className={`text-sm px-2 py-1 rounded-full ${
                          order.status === "Delivered"
                            ? "bg-secondary/20 text-secondary"
                            : order.status === "Processing"
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {order.status}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default VendorDashboard;