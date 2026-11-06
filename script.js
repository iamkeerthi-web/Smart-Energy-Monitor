
// ========================================
// SMART ENERGY MONITOR
// FRONTEND - JAVASCRIPT
// ========================================

let appliances = [];
let editingApplianceId = null;
let energyChart = null;

const API_URL = "http://127.0.0.1:5000/api/appliances";


// ========================================
// GET HTML ELEMENTS
// ========================================

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

const insightTitle =
    document.getElementById("insightTitle");

const insightMessage =
    document.getElementById("insightMessage");

const submitButton =
    document.getElementById("submitButton");

const cancelEditButton =
    document.getElementById("cancelEditButton");


// ========================================
// LOAD DATA FROM FLASK BACKEND
// ========================================

async function loadAppliancesFromBackend() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Unable to load appliances");
        }

        appliances = await response.json();

        displayAppliances();

        calculateTotal();

        updateChart();

        updateInsights();

    } catch (error) {

        console.error("Loading error:", error);

    }

}


// ========================================
// DISPLAY APPLIANCES IN TABLE
// ========================================

function displayAppliances() {

    applianceTableBody.innerHTML = "";

    appliances.forEach(function(appliance) {

        const row = document.createElement("tr");

        const energy = Number(appliance.energy || 0);
        const cost = Number(appliance.cost || 0);

        row.innerHTML = `
            <td>${appliance.name}</td>
            <td>${appliance.power}</td>
            <td>${appliance.hours}</td>
            <td>${energy.toFixed(2)}</td>
            <td>₹${cost.toFixed(2)}</td>

            <td>
                <button type="button" data-action="edit">
                    Edit
                </button>

                <button type="button" data-action="delete">
                    Delete
                </button>
            </td>
        `;

        // Store database ID on the row
        row.dataset.id = appliance.id;

        applianceTableBody.appendChild(row);

    });

}


// ========================================
// EDIT AND DELETE BUTTON HANDLING
// ========================================

applianceTableBody.addEventListener("click", function(event) {

    const button = event.target.closest("button");

    if (!button) return;

    const row = button.closest("tr");

    if (!row) return;

    const applianceId = row.dataset.id;

    if (button.dataset.action === "edit") {

        editAppliance(applianceId);

    }

    if (button.dataset.action === "delete") {

        deleteAppliance(applianceId);

    }

});


// ========================================
// CALCULATE TOTAL ENERGY AND COST
// ========================================

function calculateTotal() {

    let totalEnergy = 0;
    let totalCost = 0;

    let highestAppliance = null;

    appliances.forEach(function(appliance) {

        const energy = Number(appliance.energy || 0);
        const cost = Number(appliance.cost || 0);

        totalEnergy += energy;
        totalCost += cost;

        if (
            highestAppliance === null ||
            energy > Number(highestAppliance.energy || 0)
        ) {

            highestAppliance = appliance;

        }

    });


    // Update totals

    totalEnergyElement.textContent =
        totalEnergy.toFixed(2);

    totalCostElement.textContent =
        totalCost.toFixed(2);


    // Update dashboard

    dashboardEnergy.textContent =
        totalEnergy.toFixed(2);

    dashboardCost.textContent =
        totalCost.toFixed(2);


    // Appliance count

    applianceCount.textContent =
        appliances.length;


    // Highest consumer

    highestConsumer.textContent =
        highestAppliance
            ? highestAppliance.name
            : "---";

}


// ========================================
// ADD OR UPDATE APPLIANCE
// ========================================

form.addEventListener("submit", async function(event) {

    event.preventDefault();

    const applianceName =
        document.getElementById("applianceName").value.trim();

    const power =
        Number(document.getElementById("power").value);

    const hours =
        Number(document.getElementById("hours").value);

    const days =
        Number(document.getElementById("days").value);

    const rate =
        Number(document.getElementById("rate").value);


    // Validate inputs

    if (
        !applianceName ||
        !Number.isFinite(power) ||
        !Number.isFinite(hours) ||
        !Number.isFinite(days) ||
        !Number.isFinite(rate) ||
        power <= 0 ||
        hours <= 0 ||
        hours > 24 ||
        days <= 0 ||
        days > 31 ||
        rate <= 0
    ) {

        alert("Please enter valid appliance details.");

        return;

    }


    const applianceData = {

        name: applianceName,
        power: power,
        hours: hours,
        days: days,
        rate: rate

    };


    const isEditing = editingApplianceId !== null;

    const url = isEditing
        ? `${API_URL}/${editingApplianceId}`
        : API_URL;

    const method = isEditing ? "PUT" : "POST";


    try {

        submitButton.disabled = true;

        const response = await fetch(url, {

            method: method,

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(applianceData)

        });


        const result = await response.json();

        if (!response.ok) {

            throw new Error(
                result.error || "Unable to save appliance"
            );

        }


        alert(
            isEditing
                ? "Appliance updated successfully!"
                : "Appliance added successfully!"
        );


        // Reset form

        form.reset();

        editingApplianceId = null;

        submitButton.textContent = "Add Appliance";

        cancelEditButton.hidden = true;


        // Refresh from database

        await loadAppliancesFromBackend();


    } catch (error) {

        console.error("Save error:", error);

        alert(error.message);

    } finally {

        submitButton.disabled = false;

    }

});


// ========================================
// EDIT APPLIANCE
// ========================================

function editAppliance(id) {

    const appliance = appliances.find(function(item) {

        return String(item.id) === String(id);

    });

    if (!appliance) {

        alert("Appliance not found!");

        return;

    }

    editingApplianceId = id;

    document.getElementById("applianceName").value =
        appliance.name;

    document.getElementById("power").value =
        appliance.power;

    document.getElementById("hours").value =
        appliance.hours;

    document.getElementById("days").value =
        appliance.days;

    document.getElementById("rate").value =
        appliance.rate;

    submitButton.textContent = "Update Appliance";

    cancelEditButton.hidden = false;

    form.scrollIntoView({
        behavior: "smooth"
    });

}


// ========================================
// CANCEL EDIT
// ========================================

cancelEditButton.addEventListener("click", function() {

    editingApplianceId = null;

    form.reset();

    submitButton.textContent = "Add Appliance";

    cancelEditButton.hidden = true;

});


// ========================================
// DELETE APPLIANCE FROM DATABASE
// ========================================

async function deleteAppliance(id) {

    if (!confirm("Are you sure you want to delete this appliance?")) {
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: "DELETE"
            }
        );

        const result = await response.json();

        if (!response.ok) {

            throw new Error(
                result.error || "Unable to delete appliance"
            );

        }

        // Exit edit mode if the edited appliance is deleted

        if (String(editingApplianceId) === String(id)) {

            editingApplianceId = null;

            form.reset();

            submitButton.textContent = "Add Appliance";

            cancelEditButton.hidden = true;

        }

        alert("Appliance deleted successfully!");

        await loadAppliancesFromBackend();

    } catch (error) {

        console.error("Delete error:", error);

        alert(error.message);

    }

}


// ========================================
// UPDATE ENERGY CONSUMPTION CHART
// ========================================

function updateChart() {

    if (!chartCanvas || typeof Chart === "undefined") {
        return;
    }

    const names = appliances.map(function(appliance) {

        return appliance.name;

    });

    const energyValues = appliances.map(function(appliance) {

        return Number(appliance.energy || 0);

    });


    if (energyChart !== null) {

        energyChart.destroy();

    }


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


// ========================================
// ENERGY SAVING INSIGHTS
// ========================================

function updateInsights() {

    if (appliances.length === 0) {

        insightTitle.textContent = "No data available";

        insightMessage.textContent =
            "Add appliances to get energy-saving insights.";

        return;

    }


    let highestAppliance = appliances[0];

    appliances.forEach(function(appliance) {

        if (
            Number(appliance.energy || 0) >
            Number(highestAppliance.energy || 0)
        ) {

            highestAppliance = appliance;

        }

    });


    let totalEnergy = 0;

    appliances.forEach(function(appliance) {

        totalEnergy += Number(appliance.energy || 0);

    });


    const highestEnergy =
        Number(highestAppliance.energy || 0);

    if (totalEnergy <= 0 || highestEnergy <= 0) {

        insightTitle.textContent = "No energy data available";

        insightMessage.textContent =
            "Check your appliance consumption details.";

        return;

    }


    const percentage =
        (highestEnergy / totalEnergy) * 100;


    const dailyEnergyReduction =
        Number(highestAppliance.power) / 1000;


    const monthlyEnergySaving =
        dailyEnergyReduction * Number(highestAppliance.days);


    const monthlyCostSaving =
        monthlyEnergySaving *
        (Number(highestAppliance.cost || 0) / highestEnergy);


    insightTitle.textContent =
        `🔥 ${highestAppliance.name} is your highest consumer`;


    insightMessage.innerHTML = `

        It consumes approximately

        <strong>${highestEnergy.toFixed(2)} kWh</strong>

        per month, which is

        <strong>${percentage.toFixed(1)}%</strong>

        of your recorded consumption.

        <br><br>

        If you reduce its usage by

        <strong>1 hour per day</strong>,

        you could save approximately

        <strong>₹${monthlyCostSaving.toFixed(2)}</strong>

        per month.

    `;

}


// ========================================
// START APPLICATION
// ========================================

loadAppliancesFromBackend();
