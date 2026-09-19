const form = document.getElementById("energyForm");

const applianceTableBody =
    document.getElementById("applianceTableBody");

const totalEnergyElement =
    document.getElementById("totalEnergy");

const totalCostElement =
    document.getElementById("totalCost");


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


    appliances.forEach(function(appliance) {

        totalEnergy += appliance.energy;

        totalCost += appliance.cost;

    });


    totalEnergyElement.textContent =
        totalEnergy.toFixed(2);


    totalCostElement.textContent =
        totalCost.toFixed(2);

}


function deleteAppliance(index) {

    // Remove appliance from array
    appliances.splice(index, 1);


    // Update table
    displayAppliances();


    // Update totals
    calculateTotal();

}