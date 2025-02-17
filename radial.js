// First, add import for drawPerson
import { drawPerson } from './person.js';

// Set up dimensions
const margin1 = { top: 120, right: 60, bottom: 60, left: 60 };  // For stacked bar
const width = 800 - margin1.left - margin1.right;
const height = 400 - margin1.top - margin1.bottom;

// Different margins for each plot
const margin2 = { top: 20, right: 60, bottom: 60, left: 60 };   // For scatter plot

// Create tooltip div
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "1px solid #ddd")
    .style("border-radius", "4px")
    .style("padding", "8px")
    .style("pointer-events", "none");

// Define global color constants
const EXAM_COLORS = {
    "Final": "#1f77b4",      // Blue
    "Midterm 1": "#ff7f0e",  // Orange
    "Midterm 2": "#2ca02c"   // Green
};

// Replace the old colors array
const colors = [EXAM_COLORS["Midterm 1"], EXAM_COLORS["Midterm 2"], EXAM_COLORS["Final"]];

// Create SVG containers
const stackedSvg = d3.select("#plot")
    .append("svg")
    .attr("width", width + margin1.left + margin1.right)
    .attr("height", height + margin1.top + margin1.bottom)
    .append("g")
    .attr("transform", `translate(${margin1.left},${margin1.top})`);

const scatterSvg = d3.select("#plot")
    .append("svg")
    .attr("width", width + margin2.left + margin2.right)
    .attr("height", height + margin2.top + margin2.bottom)
    .append("g")
    .attr("transform", `translate(${margin2.left},${margin2.top})`);

// Create groups for bars and people
const barsGroup = stackedSvg.append("g").attr("class", "bars");
const peopleGroup = stackedSvg.append("g").attr("class", "people");

// Create checkbox container as horizontal bar
const checkboxDiv = d3.select("#plot")
    .append("div")
    .attr("class", "checkbox-container");

// Add checkboxes
const exams = ["Midterm 1", "Midterm 2", "Final"];
let selectedExams = new Set(exams);
let processedData = null;

console.log("Initial selectedExams:", selectedExams);

// Replace dark mode toggle with modern switch
const darkModeToggle = d3.select("body")
    .append("div")
    .attr("class", "dark-mode-toggle")
    .style("position", "absolute")
    .style("top", "20px")
    .style("right", "20px");

darkModeToggle.html(`
    <label class="switch">
        <input type="checkbox">
        <span class="slider">
            <span class="sun">☀️</span>
            <span class="moon">🌙</span>
        </span>
    </label>
`);

darkModeToggle.select("input")
    .on("change", toggleDarkMode);

// Add dark mode state
let isDarkMode = false;

function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    
    // Update body background and text color
    d3.select("body")
        .classed("dark-mode", isDarkMode)
        .style("background-color", isDarkMode ? "#1a1a1a" : "white")
        .style("color", isDarkMode ? "white" : "black");
    
    // Update all text elements including slope
    d3.selectAll(".axis text, .axis-label, .slope-tooltip")
        .style("fill", isDarkMode ? "white" : "black");
    
    // Update axes
    d3.selectAll(".axis path, .axis line")
        .style("stroke", isDarkMode ? "white" : "black");
    
    // Update plot background
    d3.selectAll("svg")
        .style("background-color", isDarkMode ? "#1a1a1a" : "white");
        
    // Update UI elements
    d3.select(".checkbox-container")
        .style("background-color", isDarkMode ? "#2d2d2d" : "white")
        .style("border-color", isDarkMode ? "#404040" : "#ddd");
        
    d3.select(".sorting-container")
        .style("background-color", isDarkMode ? "#2d2d2d" : "white")
        .style("border-color", isDarkMode ? "#404040" : "#ddd");
}

function updateVisualizations() {
    if (!processedData) return;
    
    console.log("Updating visualizations with exams:", selectedExams);
    // Filter data based on selected exams
    const filteredScores = processedData.scoreData.filter(d => selectedExams.has(d.Exam));
    console.log("Filtered scores:", filteredScores);

    // Calculate sum of scores per student
    const studentTotals = d3.rollup(filteredScores,
        v => ({
            total: d3.sum(v, d => d.Score),
            scores: Object.fromEntries(v.map(d => [d.Exam, d.Score]))
        }),
        d => d.Student
    );

    // Sort students by total score
    const sortedStudents = Array.from(studentTotals.entries())
        .sort((a, b) => b[1].total - a[1].total)
        .map(d => d[0]);

    // Update both visualizations
    updateStackedBarChart(studentTotals, sortedStudents);
    updateScatterPlot(studentTotals, processedData.bpmMeans);
}

checkboxDiv.selectAll("div")
    .data(exams)
    .enter()
    .append("div")
    .each(function(d, i) {
        const container = d3.select(this);
        container.append("input")
            .attr("type", "checkbox")
            .attr("id", d.replace(" ", ""))
            .attr("checked", true)
            .on("change", function() {
                const exam = d3.select(this.parentNode).datum();
                if (this.checked) {
                    selectedExams.add(exam);
                } else {
                    selectedExams.delete(exam);
                }
                console.log("Checkbox changed:", exam);
                console.log("Is checked:", this.checked);
                console.log("Current selectedExams:", selectedExams);
                updateVisualizations();
            });
        
        container.append("label")
            .attr("for", d.replace(" ", ""))
            .text(d)
            .style("color", colors[i]);
    });

// Load and process data
Promise.all([
    d3.csv("data/csv/size_bpm.csv"),
    d3.csv("data/csv/bpm.csv")
]).then(([sizeData, bpmData]) => {
    processedData = processData(sizeData, bpmData);
    updateVisualizations();
}).catch(error => console.error("Error loading data:", error));

function processData(sizeData, bpmData) {
    // Group BPM data by Student and Exam to calculate means
    const bpmMeans = d3.rollup(bpmData,
        v => d3.mean(v, d => +d.BPM),
        d => d.Student,
        d => d.Exam
    );

    // Process score data
    const scoreData = sizeData.map(d => ({
        Student: d.Student,
        Exam: d.Exam,
        Score: +d.Score
    }));

    return { bpmMeans, scoreData };
}

function updateStackedBarChart(studentTotals, sortedStudents) {
    // Set up scales
    const xScale = d3.scaleBand()
        .domain(sortedStudents)
        .range([0, width])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, 300])  // Fixed domain from 0 to 300
        .range([height, 0]);

    // Initial positions for students (1-10 order)
    const initialPositions = {};
    sortedStudents.forEach((student, i) => {
        const studentNum = parseInt(student.replace('S', ''));
        initialPositions[student] = (studentNum - 1) * (width / 10);
    });

    // Update bars
    const studentGroups = barsGroup.selectAll(".student-group")
        .data(sortedStudents, d => d);

    // Exit old bars
    studentGroups.exit()
        .transition()
        .duration(5000)
        .attr("transform", d => `translate(${xScale(d)},0)`)
        .remove();

    // Enter new bars
    const studentGroupsEnter = studentGroups.enter()
        .append("g")
        .attr("class", "student-group")
        .attr("transform", d => `translate(${initialPositions[d] || 0},0)`);

    // Update all groups
    const allGroups = studentGroupsEnter.merge(studentGroups);

    // Function to update bars within a group
    function updateBars(selection) {
        selection.each(function(student) {
            const group = d3.select(this);
            const studentData = studentTotals.get(student);
            let cumHeight = height;

            const bars = group.selectAll("rect")
                .data(Array.from(selectedExams));

            // Remove old bars
            bars.exit()
                .transition()
                .duration(5000)
                .attr("height", 0)
                .attr("y", height)
                .remove();

            // Add new bars
            const barsEnter = bars.enter()
                .append("rect")
                .attr("width", xScale.bandwidth())
                .attr("y", height)
                .attr("height", 0);

            // Merge and update all bars
            bars.merge(barsEnter)
                .attr("fill", d => EXAM_COLORS[d])
                .on("mouseover", function(event, d) {
                    const score = studentData.scores[d];
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    tooltip.html(`${d}: ${score} points`)
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function() {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                })
                .transition()
                .duration(5000)
                .attr("width", xScale.bandwidth())
                .attr("y", (d, i) => {
                    const score = studentData.scores[d] || 0;
                    const barHeight = height - yScale(score);
                    cumHeight -= barHeight;
                    return cumHeight;
                })
                .attr("height", d => {
                    const score = studentData.scores[d] || 0;
                    return height - yScale(score);
                });
        });
    }

    // First transition: Move to correct x positions
    allGroups.transition()
        .duration(5000)
        .attr("transform", d => `translate(${xScale(d)},0)`);
    
    // Update the bars
    allGroups.call(updateBars);

    // Update people
    const people = peopleGroup.selectAll(".person-group")
        .data(sortedStudents, d => d);

    // Remove old people
    people.exit()
        .transition()
        .duration(5000)
        .remove();

    // Add new people at initial positions
    const peopleEnter = people.enter()
        .append("g")
        .attr("class", "person-group")
        .attr("transform", d => {
            const x = initialPositions[d] + xScale.bandwidth() / 2;
            return `translate(${x},0)`;  // Start at top (y=0)
        })
        .each(function(d) {
            const studentNum = parseInt(d.replace('S', ''));
            drawPerson(d3.select(this), 0, 0, studentNum);
        });
        

    // Update all people with transition
    const allPeople = peopleEnter.merge(people);
    
    // Transition to final position
    allPeople
        .transition()
        .duration(5000)
        .attr("transform", d => {
            const studentData = studentTotals.get(d);
            const x = xScale(d) + xScale.bandwidth() / 2;
            const y = selectedExams.size > 0 ? yScale(studentData.total) - 100 : height;
            return `translate(${x},${y})`;
        })
        .on("end", function(d) {
            const studentNum = parseInt(d.replace('S', ''));
            drawPerson(d3.select(this), 0, 0, studentNum);
        });

    // Update axes with larger font and labels
    stackedSvg.selectAll(".axis").remove();
    
    stackedSvg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .style("font-size", "14px")
        .append("text")
        .attr("class", "axis-label")
        .attr("x", width / 2)
        .attr("y", 40)
        .attr("fill", "currentColor")
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Student");

    stackedSvg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(yScale))
        .style("font-size", "14px")
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -40)
        .attr("fill", "currentColor")
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Total Score");

    // Update checkbox colors to match exams
    checkboxDiv.selectAll("label")
        .style("color", d => EXAM_COLORS[d]);
}

// Update scatter plot with animations and labels
function updateScatterPlot(studentTotals, bpmMeans) {
    // Calculate data
    const scatterData = Array.from(studentTotals.entries()).map(([student, scoreData]) => {
        const studentBPMs = bpmMeans.get(student);
        const selectedBPMs = Array.from(selectedExams)
            .map(exam => studentBPMs.get(exam))
            .filter(bpm => bpm !== undefined);

        return {
            student: student,
            studentNum: parseInt(student.replace('S', '')),
            avgBPM: d3.mean(selectedBPMs) || 0,
            totalScore: scoreData.total,
            bpmValues: selectedBPMs,
            minBPM: d3.min(selectedBPMs),
            maxBPM: d3.max(selectedBPMs)
        };
    }).filter(d => d.avgBPM > 0);

    // Get shirt colors from the colors object defined in person.js
    const shirtColors = {
        1: '#FF4B4B',  // bright red
        2: '#4CAF50',  // material green
        3: '#2196F3',  // material blue
        4: '#FFC107',  // material amber
        5: '#9C27B0',  // material purple
        6: '#00BCD4',  // material cyan
        7: '#E91E63',  // material pink
        8: '#607D8B',  // material blue grey
        9: '#FF9800',  // material orange
        10: '#8BC34A'  // material light green
    };

    // Set up scales
    const xScale = d3.scaleLinear()
        .domain([0, 300])
        .range([0, width]);

    const allBPMs = scatterData.flatMap(d => d.bpmValues);
    const bpmQ1 = d3.quantile(allBPMs, 0.25);
    const bpmQ3 = d3.quantile(allBPMs, 0.75);
    const bpmIQR = bpmQ3 - bpmQ1;
    const bpmMin = Math.max(0, bpmQ1 - 2 * bpmIQR);  // Increased from 1.5 to 2
    const bpmMax = bpmQ3 + 2 * bpmIQR;  // Increased from 1.5 to 2

    const yScale = d3.scaleLinear()
        .domain([bpmMin * 0.95, bpmMax * 1.05])
        .range([height, 0]);

    // Update axes with larger font
    if (!scatterSvg.select(".x-axis").size()) {
        scatterSvg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale))
            .style("font-size", "14px")  // Increased from default
            .append("text")
            .attr("class", "axis-label")
            .attr("x", width / 2)
            .attr("y", 40)
            .attr("fill", "currentColor")
            .style("text-anchor", "middle")
            .style("font-size", "16px")  // Increased from default
            .text("Total Score");

        scatterSvg.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(yScale))
            .style("font-size", "14px")  // Increased from default
            .append("text")
            .attr("class", "axis-label")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -40)
            .attr("fill", "currentColor")
            .style("text-anchor", "middle")
            .style("font-size", "16px")  // Increased from default
            .text("Heart Rate (BPM)");
    }

    // Transition axes
    scatterSvg.select(".x-axis").transition().duration(2000).call(d3.axisBottom(xScale));
    scatterSvg.select(".y-axis").transition().duration(2000).call(d3.axisLeft(yScale));

    // Update points and IQR ranges
    const points = scatterSvg.selectAll(".point-group")
        .data(scatterData, d => d.student);

    points.exit().remove();

    // Enter new points
    const pointsEnter = points.enter()
        .append("g")
        .attr("class", "point-group")
        .attr("transform", d => `translate(${xScale(d.totalScore)},${yScale(d.avgBPM)})`);

    // Add IQR ranges for new points
    pointsEnter.append("line")
        .attr("class", "bpm-range")
        .style("stroke", d => shirtColors[d.studentNum])
        .style("stroke-width", 2)
        .style("opacity", 0.5);

    // Add points for new elements
    pointsEnter.append("circle")
        .attr("r", 6)
        .attr("fill", d => shirtColors[d.studentNum]);

    // Add labels for new elements
    pointsEnter.append("text")
        .attr("dy", -8)
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .text(d => d.student);

    // Update all points and their ranges with transitions
    const allPoints = points.merge(pointsEnter);

    // Transition the groups
    allPoints.transition()
        .duration(2000)
        .attr("transform", d => `translate(${xScale(d.totalScore)},${yScale(d.avgBPM)})`);

    // Transition the IQR ranges
    allPoints.select(".bpm-range")
        .transition()
        .duration(2000)
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("y1", d => yScale(d.minBPM) - yScale(d.avgBPM))
        .attr("y2", d => yScale(d.maxBPM) - yScale(d.avgBPM));

    // Update line of best fit
    if (scatterData.length > 1) {
        const xMean = d3.mean(scatterData, d => d.totalScore);
        const yMean = d3.mean(scatterData, d => d.avgBPM);
        const ssxy = d3.sum(scatterData, d => (d.totalScore - xMean) * (d.avgBPM - yMean));
        const ssxx = d3.sum(scatterData, d => (d.totalScore - xMean) * (d.totalScore - xMean));
        const slope = ssxy / ssxx;
        const intercept = yMean - slope * xMean;

        // Update slope tooltip
        scatterSvg.selectAll(".slope-tooltip")
            .data([1])
            .join("text")
            .attr("class", "slope-tooltip")
            .attr("x", width - 10)
            .attr("y", 20)
            .attr("text-anchor", "end")
            .style("font-size", "12px")
            .text(`Slope: ${slope.toFixed(2)} BPM/point`);

        const lineData = [
            { x: 0, y: intercept },
            { x: 300, y: slope * 300 + intercept }
        ];

        // Update best fit line
        const bestFitLine = scatterSvg.selectAll(".best-fit")
            .data([lineData]);

        bestFitLine.enter()
            .append("line")
            .attr("class", "best-fit")
            .style("stroke", "red")
            .style("stroke-width", 2)
            .style("stroke-dasharray", "5,5")
            .merge(bestFitLine)
            .transition()
            .duration(2000)
            .attr("x1", d => xScale(d[0].x))
            .attr("y1", d => yScale(d[0].y))
            .attr("x2", d => xScale(d[1].x))
            .attr("y2", d => yScale(d[1].y));
    }
}

// Add radio button container below exam checkboxes
const sortingDiv = d3.select("#plot")
    .append("div")
    .attr("class", "sorting-container")
    .style("margin-top", "10px");

// Add radio buttons
const sortOptions = ["Sort by Score", "Sort by BPM"];
sortingDiv.selectAll("div")
    .data(sortOptions)
    .enter()
    .append("div")
    .each(function(d, i) {
        const container = d3.select(this);
        container.append("input")
            .attr("type", "radio")
            .attr("id", d.replace(/\s+/g, ''))
            .attr("name", "sorting")
            .attr("value", d)
            .attr("checked", i === 0 ? true : null)
            .on("change", function() {
                updateSorting(this.value);
            });
        
        container.append("label")
            .attr("for", d.replace(/\s+/g, ''))
            .text(d);
    });

// Add sorting function
function updateSorting(sortType) {
    if (!processedData) return;
    
    const filteredScores = processedData.scoreData.filter(d => selectedExams.has(d.Exam));
    
    // Calculate student totals
    const studentTotals = d3.rollup(filteredScores,
        v => ({
            total: d3.sum(v, d => d.Score),
            scores: Object.fromEntries(v.map(d => [d.Exam, d.Score]))
        }),
        d => d.Student
    );

    // Sort students based on selected option
    let sortedStudents;
    if (sortType === "Sort by Score") {
        sortedStudents = Array.from(studentTotals.entries())
            .sort((a, b) => b[1].total - a[1].total)
            .map(d => d[0]);
    } else {
        // For BPM sorting, use the bpmMeans from processedData
        sortedStudents = Array.from(studentTotals.entries())
            .sort((a, b) => {
                const bpmA = d3.mean(Array.from(processedData.bpmMeans.get(a[0]).values())) || 0;
                const bpmB = d3.mean(Array.from(processedData.bpmMeans.get(b[0]).values())) || 0;
                return bpmB - bpmA;
            })
            .map(d => d[0]);
    }

    // Update visualizations with new sorting
    updateStackedBarChart(studentTotals, sortedStudents);
    updateScatterPlot(studentTotals, processedData.bpmMeans);
}