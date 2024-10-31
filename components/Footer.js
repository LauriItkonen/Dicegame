import React from 'react'
import { View, Text } from 'react-native'
import style from '../style/style'

export const Footer = () => {
  return (
    <View style={style.footer}>
        <Text style={style.author}>Author: Lauri Itkonen</Text>
    </View>
  )
}
