// First, add import for drawPerson
import { drawPerson } from './person.js';

// Set up dimensions
const margin = { top: 120, right: 60, bottom: 60, left: 60 };
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create tooltip div
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Revert to original color scheme
const colors = ["#ff7f0e", "#2ca02c", "#1f77b4"];

// Create SVG containers
const stackedSvg = d3.select("#plot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const scatterSvg = d3.select("#plot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

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

// Add dark mode toggle at the top
const darkModeToggle = d3.select("body")
    .append("button")
    .attr("class", "dark-mode-toggle")
    .text("Toggle Dark Mode")
    .style("position", "absolute")
    .style("top", "10px")
    .style("right", "10px");

// Add dark mode state
let isDarkMode = false;

// Dark mode toggle function
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    
    // Update body background and text color
    d3.select("body")
        .style("background-color", isDarkMode ? "#1a1a1a" : "white")
        .style("color", isDarkMode ? "white" : "black");
    
    // Update axes color
    d3.selectAll(".axis path, .axis line")
        .style("stroke", isDarkMode ? "white" : "black");
    
    d3.selectAll(".axis text")
        .style("fill", isDarkMode ? "white" : "black");
    
    // Update plot background if needed
    d3.selectAll("svg")
        .style("background-color", isDarkMode ? "#1a1a1a" : "white");
        
    // Update checkbox container background
    d3.select(".checkbox-container")
        .style("background-color", isDarkMode ? "#2d2d2d" : "white")
        .style("border-color", isDarkMode ? "#404040" : "#ddd");
        
    // Update checkbox labels
    d3.selectAll(".checkbox-container label")
        .style("color", isDarkMode ? "white" : "black");
}

// Add click handler to toggle
darkModeToggle.on("click", toggleDarkMode);

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
        .domain([0, d3.max(studentTotals.values(), d => d.total) || 1])
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
        .attr("transform", d => `translate(${initialPositions[d]},0)`);

    // Update all groups
    const allGroups = studentGroupsEnter.merge(studentGroups);

    // Function to update bars within a group
    function updateBars(selection) {
        selection.each(function(student) {
            const group = d3.select(this);
            const studentData = studentTotals.get(student);
            let cumHeight = height;

            // Create or update bars for each exam
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
                .attr("fill", (d, i) => colors[i])
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
            return `translate(${x},${height - 100})`;
        })
        .each(function(d) {
            const studentNum = parseInt(d.replace('S', ''));
            drawPerson(d3.select(this), 0, 0, studentNum);
        });

    // Update all people with transition
    const allPeople = peopleEnter.merge(people);
    
    // Transition to their score positions
    allPeople
        .transition()
        .duration(5000)
        .attr("transform", d => {
            const studentData = studentTotals.get(d);
            const x = xScale(d) + xScale.bandwidth() / 2;
            const y = selectedExams.size > 0 ? yScale(studentData.total) : height - 100;
            return `translate(${x},${y})`;
        })
        .on("end", function(d) {  // Add this end event handler
            // Redraw person after transition
            const studentNum = parseInt(d.replace('S', ''));
            drawPerson(d3.select(this), 0, 0, studentNum);
        });

    // Update axes
    stackedSvg.selectAll(".axis").remove();
    
    stackedSvg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

    stackedSvg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(yScale));
}

function updateScatterPlot(studentTotals, bpmMeans) {
    // Clear previous content
    scatterSvg.selectAll("*").remove();

    // Calculate average BPM and total score for each student
    const scatterData = Array.from(studentTotals.entries()).map(([student, scoreData]) => {
        const studentBPMs = bpmMeans.get(student);
        const selectedBPMs = Array.from(selectedExams)
            .map(exam => studentBPMs.get(exam))
            .filter(bpm => bpm !== undefined);

        return {
            student: student,
            avgBPM: d3.mean(selectedBPMs),
            totalScore: scoreData.total
        };
    });

    // Set up scales
    const xScale = d3.scaleLinear()
        .domain([d3.min(scatterData, d => d.avgBPM) * 0.95, 
                d3.max(scatterData, d => d.avgBPM) * 1.05])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(scatterData, d => d.totalScore)])
        .range([height, 0]);

    // Draw points
    scatterSvg.selectAll("circle")
        .data(scatterData)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.avgBPM))
        .attr("cy", d => yScale(d.totalScore))
        .attr("r", 5)
        .attr("fill", "steelblue")
        .attr("opacity", 0.7)
        .on("mouseover", function(event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`Student: ${d.student}<br/>
                         Average BPM: ${d.avgBPM.toFixed(1)}<br/>
                         Total Score: ${d.totalScore.toFixed(1)}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
            
            // Highlight corresponding bar in stacked chart
            stackedSvg.selectAll("rect")
                .filter(r => r.student === d.student)
                .attr("opacity", 1);
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
            
            // Reset opacity
            stackedSvg.selectAll("rect")
                .attr("opacity", 0.7);
        });

    // Add axes
    scatterSvg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .append("text")
        .attr("x", width / 2)
        .attr("y", 40)
        .attr("fill", "black")
        .text("Average BPM");

    scatterSvg.append("g")
        .call(d3.axisLeft(yScale))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -height / 2)
        .attr("fill", "black")
        .text("Total Score");
}
