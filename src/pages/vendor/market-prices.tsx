import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
    Menu,
    Globe,
    Moon,
    User,
    Leaf,
    Search,
    RotateCcw,
    Download,
    LogOut,
    Info,
    UserCircle,
    LayoutDashboard,
    BarChart3,
    ChevronRight,
    ChevronDown
} from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface MarketPriceRow {
    state: string | null;
    district: string | null;
    market: string | null;
    commodity: string | null;
    variety: string | null;
    min_price: number | null;
    max_price: number | null;
    modal_price: number | null;
    arrival_date: string | null;
}

export default function VendorMarketPrices() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { toast } = useToast();

    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [language, setLanguage] = useState<'English' | 'Hindi' | 'Punjabi'>('English');
    const languages = ['English', 'Hindi', 'Punjabi'] as const;

    const [prices, setPrices] = useState<MarketPriceRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        crop: "all",
        state: "all",
        district: "all"
    });

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark');
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();

            // Only add filters if NOT "all"
            if (filters.crop !== "all") {
                params.append('commodity', filters.crop);
            }
            if (filters.state !== "all") {
                params.append('state', filters.state);
            }
            if (filters.district !== "all") {
                params.append('district', filters.district);
            }

            const response = await fetch(`http://localhost:3001/api/market-prices?${params.toString()}`, {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch market prices');
            }

            const data = await response.json();
            setPrices(data.data || []);
        } catch (error) {
            console.error('Market prices error:', error);
            toast({
                title: "Failed to fetch market prices",
                description: "Please try again later",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFilters({
            crop: "all",
            state: "all",
            district: "all"
        });
        setPrices([]);
    };

    const handleExportCSV = () => {
        if (prices.length === 0) return;

        const headers = ['Market', 'Variety', 'Min Price', 'Max Price', 'Modal Price'];
        const rows = prices.map(price => [
            price.market || '-',
            price.variety || '-',
            price.min_price || '-',
            price.max_price || '-',
            price.modal_price || '-'
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `market_prices_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();

        toast({
            title: "Export successful",
            description: "Market prices downloaded as CSV",
        });
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans text-gray-900">
            {/* Top Navigation Bar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Left Side */}
                        <div className="flex items-center gap-4">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <button className="p-2.5 bg-white rounded-full shadow-sm hover:shadow-md transition-all border border-gray-100 group">
                                        <Menu className="h-5 w-5 text-gray-700 group-hover:text-gray-900" />
                                    </button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-[300px] sm:w-[340px] p-6 bg-[#F8F9FA]">
                                    <SheetHeader className="mb-8 flex flex-row items-center justify-between space-y-0">
                                        <SheetTitle className="text-xl font-bold text-gray-900">Navigation</SheetTitle>
                                    </SheetHeader>
                                    <div className="space-y-3">
                                        <Link to="/vendor/dashboard" className="flex items-center justify-between px-4 py-3 bg-white text-gray-700 hover:bg-green-50 hover:text-green-900 rounded-full transition-all group shadow-sm border border-transparent hover:border-green-100">
                                            <div className="flex items-center gap-3">
                                                <LayoutDashboard className="h-5 w-5 text-gray-500 group-hover:text-green-700 transition-colors" />
                                                <span className="font-medium text-sm">Dashboard</span>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-green-700 transition-colors" />
                                        </Link>

                                        <Link to="/vendor/farmer-search" className="flex items-center justify-between px-4 py-3 bg-white text-gray-700 hover:bg-green-50 hover:text-green-900 rounded-full transition-all group shadow-sm border border-transparent hover:border-green-100">
                                            <div className="flex items-center gap-3">
                                                <Search className="h-5 w-5 text-gray-500 group-hover:text-green-700 transition-colors" />
                                                <span className="font-medium text-sm">Farmer Search</span>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-green-700 transition-colors" />
                                        </Link>

                                        <Link to="/vendor/market-prices" className="flex items-center justify-between px-4 py-3 bg-[#FFD700] text-[#5c4d00] rounded-full shadow-sm transition-all group">
                                            <div className="flex items-center gap-3">
                                                <BarChart3 className="h-5 w-5 stroke-[2.5]" />
                                                <span className="font-medium text-sm">Market Price</span>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-[#5c4d00]/80" />
                                        </Link>
                                    </div>
                                </SheetContent>
                            </Sheet>
                            <div className="flex items-center gap-2">
                                <Leaf className="h-6 w-6 text-green-600" fill="currentColor" />
                                <span className="text-xl font-bold text-green-600 tracking-tight">FarmIQ</span>
                                <span className="text-gray-400 text-lg font-light">|</span>
                                <span className="text-gray-500 text-sm font-medium">Vendor dashboard</span>
                            </div>
                        </div>

                        {/* Center Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link to="/vendor/dashboard" className="text-gray-500 hover:text-gray-900 font-medium px-1 py-5 transition-colors">
                                Dashboard
                            </Link>
                            <Link to="/vendor/qr-scan" className="text-gray-500 hover:text-gray-900 font-medium px-1 py-5 transition-colors">
                                QR Scan
                            </Link>
                            <Link to="/vendor/market-prices" className="text-gray-900 font-medium border-b-2 border-green-500 px-1 py-5">
                                Market Prices
                            </Link>
                            <Link to="/vendor/farmer-search" className="text-gray-500 hover:text-gray-900 font-medium px-1 py-5 transition-colors">
                                Farmer Search
                            </Link>
                        </div>

                        {/* Right Side Icons */}
                        <div className="flex items-center gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                                        <Globe className="h-5 w-5" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-md">
                                    {languages.map((lang) => (
                                        <DropdownMenuItem
                                            key={lang}
                                            onClick={() => setLanguage(lang)}
                                            className="cursor-pointer hover:bg-gray-50"
                                        >
                                            {lang}
                                            {language === lang && <span className="ml-2 text-green-600">✓</span>}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <button
                                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                                onClick={toggleTheme}
                            >
                                <Moon className="h-5 w-5" />
                            </button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                                        <User className="h-5 w-5" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={() => navigate('/profile')}
                                    >
                                        <UserCircle className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={() => navigate('/farmer/teaching')}
                                    >
                                        <Info className="mr-2 h-4 w-4" />
                                        <span>Know about the website</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="cursor-pointer text-red-600 focus:text-red-600"
                                        onClick={() => {
                                            logout();
                                            navigate('/login');
                                        }}
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Logout</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-1">Market Prices</h1>
                        <p className="text-gray-500">Official prices refreshed daily</p>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {/* Crop Dropdown */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Crop</label>
                            <div className="relative">
                                <select
                                    className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                                    value={filters.crop}
                                    onChange={(e) => setFilters(prev => ({ ...prev, crop: e.target.value }))}
                                >
                                    <option value="all">All Crops</option>
                                    <option value="Rice">Rice</option>
                                    <option value="Wheat">Wheat</option>
                                    <option value="Corn">Corn</option>
                                    <option value="Cotton">Cotton</option>
                                    <option value="Sugarcane">Sugarcane</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* State Dropdown */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">State</label>
                            <div className="relative">
                                <select
                                    className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                                    value={filters.state}
                                    onChange={(e) => setFilters(prev => ({ ...prev, state: e.target.value }))}
                                >
                                    <option value="all">All States</option>
                                    <option value="Punjab">Punjab</option>
                                    <option value="Haryana">Haryana</option>
                                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                                    <option value="Maharashtra">Maharashtra</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* District Dropdown */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">District</label>
                            <div className="relative">
                                <select
                                    className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                                    value={filters.district}
                                    onChange={(e) => setFilters(prev => ({ ...prev, district: e.target.value }))}
                                >
                                    <option value="all">All Districts</option>
                                    <option value="Amritsar">Amritsar</option>
                                    <option value="Ludhiana">Ludhiana</option>
                                    <option value="Jalandhar">Jalandhar</option>
                                    <option value="Patiala">Patiala</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleSearch}
                            disabled={loading}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                            <Search className="h-4 w-4" />
                            <span>{loading ? 'Searching...' : 'Search'}</span>
                        </button>
                        <button
                            onClick={handleReset}
                            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg font-medium transition-colors"
                        >
                            <RotateCcw className="h-4 w-4" />
                            <span>Reset</span>
                        </button>
                    </div>
                </div>

                {/* Results Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Price Data</h2>
                        <button
                            onClick={handleExportCSV}
                            disabled={prices.length === 0}
                            className="flex items-center gap-2 text-green-600 border border-green-600 hover:bg-green-50 px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Download className="h-4 w-4" />
                            <span>Export CSV</span>
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-white border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Market</th>
                                    <th className="px-6 py-3 font-medium">Variety</th>
                                    <th className="px-6 py-3 font-medium">Min Price</th>
                                    <th className="px-6 py-3 font-medium">Max Price</th>
                                    <th className="px-6 py-3 font-medium">Modal Price</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                            Loading prices...
                                        </td>
                                    </tr>
                                ) : prices.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                            No prices found. Try adjusting your filters.
                                        </td>
                                    </tr>
                                ) : (
                                    prices.map((price, index) => (
                                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-gray-900">{price.market || '-'}</td>
                                            <td className="px-6 py-4 text-gray-900">{price.variety || '-'}</td>
                                            <td className="px-6 py-4 text-gray-900">₹{price.min_price || '-'}</td>
                                            <td className="px-6 py-4 text-gray-900">₹{price.max_price || '-'}</td>
                                            <td className="px-6 py-4 font-bold text-green-600">₹{price.modal_price || '-'}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
