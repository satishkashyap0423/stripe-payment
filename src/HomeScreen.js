import React, { useEffect, useState } from "react";
import { View, Alert, Button } from "react-native";
import { useStripe, StripeProvider } from "@stripe/stripe-react-native";

const PUBLISHABLE_KEY = "pk_test_51QvClgBQbbrVo9zcL1Fb6A16UKxoTEYq0Gm5GHQP4s9prKl79neeKwv53DsFerfvwxxjCc5dIfqOTrXhTN2Kv40100wypMULep";
const STRIPE_SECRET_KEY = "sk_test_51QvClgBQbbrVo9zcjL0RYfQx3Z0G2VfXbLlvD3dB6DV1A8PVXQDKrEMhq8vmVEvfPVFvQpT9KFiDMhweuwXjpR4X00fBEWyb0X"; // ⚠️ Replace with your Stripe Secret Key (Only for testing)
const API_URL = "https://api.stripe.com/v1/payment_intents";

export default function HomeScreen() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  // Fetch Payment Intent Directly from Stripe
  const fetchPaymentSheetParams = async () => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "amount=1000&currency=usd&payment_method_types[]=card", // $10.00 charge
      });

      const data = await response.json();

      if (!data.client_secret) {
        throw new Error("Error creating payment intent");
      }

      return {
        paymentIntent: data.client_secret,
      };
    } catch (error) {
      console.error("Error fetching payment intent:", error);
      Alert.alert("Error", "Failed to fetch payment details.");
    }
  };

  // Initialize Payment Sheet
  const initializePaymentSheet = async () => {
    const { paymentIntent } = await fetchPaymentSheetParams();
    if (!paymentIntent) return;

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Example, Inc.",
      paymentIntentClientSecret: paymentIntent,
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: "Jane Doe",
      },
    });

    if (!error) {
      setLoading(true);
    }
  };

  // Open Payment Sheet
  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert("Payment failed", error.message);
    } else {
      Alert.alert("Success", "Your payment was successful!");
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  return (
    <StripeProvider publishableKey={PUBLISHABLE_KEY} urlScheme="fieldequip">
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Button
          title="Checkout"
          disabled={!loading}
          onPress={openPaymentSheet}
        />
      </View>
    </StripeProvider>
  );
}
