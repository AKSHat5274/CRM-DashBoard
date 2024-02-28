import React from 'react'
import {Card, Skeleton} from "antd"
import { Text } from '../text';
import { totalCountVariants } from '@/constants'
import { Area, AreaConfig } from '@ant-design/plots';
type Props={
    resource:"companies"| "contacts"|"deals",
    isLoading:boolean,
    totalCount:number
}

const TotalCountCards = ({
    resource,
    isLoading,
    totalCount
}:Props) => {
    const {primaryColor,secondaryColor,icon,title }= totalCountVariants[resource];
    const config:AreaConfig={
        data:totalCountVariants[resource].data,
        xField:'index',
        yField:'value',
        smooth:true,
        padding:0,
        xAxis:false,
        syncViewPadding:true,
        autoFit:true,
        animation:false,
        tooltip:false,
        yAxis:{
            tickCount:12,
            label:{
                style:{
                    stroke:'transparent'
                }
            },
            grid:{
                line:{
                    style:{
                        stroke:'transparent'
                    }
                }
            }
        },
        line:{
            color:primaryColor,
            
        },
        areaStyle:()=>{
            return{
                fill:`l(270) 0:#fff 1:${primaryColor} 0.2:${secondaryColor} `
            }
        }
    }
  return (
    <Card
    style={{height:"96px",padding:0}}
    bodyStyle={{padding:`8px 8px 8px 12px`}}
    size="small"
    >
        <div
        style={{
            display:'flex',
            alignItems:"center",
            gap:'8px',
            whiteSpace:'nowrap'
        }}>
            {icon}
            <Text size="md" className='secondary' style={{marginLeft:`8px`}}>
                {title}
            </Text>
        </div>
        <div
        style={{
            display:'flex',
            justifyContent:"space-between"
        }}
        >
            <Text
            size="xxxl"
            strong
            style={{
                flex:1,
                whiteSpace:'nowrap',
                flexShrink:0,
                textAlign:'start',
                marginLeft:'48px',
                fontVariantNumeric:'tabular-nums'
            }}
            >
                {isLoading?(
                    <Skeleton.Button
                    style={{
                        marginTop:"8px",
                        width:'74px'
                    }}
                    />
                ):(
                    totalCount
                )}
            </Text>
            <Area {...config} style={{width:'50%'}}/>
        </div>

    </Card>
  )
}

export default TotalCountCards