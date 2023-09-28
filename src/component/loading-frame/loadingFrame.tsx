import React from 'react'
import './loading.css'

interface IProps {
  divWidth: any;
  divHeight: any;
  spacing?: any;
  borderRadius?:any;
  maxDivWidth?:any;
  gridCol?: string;
  bgColor?: string;
}
export function LoadingFrame({divWidth, divHeight, spacing, borderRadius, maxDivWidth, bgColor, gridCol}:IProps) {
  return (
    <div className='div-load' style={{
      width:`${divWidth}`, 
      height:`${divHeight}`, 
      padding:`${spacing}`, 
      borderRadius:`${borderRadius}`,
      maxWidth:`${maxDivWidth}`,
      backgroundColor: `${bgColor}`,
      gridColumn: `${gridCol}`
    }}></div>
  )
}