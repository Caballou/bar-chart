function main() {
  /*Request de datos*/
  const req = fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
  .then(response => response.json())
  .then(response => {
    const { data } = response;
    graph(data) /*Función graficadora*/
  })

  const graph = (data) => {

    let dates = data.map((d) => new Date(d[0])) /*Formateado de fechas*/

    console.log(data)
    //console.log(dates)

    const w = 1000; /*Ancho de canvas*/
    const h = 550; /*Alto de canvas*/
    const padding = 60;
    const barWidth = (w - 2*padding) / data.length; /*Ancho de barras*/

    /*Definición de escalas*/
    const xScale = d3.scaleTime()
    .domain([d3.min(dates), d3.max(dates)])
    .range([padding, w - padding]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => d[1])])
      .range([h, 2*padding])
    
    /*Tooltip*/
    const tooltip = d3.select('.grafico')
      .append('div')
      .attr('id','tooltip')
      .style("position", "absolute")
      .style("visibility", "hidden")

    /*Canvas*/
    const svg = d3.select('.grafico')
      .append('svg')
      .attr('width', w)
      .attr('height', h)
    
    /*Título*/
    d3.select('#title')
      .text('United States GDP')

    /*Definición de los ejes*/
    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)
    
   /*Texto eje e info*/
    svg.append('text')
      .attr('x', -215)
      .attr('y', 80)
      .attr('transform', 'rotate(-90)')
      .text('Gross Domestic Product')
  
    svg.append('text')
      .attr('x', 600)
      .attr('y', 540)
      .attr('class', 'info')
      .html('More Information: <a href="http://www.bea.gov/national/pdf/nipaguid.pdf" target="blank_">http://www.bea.gov/national/pdf/nipaguid.pdf</a>')
    
    /*Graficado de ejes*/
    svg.append('g')
      .attr('id','x-axis')
      .attr('transform', `translate(0,${h - padding})`)
      .call(xAxis)
    
    svg.append('g')
      .attr('id','y-axis')
      .attr('transform', `translate(${padding},${-padding})`)
      .call(yAxis)


    /*Graficado de barras*/
    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('data-date', (d) => d[0])
      .attr('data-gdp', (d) => d[1])
      .attr('class','bar')
      .attr('x', (d, i) => i * barWidth + padding)
      .attr('y', (d, i) => yScale(d[1]) - padding)
      .attr('width', barWidth)
      .attr('height', (d, i) => h - yScale(d[1]))
      .on("mouseover", (d) => {
        tooltip.attr('data-date', d.target.__data__[0])
          .style("visibility", "visible")
          .html(
        '<p>' + d.target.__data__[0].slice(0,4) + 
        ` ${d.target.__data__[0].slice(5,7) === '01' ? 'Q1': 
        d.target.__data__[0].slice(5,7) === '04' ? 'Q2' :
        d.target.__data__[0].slice(5,7) === '07' ? 'Q3' : 'Q4'}` +
        '</p>' + 
        '<p>$ ' 
        + d.target.__data__[1] + ' Billion' + 
        '</p>')
      ;})
      .on("mousemove", (d) => {
        tooltip.style("top", (d.pageY-25)+"px").style("left",(d.pageX+25)+"px");
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
    });
    

  }
};
  
