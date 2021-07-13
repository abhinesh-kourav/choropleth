let countyURL =
"https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
let educationURL =
"https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

let countyData;
let educationData;

let canvas = d3.select("#canvas");
let tooltip = d3.select("#tooltip");

let drawMap = () => {
  canvas.
  selectAll("path").
  data(countyData).
  enter().
  append("path").
  attr('d', d3.geoPath()).
  attr("class", "county").
  attr("fill", d => {
    let reqData = educationData.filter(item => item.fips === d.id);
    let percentage = reqData[0].bachelorsOrHigher;
    if (percentage <= 15) {
      return "tomato";
    } else if (percentage <= 30) {
      return "orange";
    } else if (percentage <= 45) {
      return "LightGreen";
    } else {
      return "limegreen";
    }
  }).
  attr("data-fips", d => d.id).
  attr("data-education", d => educationData.filter(item => item.fips === d.id)[0].bachelorsOrHigher).
  on("mouseover", d => {
    tooltip.transition().style("visibility", "visible");
    tooltip.text(educationData.filter(item => item.fips === d.id)[0].area_name);
    tooltip.attr("data-education", educationData.filter(item => item.fips === d.id)[0].bachelorsOrHigher);
  }).
  on("mouseout", d => {
    tooltip.transition().style("visibility", "hidden");
  });
};

d3.json(countyURL).then((data, error) => {
  if (error) {
    console.log(error);
  } else {
    countyData = topojson.feature(data, data.objects.counties).features;
    console.log(countyData);
    d3.json(educationURL).then((res, error) => {
      if (error) {
        console.log(error);
      } else {
        educationData = res;
        console.log(educationData);
        drawMap();
      }
    });
  }
});