import { useState } from 'react'
import { Cell, Pie, PieChart, Sector } from 'recharts'

const COLORS = ['#00D1B2', '#3298DC', '#48C774', '#FFDD57', '#F14668']

type Asset = {
  coin: string
  currentBTCValue
}

type AssetsPieChartProps = {
  data: Asset[]
}

type activeShapePayload = {
  coin: string
  balance: string
  currentBTCValue: string
}

type ActiveShapeProps = {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  startAngle: number
  endAngle: number
  fill: string
  payload: activeShapePayload
  value: number
}

function AssetsPieChart(props: AssetsPieChartProps) {
  const { data } = props

  const [activeIndex, setActive] = useState(0)

  const renderActiveShape = (args: ActiveShapeProps) => {
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      value,
    } = args

    const RADIAN = Math.PI / 180
    const cos = Math.cos(-RADIAN * midAngle)
    const sin = Math.sin(-RADIAN * midAngle)
    const sx = cx + (outerRadius + 10) * cos
    const sy = cy + (outerRadius + 10) * sin
    const mx = cx + (outerRadius + 30) * cos
    const my = cy + (outerRadius + 30) * sin
    const ex = mx + (cos >= 0 ? 1 : -1) * 22
    const ey = my
    const textAnchor = cos >= 0 ? 'start' : 'end'

    return (
      <g>
        <text x={ cx } y={ cy } dy={ 8 } textAnchor="middle" fill="#363636">
          { payload.coin }
        </text>
        <Sector
          cx={ cx }
          cy={ cy }
          innerRadius={ innerRadius }
          outerRadius={ outerRadius }
          startAngle={ startAngle }
          endAngle={ endAngle }
          fill={ fill }
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={ fill } fill="none"/>
        <circle cx={ ex } cy={ ey } r={ 2 } fill={ fill } stroke="none"/>
        <text x={ ex + (cos >= 0 ? 1 : -1) * 12 } y={ ey } textAnchor={ textAnchor } fill="#363636">
          { payload.balance }
        </text>
        <text x={ ex + (cos >= 0 ? 1 : -1) * 12 } y={ ey } dy={ 18 } textAnchor={ textAnchor } fill="#999">
          { value.toFixed(8) } BTC
        </text>
      </g>
    )
  }

  const mappedDataCells = data
    .sort((a, b) => b.currentBTCValue - a.currentBTCValue)
    .map((entry, index: number) => {
      return <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
    })

  return (
    <div className="AssetsPieChart">
      <PieChart width={550} height={300}>
        <Pie
          activeIndex={ activeIndex }
          activeShape={ renderActiveShape }
          data={ data }
          type="monotone"
          nameKey="coin"
          dataKey="currentBTCValue"
          cx="50%"
          cy="50%"
          innerRadius={ 60 }
          outerRadius={ 80 }
          onMouseEnter={(data, index: number) => setActive(index)}
        >
          { mappedDataCells }
        </Pie>
      </PieChart>
      <style jsx>{`
        .AssetsPieChart {
          margin: 1rem 0;
        }
      `}</style>
    </div>
  )
}

export default AssetsPieChart
