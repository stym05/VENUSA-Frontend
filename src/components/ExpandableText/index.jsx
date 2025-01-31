import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ExpandableText = ({ title, details }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.container}>
        {console.log(title)}
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>
      {expanded && <Text style={styles.details}>{details}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderWidth: 2
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  details: {
    marginTop: 5,
    fontSize: 16,
    color: '#333',
  },
});

export default ExpandableText;