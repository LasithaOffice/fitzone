import { View, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import RegistrationWrapper from '../components/RegistrationWrapper'
import { Text } from '@/components/ui/text'
import { Input } from '@/components/ui/input'
import * as Haptics from 'expo-haptics'
import { router } from 'expo-router'
import useFormInputWithDropdown, { SelectItem } from '@/components/ui/custom/FormInputWithDropdown'
import { useAppDispatch } from '@/store'
import { setMedicalAndTargetInfo } from '@/store/authSlice'
import { saveLocalOnboardingState } from '@/lib/onboardingStore'
import {
  COMP_BACKGROUND_COLOR,
  COMP_BACKGROUND_COLOR_SELECTED,
  COMP_BORDER_COLOR,
  COMP_BORDER_COLOR_SELECTED,
  GRAY,
  TEXT_PRIMARY
} from '@/constants/colors'

const weightUnits: SelectItem[] = [
  { label: 'Kg', value: 'kg' },
  { label: 'Lb', value: 'lb' },
];

const allergyOptions = ['None', 'Peanut', 'Dairy', 'Gluten', 'Soy', 'Eggs', 'Shellfish', 'Tree Nuts'];
const conditionOptions = ['None', 'Diabetes', 'Hypertension', 'Asthma', 'Heart Issue', 'Arthritis', 'Other'];

const JoinScreen4 = () => {
  const dispatch = useAppDispatch();

  const [selectedAllergies, setSelectedAllergies] = useState<string[]>(['None']);
  const [selectedConditions, setSelectedConditions] = useState<string[]>(['None']);
  const [injuryHistory, setInjuryHistory] = useState<string>('');

  const targetWeight = useFormInputWithDropdown({
    items: weightUnits,
    listTitle: "Unit",
    placeHolder: "Enter target weight",
    title: "Target Weight",
    topGap: 24
  });

  const [errors, setErrors] = useState<{ targetWeight?: string }>({});

  const toggleAllergy = (allergy: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (allergy === 'None') {
      setSelectedAllergies(['None']);
    } else {
      setSelectedAllergies(prev => {
        const filtered = prev.filter(x => x !== 'None');
        if (filtered.includes(allergy)) {
          const result = filtered.filter(x => x !== allergy);
          return result.length === 0 ? ['None'] : result;
        } else {
          return [...filtered, allergy];
        }
      });
    }
  };

  const toggleCondition = (condition: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (condition === 'None') {
      setSelectedConditions(['None']);
    } else {
      setSelectedConditions(prev => {
        const filtered = prev.filter(x => x !== 'None');
        if (filtered.includes(condition)) {
          const result = filtered.filter(x => x !== condition);
          return result.length === 0 ? ['None'] : result;
        } else {
          return [...filtered, condition];
        }
      });
    }
  };

  const continueProcess = () => {
    const newErrors: typeof errors = {};
    const weightNum = parseFloat(targetWeight.value || '');

    if (!targetWeight.value || isNaN(weightNum) || weightNum <= 0) {
      newErrors.targetWeight = "Please enter a valid target weight.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    const medicalData = {
      allergies: selectedAllergies.filter(x => x !== 'None'),
      chronicConditions: selectedConditions.filter(x => x !== 'None'),
      injuryHistory: injuryHistory.trim(),
      targetWeightValue: targetWeight.value || '',
      targetWeightUnit: targetWeight.selected,
    };

    // Save info in Redux store
    dispatch(setMedicalAndTargetInfo(medicalData));
    saveLocalOnboardingState(medicalData);

    router.push('/(auth)/join5');
  };

  return (
    <RegistrationWrapper
      mainTitle={"Medical & Target Details"}
      onPress={continueProcess}
      onBack={() => {
        router.back();
      }}
      subTitle={"This keeps your diet and workouts safe and personalized"}
      step={3}
    >
      <ScrollView showsVerticalScrollIndicator={false} className="mt-5 mb-5">
        <View className="w-full items-start mt-4">

          {/* Allergies Choice */}
          <Text className="text-gray-300 text-sm mb-2">Food Allergies</Text>
          <View className="flex-row flex-wrap mb-4">
            {allergyOptions.map(allergy => {
              const isSelected = selectedAllergies.includes(allergy);
              return (
                <TouchableOpacity
                  key={allergy}
                  onPress={() => toggleAllergy(allergy)}
                  style={{
                    backgroundColor: isSelected ? COMP_BACKGROUND_COLOR_SELECTED : COMP_BACKGROUND_COLOR,
                    borderColor: isSelected ? COMP_BORDER_COLOR_SELECTED : COMP_BORDER_COLOR,
                    borderWidth: 1,
                    borderRadius: 20,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    marginRight: 8,
                    marginBottom: 8,
                  }}
                >
                  <Text style={{ color: isSelected ? TEXT_PRIMARY : GRAY, fontSize: 13, fontWeight: isSelected ? '600' : '400' }}>
                    {allergy}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>

          {/* Chronic Conditions Choice */}
          <Text className="text-gray-300 text-sm mb-2">Chronic Conditions</Text>
          <View className="flex-row flex-wrap mb-4">
            {conditionOptions.map(condition => {
              const isSelected = selectedConditions.includes(condition);
              return (
                <TouchableOpacity
                  key={condition}
                  onPress={() => toggleCondition(condition)}
                  style={{
                    backgroundColor: isSelected ? COMP_BACKGROUND_COLOR_SELECTED : COMP_BACKGROUND_COLOR,
                    borderColor: isSelected ? COMP_BORDER_COLOR_SELECTED : COMP_BORDER_COLOR,
                    borderWidth: 1,
                    borderRadius: 20,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    marginRight: 8,
                    marginBottom: 8,
                  }}
                >
                  <Text style={{ color: isSelected ? TEXT_PRIMARY : GRAY, fontSize: 13, fontWeight: isSelected ? '600' : '400' }}>
                    {condition}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>

          {/* Injury History */}
          <Text className="text-gray-300 text-sm mt-2">Injury History (Optional)</Text>
          <Input
            className="mt-2 w-full"
            placeholder="e.g. Lower back pain, left knee surgery"
            value={injuryHistory}
            onChangeText={setInjuryHistory}
          />

          {/* Target Weight Component */}
          {targetWeight.element}
          {errors.targetWeight && (
            <Text className="text-red-500 text-xs mt-1">{errors.targetWeight}</Text>
          )}

        </View>
      </ScrollView>
    </RegistrationWrapper>
  )
}

export default JoinScreen4
