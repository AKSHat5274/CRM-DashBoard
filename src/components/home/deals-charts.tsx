import { DollarOutlined } from '@ant-design/icons'
import { Card } from 'antd'
import React from 'react'
import { Text } from '../text'
import { Area,AreaConfig } from '@ant-design/plots'
import { useList } from '@refinedev/core'
import { DASHBOARD_DEALS_CHART_QUERY } from '@/graphql/queries'
import { mapDealsData } from '@/utilities/helpers'
import { GetFieldsFromList } from '@refinedev/nestjs-query'
import { DashboardDealsChartQuery } from '@/graphql/types'
const DealsCharts = () => {
  const {data} = useList<GetFieldsFromList<DashboardDealsChartQuery>>({
    resource:'dealStages',
    meta:{
      gqlQuery:DASHBOARD_DEALS_CHART_QUERY
    }
  });
  // console.log(data,"Deals Data")
  const dealsData= React.useMemo(()=>{
    return mapDealsData(data?.data)
  },[data?.data])
  const config:AreaConfig={
    data:dealsData,
    xField:'timeText',
    yField:'value',
    isStack:false,
    seriesField:'state',
    animation:true,
    startOnZero:false,
    smooth:true,
    legend:{
      offsetY:-6
    },
    yAxis:{
      tickCount:4,
      label:{
        formatter:(v:string)=>{
          return `$${Number(v)/10000}K`
        }
      }
    },
    tooltip:{
      formatter:(data)=>{
        return{
          name:data.state,
          value:`$${Number(data.value)/10000}K`
        }
      }
    }

  }
  return (
    <Card
    style={{height:'100%'}}
    headStyle={{padding:'8px 16px'}}
    bodyStyle={{padding:'0px 0px'}}
    title={
      <div
        style={{
          display:'flex',
          alignItems:'center',
          gap:'8px'
        }}>
          <DollarOutlined/>
          <Text size="sm" style={{marginLeft:'0.5rem0 '}}>
            Deals
          </Text>
      </div>
    }
    >
      {<Area {...config} height={325}/>}
    </Card>
  )
}

export default DealsCharts