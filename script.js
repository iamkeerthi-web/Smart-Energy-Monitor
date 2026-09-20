const form = document.getElementById("energyForm");

const applianceTableBody =
    document.getElementById("applianceTableBody");

const totalEnergyElement =
    document.getElementById("totalEnergy");

const totalCostElement =
    document.getElementById("totalCost");

const dashboardEnergy =
    document.getElementById("dashboardEnergy");

const dashboardCost =
    document.getElementById("dashboardCost");

const highestConsumer =
    document.getElementById("highestConsumer");

const applianceCount =
    document.getElementById("applianceCount");

const chartCanvas =
    document.getElementById("energyChart");

let energyChart = null;


let appliances = [];


form.addEventListener("submit", function(event) {

    // Stop the page from refreshing
    event.preventDefault();


    // Get values from the form
    const applianceName =
        document.getElementById("applianceName").value;

    const power =
        Number(document.getElementById("power").value);

    const hours =
        Number(document.getElementById("hours").value);

    const days =
        Number(document.getElementById("days").value);

    const rate =
        Number(document.getElementById("rate").value);


    // Calculate energy consumption
    const energy =
        (power * hours * days) / 1000;


    // Calculate electricity cost
    const cost =
        energy * rate;


    // Create an appliance object
    const appliance = {

        name: applianceName,

        power: power,

        hours: hours,

        days: days,

        energy: energy,

        cost: cost

    };


    // Add appliance to the array
    appliances.push(appliance);


    // Display appliances in the table
    displayAppliances();


    // Calculate total consumption and cost
    calculateTotal();

    // update the cart
    updateChart();

    // Clear the form
    form.reset();

});


function displayAppliances() {

    // Clear the table before displaying again
    applianceTableBody.innerHTML = "";


    appliances.forEach(function(appliance, index) {

        const row = document.createElement("tr");


        row.innerHTML = `

            <td>${appliance.name}</td>

            <td>${appliance.power}</td>

            <td>${appliance.hours}</td>

            <td>${appliance.energy.toFixed(2)}</td>

            <td>₹${appliance.cost.toFixed(2)}</td>

            <td>
                <button
                    type="button"
                    onclick="deleteAppliance(${index})"
                >
                    Delete
                </button>
            </td>

        `;


        applianceTableBody.appendChild(row);

    });

}


function calculateTotal() {

    let totalEnergy = 0;

    let totalCost = 0;

    let highestAppliance = null;


    appliances.forEach(function(appliance) {

        totalEnergy += appliance.energy;

        totalCost += appliance.cost;


        // Find highest energy consuming appliance

        if (
            highestAppliance === null ||
            appliance.energy > highestAppliance.energy
        ) {

            highestAppliance = appliance;

        }

    });


    // Update total section

    totalEnergyElement.textContent =
        totalEnergy.toFixed(2);

    totalCostElement.textContent =
        totalCost.toFixed(2);


    // Update dashboard

    dashboardEnergy.textContent =
        totalEnergy.toFixed(2);

    dashboardCost.textContent =
        totalCost.toFixed(2);


    // Number of appliances

    applianceCount.textContent =
        appliances.length;


    // Highest consumer

    if (highestAppliance !== null) {

        highestConsumer.textContent =
            highestAppliance.name;

    } else {

        highestConsumer.textContent =
            "---";

    }

}


function deleteAppliance(index) {

    // Remove appliance from array
    appliances.splice(index, 1);


    // Update table
    displayAppliances();

    calculateTotal();


    // Update totals
    calculateTotal();

}

function updateChart() {

    const names = appliances.map(function(appliance) {
        return appliance.name;
    });


    const energyValues = appliances.map(function(appliance) {
        return appliance.energy;
    });


    // Remove old chart
    if (energyChart !== null) {
        energyChart.destroy();
    }


    // Create new chart
    energyChart = new Chart(chartCanvas, {

        type: "bar",

        data: {

            labels: names,

            datasets: [
                {
                    label: "Energy Consumption (kWh)",

                    data: energyValues
                }
            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            scales: {

                y: {
                    beginAtZero: true,

                    title: {
                        display: true,

                        text: "Energy (kWh)"
                    }
                },

                x: {
                    title: {
                        display: true,

                        text: "Appliances"
                    }
                }

            }

        }

    });

}
