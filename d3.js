const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
const req = new XMLHttpRequest;
req.open("GET", url, true)
req.send()
req.onload = () => {
    const json = JSON.parse(req.responseText)
    const dataset = json
    const w = 1000
    const h = 600
    const p = 60
    let tooltip = d3.select("#tooltip")

    const xScale = d3.scaleLinear()
                     .domain([d3.min(dataset, (d) => {
                        return d["Year"]
                     }) - 1, d3.max(dataset, (d) => {
                        return d["Year"]
                     }) + 1])
                     .range([p, w - p])
    const yScale = d3.scaleLinear()
                     .domain([d3.min(dataset, (d) => {
                        return new Date(d["Seconds"] * 1000)
                     }), d3.max(dataset, (d) => {
                        return new Date(d["Seconds"] * 1000)
                     })])
                     .range([p, h - p])

    const xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format('d'))
    const yAxis = d3.axisLeft(yScale)
                    .tickFormat(d3.timeFormat("%M:%S"))
    const svg = d3.select("body")
                  .append("svg")
                  .attr("class", "container")
                  .attr("width", w)
                  .attr("height", h)
                  .attr("padding", p)
          svg.selectAll("circle")
             .data(dataset)
             .enter()
             .append("circle")
             .attr("cx", (d) => {
                return xScale(d["Year"])
             })
             .attr("cy", (d) => {
                return yScale(new Date(d["Seconds"] * 1000))
             })
             .attr("r", 6)
             .attr("class", "dot")
             .attr("data-xvalue", (d) => {
                return d["Year"]
             })
             .attr("data-yvalue", (d) => {
                return new Date(d["Seconds"] * 1000)
             })
             .attr("fill", (d) => {
                if(d["Doping"] === "") {
                    return "orange"
                }else {
                    return "rgb(31, 119, 180)"
                }
             })
             .style("stroke", "black")
             .on('mouseover', (d) => {
                tooltip.transition()
                       .style("visibility", "visible")
                if(d["Doping"] != "") {
                    tooltip.text(d["Name"])
                }else {
                    tooltip.text(d["Year"])
                }
             })
             .on('mouseout', (d) => {
                tooltip.transition()
                       .style("visibility", "hidden")
             })

          svg.append("g")
             .attr("id", "x-axis")
             .attr("transform", "translate(0, " + (h - p) + ")")
             .call(xAxis)

          svg.append('g')
             .attr("id", "y-axis")
             .attr("transform", "translate("+ p +", 0)")
             .call(yAxis)
}