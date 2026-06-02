import { View, Text, Alert } from 'react-native'
import React, { useMemo, useState } from 'react'
import { Input } from '../input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../select'
import type { TriggerRef } from '@rn-primitives/select';

export type SelectItem = {
  value: string,
  label: string
}

type Props = {
  listTitle: string,
  title: string,
  placeHolder: string,
  items: SelectItem[],
  topGap?: number
}

const useFormInputWithDropdown = ({
  listTitle,
  title,
  items,
  placeHolder,
  topGap
}: Props) => {

  const [selected, setSelected] = useState<string>(items[0].value);
  const [value, setValue] = useState<string>();
  const [allItem, setAllItem] = useState<SelectItem[]>(items)

  const ref = React.useRef<TriggerRef>(null);

  const mt = useMemo(() => (
    topGap ? { marginTop: topGap } : {}
  ), [topGap])

  const element = (
    <>
      <Text className={`text-gray-300 text-sm ${topGap ? `mt-[${10}px]` : ''}`} style={mt}>{title}</Text>
      <View className='flex-row gap-2 mt-2 w-full'>
        <Input className='flex-1' placeholder={placeHolder} inputMode='numeric' value={value} onChangeText={setValue} />
        <Select value={allItem.find(s => s.value == selected)} onValueChange={(p) => {
          setSelected(p?.value + "")
        }}>
          <SelectTrigger ref={ref}>
            <SelectValue placeholder="" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{listTitle}</SelectLabel>
              {allItem.map((item) => (
                <SelectItem key={item.value} label={item.label} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </View>
    </>
  )

  return {
    element,
    setAllItem,
    selected,
    value
  }
}

export default useFormInputWithDropdown