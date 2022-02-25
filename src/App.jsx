import { useState } from 'react' 
import logo from './logo.svg'
import './App.css'
import { uniq } from "lodash";
import college from "/college"
import { AxisLeft, AxisBottom } from '@visx/axis';
import { scaleLinear, scaleBand, extent, line, symbol, csv } from "d3";

function App() {

  const majorCategory = uniq(college.map((data) => data.Major_category))
  console.log(majorCategory)
  function filterData(data, category){
    var filteredData = []
    filteredData = data.filter(data => data.Major_category === category);
    const women = filteredData.map((data) => data.ShareWomen)
    const men = filteredData.map((data) => 1 - data.ShareWomen)
    const arrSortWomen = women.sort();
    const lenWomen = women.length;
    const midWomen = Math.ceil(lenWomen / 2);
    const medianWomen = lenWomen % 2 == 0 ? (arrSortWomen[midWomen] + arrSortWomen[midWomen - 1]) / 2 : arrSortWomen[midWomen - 1];

    const arrSortMen = men.sort();
    const lenMen = men.length;
    const midMen = Math.ceil(lenMen / 2);
    const medianMen = lenMen % 2 == 0 ? (arrSortMen[midMen] + arrSortMen[midMen - 1]) / 2 : arrSortMen[midMen - 1];

    return {women: medianWomen, men: medianMen};

  }
  var genderPercentage = []
  for (var i = 0; i < majorCategory.length; i++){
    let median = filterData(college, majorCategory[i])
    genderPercentage.push(median)

  }
  console.log(genderPercentage)
  const differenceWomen = genderPercentage.map((data) => data.women - data.men)
  const differenceMen = genderPercentage.map((data) => data.men - data.women)
  const maxWomen = extent(differenceWomen)
  const maxMen = extent(differenceMen)
  const maxDifferenceData = [{majorCat: "Psychology & Social Work", description: "Top major category that women more than men", data: maxWomen}, {majorCat: "Engineering", description: "Top major category that men more than women", data: maxMen}]
  const top3Women = differenceWomen.slice().sort(function (a, b) { return b - a}).slice(0, 3);
  const top3Men = differenceMen.slice().sort(function (a, b) { return b - a}).slice(0, 3);
  console.log(maxWomen)
  console.log(maxMen)


  const [checkedState, setCheckedState] = useState(
    new Array(maxDifferenceData.length).fill(false)
  );
  console.log(checkedState)


  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((data, i) =>
      i === position ? !data : data
    );

    setCheckedState(updatedCheckedState);

    
  };
  
  console.log(setCheckedState)

  const chartSizeHeight = 500;
  const chartSizeWidth = 1000;
  const margin = 30;
  const legendPadding = 200;
  const chart2SizeHeight = 1700;
  const chart2SizeWidth = 1000;


  const scalePercentage = scaleLinear()
    .domain([0, 100])
    .range([chartSizeHeight - margin, margin]);
  
  const scaleMajorCat = scaleBand()
    .domain(majorCategory)
    .range([0, chartSizeWidth]);

  const earningIn1000 = college.map(data => data.Median/1000)
  const maxEarning = extent(earningIn1000);


  const arrSortEarning = earningIn1000.sort();
  const lenEarning = earningIn1000.length;
  const midEarning = Math.ceil(lenEarning / 2);
  const medianEarning = earningIn1000.length % 2 == 0 ? (arrSortEarning[midEarning] + arrSortEarning[midEarning - 1]) / 2 : arrSortEarning[midEarning - 1];
  

  const scaleEarning = scaleLinear()
    .domain([0, maxEarning[1]])
    .range([0, chart2SizeWidth]);

  const unemploymentRate = college.map(data => data.Unemployment_rate * 100);
  const maxUnemploymentRate = extent(unemploymentRate);
  const scaleUnemploymentRate  = scaleLinear()
    .domain([0, maxUnemploymentRate[1]])
    .range([chartSizeHeight, margin]);

  
  function filterDataUR(data, category){
    var filteredData = []
    filteredData = data.filter(data => data.Major_category === category);
    filteredData.ShareWomen
    const unemploymentRateData = filteredData.map((data) => data.Unemployment_rate)
    const arrSortUR = unemploymentRateData.sort();
    const lenUR = unemploymentRateData.length;
    const midUR = Math.ceil(lenUR / 2);
    const medianUR = lenUR % 2 == 0 ? (arrSortUR[midUR] + arrSortUR[midUR - 1]) / 2 : arrSortUR[midUR - 1];
    return medianUR;

  }

  var medianUnemploymentRate = []
  for (var i = 0; i < majorCategory.length; i++){
    let median = filterDataUR(college, majorCategory[i])
    medianUnemploymentRate.push(median)

  }

  const scaleURBottom = scaleLinear()
    .domain([0, maxUnemploymentRate[1]])
    .range([0, chart2SizeWidth]);


  const scaleUR = scaleLinear()
    .domain([0, maxUnemploymentRate[1]])
    .range([chartSizeHeight - margin, margin]);


  
  const filteredCollegeData = college.filter(data => data.Major_code != 1104);
  const parttimePercentage = filteredCollegeData.map(data => data.Part_time/data.Total *100)
  // const filteredparttimePercentage = parttimePercentage.filter(data => data.Major_code !== "1104");
  const maxParttimePercentage = extent(parttimePercentage);
  const scaleParttimePercentage = scaleLinear()
    .domain([0, maxParttimePercentage[1]])
    .range([chartSizeHeight, margin]);

  return (
    <div style={{ margin: 50 }}>
      <h1>Interactive Chart for College Major Dataset </h1>
      <p>
        The College Major dataset contains {college.length} entries, each entry
        represents a different major.
      </p>
      
      <h2>1. Which major category has the most unblanced percentage between men and women?</h2>
      <p>Every major has different gender diversity. There are also gender stereotypes 
        toward different majors. I was wondering what are major categories have the 
        greatest gender disparities and also wondering if the stereotypes are true. 
        Therefore, I make an intweactive chart for people to dicover the data:</p>
      {/* first chart */}
      <div>
        {maxDifferenceData.map((data, i) =>{
          return(
            <>
              <input 
                type="checkbox"
                id={data.majorCat}
                name={data.majorCat}
                checked={checkedState[i]}
                onChange={() => handleOnChange(i)}
              />
              <label style={{marginRight: 15}} for={data.majorCat}>{data.description}</label>
            </>
          )
        })}
        
      </div>
      <div style={{ display: "flex" }}>
      <svg
          width={chartSizeWidth + legendPadding}
          height={chartSizeHeight + 200}
        >
          <AxisLeft strokeWidth={1} left={margin + 50} scale={scalePercentage} />
          <AxisBottom
            strokeWidth={1}
            top={chartSizeHeight - margin}
            left={margin + 50}
            scale={scaleMajorCat}
            tickValues={majorCategory}
            tickLabelProps={(value) => {
              return {
                transform: 'rotate(65 ' + scaleMajorCat(value) + ',0)',
                fontSize: 10,
                dx:30,
                dy:-5,
              }
            }}
          />
          

          <text x="-300" y="30" transform="rotate(-90)" fontSize={16}>
            Percentage (%)
          </text>

          <text x="450" y="680" fontSize={16}>
            Major Categories
          </text>

          

          {genderPercentage.map((data, i) => {
            return (
              <rect
                x={97 + i * 62.5}
                y={scalePercentage(data.women*100)}
                height={scalePercentage(0) - scalePercentage(data.women*100)}
                width={15}
                fill= {checkedState[0] == true && data.women - data.men == maxWomen[1]?'rgb(210, 43, 43)': `rgb(${100},${100},${100})`}
                // {data.women - data.men == top3Women[0]? 'rgb(210, 43, 43)': data.women - data.men == top3Women[1] ? 'rgb(255,64,64)': data.women - data.men == top3Women[2] ? 'rgb(250, 128, 114)':`rgb(${100},${100},${100})`}
              />
              
            );
          })}

          {genderPercentage.map((data, i) => {
            return (
              <rect
                x={112 + i * 62.5}
                y={scalePercentage(data.men*100)}
                height={scalePercentage(0) - scalePercentage(data.men*100)}
                width={15}
                fill={checkedState[1] == true && data.men - data.women == maxMen[1]?'rgb(65,105,225)': `rgb(${200},${200},${200})`}
                // {`rgb(${200},${200},${200})`}
              />
            );
          })}
          <rect
            x={chartSizeWidth }
            y={50}
            height={20}
            width={30}
            fill={`rgb(${200},${200},${200})`}
          />

          <rect
            x={chartSizeWidth}
            y={20}
            height={20}
            width={30}
            fill={`rgb(${100},${100},${100})`}
          />
          

          <text x={chartSizeWidth + 35} y="35" fontSize={12}>
            Women
          </text>

          <text x={chartSizeWidth + 35} y="65" fontSize={12}>
            Men
          </text>

        </svg> 
      </div>
      <p>
      This interactive chart allows people to highligh the top major category that have more women 
      than men and also the top major category that have more men than women. When people select 
      the "Top major category that women more than men" checkbox, the chart will highligh the 
      top major category have more women than men in a red color. In addition, When people select 
      the "Top major category that men more than women" checkbox, the chart will highligh the 
      top major category have more men more than women in a blue color. I choose to use both red and blue
      color to highlight the chart because people are able to select both checkbox and I want them to be
      able to distinguish which one belong to which checkbox.
      </p>

      {/* second chart
      <div style={{ display: "flex" }}>
      <svg
          width={chartSizeWidth + legendPadding}
          height={chartSizeHeight + 200}
        >
          <AxisLeft strokeWidth={1} left={margin + 50} scale={scalePercentage} />
          <AxisBottom
            strokeWidth={1}
            top={chartSizeHeight - margin}
            left={margin + 50}
            scale={scaleMajorCat}
            tickValues={majorCategory}
            tickLabelProps={(value) => {
              return {
                transform: 'rotate(65 ' + scaleMajorCat(value) + ',0)',
                fontSize: 10,
                dx:30,
                dy:-5,
              }
            }}
          />
          

          <text x="-300" y="30" transform="rotate(-90)" fontSize={16}>
            Percentage (%)
          </text>

          <text x="450" y="680" fontSize={16}>
            Major Categories
          </text>

          

          {genderPercentage.map((data, i) => {
            return (
              <rect
                x={97 + i * 62.5}
                y={scalePercentage(data.women*100)}
                height={scalePercentage(0) - scalePercentage(data.women*100)}
                width={15}
                fill={`rgb(${100},${100},${100})`}
              />
              
            );
          })}

          {genderPercentage.map((data, i) => {
            return (
              <rect
                x={112 + i * 62.5}
                y={scalePercentage(data.men*100)}
                height={scalePercentage(0) - scalePercentage(data.men*100)}
                width={15}
                fill= {data.men - data.women == top3Men[0]?'rgb(65,105,225)': data.men - data.women == top3Men[1] ? 'rgb(30,144,255)': data.men - data.women == top3Men[2] ? 'rgb(135,206,250)':`rgb(${200},${200},${200})`}
              />
            );
          })}
          <rect
            x={chartSizeWidth }
            y={50}
            height={20}
            width={30}
            fill={`rgb(${200},${200},${200})`}
          />

          <rect
            x={chartSizeWidth}
            y={20}
            height={20}
            width={30}
            fill={`rgb(${100},${100},${100})`}
          />
          

          <text x={chartSizeWidth + 35} y="35" fontSize={12}>
            Women
          </text>

          <text x={chartSizeWidth + 35} y="65" fontSize={12}>
            Men
          </text>

        </svg>
      </div>
      <p>
      The second chart highlights the major categories that have more men than women. 
      Same the first chart, the three highlighted ones are the ones that have the top 
      three greatest differences, but the shades are in blue.  The darker color shades 
      mean that the categories have the most differences between men and women when 
      looking at the ones that have more men than women. According to the chart, the 
      top one categories is Engineering, the second one is Industrial Arts and Consumer 
      Services, and the third one is Computers and Mathematics. I think overall the data 
      does match the stereotypes that more men in the STEM field.
      </p> */}


      
  
          
          

        
    </div>
  );
}


export default App