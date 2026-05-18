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
  title: string,
  placeHolder: string,
  items: SelectItem[],
  topGap?: number
}

const useFormSelector = ({
  title,
  items,
  placeHolder,
  topGap
}: Props) => {

  const [selected, setSelected] = useState<string>(items[0].value);
  const [allItem, setAllItem] = useState<SelectItem[]>(items)

  const Component = () => {

    const ref = React.useRef<TriggerRef>(null);

    const mt = useMemo(() => (
      topGap ? { marginTop: topGap } : {}
    ), [topGap])

    return (
      < >
        <Text className={`text-gray-300 text-sm`} style={mt}>{title}</Text>
        <Select className='w-full mt-2' value={allItem.find(s => s.value == selected)} onValueChange={(p) => {
          setSelected(p?.value + "")
        }}>
          <SelectTrigger ref={ref}>
            <SelectValue placeholder={placeHolder} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{""}</SelectLabel>
              {allItem.map((item) => (
                <SelectItem key={item.value} label={item.label} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </>
    )
  }

  return {
    Component,
    setAllItem,
    selected,
  }
}

export default useFormSelector