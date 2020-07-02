import axios from 'axios'
import { api } from '../../api-config'

const data = {
    getData(){

       /*  axios({
            method: 'post',
            url: `${api}/`,
            data: {
                
            }
        }).then((response) => {console.log(response.status)}) */
        return {
            months: ["JAN", "FEB", "MAR"],
            interestEarned: ["100", "200", "300"],
            interestToBeEarned: ["150", "250", "350" ]
        }
    }
}



const Chart = {

    data: canvas => {
      const ctx = canvas.getContext("2d");
      var chartColor = "#FFFFFF";
      var gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
      gradientStroke.addColorStop(0, "#80b6f4");
      gradientStroke.addColorStop(1, chartColor);
      var gradientFill = ctx.createLinearGradient(0, 200, 0, 50);
      gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
      gradientFill.addColorStop(1, "rgba(255, 255, 255, 0.14)");
  
      return {
        labels: data.getData().months,
        datasets: [
          {
            label: "Interest you have earned",
            borderColor: chartColor,
            pointBorderColor: chartColor,
            pointBackgroundColor: "#2c2c2c",
            pointHoverBackgroundColor: "#2c2c2c",
            pointHoverBorderColor: chartColor,
            pointBorderWidth: 1,
            pointHoverRadius: 7,
            pointHoverBorderWidth: 2,
            pointRadius: 5,
            fill: true,
            backgroundColor: gradientFill,
            borderWidth: 2,
            data: data.getData().interestEarned
          }, 
          {
            label: "Interest you could've earned",
            borderColor: chartColor,
            pointBorderColor: chartColor,
            pointBackgroundColor: "#2c2c2c",
            pointHoverBackgroundColor: "#2c2c2c",
            pointHoverBorderColor: chartColor,
            pointBorderWidth: 1,
            pointHoverRadius: 7,
            pointHoverBorderWidth: 2,
            pointRadius: 5,
            fill: true,
            backgroundColor: gradientFill,
            borderWidth: 2,
            data: data.getData().interestToBeEarned
          } 
        ]
      };
    },
    options: {
      layout: {
        padding: {
          left: 20,
          right: 20,
          top: 0,
          bottom: 0
        }
      },
      maintainAspectRatio: false,
      tooltips: {
        backgroundColor: "#fff",
        titleFontColor: "#333",
        bodyFontColor: "#666",
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      legend: {
        position: "bottom",
        fillStyle: "#FFF",
        display: false
      },
      scales: {
        yAxes: [
          {
            ticks: {
              fontColor: "rgba(255,255,255,0.4)",
              fontStyle: "bold",
              beginAtZero: true,
              maxTicksLimit: 5,
              padding: 10
            },
            gridLines: {
              drawTicks: true,
              drawBorder: false,
              display: true,
              color: "rgba(255,255,255,0.1)",
              zeroLineColor: "transparent"
            }
          }
        ],
        xAxes: [
          {
            gridLines: {
              display: false,
              color: "rgba(255,255,255,0.1)"
            },
            ticks: {
              padding: 10,
              fontColor: "rgba(255,255,255,0.4)",
              fontStyle: "bold"
            }
          }
        ]
      }
    }
  }


export { Chart as default }