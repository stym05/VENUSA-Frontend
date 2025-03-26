import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";

const RazorpayPaymentScreen = ({ route, navigation }) => {
  const { orderId, amount, currency, email, contact } = route.params;
  const [paymentUrl, setPaymentUrl] = useState(null);

  useEffect(() => {
    // Construct the Razorpay checkout URL
    const url = `https://api.razorpay.com/v1/checkout?order_id=${orderId}&amount=${amount}&currency=${currency}&email=${email}&contact=${contact}`;
    setPaymentUrl(url);
  }, []);

  const handleWebViewNavigationStateChange = (event) => {
    if (event.url.includes("success")) {
      navigation.goBack();
      alert("Payment Successful!");
    } else if (event.url.includes("failed")) {
      navigation.goBack();
      alert("Payment Failed!");
    }
  };

  if (!paymentUrl) {
    return <ActivityIndicator size="large" color="blue" />;
  }

  return (
    <WebView 
      source={{ uri: paymentUrl }} 
      onNavigationStateChange={handleWebViewNavigationStateChange} 
    />
  );
};

export default RazorpayPaymentScreen;


// const createOrder = async () => {
//     try {
//       const response = await fetch("http://your-backend-url/create-order", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId: "user_123",
//           products: [
//             { product: "product_abc", size: "M", quantity: 2, price: 500 },
//             { product: "product_xyz", size: "L", quantity: 1, price: 800 },
//           ],
//           shippingAddress: {
//             street: "123 Street",
//             city: "Mumbai",
//             state: "Maharashtra",
//             postalCode: "400001",
//             country: "India",
//             mobileNumber: "9876543210",
//           },
//           paymentMethod: "UPI",
//         }),
//       });
  
//       const data = await response.json();
//       console.log("Order Created:", data);
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };
  
  

// const verifyPayment = async (paymentDetails) => {
//     try {
//       const response = await fetch("http://your-backend-url/verify-payment", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(paymentDetails),
//       });
  
//       const result = await response.json();
//       if (result.success) {
//         alert("Payment verified successfully!");
//       } else {
//         alert("Payment verification failed!");
//       }
//     } catch (error) {
//       console.error("Error verifying payment:", error);
//     }
//   };
  