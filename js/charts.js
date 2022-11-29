const charts = {
  chartTableElem: undefined,

  /**
   * Creates the day element (div + title + bar)
   * @param {Object} dayData Day name and amount
   * @param {Boolean} isCurrentDay Is the given day the current one ?
   * @param {Number} maxAmount The week's max amount
   */
  addDayElement(dayData, isCurrentDay, maxAmount, timeOut) {
    // Day container div
    const dayElem = document.createElement('div');
    charts.chartTableElem.appendChild(dayElem);
    dayElem.className = 'single-day';
    // Title
    const dayTitleElem = document.createElement('p');
    dayElem.appendChild(dayTitleElem);
    dayTitleElem.className = 'single-day__title';
    dayTitleElem.textContent = dayData.day;
    // Bar container (height is managed in the css thus we can
    // set the actual bar's height as a percentage of its container)
    const dayBarContainerElem = document.createElement('div');
    dayElem.appendChild(dayBarContainerElem);
    dayBarContainerElem.className = 'single-day-bar-container';
    // Bar
    const dayBarElem = document.createElement('div');
    setTimeout(() => {
      dayBarContainerElem.appendChild(dayBarElem);
    }, timeOut); 
    dayBarElem.className = 'single-day-bar-container__bar';
    if (isCurrentDay) {
      dayBarElem.classList.add('single-day-bar-container__bar--current');
    }
    dayBarElem.style.height = `${(dayData.amount / maxAmount) * 100}%`;
    // Bar amount tooltip
    const dayAmountElem = document.createElement('div');
    dayAmountElem.className = 'single-day-bar-container__amount';
    dayBarElem.appendChild(dayAmountElem);
    dayAmountElem.textContent = `$${dayData.amount}`;
    // Show/hide the tooltip
    dayBarElem.addEventListener('mouseenter', () => {
      dayAmountElem.style.visibility = 'visible';
      dayAmountElem.style.animation = '0.2s ease-out 0s 1 smoothApparition';
    });
    dayBarElem.addEventListener('mouseleave', () => {
      dayAmountElem.style.visibility = 'hidden';
      dayAmountElem.style.animation = 'none';
    });
  },

  fillChart(data) {
    console.log(data);
    // Get the maximum amount to later set bar's heights proportionnaly
    let maxAmount = 0;
    for (dayData of data) {
      maxAmount = Math.max(dayData.amount, maxAmount);
    }
    // Get the current day
    const d = new Date();
    let dayIndex = d.getDay();
    // Generate the chart bars
    for (let i = 0; i < data.length; i++) {
      charts.addDayElement(
        data[i],
        dayIndex === i,  // true if data[i] is the current day
        maxAmount,
        i*50  // Timeout to delay bars apparition
      );
    }
  },

  init() {
    charts.chartTableElem = document.getElementById('chart-table');
    fetch("../data.json")
      .then(response => response.json())
      .then(json => {
        charts.fillChart(json);
      });
    charts.createAmountTooltip()
  }
}

document.addEventListener('DOMContentLoaded', charts.init);
