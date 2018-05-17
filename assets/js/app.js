// D3 Scatterplot Assignment
// Create a scatter plot with D3.js.

// Margins
let margin= {top: 20, right: 20, bottom: 100, left: 100};
let width= 800 - margin.left - margin.right;
let height= 500 - margin.top - margin.bottom;

// x & y scale range
let xScale= d3.scaleLinear().range([0,width]);
let yScale= d3.scaleLinear().range([height,0]);
let xAxis= d3.axisBottom(xScale);
let yAxis= d3.axisLeft(yScale);

// append svg in chart
let svg= d3.select('.chart')
  .append('div')
  .classed('svg-container',true)
  .append('svg')
  .attr('preserveAspectRatio','xMidYMid')
  .attr('viewBox','0 0 800 600')
  .classed('svg-content-responsive',true)
  .attr('style','background: rgb(245,245,255)')
  .append('g')
  .attr('transform','translate(' + margin.left + ',' + margin.top + ')');

// xAxis 
// Divorced
svg.append('text')
  .attr('class','axis-text active')
  .attr('id','x')
  .attr('x',width/2 - 50)
  .attr('y',height + 35)
  .attr('style','font-weight: bold')
  .attr('data-axis-name','Divorced_total_2014')
  .text('Divorced rate (%)');
// Poverty
svg.append('text')
.attr('class','axis-text')
.attr('id','x')
.attr('x',width/2 - 50)
.attr('y',height + 55)
.attr('style','font-weight: bold')
.attr('data-axis-name','Poverty_rate')
.text('Poverty rate (%)');
// Unemployment
svg.append('text')
  .attr('class','axis-text')
  .attr('id','x')
  .attr('x',width/2 - 50)
  .attr('y',height + 75)
  .attr('style','font-weight: bold')
  .attr('data-axis-name','Unemployment_rate')
  .text('Unemployment rate (%)');

// yAxis
// Depression
svg.append('text')
  .attr('class','axis-text active')
  .attr('id','y')
  .attr('transform','rotate(-90)')
  .attr('x',-height/2 - 50)
  .attr('y',-40)
  .attr('dy','.71em')
  .attr('style','font-weight: bold')
  .attr('data-axis-name','Depression_total_2014')
  .text('Depression rate (%)');
// Heart Attack
svg.append('text')
  .attr('class','axis-text')
  .attr('id','y')
  .attr('transform','rotate(-90)')
  .attr('x',-height/2 - 50)
  .attr('y',-60)
  .attr('dy','.71em')
  .attr('style','font-weight: bold')
  .attr('data-axis-name','heart_attack_rate')
  .text('Heart attack rate (%)');
// Doctor Visits
svg.append('text')
  .attr('class','axis-text')
  .attr('id','y')
  .attr('transform','rotate(-90)')
  .attr('x',-height/2 - 110)
  .attr('y',-80)
  .attr('dy','.71em')
  .attr('style','font-weight: bold')
  .attr('data-axis-name','Dr_visit_last_year')
  .text('Doctor visits within last year (%)');

// Data
let csv_data= 'Data/data.csv'

d3.csv(csv_data, function(err,data) {
  if(err) throw err;

  data.forEach(function(d) {
    // str => int
    d.Divorced_total_2014 = +d.Divorced_total_2014;
    d.Depression_total_2014 = +d.Depression_total_2014;
    d.Poverty_rate = d.Poverty_rate;
    d.heart_attack_rate = +d.heart_attack_rate;
    d.Unemployment_rate = +d.Unemployment_rate;
    d.Dr_visit_last_year = +d.Dr_visit_last_year;
  });
  // Initializing tooltip
  let tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([120,10])
    .html(function(d) {
      return d;
    });
    svg.call(tip);

    // data-axis-name
    let activeX = d3
      .select('#x')
      .filter('.active').attr('data-axis-name');
    let activeY = d3
      .select('#y')
      .filter('.active').attr('data-axis-name');

    console.log('activeX: ' + activeX + '; activeY: ' + activeY);
    
    // plot chart
    plot_data(activeX,activeY);
    
    // Configure axis text on click
    let allX = d3.selectAll('#x');
    let allY = d3.selectAll('#y');

    change_active_x(allX);
    change_active_y(allY);

    // d3.selectAll(x axis)
    function change_active_x(textLabels) {
      textLabels.on('click',function(event) {
        let clicked = d3.select(this)
        let currentActive = textLabels.filter('.active')

        // chenge active and inactive labels
        clicked.attr('class', 'axis-text active');
        currentActive.attr('class', 'axis-text');
        // Return clicked.attr
        activeX = clicked.attr('data-axis-name');
        plot_data(activeX,activeY);
      });
    }
    function change_active_y(textLabels) {
      textLabels.on('click',function(event) {
        let clicked = d3.select(this)
        let currentActive = textLabels.filter('.active')

        // chenge active and inactive labels
        clicked.attr('class', 'axis-text active');
        currentActive.attr('class', 'axis-text');
        // Return clicked.attr
        activeX = clicked.attr('data-axis-name');
        plot_data(activeX,activeY);
      });
    }

    // Create graph for x & y
    function plot_data(x_data,y_data) {
      // domain
      xScale.domain(d3.extent(data,function(d) {
        return d[x_data];
      }));
      yScale.domain(d3.extent(data,function(d) {
        return d[y_data];
      }));

      // if no previous plot, the make a new one
      if(d3.select('.dot').empty() == true) {
        // append svg
        svg.append('g')
        .attr('class','xaxis')
        .attr('transform','translate(0,' + height + ')')
        .call(xAxis);

        svg.append('g')
        .attr('class','yaxis')
        .call(yAxis);

        // scatterplot
        svg.selectAll('.dot')
          .data(data)
          .enter().append('circle')
          .attr('class','dot')
          .attr('r',10)
          .attr('cx',function(d) {
            return xScale(d[x_data]);
          })
          .attr('cy',function(d) {
            return yScale(d[y_data])
          })
          .attr('fill','dark blue')
          .style('opacity',0.5);

          // append to each point
          let text = svg.selectAll('dot')
            .data(data)
            .enter()
            .append('text');
          
          let textLabels = text
            .attr('class','label')
            .attr('x',function(d) {
              return xScale(d[x_data]) -8;
            })
            .attr('y',function(d) {
              return xScale(d[y_data]) +4;
            })
            .style('font-size','10px')
            .style('font-weight','bold')
            .style('font-family','verdana')
            .style('opacity',0.6)
            // append tooltip
            .on('mouseover',handleMouseOver)
            .on('mouseout',tip.hide);
      }
      else {
            // set new domain
            xScale.domain(d3.extent(data, function(d) {
              return d[x_data];
          }));
          yScale.domain(d3.extent(data, function(d){
              return d[y_data];
          }));
          // rescale the axes
          svg.select('.xaxis')
              .transition()
              .call(xAxis);
          svg.select('.yaxis')
              .transition()
              .call(yAxis);

          // reposition the dots
          svg.selectAll('.dot')
              .transition()
              .attr('cx', function(d){
                  return xScale(d[x_data]);
              })
              .attr('cy', function(d){
                  return yScale(d[y_data])
              });
              
          // reposition the text associated with each dot
          svg.selectAll('.label')
              .transition()
              .attr('x', function(d){
                  return xScale(d[x_data])-8;
              })
              .attr('y', function(d){
                  return yScale(d[y_data])+4;
              })
              .text(function(d){
                  console.log(d.State);
                  return d.State;
              })

          // update the tooltip 
          svg.selectAll('.label')
          .on('mouseover', handleMouseOver);
      } 
      function handleMouseOver(d) {
        tip.show(d.State + '<hr>' + 'X' + ': ' + d[x_data]
                + ", <br>" + "Y" + ": " + d[y_data]);
      }
    }
});