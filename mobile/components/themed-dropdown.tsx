import { useState } from 'react';
import DropDownPicker, { type ItemType, type ValueType } from 'react-native-dropdown-picker';

import { useThemeColor } from '@/hooks/use-theme-color';

export interface ThemedDropdownProps<T extends ValueType> {
    items: Array<ItemType<T>>;
    onValueChange: (value: T) => void;
    selectedValue: T;
}

export function ThemedDropdown<T extends ValueType>({ items, onValueChange, selectedValue }: ThemedDropdownProps<T>) {
    const [open, setOpen] = useState(false);

    const textColor = useThemeColor({}, 'text');
    const backgroundColor = useThemeColor({}, 'card');
    const borderColor = useThemeColor({}, 'border');
    const selectedColor = useThemeColor({}, 'tint');

    const setValue = (cb: (prev: T | null) => T | null) => {
        const newValue = cb(selectedValue);
        if (newValue !== null) onValueChange(newValue);
    };

    return (
        <DropDownPicker
            open={open}
            setOpen={setOpen}
            value={selectedValue}
            setValue={setValue}
            items={items}
            style={{ backgroundColor, borderColor }}
            textStyle={{ color: textColor }}
            dropDownContainerStyle={{ backgroundColor, borderColor }}
            selectedItemLabelStyle={{ color: selectedColor }}
            tickIconStyle={{ tintColor: selectedColor } as object}
        />
    );
}
