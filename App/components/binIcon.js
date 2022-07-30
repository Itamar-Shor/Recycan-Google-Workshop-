import React from 'react';

export const BinIcon = ({bin, size, color = ''}) => {
    const IconLib = bin.IconLib;
    const IconName = bin.IconName;
    const binColor = bin.color;
    const iconColor = color || binColor;
    return (
        <IconLib name={IconName} color={iconColor} size={size}/>
    );
}