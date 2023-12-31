import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign'
import RIcon from 'react-native-vector-icons/MaterialIcons'
import Modal from "react-native-modal";
import { useDispatch, useSelector } from 'react-redux';
import { setAuthToken, setUserId } from '../features/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AwesomeAlert from 'react-native-awesome-alerts';

const OtpModal = ({ isVisible, onClose, navigation }) => {
    const [otp, setOtp] = useState('')
    const [alertVisible, setAlertVisible] = useState(false);
    const dispatch = useDispatch()
    const showAlert = () => {
        setAlertVisible(true);
    };

    // Function to close the custom alert
    const closeAlert = () => {
        setAlertVisible(false);
    };

    const loginHandler = async () => {
        try {
            const response = await fetch("http://54.89.234.175:8080/auth/login/otp-login2", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    leotp: otp,
                }),
            });

            console.log("Raw response:", response);

            const responseData = await response.json();
            if (responseData.jwrToken) {
                const TOKEN = responseData.jwrToken;
                dispatch(setAuthToken({ authToken: TOKEN }));

                navigation.replace('HomeLoading');
            } else {
                console.log("Authentication failed");
                showAlert();
            }

            dispatch(setUserId({ userId: responseData.userId }));
        } catch (error) {
            console.error("Error sending authentication request:", error);
            showAlert();
        }

    };
    return (
        <View>
            <Modal
                onBackdropPress={onClose}
                onBackButtonPress={onClose}
                isVisible={isVisible}
                style={styles.modal}>
                <View style={styles.modalContent}>
                    {/* <TouchableOpacity style={styles.closeButton} onPress={toggleDetailModal}>
                        <Icon name="closecircle" color='black' size={25}/>
                    </TouchableOpacity> */}

                    <View>
                        <View style={styles.center}>
                            {/* <TouchableOpacity style={styles.closeButton} onPress={toggleDetailModal}>
                                        <Icon name="closecircle" color='black' size={25} />
                                    </TouchableOpacity> */}
                        </View>
                        <View>
                            <View style={styles.modalContentContainer}>
                                <TextInput
                                    value={otp}
                                    autoComplete='sms-otp'
                                    autoFocus
                                    inputmode='numeric'
                                    keyboardType="numeric"
                                    style={styles.input}
                                    placeholder='Enter OTP'
                                    placeholderTextColor={'#4f4f4f'}
                                    onChangeText={(text) => setOtp(text)}
                                    secureTextEntry />
                                <View style={{ justifyContent: "flex-end" }}>
                                    <TouchableOpacity style={styles.button} onPress={() => loginHandler()}>
                                        <Text style={styles.buttonText}>Login with OTP</Text>
                                    </TouchableOpacity></View>
                            </View>
                            <View>

                            </View>
                        </View>

                    </View>

                </View>
            </Modal>
            <AwesomeAlert
                show={alertVisible}
                showProgress={false}
                title="Authentication Failed"
                message="Login with OTP failed. Please try again."
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={false} // Hide cancel button
                showConfirmButton={true}
                confirmText="OK"
                confirmButtonColor="#FC3839"
                onConfirmPressed={() => {
                    closeAlert(); // Close the alert on "OK" button press
                }}
            />
        </View>
    )
};

const styles = StyleSheet.create({

    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#9f9f9f',
        margin: 5,
        color: '#2f2f2f',
        fontWeight: "300",
        fontFamily: "Metropolis-Medium",
        width: "100%"
    },
    button: {
        backgroundColor: '#FC3839',
        height: '55%',
        widht: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        letterSpacing: 10,

    },
    buttonText: {
        color: 'white',
        fontFamily: "Metropolis-SemiBold",
        letterSpacing: 1,
        textTransform: 'uppercase'
    },

    closeButton: {
        margin: 10
    },

    shadowProp: {
        elevation: 5,
        shadowColor: '#171717',
    },

    tagline: {
        color: '#4f4f4f',
        fontFamily: "Metropolis-Light",
        // marginTop: 5
    },

    modal: {
        justifyContent: "flex-end",
        margin: 0,
    },
    modalContent: {
        backgroundColor: "white",
        paddingTop: 12,
        paddingHorizontal: 12,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        height: 350,
        // paddingBottom: 20,
    },
    modaltitle: {
        color: 'black',
        fontFamily: 'Metropolis-Bold',
        margin: 5,
        fontSize: 16,
    },

    barIcon: {
        width: 60,
        height: 5,
        backgroundColor: "#7f7f7f",
        borderRadius: 3,
    },
    center: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    modalContentContainer: {
        // flexDirection: 'row',
        // justifyContent: 'space-between',
        marginTop: 10,
        padding: 5,
    },

    container: {
        margin: 10
    }
});
export default OtpModal;