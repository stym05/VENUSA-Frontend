import React, { useState } from 'react'
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native'
import Footer from '../components/footer'
import Entypo from '@expo/vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';

const faqsData = {
  "faqs": [
    {
      "question": "How do I contact your Customer Service?",
      "answer": "Our venusa Customer Service Team is available Monday through Friday, 9 am - 5 pm ET, excluding holidays. You can reach us via email at info@Venusa.com (preferred and our fastest response), via Whatsapp chat using the icon in the right bottom concern of our website, or via Call at +91 - 887 766 4332. We will make sure to get back to you within 24 business hours."
    },
    {
      "question": "When will my order ship?",
      "answer": "this answer"
    },
    {
      "question": "Can I cancel or modify my order?",
      "answer": "this answer"
    },
    {
      "question": "What are my shipping options?",
      "answer": "this answer"
    },
    {
      "question": "What type of payment methods do you offer?",
      "answer": "this answer"
    },
    {
      "question": "Which size will fit me best?",
      "answer": "We offer product and body measurements on each of our products pages, just click on “Size Guide” to find your best fit. Measuring guides are included."
    },
    {
      "question": "How do I take care of my Venusa pieces?",
      "answer": "this answer"
    },
    {
      "question": "Where and how do you manufacture your products?",
      "answer": "this answer"
    },
    {
      "question": "How do you find and evaluate your suppliers?",
      "answer": "this answer"
    },
    {
      "question": "How do your suppliers support their workers? ",
      "answer": "this answer"
    }
  ]
}


function FAQs() {
  const [expandedIndex, setExpandedIndex] = useState(0);
  const navigation = useNavigation();

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index); // Toggle open/close per FAQ
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.subContainer}>
          <Text style={styles.header}>FAQs</Text>
          <View style={{ marginTop: 10, width: '70%' }}>
            {faqsData.faqs.map((faq, index) => (
              <View key={index} style={{ marginVertical: 20 }}>
                <TouchableOpacity style={styles.faqHeader} onPress={() => toggleExpand(index)}>

                  <Text style={styles.title}>{faq.question}</Text>

                  {expandedIndex === index ? (
                    <Entypo name="minus" size={24} color="black" />
                  ) : (
                    <Entypo name="plus" size={24} color="black" />
                  )}
                </TouchableOpacity>
                {expandedIndex === index && <Text style={styles.details}>{faq.answer}</Text>}
              </View>
            ))}
          </View>
        </View>
        <Footer navigation={navigation} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  subContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20
  },
  header: {
    fontFamily: "Didot",
    fontWeight: "400",
    fontSize: 40,
    lineHeight: 48
  },
  title: {
    fontFamily: "Roboto",
    fontWeight: "700",
    fontSize: 20,
    lineHeight: 28
  },
  details: {
    fontFamily: "Roboto",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 28,
    color: "#333333"
  },
  faqHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})


export default FAQs;