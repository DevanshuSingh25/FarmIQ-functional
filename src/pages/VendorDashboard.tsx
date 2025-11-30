import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Store, Package, Users, TrendingUp } from 'lucide-react';

export default function VendorDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Login</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Vendor Dashboard</h1>
                <p className="text-muted-foreground">Manage your vendor operations</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Coming Soon Card */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Store className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">Vendor Dashboard Coming Soon</CardTitle>
            <CardDescription className="text-lg">
              We're working hard to bring you a comprehensive vendor management platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-muted-foreground mb-6">
                The vendor dashboard will include features for managing inventory, orders, 
                customer relationships, and analytics to help you grow your business.
              </p>
            </div>

            {/* Feature Preview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg text-center">
                <Package className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">Inventory Management</h3>
                <p className="text-sm text-muted-foreground">
                  Track and manage your product inventory
                </p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">Customer Relations</h3>
                <p className="text-sm text-muted-foreground">
                  Manage customer accounts and relationships
                </p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">Analytics & Reports</h3>
                <p className="text-sm text-muted-foreground">
                  View sales data and business insights
                </p>
              </div>
            </div>

            <div className="text-center pt-4">
              <Button onClick={() => navigate('/login')} variant="outline">
                Return to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
