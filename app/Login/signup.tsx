import DateTimePicker from '@react-native-community/datetimepicker';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Button, Checkbox } from 'react-native-paper';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const GENDER_OPTIONS = ['Male', 'Female', 'Non-binary', 'Prefer not to answer'];

type GenderDropdownProps = {
  selectedGender: string;
  setSelectedGender: (gender: string) => void;
};

function GenderDropdown({ selectedGender, setSelectedGender }: GenderDropdownProps) {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleSelect = (option: string) => {
    setSelectedGender(option);
    setDropdownVisible(false);
  };

  return (
    <View style={genderStyles.container}>
      <Text style={genderStyles.heading}>Gender</Text>
      <TouchableOpacity
        style={genderStyles.dropdownField}
        onPress={() => setDropdownVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={[genderStyles.selectedText, !selectedGender && { color: '#888' }]}>
          {selectedGender || 'Select your gender'}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={dropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableOpacity
          style={genderStyles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setDropdownVisible(false)}
        >
          <View style={genderStyles.dropdownBox}>
            {GENDER_OPTIONS.map((option) => (
              <TouchableOpacity key={option} style={genderStyles.option} onPress={() => handleSelect(option)}>
                <Text style={genderStyles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const SignUpScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [gender, setGender] = useState('');

  // const signupUser = async () => {
  //   try {
  //     const response = await fetch('https://example.com/api/register', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ firstName, lastName, dob, gender }),
  //     });

  //     if (response.ok) {
  //       router.replace('/home');
  //     } else {
  //       Alert.alert('Error', 'Something went wrong. Try again.');
  //     }
  //   } catch (error) {
  //     console.error('Signup error', error);
  //   }
  // };

  const handleSignUp = async () => {
    if (!firstName.trim()) return Alert.alert('Validation Error', 'First name is required');
    if (!lastName.trim()) return Alert.alert('Validation Error', 'Last name is required');
    if (!dob.trim()) return Alert.alert('Validation Error', 'Date of birth is required');
    if (!gender) return Alert.alert('Validation Error', 'Gender is required');
    if (isChecked) {
      // signupUser();
    } else {
      Alert.alert('Please accept the terms and conditions');
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (event.type === 'set' && selectedDate) {
      const formatted = selectedDate.toISOString().split('T')[0];
      setDob(formatted);
    }
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.outerContainer} keyboardShouldPersistTaps="handled">
            <View style={styles.headerRow}>
              <Text style={styles.header}>Sign Up</Text>
            </View>

            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your first name"
              placeholderTextColor="#888"
              value={firstName}
              onChangeText={setFirstName}
            />

            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your last name"
              placeholderTextColor="#888"
              value={lastName}
              onChangeText={setLastName}
            />

            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <TextInput
                style={styles.input}
                placeholder="Select your date of birth"
                placeholderTextColor="#888"
                value={dob}
                editable={false}
                pointerEvents="none"
              />
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={dob ? new Date(dob) : new Date()}
                mode="date"
                display="default"
                maximumDate={new Date()}
                onChange={onDateChange}
              />
            )}

            <GenderDropdown selectedGender={gender} setSelectedGender={setGender} />

            <View style={styles.checkboxRow}>
              <View style={styles.checkboxBorder}>
                <Checkbox
                  status={isChecked ? 'checked' : 'unchecked'}
                  onPress={() => setIsChecked(!isChecked)}
                  color="#007E71"
                  uncheckedColor="#007E71"
                />
              </View>
              <Text style={styles.checkboxText}>
                By clicking, I accept the{' '}
                <Text style={styles.link} onPress={() => router.push('./t_and_c')}>
                  terms of services
                </Text>{' '}
                and{' '}
                <Text style={styles.link} onPress={() => router.push('./privacy')}>
                  privacy policy
                </Text>
              </Text>
            </View>

            <Button
              mode="contained"
              style={styles.signUpButton}
              onPress={()=> router.push('/home')}
              disabled={!isChecked}
            >
              <Text style={styles.signText}>Sign up</Text>
            </Button>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1 }}>
          <BlurView intensity={90} tint="light" style={styles.blurContainer}>
            <View style={styles.modalContent}>
              {/* <WelcomeCard /> */}
            </View>
          </BlurView>
        </View>
      </Modal>
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  outerContainer: {
    flexGrow: 1,
    backgroundColor: 'white',
    paddingTop: 60,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#00A99D',
    top: 10,
    left: 10,
  },
  label: {
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
    color: '#000',
    alignSelf: 'flex-start',
    paddingLeft: 20,
    fontSize: 20,
  },
  input: {
    width: 326,
    height: 52,
    backgroundColor: '#E8F1F0',
    borderRadius: 25,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000',
  },
  signUpButton: {
    marginTop: 24,
    width: 189,
    height: 52,
    borderRadius: 25,
    backgroundColor: '#007E71',
    justifyContent: 'center',
  },
  signText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
    width: '100%',
  },
  checkboxBorder: {
    borderWidth: 1,
    borderColor: '#007E71',
    borderRadius: 4,
  },
  checkboxText: {
    color: '#333',
    flex: 1,
    flexWrap: 'wrap',
    marginLeft: 8,
    fontSize: 14,
  },
  link: {
    color: '#00A99D',
    textDecorationLine: 'underline',
  },
  blurContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '90%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
});

const genderStyles = StyleSheet.create({
  container: {
    width: 326,
    marginTop: 20,
    marginBottom: 10,
    alignSelf: 'center',
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000',
    paddingLeft: 2,
  },
  dropdownField: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 25,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    paddingHorizontal: 16,
    backgroundColor: '#E8F1F0',
    justifyContent: 'center',
    height: 52,
  },
  selectedText: {
    fontSize: 16,
    color: '#222',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  dropdownBox: {
    marginHorizontal: 32,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 8,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionText: {
    fontSize: 16,
    color: '#222',
  },
});