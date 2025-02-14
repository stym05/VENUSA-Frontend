import React, { useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, TouchableOpacity, Image, StyleSheet, Dimensions, SafeAreaView, ScrollView } from 'react-native';
import { PaperProvider, Card } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Footer from '../components/footer';
import { isMobile } from '../utils';

const { width } = Dimensions.get('window');

const ContactUs = (props) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [description, setDescription] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const pickDocument = async () => {
        let result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
        if (result.canceled === false) {
            setAttachment(result);
        }
    };

    const handleSubmit = () => {
        const formData = {
            name,
            email,
            phone,
            description,
            attachment
        };
        console.log('Form Data Submitted:', formData);
        alert('Form Submitted Successfully!');
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
                <PaperProvider>
                    <View style={styles.container}>
                        <Text style={styles.header}>Contact Us</Text>
                        <Card style={styles.card}>
                            <Card.Content>
                                <Text style={styles.label}>Name*:</Text>
                                <TextInput
                                    style={styles.input}
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="Enter your name"
                                />

                                <Text style={styles.label}>Email*:</Text>
                                <TextInput
                                    style={styles.input}
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="Enter your email"
                                    keyboardType="email-address"
                                />

                                <Text style={styles.label}>Phone Number*:</Text>
                                <TextInput
                                    style={styles.input}
                                    value={phone}
                                    onChangeText={setPhone}
                                    placeholder="Enter your phone number"
                                    keyboardType="phone-pad"
                                />

                                <Text style={styles.label}>Description*:</Text>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    value={description}
                                    onChangeText={setDescription}
                                    placeholder="Enter your message"
                                    multiline
                                />
                                <Text style={styles.label}>Attach File: (optional)</Text>
                                <GestureHandlerRootView>
                                    <TouchableOpacity onPress={pickDocument} style={styles.dropZone}>
                                        <Text>Tap to Select a File</Text>
                                    </TouchableOpacity>
                                </GestureHandlerRootView>
                                {attachment && (
                                    <View style={styles.attachmentContainer}>
                                        <Text>Selected File: {attachment.name}</Text>
                                        {attachment.uri && <Image source={{ uri: attachment.uri }} style={styles.image} />}
                                    </View>
                                )}

                                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                                    {isLoading ? (<ActivityIndicator size={"small"} color={"#fff"} />) : (<Text style={styles.buttonText}>Submit</Text>)}
                                </TouchableOpacity>
                            </Card.Content>
                        </Card>
                    </View>
                </PaperProvider>
                <Footer navigation={props.navigation} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5'
    },
    header: {
        fontFamily: "Roboto",
        fontSize: 32,
        fontWeight: "400",
        lineHeight: 48,
    },
    card: {
        width: !isMobile() ? '60%' : '95%',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        backgroundColor: 'white'
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        backgroundColor: 'white'
    },
    textArea: {
        height: 80,
    },
    dropZone: {
        borderWidth: 2,
        borderColor: '#000',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: '#ddd'
    },
    attachmentContainer: {
        alignItems: 'center',
        marginBottom: 10
    },
    image: {
        width: 100,
        height: 50,
        marginTop: 5
    },
    button: {
        marginTop: 50,
        backgroundColor: '#1A1A1A',
        width: '100%',
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        fontFamily: "Roboto"
    }
});

export default ContactUs;
