import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'hi' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  hi: {
    // Homepage
    welcome: "नमस्ते, बाज़ार बंधु में आपका स्वागत है!",
    login: "लॉग इन",
    signup: "साइन अप",
    
    // Common
    name: "नाम",
    phone: "मोबाइल नंबर",
    address: "पता",
    sendOtp: "OTP भेजें",
    verifyOtp: "OTP सत्यापित करें",
    register: "रजिस्टर करें",
    buyer: "खरीदार",
    seller: "विक्रेता",
    userType: "उपयोगकर्ता प्रकार",
    
    // Placeholders
    namePlaceholder: "अपना नाम दर्ज करें",
    phonePlaceholder: "मोबाइल नंबर दर्ज करें",
    addressPlaceholder: "अपना पता दर्ज करें",
    otpPlaceholder: "6 अंकों का OTP दर्ज करें",
    
    // Messages
    otpSent: "OTP भेजा गया!",
    otpVerified: "OTP सत्यापित हो गया!",
    registrationSuccess: "सफलतापूर्वक पंजीकरण हो गया!",
    loginSuccess: "लॉग इन सफल!",
    fillAllFields: "कृपया सभी फ़ील्ड भरें",
    invalidOtp: "गलत OTP",
    
    // Headers
    loginTitle: "लॉग इन करें",
    signupTitle: "साइन अप करें",
    
    // Other
    close: "बंद करें",
    cancel: "रद्द करें",
    
    // Grocery Dashboard
    groceryDashboard: "वर्डे लिंक ग्रॉसरी डैशबोर्ड",
    searchPlaceholder: "कोई वस्तु खोजें...",
    selectLocation: "अपना स्थान चुनें:",
    vegetables: "सब्जियां",
    dairyProducts: "डेयरी उत्पाद",
    spicesAndOils: "मसाले और तेल",
    meatAndPoultry: "मांस और मुर्गी",
    others: "अन्य",
    daily: "दैनिक",
    weekly: "साप्ताहिक",
    monthly: "मासिक",
    quantity: "मात्रा",
    kg: "किग्रा",
    addToCart: "कार्ट में जोड़ें",
    yourCart: "आपका कार्ट",
    cartEmpty: "कार्ट खाली है",
    total: "कुल:",
    checkout: "चेकआउट",
    cartUpdated: "कार्ट अपडेट हुआ",
    addedToCart: "कार्ट में जोड़ा गया",
    removedFromCart: "कार्ट से हटाया गया",
    itemRemoved: "वस्तु सफलतापूर्वक हटाई गई",
    language: "भाषा",
    
    // Delivery and Checkout
    selectDeliverySlot: "डिलीवरी स्लॉट चुनें",
    chooseDeliveryTime: "अपने लिए सबसे सुविधाजनक डिलीवरी समय चुनें:",
    morningSlot: "सुबह का स्लॉट",
    afternoonSlot: "दोपहर का स्लॉट",
    deliverySlot: "डिलीवरी स्लॉट",
    deliveryTime: "डिलीवरी समय",
    orderConfirmation: "ऑर्डर पुष्टि",
    orderSummary: "ऑर्डर सारांश",
    thankYou: "धन्यवाद!",
    paymentInfo: "कृपया ध्यान दें: कुल राशि महीने के अंत में देय है। आपके व्यापार की सराहना करते हैं!",
    confirmOrder: "ऑर्डर पुष्ट करें",
    orderConfirmed: "ऑर्डर पुष्ट हुआ",
    orderSuccess: "आपका ऑर्डर सफलतापूर्वक दर्ज हो गया है!",
    
    // View Orders
    shopping: "खरीदारी",
    viewOrders: "ऑर्डर देखें",
    orderHistory: "ऑर्डर इतिहास",
    totalOrders: "कुल ऑर्डर",
    noOrdersYet: "अभी तक कोई ऑर्डर नहीं",
    startShopping: "अपनी पहली खरीदारी शुरू करें",
    startShoppingNow: "अभी खरीदारी शुरू करें",
    orderDate: "ऑर्डर दिनांक",
    orderItems: "ऑर्डर आइटम",
    deliveryDetails: "डिलीवरी विवरण",
    paid: "भुगतान हुआ",
    pending: "लंबित",
    payNow: "अभी भुगतान करें",
    paymentSuccess: "भुगतान सफल",
    paymentProcessed: "आपका भुगतान सफलतापूर्वक संसाधित हुआ",
    daysRemaining: "शेष दिन",
    days: "दिन",
    paymentMessage: "बाज़ार बंधु के महत्वपूर्ण हिस्से बनने के लिए धन्यवाद!",
    paymentOverdue: "भुगतान अंतिम तारीख बीत गई",
    paymentCompleted: "भुगतान पूरा हुआ",
    upiPayment: "UPI भुगतान",
    processingPayment: "आपका भुगतान प्रक्रिया में है...",
    pleaseWait: "कृपया प्रतीक्षा करें",
    enterUpiId: "अपना UPI ID दर्ज करें या QR कोड स्कैन करें",
    upiIdLabel: "UPI ID",
    orScanQr: "या QR कोड स्कैन करें",
    submitPayment: "भुगतान सबमिट करें",
    paymentCelebration: "धन्यवाद! आपका भुगतान मिल गया है। आपका ऑर्डर निर्धारित समय पर डिलीवर किया जाएगा।",
    
    // Product names
    onion: "प्याज",
    tomato: "टमाटर",
    garlic: "लहसुन",
    potato: "आलू",
    carrot: "गाजर",
    cauliflower: "गोभी",
    spinach: "पालक",
    beans: "बींस",
    peas: "मटर",
    cabbage: "पत्ता गोभी",
    chillies: "मिर्च",
    brinjal: "बैंगन",
    milk: "दूध",
    eggs: "अंडे",
    ghee: "घी",
    oil: "तेल",
    redSpice: "लाल मिर्च पाउडर",
    corianderPowder: "धनिया पाउडर",
    turmericPowder: "हल्दी पाउडर",
    garamMasala: "गरम मसाला",
    cuminSeeds: "जीरा",
    blackPepper: "काली मिर्च",
    mustardSeeds: "सरसों के बीज",
    fenugreek: "मेथी",
    asafoetida: "हींग",
    chicken: "चिकन",
    mutton: "मटन",
    fish: "मछली",
    prawns: "झींगा",
    apples: "सेब",
    broccoli: "ब्रोकली",
    rice: "चावल",
    bread: "ब्रेड",
    noodles: "नूडल्स",
    momos: "मोमोज",
  },
  en: {
    // Homepage
    welcome: "Welcome to Bazzar Bandhu!",
    login: "Login",
    signup: "Sign Up",
    
    // Common
    name: "Name",
    phone: "Mobile Number",
    address: "Address",
    sendOtp: "Send OTP",
    verifyOtp: "Verify OTP",
    register: "Register Now",
    buyer: "Buyer",
    seller: "Seller",
    userType: "User Type",
    
    // Placeholders
    namePlaceholder: "Enter your name",
    phonePlaceholder: "Enter mobile number",
    addressPlaceholder: "Enter your address",
    otpPlaceholder: "Enter 6-digit OTP",
    
    // Messages
    otpSent: "OTP Sent!",
    otpVerified: "OTP Verified!",
    registrationSuccess: "Registration Successful!",
    loginSuccess: "Login Successful!",
    fillAllFields: "Please fill all fields",
    invalidOtp: "Invalid OTP",
    
    // Headers
    loginTitle: "Login",
    signupTitle: "Sign Up",
    
    // Other
    close: "Close",
    cancel: "Cancel",
    
    // Grocery Dashboard
    groceryDashboard: "Verde Link Grocery Dashboard",
    searchPlaceholder: "Search for an item...",
    selectLocation: "Select Your Location:",
    vegetables: "Vegetables",
    dairyProducts: "Dairy Products",
    spicesAndOils: "Spices and Oils",
    meatAndPoultry: "Meat & Poultry",
    others: "Others",
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
    quantity: "Qty",
    kg: "kg",
    addToCart: "Add to Cart",
    yourCart: "Your Cart",
    cartEmpty: "Cart is empty",
    total: "Total:",
    checkout: "Checkout",
    cartUpdated: "Cart Updated",
    addedToCart: "Added to Cart",
    removedFromCart: "Removed from Cart",
    itemRemoved: "Item successfully removed",
    language: "Language",
    
    // Delivery and Checkout
    selectDeliverySlot: "Select Delivery Slot",
    chooseDeliveryTime: "Choose the most convenient delivery time for your business:",
    morningSlot: "Morning Slot",
    afternoonSlot: "Afternoon Slot",
    deliverySlot: "Delivery Slot",
    deliveryTime: "Delivery Time",
    orderConfirmation: "Order Confirmation",
    orderSummary: "Order Summary",
    thankYou: "Thank You!",
    paymentInfo: "Please note: The total amount is payable at the end of the month. We appreciate your business!",
    confirmOrder: "Confirm Order",
    orderConfirmed: "Order Confirmed",
    orderSuccess: "Your order has been successfully placed!",
    
    // View Orders
    shopping: "Shopping",
    viewOrders: "View Orders",
    orderHistory: "Order History",
    totalOrders: "Total Orders",
    noOrdersYet: "No orders yet",
    startShopping: "Start your first shopping experience",
    startShoppingNow: "Start Shopping Now",
    orderDate: "Order Date",
    orderItems: "Order Items",
    deliveryDetails: "Delivery Details",
    paid: "Paid",
    pending: "Pending",
    payNow: "Pay Now",
    paymentSuccess: "Payment Successful",
    paymentProcessed: "Your payment has been processed successfully",
    daysRemaining: "Days remaining",
    days: "days",
    paymentMessage: "Thank you for being a valued part of Bazzar Bandhu!",
    paymentOverdue: "Payment overdue",
    paymentCompleted: "Payment Completed",
    upiPayment: "UPI Payment",
    processingPayment: "Processing your payment...",
    pleaseWait: "Please wait",
    enterUpiId: "Enter your UPI ID or scan QR code",
    upiIdLabel: "UPI ID",
    orScanQr: "Or scan QR code",
    submitPayment: "Submit Payment",
    paymentCelebration: "Thank you! Your payment has been received. Your order will be delivered as scheduled.",
    
    // Product names
    onion: "Onion",
    tomato: "Tomato",
    garlic: "Garlic",
    potato: "Potato",
    carrot: "Carrot",
    cauliflower: "Cauliflower",
    spinach: "Spinach",
    beans: "Beans",
    peas: "Peas",
    cabbage: "Cabbage",
    chillies: "Chillies",
    brinjal: "Brinjal",
    milk: "Milk",
    eggs: "Eggs",
    ghee: "Ghee",
    oil: "Oil",
    redSpice: "Red Chili Powder",
    corianderPowder: "Coriander Powder",
    turmericPowder: "Turmeric Powder",
    garamMasala: "Garam Masala",
    cuminSeeds: "Cumin Seeds",
    blackPepper: "Black Pepper",
    mustardSeeds: "Mustard Seeds",
    fenugreek: "Fenugreek",
    asafoetida: "Asafoetida",
    chicken: "Chicken",
    mutton: "Mutton",
    fish: "Fish",
    prawns: "Prawns",
    apples: "Apples",
    broccoli: "Broccoli",
    rice: "Rice",
    bread: "Bread",
    noodles: "Noodles",
    momos: "Momos",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('hi');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'hi' ? 'en' : 'hi');
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['hi']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
